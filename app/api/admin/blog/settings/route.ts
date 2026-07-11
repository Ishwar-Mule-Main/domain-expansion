import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

/**
 * GET current blog autopilot setting
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    let settings = await prisma.emailSettings.findFirst();
    if (!settings) {
      // Return default true if no settings exist
      return NextResponse.json({ success: true, blogAutopilot: true });
    }

    return NextResponse.json({ success: true, blogAutopilot: settings.blogAutopilot });
  } catch (err: any) {
    console.error("[Blog Settings GET] Error:", err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}

/**
 * POST update blog autopilot setting
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { blogAutopilot } = body;

    if (blogAutopilot === undefined) {
      return NextResponse.json({ success: false, message: "blogAutopilot parameter is required" }, { status: 400 });
    }

    let settings = await prisma.emailSettings.findFirst();
    if (settings) {
      settings = await prisma.emailSettings.update({
        where: { id: settings.id },
        data: { blogAutopilot: Boolean(blogAutopilot) },
      });
    } else {
      settings = await prisma.emailSettings.create({
        data: {
          gmailUser: "connect.domainexpansion@gmail.com",
          blogAutopilot: Boolean(blogAutopilot),
        },
      });
    }

    return NextResponse.json({ success: true, blogAutopilot: settings.blogAutopilot });
  } catch (err: any) {
    console.error("[Blog Settings POST] Error:", err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
