import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Content-Type": "application/json"
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`OpenRouter models API returned status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data: data.data || [] });
  } catch (err: any) {
    console.error("Failed to fetch OpenRouter models:", err);
    // Return a solid list of valid 2026 models as fallback
    const fallbackModels = [
      { id: "google/gemini-2.5-flash", name: "Google: Gemini 2.5 Flash" },
      { id: "google/gemini-2.5-pro", name: "Google: Gemini 2.5 Pro" },
      { id: "google/gemini-2.5-flash-lite", name: "Google: Gemini 2.5 Flash Lite" },
      { id: "google/gemini-3.5-flash", name: "Google: Gemini 3.5 Flash" },
      { id: "meta-llama/llama-3-8b-instruct:free", name: "Meta: Llama 3 8B Instruct (Free)" },
      { id: "deepseek/deepseek-chat", name: "DeepSeek: Chat" }
    ];
    return NextResponse.json({ success: true, data: fallbackModels });
  }
}
