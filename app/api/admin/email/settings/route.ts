import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

/**
 * GET current email settings (or create default ones if they don't exist yet)
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    let settings = await prisma.emailSettings.findFirst();

    if (!settings) {
      // Initialize default settings record
      settings = await prisma.emailSettings.create({
        data: {
          gmailUser: "connect.domainexpansion@gmail.com",
          gmailAppPassword: "",
          geminiApiKey: "",
          openRouterApiKey: "",
          openRouterModel: "google/gemini-2.0-flash",
          preferredProvider: "GOOGLE",
          fallbackEnabled: true,
          dailyLimit: 150,
          intervalSeconds: 120,
          isActive: false,
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    console.error("Settings GET API error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch settings" }, { status: 500 });
  }
}

/**
 * POST / UPDATE email settings
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const {
      gmailUser,
      gmailAppPassword,
      geminiApiKey,
      openRouterApiKey,
      openRouterModel,
      preferredProvider,
      fallbackEnabled,
      pitchPrompt,
      replyPrompt,
      dailyLimit,
      intervalSeconds,
      isActive,
    } = body;

    let settings = await prisma.emailSettings.findFirst();

    if (settings) {
      // Update existing record
      settings = await prisma.emailSettings.update({
        where: { id: settings.id },
        data: {
          gmailUser: gmailUser !== undefined ? String(gmailUser).trim() : settings.gmailUser,
          gmailAppPassword: gmailAppPassword !== undefined ? String(gmailAppPassword).trim() : settings.gmailAppPassword,
          geminiApiKey: geminiApiKey !== undefined ? String(geminiApiKey).trim() : settings.geminiApiKey,
          openRouterApiKey: openRouterApiKey !== undefined ? String(openRouterApiKey).trim() : settings.openRouterApiKey,
          openRouterModel: openRouterModel !== undefined ? String(openRouterModel).trim() : settings.openRouterModel,
          preferredProvider: preferredProvider !== undefined ? String(preferredProvider).trim() : settings.preferredProvider,
          fallbackEnabled: fallbackEnabled !== undefined ? Boolean(fallbackEnabled) : settings.fallbackEnabled,
          pitchPrompt: pitchPrompt !== undefined ? String(pitchPrompt).trim() : settings.pitchPrompt,
          replyPrompt: replyPrompt !== undefined ? String(replyPrompt).trim() : settings.replyPrompt,
          dailyLimit: dailyLimit !== undefined ? Number(dailyLimit) : settings.dailyLimit,
          intervalSeconds: intervalSeconds !== undefined ? Number(intervalSeconds) : settings.intervalSeconds,
          isActive: isActive !== undefined ? Boolean(isActive) : settings.isActive,
        },
      });
    } else {
      // Create new record
      settings = await prisma.emailSettings.create({
        data: {
          gmailUser: gmailUser ? String(gmailUser).trim() : "connect.domainexpansion@gmail.com",
          gmailAppPassword: gmailAppPassword ? String(gmailAppPassword).trim() : "",
          geminiApiKey: geminiApiKey ? String(geminiApiKey).trim() : "",
          openRouterApiKey: openRouterApiKey ? String(openRouterApiKey).trim() : "",
          openRouterModel: openRouterModel ? String(openRouterModel).trim() : "google/gemini-2.0-flash",
          preferredProvider: preferredProvider ? String(preferredProvider).trim() : "GOOGLE",
          fallbackEnabled: fallbackEnabled !== undefined ? Boolean(fallbackEnabled) : true,
          pitchPrompt: pitchPrompt ? String(pitchPrompt).trim() : undefined,
          replyPrompt: replyPrompt ? String(replyPrompt).trim() : undefined,
          dailyLimit: dailyLimit ? Number(dailyLimit) : 150,
          intervalSeconds: intervalSeconds ? Number(intervalSeconds) : 120,
          isActive: isActive !== undefined ? Boolean(isActive) : false,
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    console.error("Settings POST API error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to update settings" }, { status: 500 });
  }
}
