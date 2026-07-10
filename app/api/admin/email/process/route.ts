import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { generatePitchEmail } from "@/lib/email/geminiService";
import { sendPitchEmail } from "@/lib/email/emailService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleProcess(request);
}

export async function POST(request: Request) {
  return handleProcess(request);
}

async function handleProcess(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const force = searchParams.get("force") === "true"; // Bypass master toggle & timing restrictions for manual clicks

    // 1. Authorization: NextAuth session OR query token OR Vercel Cron auth header
    const session = await auth();
    const authHeader = request.headers.get("Authorization");
    const isVercelCron = authHeader && process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isTokenCron = token && token === process.env.NEXTAUTH_SECRET;
    const isCronAuthorized = isVercelCron || isTokenCron;
 
    if (!session && !isCronAuthorized) {
      return NextResponse.json({ success: false, message: "Unauthorized trigger" }, { status: 401 });
    }

    // 2. Fetch email settings
    const settings = await prisma.emailSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ success: false, message: "Email settings not configured. Please initialize settings." }, { status: 400 });
    }

    // 3. Check master switch
    if (!settings.isActive && !force) {
      return NextResponse.json({ success: false, message: "Email automation is currently inactive." });
    }
 
    // 3.5 Enforce Business Hours & Business Days (Monday - Friday, 10 AM - 6 PM IST)
    if (!force) {
      const tzString = "Asia/Kolkata";
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tzString,
        hour12: false,
        weekday: "long",
        hour: "numeric",
      });
      const parts = formatter.formatToParts(new Date());
      const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));
      
      const weekday = partMap.weekday; // "Monday", "Tuesday", etc.
      const hour = parseInt(partMap.hour, 10); // 0-23
      
      const isBusinessDay = !["Saturday", "Sunday"].includes(weekday);
      const isBusinessHour = hour >= 10 && hour < 18; // 10:00 AM to 5:59 PM (6:00 PM cutoff)
      
      if (!isBusinessDay || !isBusinessHour) {
        return NextResponse.json({
          success: false,
          message: `Process halted. Out of business hours (Monday-Friday, 10:00 AM - 6:00 PM IST). Current local time: ${weekday}, ${hour}:00.`,
        });
      }
    }

    // 4. Verify SMTP & AI credentials
    const hasAIConfig = settings.geminiApiKey || settings.openRouterApiKey;
    if (!settings.gmailUser || !settings.gmailAppPassword || !hasAIConfig) {
      return NextResponse.json({ success: false, message: "SMTP or AI configuration details are incomplete." }, { status: 400 });
    }

    // 5. Enforce Daily Limit (sent logs since midnight UTC)
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const sentTodayCount = await prisma.emailLog.count({
      where: {
        action: "SENT",
        createdAt: {
          gte: startOfToday,
        },
      },
    });

    if (sentTodayCount >= settings.dailyLimit && !force) {
      return NextResponse.json({
        success: false,
        message: `Daily send limit of ${settings.dailyLimit} reached. Process halted.`,
        sentToday: sentTodayCount,
      });
    }

    // 6. Enforce Spacing Throttling (check elapsed time since last send)
    if (!force) {
      const lastSentLog = await prisma.emailLog.findFirst({
        where: { action: "SENT" },
        orderBy: { createdAt: "desc" },
      });

      if (lastSentLog) {
        const secondsSinceLastSend = (Date.now() - lastSentLog.createdAt.getTime()) / 1000;
        if (secondsSinceLastSend < settings.intervalSeconds) {
          const waitTime = Math.ceil(settings.intervalSeconds - secondsSinceLastSend);
          return NextResponse.json({
            success: false,
            message: `Throttling active. Please wait ${waitTime}s before sending next.`,
            cooldownSeconds: waitTime,
          });
        }
      }
    }

    // 7. Find next prospect to process
    // Priority 1: READY prospects (pre-generated)
    // Priority 2: PENDING prospects (generate & send immediately)
    let prospect = await prisma.prospect.findFirst({
      where: { status: "READY" },
      orderBy: { createdAt: "asc" },
    });

    let needsGeneration = false;

    if (!prospect) {
      prospect = await prisma.prospect.findFirst({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
      });
      needsGeneration = true;
    }

    if (!prospect) {
      return NextResponse.json({ success: true, message: "Queue is empty. No prospects left to send.", queueEmpty: true });
    }

    let subject = prospect.customSubject || "";
    let body = prospect.customBody || "";

    // 8. Generate content via Gemini API if status is PENDING
    if (needsGeneration || !subject || !body) {
      // Mark prospect as GENERATING to avoid concurrent lock issues
      prospect = await prisma.prospect.update({
        where: { id: prospect.id },
        data: { status: "GENERATING" },
      });

      try {
        const generation = await generatePitchEmail({
          name: prospect.name,
          company: prospect.company,
          industry: prospect.industry,
          website: prospect.website,
          prospectId: prospect.id,
          prospectEmail: prospect.email,
          settings,
        });

        subject = generation.subject;
        body = generation.body;

        // Update DB with generated text
        prospect = await prisma.prospect.update({
          where: { id: prospect.id },
          data: {
            customSubject: subject,
            customBody: body,
            status: "READY",
          },
        });

        // Log successful generation
        await prisma.emailLog.create({
          data: {
            prospectId: prospect.id,
            prospectEmail: prospect.email,
            action: "GENERATED",
            details: `Successfully compiled customized pitch subject: "${subject}"`,
          },
        });
      } catch (genErr: any) {
        console.error("Gemini prompt generation failed:", genErr);
        
        await prisma.$transaction([
          prisma.prospect.update({
            where: { id: prospect.id },
            data: { status: "FAILED" },
          }),
          prisma.emailLog.create({
            data: {
              prospectId: prospect.id,
              prospectEmail: prospect.email,
              action: "FAILED",
              details: `Gemini Generation Error: ${genErr.message || String(genErr)}`,
            },
          }),
        ]);

        return NextResponse.json({ success: false, message: `AI text generation failed: ${genErr.message}` }, { status: 500 });
      }
    }

    // 9. Send email via SMTP
    // Mark prospect as SENDING
    prospect = await prisma.prospect.update({
      where: { id: prospect.id },
      data: { status: "SENDING" },
    });

    try {
      await sendPitchEmail({
        to: prospect.email,
        subject,
        html: body,
        prospectId: prospect.id,
      }, settings);

      // 10. Update DB on successful send
      await prisma.$transaction([
        prisma.prospect.update({
          where: { id: prospect.id },
          data: {
            status: "SENT",
            sentAt: new Date(),
          },
        }),
        prisma.emailLog.create({
          data: {
            prospectId: prospect.id,
            prospectEmail: prospect.email,
            action: "SENT",
            details: `Email dispatched to ${prospect.email}`,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: `Email successfully sent to ${prospect.email}`,
        prospect: {
          id: prospect.id,
          name: prospect.name,
          email: prospect.email,
          subject,
        },
      });

    } catch (sendErr: any) {
      console.error("Nodemailer SMTP dispatch failed:", sendErr);

      await prisma.$transaction([
        prisma.prospect.update({
          where: { id: prospect.id },
          data: { status: "FAILED" },
        }),
        prisma.emailLog.create({
          data: {
            prospectId: prospect.id,
            prospectEmail: prospect.email,
            action: "FAILED",
            details: `SMTP Send Error: ${sendErr.message || String(sendErr)}`,
          },
        }),
      ]);

      return NextResponse.json({ success: false, message: `Email sending failed: ${sendErr.message}` }, { status: 500 });
    }

  } catch (globalErr: any) {
    console.error("Queue processor global error:", globalErr);
    return NextResponse.json({ success: false, message: globalErr.message || "Queue processing error" }, { status: 500 });
  }
}
