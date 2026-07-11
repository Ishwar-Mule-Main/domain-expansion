import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { registerSitemapUrl } from "@/lib/sitemap/sitemapAgent";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { url, changeFrequency, priority } = body;

    if (!url) {
      return NextResponse.json({ success: false, message: "URL parameter is required" }, { status: 400 });
    }

    const result = await registerSitemapUrl({
      url,
      changeFrequency: changeFrequency || "weekly",
      priority: priority !== undefined ? Number(priority) : 0.6,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[Sitemap Register API] Registration failed:", err);
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID parameter is required" }, { status: 400 });
    }

    await prisma.sitemapUrl.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Sitemap URL unregistered successfully" });
  } catch (err: any) {
    console.error("[Sitemap Register API] Unregistration failed:", err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
