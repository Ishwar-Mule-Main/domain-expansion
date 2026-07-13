import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

/**
 * GET current blog settings
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    let settings = await prisma.emailSettings.findFirst();
    if (!settings) {
      return NextResponse.json({
        success: true,
        blogAutopilot: true,
        openRouterApiKey: "",
        blogResearchModel: "mistralai/mistral-nemo:free",
        blogWriterModel: "qwen/qwen-2.5-72b-instruct:free",
        blogImageModel: "playgroundai/playground-v2.5",
        blogReviewerModel: "qwen/qwen3-coder:free",
      });
    }

    return NextResponse.json({
      success: true,
      blogAutopilot: settings.blogAutopilot,
      openRouterApiKey: settings.openRouterApiKey,
      blogResearchModel: settings.blogResearchModel,
      blogWriterModel: settings.blogWriterModel,
      blogImageModel: settings.blogImageModel,
      blogReviewerModel: settings.blogReviewerModel,
    });
  } catch (err: any) {
    console.error("[Blog Settings GET] Error:", err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}

/**
 * POST update blog settings
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      blogAutopilot, 
      openRouterApiKey, 
      blogResearchModel, 
      blogWriterModel, 
      blogImageModel, 
      blogReviewerModel 
    } = body;

    let settings = await prisma.emailSettings.findFirst();
    
    const updateData: any = {};
    if (blogAutopilot !== undefined) updateData.blogAutopilot = Boolean(blogAutopilot);
    if (openRouterApiKey !== undefined) updateData.openRouterApiKey = openRouterApiKey;
    if (blogResearchModel !== undefined) updateData.blogResearchModel = blogResearchModel;
    if (blogWriterModel !== undefined) updateData.blogWriterModel = blogWriterModel;
    if (blogImageModel !== undefined) updateData.blogImageModel = blogImageModel;
    if (blogReviewerModel !== undefined) updateData.blogReviewerModel = blogReviewerModel;

    if (settings) {
      settings = await prisma.emailSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.emailSettings.create({
        data: {
          gmailUser: "connect.domainexpansion@gmail.com",
          ...updateData,
        },
      });
    }

    return NextResponse.json({
      success: true,
      blogAutopilot: settings.blogAutopilot,
      openRouterApiKey: settings.openRouterApiKey,
      blogResearchModel: settings.blogResearchModel,
      blogWriterModel: settings.blogWriterModel,
      blogImageModel: settings.blogImageModel,
      blogReviewerModel: settings.blogReviewerModel,
    });
  } catch (err: any) {
    console.error("[Blog Settings POST] Error:", err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
