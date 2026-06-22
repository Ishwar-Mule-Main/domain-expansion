import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const statusUpdateSchema = z.object({
  status: z.enum([
    "NEW",
    "CONTACTED",
    "IN_PROGRESS",
    "PROPOSAL_SENT",
    "CONVERTED",
    "LOST",
    "SPAM"
  ]),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    // 1. Authorize session
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // 2. Validate input schema
    const parseResult = statusUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status } = parseResult.data;

    // 3. Update database record
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: "Lead status updated successfully.",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("PATCH lead status error:", error);
    return NextResponse.json(
      { success: false, message: "Internal database update error occurred." },
      { status: 500 }
    );
  }
}
