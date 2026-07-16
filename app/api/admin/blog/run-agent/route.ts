import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { 
  generatePillarBlog,
  runResearchStep,
  runWriterStep,
  runImageStep,
  runReviewerStep
} from "@/lib/blog/blogAgentService";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { pillar, step } = body;

    if (!pillar || !["marketing", "development", "design", "ai"].includes(pillar)) {
      return NextResponse.json({ success: false, message: "Invalid service pillar specified" }, { status: 400 });
    }

    const settings = await prisma.emailSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ success: false, message: "Active EmailSettings/API configuration not found." }, { status: 400 });
    }

    // Step-by-step route
    if (step) {
      const stepNum = parseInt(step, 10);
      console.log(`[Blog Agent Route] Executing manual step ${stepNum} for pillar: ${pillar}`);

      if (stepNum === 1) {
        const researchParsed = await runResearchStep(pillar, settings);
        return NextResponse.json({ success: true, step: 1, researchParsed });
      }

      if (stepNum === 2) {
        const { researchParsed } = body;
        if (!researchParsed) {
          return NextResponse.json({ success: false, message: "Missing researchParsed data for step 2." }, { status: 400 });
        }
        const writerParsed = await runWriterStep(pillar, researchParsed, settings);
        return NextResponse.json({ success: true, step: 2, writerParsed });
      }

      if (stepNum === 3) {
        const { imagePrompt, slug } = body;
        if (!imagePrompt || !slug) {
          return NextResponse.json({ success: false, message: "Missing imagePrompt or slug data for step 3." }, { status: 400 });
        }
        const featuredImage = await runImageStep(imagePrompt, slug);
        return NextResponse.json({ success: true, step: 3, featuredImage });
      }

      if (stepNum === 4) {
        const { writerParsed, featuredImage } = body;
        if (!writerParsed || !featuredImage) {
          return NextResponse.json({ success: false, message: "Missing writerParsed or featuredImage data for step 4." }, { status: 400 });
        }
        const post = await runReviewerStep(pillar, writerParsed, featuredImage, settings);
        return NextResponse.json({ success: true, step: 4, post });
      }

      return NextResponse.json({ success: false, message: "Invalid step number specified." }, { status: 400 });
    }

    // Default sequential run
    console.log(`[Blog Agent] Initiating manual generation for: ${pillar}`);
    const post = await generatePillarBlog(pillar, settings);

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    console.error(`[Blog Agent] Manual generation/step failed:`, err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
