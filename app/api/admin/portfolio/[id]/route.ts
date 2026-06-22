import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const portfolioUpdateSchema = z.object({
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
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
    const parseResult = portfolioUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 3. Update database record
    const updatedItem = await prisma.portfolioItem.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Portfolio item updated successfully.",
      item: updatedItem,
    });
  } catch (error) {
    console.error("PATCH portfolio item error:", error);
    return NextResponse.json(
      { success: false, message: "Internal database update error occurred." },
      { status: 500 }
    );
  }
}
