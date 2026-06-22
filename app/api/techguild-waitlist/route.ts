import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { waitlistRateLimiter } from "@/lib/ratelimit";
import { sendWaitlistConfirmation } from "@/lib/email";

// Validation schema for TechGuild Waitlist submissions
const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["AGENCY", "CLIENT"]),
  company: z.string().optional(),
  phone: z.string().optional(),
  // Honeypot field
  website: z.string().max(0, "Honeypot triggered").optional(),
});

export async function POST(request: Request) {
  try {
    // 1. Cap payload size at 50KB to protect against body bloat attacks
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 50 * 1024) {
      return NextResponse.json(
        { success: false, message: "Payload too large" },
        { status: 413 }
      );
    }

    const body = await request.json();

    // 2. Extract client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 3. Perform Rate Limiting (max 1 sign-up per IP per 24 hours)
    const rateLimitResult = await waitlistRateLimiter.limit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: "Limit reached. You can join the waitlist once per day." },
        { status: 429 }
      );
    }

    // 4. Validate body parameters
    const parseResult = waitlistSchema.safeParse(body);
    if (!parseResult.success) {
      // If honeypot fails (website field is filled), we silently return success to make bots think they succeeded
      const hasHoneypotError = parseResult.error.issues.some(
        (issue) => issue.path.includes("website")
      );
      if (hasHoneypotError) {
        console.warn(`[Honeypot] Waitlist spambot blocked from IP: ${ip}`);
        return NextResponse.json({
          success: true,
          message: "Thank you! You have been successfully added to our waitlist.",
        });
      }

      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;



    // 6. Check if email already registered in waitlist
    const existingEntry = await prisma.techGuildWaitlist.findUnique({
      where: { email: data.email },
    });

    if (existingEntry) {
      return NextResponse.json(
        { success: false, message: "This email has already joined our waitlist." },
        { status: 400 }
      );
    }

    // 7. Persist to Neon Database via Prisma
    const entry = await prisma.techGuildWaitlist.create({
      data: {
        email: data.email,
        role: data.role,
        company: data.company || null,
        phone: data.phone || null,
      },
    });

    // 8. Send welcome email asynchronously
    sendWaitlistConfirmation(entry.email, entry.role, entry.position).catch((err) =>
      console.error("Waitlist welcome Resend email failed:", err)
    );

    return NextResponse.json({
      success: true,
      message: "Success! You have joined the TechGuild waitlist.",
      position: entry.position,
    });
  } catch (error) {
    console.error("Error adding to waitlist in POST handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
