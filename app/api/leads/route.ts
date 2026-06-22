import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { leadsRateLimiter } from "@/lib/ratelimit";
import { sendAdminLeadNotification, sendLeadUserConfirmation } from "@/lib/email";

// Validation schema for incoming leads
const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  // Honeypot field (should be empty for human submissions)
  website: z.string().max(0, "Honeypot triggered").optional(),
  // Tracking
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
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

    // 3. Perform Rate Limiting
    const rateLimitResult = await leadsRateLimiter.limit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: "Too many inquiries. Please try again later." },
        { status: 429 }
      );
    }

    // 4. Validate body parameters
    const parseResult = leadSchema.safeParse(body);
    if (!parseResult.success) {
      // If honeypot fails (website field is filled), we silently return success to make bots think they succeeded
      const hasHoneypotError = parseResult.error.issues.some(
        (issue) => issue.path.includes("website")
      );
      if (hasHoneypotError) {
        console.warn(`[Honeypot] Spambot submission blocked from IP: ${ip}`);
        return NextResponse.json({
          success: true,
          message: "Thank you! Your inquiry has been logged.",
        });
      }

      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;


    // 6. Gather tracking details from headers
    const userAgent = request.headers.get("user-agent") || undefined;

    // 7. Persist to Neon Database via Prisma
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service,
        budget: data.budget || null,
        message: data.message,
        ipAddress: ip,
        userAgent,
        referrer: data.referrer || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
      },
    });

    // 8. Send transactional emails asynchronously
    // Admin Notification
    sendAdminLeadNotification({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || undefined,
      company: lead.company || undefined,
      service: lead.service,
      budget: lead.budget || undefined,
      message: lead.message,
    }).catch((err) => console.error("Admin Resend notification failed:", err));

    // Lead Confirmation
    sendLeadUserConfirmation(lead.email, lead.name).catch((err) =>
      console.error("User Resend confirmation failed:", err)
    );

    return NextResponse.json({
      success: true,
      message: "Thank you! Your inquiry has been logged. We'll be in touch within 24 hours.",
      leadId: lead.id,
    });
  } catch (error) {
    console.error("Error logging lead in POST handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
