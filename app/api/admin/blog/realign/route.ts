import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { formatBlogBodyHTML } from "@/lib/blog/blogAgentService";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/blog/realign
 * Reformats and realigns an existing blog post's bodyHTML to align perfectly with the design system.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Blog Post ID is required" }, { status: 400 });
    }

    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ success: false, message: "Blog Post not found" }, { status: 404 });
    }

    const formattedBodyHTML = formatBlogBodyHTML(post.bodyHTML);

    // Update database
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: { bodyHTML: formattedBodyHTML },
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (err) {
    const error = err as Error;
    console.error("[Realign Blog API] Failed:", error);
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}
