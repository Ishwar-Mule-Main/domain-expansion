import { prisma } from "../db/prisma";
import { registerSitemapUrl } from "../sitemap/sitemapAgent";
import fs from "fs/promises";
import path from "path";

interface BlogGenerationResult {
  title: string;
  slug: string;
  excerpt: string;
  bodyHTML: string;
  readTime: string;
  schemaMarkup: string;
  imagePrompt: string;
}

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
    console.log(`[Blog Agent] Cover image saved locally to: ${filePath}`);
    return `/blog/${slug}.png`;
  } catch (err) {
    console.warn("[Blog Agent] Read-only file system (Vercel). Storing image as Base64 data URL directly in DB.");
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
    console.error(`[Blog Agent] Pollinations fallback download failed, returning URL:`, err);
    return imageUrl;
  }
}

/**
 * Call Google Gemini with optional search grounding
 */
async function fetchGeminiWithGrounding(prompt: string, apiKey: string, useSearch: boolean): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const requestBody: any = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          slug: { type: "STRING" },
          excerpt: { type: "STRING" },
          bodyHTML: { type: "STRING" },
          readTime: { type: "STRING" },
          schemaMarkup: { type: "STRING" },
          imagePrompt: { type: "STRING" },
        },
        required: ["title", "slug", "excerpt", "bodyHTML", "readTime", "schemaMarkup", "imagePrompt"],
      },
    },
  };

  if (useSearch) {
    requestBody.tools = [{ googleSearch: {} }];
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error("Empty response from Gemini API");
  }
  return textContent;
}

/**
 * Free web search tool using DuckDuckGo html interface.
 * Extracts titles, links, and snippets cleanly without external packages.
 */
async function searchWebFree(query: string): Promise<{ title: string; link: string; snippet: string }[]> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!response.ok) {
      throw new Error(`DuckDuckGo request failed with status: ${response.status}`);
    }
    const html = await response.text();
    const results: { title: string; link: string; snippet: string }[] = [];
    const blocks = html.split('<div class="result ');
    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      const hrefMatch = block.match(/href="([^"]+)"/);
      const url = hrefMatch ? hrefMatch[1] : "";
      
      let cleanUrl = url;
      if (url.includes("uddg=")) {
        const decoded = decodeURIComponent(url.split("uddg=")[1]?.split("&")[0] || "");
        if (decoded) cleanUrl = decoded;
      }
      
      const titleMatch = block.match(/class="result__link"[^>]*>([\s\S]*?)<\/a>/);
      let title = titleMatch ? titleMatch[1] : "";
      title = title.replace(/<[^>]*>/g, "").trim();
      
      const snippetMatch = block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
      let snippet = snippetMatch ? snippetMatch[1] : "";
      snippet = snippet.replace(/<[^>]*>/g, "").trim();
      
      if (title && cleanUrl) {
        results.push({
          title,
          link: cleanUrl,
          snippet: snippet || "No snippet available."
        });
      }
    }
    return results.slice(0, 10);
  } catch (error) {
    console.error("[Blog Agent Search] DuckDuckGo search error:", error);
    return [];
  }
}

interface ResearchOutlineResult {
  selectedTopic: string;
  reasoning: string;
  primaryKeyword: string;
  clusterKeywords: string[];
  outline: string;
}

/**
 * Resilient OpenRouter API call wrapper.
 * Falls back to plain text if JSON mode is rejected or fails.
 */
async function fetchOpenRouterBlog(prompt: string, apiKey: string, model: string, forceJson = true): Promise<string> {
  const endpoint = "https://openrouter.ai/api/v1/chat/completions";

  const body: any = {
    model: model,
    messages: [{ role: "user", content: prompt }],
  };

  if (forceJson) {
    body.response_format = { type: "json_object" };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://domainexpansion.in",
        "X-Title": "Domain Expansion Blog System",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (forceJson) {
        console.warn("[OpenRouter API] JSON mode failed, retrying in plain text...");
        return await fetchOpenRouterBlog(prompt, apiKey, model, false);
      }
      const errorText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from OpenRouter API");
    }
    return content;
  } catch (err) {
    if (forceJson) {
      console.warn("[OpenRouter API] Error in JSON mode, retrying in plain text:", err);
      return await fetchOpenRouterBlog(prompt, apiKey, model, false);
    }
    throw err;
  }
}

