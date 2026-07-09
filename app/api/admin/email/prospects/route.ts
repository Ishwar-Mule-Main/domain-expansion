import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

/**
 * GET paginated, searchable prospects list + statistics
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.max(1, Number(searchParams.get("limit") || 10));
    const status = searchParams.get("status") || "all";
    const query = searchParams.get("q") || "";

    const skip = (page - 1) * limit;

    // Build database filter query
    const where: any = {};

    if (status !== "all") {
      where.status = status;
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { company: { contains: query, mode: "insensitive" } },
        { industry: { contains: query, mode: "insensitive" } },
      ];
    }

    // Fetch filtered list and counts in parallel
    const [
      prospects,
      totalFiltered,
      totalCount,
      pendingCount,
      generatingCount,
      readyCount,
      sendingCount,
      sentCount,
      repliedCount,
      failedCount,
      unsubscribedCount
    ] = await Promise.all([
      prisma.prospect.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.prospect.count({ where }),
      prisma.prospect.count({}),
      prisma.prospect.count({ where: { status: "PENDING" } }),
      prisma.prospect.count({ where: { status: "GENERATING" } }),
      prisma.prospect.count({ where: { status: "READY" } }),
      prisma.prospect.count({ where: { status: "SENDING" } }),
      prisma.prospect.count({ where: { status: "SENT" } }),
      prisma.prospect.count({ where: { status: "REPLIED" } }),
      prisma.prospect.count({ where: { status: "FAILED" } }),
      prisma.prospect.count({ where: { status: "UNSUBSCRIBED" } }),
    ]);

    // Format metrics counter
    const stats = {
      TOTAL: totalCount,
      PENDING: pendingCount,
      GENERATING: generatingCount,
      READY: readyCount,
      SENDING: sendingCount,
      SENT: sentCount,
      REPLIED: repliedCount,
      FAILED: failedCount,
      UNSUBSCRIBED: unsubscribedCount,
    };

    return NextResponse.json({
      success: true,
      prospects,
      pagination: {
        total: totalFiltered,
        page,
        limit,
        pages: Math.ceil(totalFiltered / limit),
      },
      stats,
    });
  } catch (err: any) {
    console.error("Prospects GET API error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch prospects data" }, { status: 500 });
  }
}

/**
 * DELETE a specific prospect or clear queue
 */
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("clearAll") === "true";

    if (clearAll) {
      // Clear entire prospects and logs database
      await prisma.$transaction([
        prisma.emailLog.deleteMany({}),
        prisma.prospect.deleteMany({}),
      ]);
      return NextResponse.json({ success: true, message: "Queue fully cleared." });
    }

    if (!id) {
      return NextResponse.json({ success: false, message: "Prospect ID required" }, { status: 400 });
    }

    await prisma.prospect.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Prospect deleted successfully." });
  } catch (err: any) {
    console.error("Prospects DELETE API error:", err);
    return NextResponse.json({ success: false, message: "Failed to delete record" }, { status: 500 });
  }
}

/**
 * PATCH to modify individual prospect settings or status
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, customSubject, customBody, name, email, company, industry, website } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Prospect ID required" }, { status: 400 });
    }

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (customSubject !== undefined) data.customSubject = customSubject;
    if (customBody !== undefined) data.customBody = customBody;
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (company !== undefined) data.company = company;
    if (industry !== undefined) data.industry = industry;
    if (website !== undefined) data.website = website;

    const updated = await prisma.prospect.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, prospect: updated });
  } catch (err: any) {
    console.error("Prospects PATCH API error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to update prospect" }, { status: 500 });
  }
}
