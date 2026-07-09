import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

/**
 * GET paginated, searchable Master Brain logs
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.max(1, Number(searchParams.get("limit") || 20));
    const status = searchParams.get("status") || "all";
    const query = searchParams.get("q") || "";

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status !== "all") {
      where.status = status;
    }

    if (query) {
      where.OR = [
        { prospectEmail: { contains: query, mode: "insensitive" } },
        { provider: { contains: query, mode: "insensitive" } },
        { model: { contains: query, mode: "insensitive" } },
        { prompt: { contains: query, mode: "insensitive" } },
        { response: { contains: query, mode: "insensitive" } },
        { errorMessage: { contains: query, mode: "insensitive" } },
      ];
    }

    const [logs, totalFiltered] = await Promise.all([
      prisma.masterBrainLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.masterBrainLog.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        total: totalFiltered,
        page,
        limit,
        pages: Math.ceil(totalFiltered / limit),
      },
    });
  } catch (err: any) {
    console.error("Master Brain Logs GET API error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch logs data" }, { status: 500 });
  }
}
