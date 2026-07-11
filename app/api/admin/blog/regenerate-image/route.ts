import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/blog/regenerate-image
 * Re-creates the featured cover image for a blog post and stores it in the local blog image folder
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

    // Generate a beautiful, category-specific image prompt based on the title
    const categoryKeyword = post.categoryLabel || post.category;
    const basePrompt = `A premium, sleek dark-themed technology banner image for a professional tech article titled "${post.title}". Category: ${categoryKeyword}. Minimalist, vector graphics style, vibrant accents of orange and purple, no text, no labels, ultra-high definition, 16:9 aspect ratio.`;
    const cleanPrompt = encodeURIComponent(basePrompt.trim().substring(0, 200));
    const randomSeed = Math.floor(Math.random() * 100000);
    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=576&nologo=true&seed=${randomSeed}`;

    let featuredImage = imageUrl;
    try {
      // Try to save image locally
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error fetching image from Pollinations AI: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const dirPath = path.join(process.cwd(), "public", "blog");
      await fs.mkdir(dirPath, { recursive: true });

      const filePath = path.join(dirPath, `${post.slug}.png`);
      await fs.writeFile(filePath, buffer);

      featuredImage = `/blog/${post.slug}.png`;
      console.log(`[Regenerate Image API] Image saved locally to: ${filePath}`);
    } catch (writeErr: any) {
      console.warn("[Regenerate Image API] Failed to save locally (read-only system/serverless?), falling back to remote CDN URL:", writeErr.message || String(writeErr));
      featuredImage = imageUrl;
    }

    // Update database
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: { featuredImage },
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (err: any) {
    console.error("[Regenerate Image API] Failed:", err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
