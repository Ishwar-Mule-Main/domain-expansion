import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

/**
 * Call Gemini Imagen 3 to generate an image
 */
async function generateImageWithGemini(prompt: string, apiKey: string): Promise<Buffer | null> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          outputMimeType: "image/png",
          aspectRatio: "16:9",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Gemini Imagen API] Error (${response.status}):`, errorText);
      return null;
    }

    const data = await response.json();
    const b64 = data.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) {
      console.warn("[Gemini Imagen API] No image data returned in predictions");
      return null;
    }

    return Buffer.from(b64, "base64");
  } catch (err) {
    console.error("[Gemini Imagen API] call failed:", err);
    return null;
  }
}

/**
 * Resilient image processing: saves buffer to local directory, or falls back to Base64 in read-only filesystems.
 */
async function saveImageResilient(buffer: Buffer, slug: string): Promise<string> {
  try {
    const dirPath = path.join(process.cwd(), "public", "blog");
    await fs.mkdir(dirPath, { recursive: true });
    const filePath = path.join(dirPath, `${slug}.png`);
    await fs.writeFile(filePath, buffer);
    console.log(`[Regenerate Image API] Cover image saved locally to: ${filePath}`);
    return `/blog/${slug}.png`;
  } catch {
    console.warn("[Regenerate Image API] Read-only file system (Vercel). Storing image as Base64 data URL directly in DB.");
    return `data:image/png;base64,${buffer.toString("base64")}`;
  }
}

/**
 * Fallback to Pollinations AI and download/process
 */
async function downloadAndProcessFallback(imageUrl: string, slug: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    return await saveImageResilient(Buffer.from(arrayBuffer), slug);
  } catch (err) {
    console.error(`[Regenerate Image API] Pollinations fallback download failed, returning URL:`, err);
    return imageUrl;
  }
}

/**
 * POST /api/admin/blog/regenerate-image
 * Re-creates the featured cover image for a blog post using Gemini Imagen 3 (with Pollinations AI fallback)
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
    const basePrompt = `A premium, sleek dark-themed technology banner image for a professional tech article titled "${post.title}". Category: ${categoryKeyword}. Minimalist, vector graphics style, vibrant accents of orange and purple, no text, no labels, ultra-high definition, 16:9 aspect ratio. Make sure the visual is clean, premium, and free of messy AI text artifacts. If text is needed, it must be spelled correctly. Otherwise, a purely visual tech illustration without text is preferred.`;

    const settings = await prisma.emailSettings.findFirst();
    const geminiApiKey = settings?.geminiApiKey;
    const blogImageModel = (settings as any)?.blogImageModel || "playgroundai/playground-v2.5";

    let featuredImage = "";

    // 1. If Gemini Imagen is selected, use it
    if (blogImageModel === "gemini-imagen" && geminiApiKey) {
      console.log(`[Regenerate Image API] Attempting to generate image using Gemini Imagen 3 API...`);
      const buffer = await generateImageWithGemini(basePrompt, geminiApiKey);
      if (buffer) {
        featuredImage = await saveImageResilient(buffer, post.slug);
      }
    }

    // 2. Fallback / Standard model configuration via Pollinations
    if (!featuredImage) {
      console.log(`[Regenerate Image API] Utilizing third agent model parameter: ${blogImageModel}`);
      let imgModel = blogImageModel;
      if (imgModel.includes("/")) {
        imgModel = imgModel.split("/")[1]; // extract base model name (e.g. "playground-v2.5")
      }
      const cleanPrompt = encodeURIComponent(basePrompt.trim().substring(0, 200));
      const randomSeed = Math.floor(Math.random() * 100000);
      const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?model=${encodeURIComponent(imgModel)}&width=1024&height=576&nologo=true&seed=${randomSeed}`;
      featuredImage = await downloadAndProcessFallback(imageUrl, post.slug);
    }

    // Update database
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: { featuredImage },
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (err) {
    const error = err as Error;
    console.error("[Regenerate Image API] Failed:", error);
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}
