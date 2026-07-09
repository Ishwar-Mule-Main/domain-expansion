import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    // 1. Authorize admin session
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    // 2. Parse request JSON payload
    const body = await request.json();
    const { prospects } = body;

    if (!Array.isArray(prospects) || prospects.length === 0) {
      return NextResponse.json({ success: false, message: "No prospects data provided" }, { status: 400 });
    }

    // 3. Prepare data for insert with sanitization
    const formattedProspects = prospects.map((p: any) => ({
      email: String(p.email).trim().toLowerCase(),
      name: String(p.name || "Valued Prospect").trim(),
      company: p.company ? String(p.company).trim() : null,
      industry: p.industry ? String(p.industry).trim() : null,
      website: p.website ? String(p.website).trim() : null,
      status: "PENDING" as const,
    })).filter(p => {
      // Basic email regex filter
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(p.email);
    });

    if (formattedProspects.length === 0) {
      return NextResponse.json({ success: false, message: "No valid email prospects found in batch" }, { status: 400 });
    }

    // 4. Batch insert into database, skipping existing emails
    const createdCount = await prisma.prospect.createMany({
      data: formattedProspects,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully processed batch. Imported ${createdCount.count} new prospects.`,
      count: createdCount.count,
    });

  } catch (err: any) {
    console.error("CSV Import API error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to process prospects upload" }, { status: 500 });
  }
}
