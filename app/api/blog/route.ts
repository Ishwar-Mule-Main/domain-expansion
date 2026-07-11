import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    console.error("[Blogs API] Database query failed:", err);
    return NextResponse.json({ success: false, posts: [] }, { status: 500 });
  }
}