/**
 * Generate a daily blog post using a four-agent pipeline:
 * 1. Research Agent (Mistral Nemo Free): Searches Q&A platforms, scans for business growth value, generates outline.
 * 2. Blog Writer Agent (Qwen 2.5 72B Free): Writes deep-dive 3000-word post using blogagentprompt.txt and outputs image prompt.
 * 3. Image Creator Agent (Playground v2.5): Calls Pollinations to generate stylized vector-like featured image.
 * 4. Reviewer Agent (Prisma): Performs alignment checks and upserts the post to database & sitemap.
 */
export async function generatePillarBlog(pillar: string, settings: any) {
  const openRouterApiKey = settings.openRouterApiKey;
  const geminiApiKey = settings.geminiApiKey;

  // Resilient check: require at least one API key
  if (!openRouterApiKey && !geminiApiKey) {
    const err = "Failed: Both OpenRouter and Gemini API Keys are missing.";
    await prisma.blogAgentLog.create({
      data: { piller: pillar, status: "FAILED", errorMessage: err },
    });
    throw new Error(err);
  }

  let pillarName = "";
  let categoryLabel = "";
  switch (pillar) {
    case "marketing":
      pillarName = "Marketing Expansion (SEO, GEO, AIO, Paid Ads, Social Media growth, performance marketing, content strategy)";
      categoryLabel = "SEO & Marketing";
      break;
    case "development":
      pillarName = "Development Expansion (Next.js, high-speed interfaces, APIs, SaaS architectures, TailwindCSS, full-stack, headless CMS, Postgres)";
      categoryLabel = "Development";
      break;
    case "design":
      pillarName = "Design Expansion (Brand identity, premium UI/UX, Figma design systems, visual assets, custom website design)";
      categoryLabel = "Design Systems";
      break;
    case "ai":
      pillarName = "AI Expansion (LLM integration, n8n/Make automation workflows, RAG, custom agents, intelligent automation)";
      categoryLabel = "AI & Automation";
      break;
    default:
      pillarName = "Digital Strategy & Technology";
      categoryLabel = "Agency News";
  }

  try {
    console.log(`[Blog Agent Workflow] Starting multi-agent pipeline for pillar: ${pillarName}`);

  // ==========================================
  // AGENT 1: RESEARCH AGENT (Mistral Nemo Free)
  // ==========================================
  console.log(`[Research Agent] Querying Q&A platforms for recent trending topics...`);
  
  let searchQuery = "";
  switch (pillar) {
    case "marketing":
      searchQuery = `site:reddit.com OR site:quora.com "SEO" OR "GEO" OR "AIO" OR "B2B marketing" growth hack`;
      break;
    case "development":
      searchQuery = `site:reddit.com OR site:quora.com "Next.js" OR "SaaS architecture" OR "web performance" loading speed dev`;
      break;
    case "design":
      searchQuery = `site:reddit.com OR site:quora.com "UI" OR "UX" OR "Figma design system" website design trends`;
      break;
    case "ai":
      searchQuery = `site:reddit.com OR site:quora.com "AI agents" OR "n8n automation" OR "RAG setup" LLM workflow`;
      break;
    default:
      searchQuery = `site:reddit.com OR site:quora.com technology digital business strategy growth`;
  }

  const rawSearchResults = await searchWebFree(searchQuery);
  console.log(`[Research Agent] Found ${rawSearchResults.length} discussions on Reddit/Quora.`);

  const researchPrompt = `
    You are the Domain Expansion Research Agent.
    Your goal is to search for high-quality, live trending topics/questions from Reddit, Quora, and public Q&A platforms related to the service pillar: "${pillarName}".

    Here are the raw search results collected from recent Reddit/Quora posts:
    ${JSON.stringify(rawSearchResults.slice(0, 5), null, 2)}

    Your task:
    1. Scan and analyze all raw content.
    2. Conduct a MANDATORY BUSINESS VALUE SCAN: Select the single best topic that has direct, actionable utility to help other companies scale, automate, lower costs, or boost conversions. If a topic does not help other businesses grow, discard it.
    3. Identify:
       - The Primary Target Keyword (highly searched and relevant).
       - Related LSI keywords.
       - Cluster keywords (parent and subtopics).
    4. Personalize this ONE BEST TOPIC and create a comprehensive, highly formatted Markdown outline. The outline must cover sections including:
       - Introduction & AEO/AIO direct question answer
       - Detailed technical/strategy guide
       - Calculations, metrics, or ROI projections
       - Common pitfalls and how to avoid them
       - Frequently Asked Questions section (5-10 Q&A pairs)

    Return your output strictly as a JSON object containing:
    {
      "selectedTopic": string,
      "reasoning": string,
      "primaryKeyword": string,
      "clusterKeywords": string[],
      "outline": string // detailed Markdown outline
    }
  `;

  let researchParsed: ResearchOutlineResult;
  let useFallbackModel = !openRouterApiKey;

  if (!useFallbackModel) {
    try {
      console.log(`[Research Agent] Generating outline using mistralai/mistral-nemo:free...`);
      const nemoResponse = await fetchOpenRouterBlog(researchPrompt, openRouterApiKey, "mistralai/mistral-nemo:free");
      let cleaned = nemoResponse.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "").trim();
      }
      researchParsed = JSON.parse(cleaned);
    } catch (err) {
      console.warn("[Research Agent] Mistral Nemo OpenRouter failed or JSON invalid. Falling back to Gemini...", err);
      useFallbackModel = true;
    }
  }

  if (useFallbackModel && geminiApiKey) {
    console.log(`[Research Agent] Running fallback outline generation via Gemini...`);
    const fallbackText = await fetchGeminiWithGrounding(researchPrompt, geminiApiKey, false);
    let cleaned = fallbackText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "").trim();
    }
    researchParsed = JSON.parse(cleaned);
  }

  // Double fallback guard if parsing somehow failed completely
  if (!researchParsed!) {
    throw new Error("Research Agent failed to produce valid topic outline payload.");
  }

  console.log(`[Research Agent] Outline completed. Topic: "${researchParsed.selectedTopic}"`);

  // ==========================================
  // AGENT 2: BLOG WRITER AGENT (Qwen 2.5 72B Free)
  // ==========================================
  console.log(`[Blog Writer Agent] Reading blogagentprompt.txt styling guidelines...`);
  const promptFilePath = path.join(process.cwd(), "blogagentprompt.txt");
  let systemInstructions = "";
  try {
    systemInstructions = await fs.readFile(promptFilePath, "utf-8");
  } catch (err) {
    console.warn("[Blog Writer Agent] blogagentprompt.txt not read, using standard rules.", err);
    systemInstructions = "Write a comprehensive, professional blog post matching the design system and SEO/GEO/AIO requirements.";
  }

  const writerPrompt = `
    ${systemInstructions}

    You are the Second Agent: The Blog Writer Agent.
    Your goal is to write a highly detailed, professional, human-written blog article in maximum depth based on the outline, keywords, and raw data provided by the Research Agent.

    Here is the outline and data from the Research Agent:
    - Selected Topic: ${researchParsed.selectedTopic}
    - Reasoning: ${researchParsed.reasoning}
    - Primary Keyword: ${researchParsed.primaryKeyword}
    - Cluster Keywords: ${researchParsed.clusterKeywords.join(", ")}
    - Markdown Outline:
    ${researchParsed.outline}

    ADDITIONAL MANDATORY REQUIREMENTS:
    - The article must be extremely detailed, reaching at least 3,000 words (minimum 2,500 words). Expand on all points, providing full step-by-step implementations, real code files/scripts, and database setup instructions where appropriate. Do not use placeholders or summaries.
    - Write a section specifically on: "How Domain Expansion can help in this topic area" or "Our growth strategies/results in this topic area".
    - The first element of the bodyHTML must be the GEO/AIO Hook: a prominent question header followed by a direct, concise 30-50 words answer paragraph.
    - Keep the keyword density of the Primary Target Keyword at ~2% and the related Cluster Keywords at ~2-3%.
    - Use headings (<h2> and <h3>), formatted bullet lists, bold text, code blocks (<pre><code>), tables with real data parameters, and an alert box (<div class="alert alert-important">).
    - Append a compiled "Frequently Asked Questions" section containing 5-10 detailed Q&A pairs (e.g. <h4> Questions and <p> Answers) about the blog topic.
    - Create a best-performing image generation prompt optimized for the "playgroundai/playground-v2.5" model to generate a cover image. The prompt should request a beautiful, stylized vector-like digital art or creative illustration (matching our sleek dark theme) and avoid AI text artifacts.

    Return your output strictly as a JSON object containing:
    {
      "title": string,
      "slug": string,
      "excerpt": string,
      "bodyHTML": string,
      "readTime": string,
      "schemaMarkup": string, // JSON string containing Article and FAQPage schema matching the FAQ section
      "imagePrompt": string
    }
  `;

  let writerParsed: BlogGenerationResult;
  let useFallbackWriter = !openRouterApiKey;

  if (!useFallbackWriter) {
    try {
      console.log(`[Blog Writer Agent] Writing blog using qwen/qwen-2.5-72b-instruct:free...`);
      const qwenResponse = await fetchOpenRouterBlog(writerPrompt, openRouterApiKey, "qwen/qwen-2.5-72b-instruct:free");
      let cleaned = qwenResponse.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "").trim();
      }
      writerParsed = JSON.parse(cleaned);
    } catch (err) {
      console.warn("[Blog Writer Agent] Qwen 72B failed or JSON invalid. Falling back to Gemini...", err);
      useFallbackWriter = true;
    }
  }

  if (useFallbackWriter && geminiApiKey) {
    console.log(`[Blog Writer Agent] Running fallback writing agent via Gemini...`);
    const fallbackText = await fetchGeminiWithGrounding(writerPrompt, geminiApiKey, false);
    let cleaned = fallbackText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "").trim();
    }
    writerParsed = JSON.parse(cleaned);
  }

  if (!writerParsed!) {
    throw new Error("Blog Writer Agent failed to produce valid article content payload.");
  }

  console.log(`[Blog Writer Agent] Article generation complete. Title: "${writerParsed.title}"`);

  // ==========================================
  // AGENT 3: FEATURED IMAGE CREATOR (Playground v2.5)
  // ==========================================
  console.log(`[Image Creator Agent] Generating featured cover image using playgroundai/playground-v2.5 model...`);
  
  let featuredImage = "";
  const cleanPrompt = encodeURIComponent(writerParsed.imagePrompt.trim().substring(0, 180));
  const randomSeed = Math.floor(Math.random() * 100000);
  const playgroundUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?model=playground-v2.5&width=1024&height=576&nologo=true&seed=${randomSeed}`;

  try {
    featuredImage = await downloadAndProcessFallback(playgroundUrl, writerParsed.slug);
  } catch (err) {
    console.warn("[Image Creator Agent] Playground v2.5 generation failed. Trying Gemini Imagen fallback...", err);
    if (geminiApiKey) {
      const buffer = await generateImageWithGemini(writerParsed.imagePrompt, geminiApiKey);
      if (buffer) {
        featuredImage = await saveImageResilient(buffer, writerParsed.slug);
      }
    }
  }

  // Failover default
  if (!featuredImage) {
    console.warn("[Image Creator Agent] Both Playground and Gemini failed. Using direct image link fallback...");
    featuredImage = playgroundUrl;
  }

  // ==========================================
  // AGENT 4: REVIEWER AGENT (Qwen 3 Coder Free via OpenRouter)
  // ==========================================
  console.log(`[Reviewer Agent] Reviewing formatting, CSS design systems alignment, and polishing using ${settings.blogReviewerModel || "qwen/qwen3-coder:free"}...`);

  const reviewerPrompt = `
    You are the Domain Expansion Reviewer Agent.
    Your task is to review, polish, clean, and verify the blog article details generated by the Writer Agent to ensure it meets our website design standards.
    
    CRITICAL CHECKPOINTS:
    1. The title must be compelling and SEO-friendly.
    2. The excerpt must be under 180 characters.
    3. The bodyHTML must contain clean, correct semantic HTML5 structure (like <h2>, <h3>, <p>, <ul>, <li>, <table>, <pre><code>). Remove any double spaces, empty paragraphs, or broken markdown residues.
    4. Ensure the AIO/GEO question-first start paragraph is at the very beginning of the bodyHTML.
    5. Ensure the FAQ section with 5-10 detailed Q&As is correctly placed at the end of the bodyHTML.
    
    If everything looks great, return the original text. Otherwise, make minor edits to polish the formatting. Do not change the core facts, code segments, or overall narrative.
    
    Input Blog Details to Review:
    - Title: ${writerParsed.title}
    - Excerpt: ${writerParsed.excerpt}
    - BodyHTML: ${writerParsed.bodyHTML}

    Return your output strictly as a JSON object containing:
    {
      "title": string,
      "excerpt": string,
      "bodyHTML": string
    }
  `;

  let reviewerParsed = {
    title: writerParsed.title,
    excerpt: writerParsed.excerpt,
    bodyHTML: writerParsed.bodyHTML,
  };

  let useReviewerFallback = !openRouterApiKey;
  if (!useReviewerFallback) {
    try {
      const reviewerResponse = await fetchOpenRouterBlog(
        reviewerPrompt,
        openRouterApiKey,
        settings.blogReviewerModel || "qwen/qwen3-coder:free"
      );
      let cleaned = reviewerResponse.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "").trim();
      }
      reviewerParsed = JSON.parse(cleaned);
    } catch (err) {
      console.warn("[Reviewer Agent] Qwen Coder failed or JSON invalid, using fallback parsing...", err);
      useReviewerFallback = true;
    }
  }

  if (useReviewerFallback && geminiApiKey) {
    try {
      console.log("[Reviewer Agent] Running fallback reviewer via Gemini...");
      const fallbackText = await fetchGeminiWithGrounding(reviewerPrompt, geminiApiKey, false);
      let cleaned = fallbackText.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "").trim();
      }
      reviewerParsed = JSON.parse(cleaned);
    } catch (err) {
      console.warn("[Reviewer Agent] Gemini fallback failed, utilizing direct writer output.", err);
    }
  }

  const finalBodyHTML = reviewerParsed.bodyHTML || writerParsed.bodyHTML;
  const finalTitle = reviewerParsed.title || writerParsed.title;
  const finalExcerpt = reviewerParsed.excerpt || writerParsed.excerpt;

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const post = await prisma.blogPost.upsert({
    where: { slug: writerParsed.slug },
    update: {
      title: finalTitle,
      excerpt: finalExcerpt,
      category: pillar,
      categoryLabel,
      date: formattedDate,
      readTime: writerParsed.readTime,
      featuredImage,
      bodyHTML: finalBodyHTML,
      schemaMarkup: writerParsed.schemaMarkup,
    },
    create: {
      slug: writerParsed.slug,
      title: finalTitle,
      excerpt: finalExcerpt,
      category: pillar,
      categoryLabel,
      date: formattedDate,
      readTime: writerParsed.readTime,
      featuredImage,
      bodyHTML: finalBodyHTML,
      schemaMarkup: writerParsed.schemaMarkup,
    },
  });

  // Dynamic Sitemap registration
  await registerSitemapUrl({
    url: `/blog/${post.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  });

  // Log success event
  await prisma.blogAgentLog.create({
    data: {
      piller: pillar,
      status: "SUCCESS",
      topicSelected: finalTitle,
    },
  });

  console.log(`[Reviewer Agent] Successfully published article: "${post.title}" at /blog/${post.slug}`);
  return post;
  } catch (err: any) {
    console.error(`[Blog Agent] Generation failed for pillar ${pillar}:`, err);
    await prisma.blogAgentLog.create({
      data: {
        piller: pillar,
        status: "FAILED",
        errorMessage: err.message || String(err),
      },
    });
    throw err;
  }
}

/**
 * Main routine running all 4 pillars in sequence (daily agent run)
 */
export async function runDailyBlogAgent() {
  const settings = await prisma.emailSettings.findFirst();
  if (!settings) {
    throw new Error("Database EmailSettings must be initialized first to retrieve API keys.");
  }

  const pillars = ["marketing", "development", "design", "ai"];
  const results = [];

  for (const pillar of pillars) {
    try {
      console.log(`[Blog Agent] Initiating generation loop for: ${pillar}`);
      const post = await generatePillarBlog(pillar, settings);
      results.push({ pillar, status: "SUCCESS", slug: post.slug });
    } catch (err: any) {
      console.error(`[Blog Agent] Failed generation loop for: ${pillar}`, err);
      results.push({ pillar, status: "FAILED", error: err.message || String(err) });
    }
  }

  return results;
}
