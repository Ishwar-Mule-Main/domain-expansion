import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generatePillarBlog } from "@/lib/blog/blogAgentService";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { pillar } = body;

    if (!pillar || !["marketing", "development", "design", "ai"].includes(pillar)) {
      return NextResponse.json({ success: false, message: "Invalid service pillar specified" }, { status: 400 });
    }

    const settings = await prisma.emailSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ success: false, message: "Active EmailSettings/API configuration not found." }, { status: 400 });
    }

    console.log(`[Blog Agent] Initiating manual generation for: ${pillar}`);
    const post = await generatePillarBlog(pillar, settings);

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    console.error(`[Blog Agent] Manual generation failed:`, err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
