import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    const logs = await prisma.blogAgentLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Also fetch sitemap URLs so they can be shown in the sitemap tab
    const sitemaps = await prisma.sitemapUrl.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, posts, logs, sitemaps });
  } catch (err: any) {
    console.error("[Blog History API] Fetch failed:", err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (type === "all-logs") {
      await prisma.blogAgentLog.deleteMany();
      return NextResponse.json({ success: true, message: "All agent logs cleared successfully" });
    }

    if (type === "log" && id) {
      await prisma.blogAgentLog.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Log entry deleted successfully" });
    }

    if (type === "post" && id) {
      const post = await prisma.blogPost.findUnique({ where: { id } });
      if (post) {
        await prisma.sitemapUrl.deleteMany({
          where: { url: `/blog/${post.slug}` }
        });
        await prisma.blogPost.delete({ where: { id } });
      }
      return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
    }

    return NextResponse.json({ success: false, message: "Invalid parameters specified" }, { status: 400 });
  } catch (err: any) {
    console.error("[Blog History API] Deletion failed:", err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
