import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { syncGmailReplies } from "@/lib/email/emailService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleSync(request);
}

export async function POST(request: Request) {
  return handleSync(request);
}

async function handleSync(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // 1. Authorization Check (admin session OR token matching NEXTAUTH_SECRET)
    const session = await auth();
    const isCronAuthorized = token && token === process.env.NEXTAUTH_SECRET;

    if (!session && !isCronAuthorized) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    // 2. Fetch configurations
    const settings = await prisma.emailSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ success: false, message: "Settings not configured." }, { status: 400 });
    }

    if (!settings.gmailUser || !settings.gmailAppPassword) {
      return NextResponse.json({ success: false, message: "Gmail credentials not configured." }, { status: 400 });
    }

    // 3. Connect to IMAP and retrieve incoming messages
    console.log("Triggering IMAP inbox scan...");
    const repliesCount = await syncGmailReplies(settings);

    return NextResponse.json({
      success: true,
      message: `Sync completed. Processed and synced ${repliesCount} prospect replies.`,
      repliesSynced: repliesCount,
    });

  } catch (err: any) {
    console.error("Sync replies API error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to scan Gmail inbox" }, { status: 500 });
  }
}
