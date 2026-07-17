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

function cleanAndParseJSON(jsonStr: string): any {
  let cleaned = jsonStr.trim();
  
  // Extract JSON block if surrounded by conversational text
  const startIdx = cleaned.indexOf("{");
  const endIdx = cleaned.lastIndexOf("}");
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err: any) {
    console.warn("[JSON Clean Parser] Standard JSON.parse failed. Running state machine repair...", err);
    try {
      let insideString = false;
      let escaped = false;
      let repaired = '';
      let lastStructuralChar = '';
      let arrayDepth = 0;
      
      for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i];
        
        if (insideString) {
          if (escaped) {
            // Valid JSON escape check
            if (char === '"' || char === '\\' || char === '/' || char === 'b' || char === 'f' || char === 'n' || char === 'r' || char === 't') {
              repaired += '\\' + char;
            } else if (char === 'u') {
              // Verify u is followed by exactly 4 hex digits (e.g. \u0020)
              const next4 = cleaned.substring(i + 1, i + 5);
              if (/^[0-9a-fA-F]{4}$/.test(next4)) {
                repaired += '\\u';
              } else {
                repaired += '\\\\u';
              }
            } else {
              repaired += '\\\\' + char;
            }
            escaped = false;
          } else if (char === '\\') {
            escaped = true;
          } else if (char === '"') {
            // Peek next non-whitespace char
            let nextChar = '';
            for (let j = i + 1; j < cleaned.length; j++) {
              if (!/\s/.test(cleaned[j])) {
                nextChar = cleaned[j];
                break;
              }
            }
            
            // Determine if key or value quote
            let isKey = false;
            if (lastStructuralChar === '{') {
              isKey = true;
            } else if (lastStructuralChar === ',') {
              isKey = (arrayDepth === 0);
            }
            
            let isClosingQuote = false;
            if (isKey) {
              isClosingQuote = (nextChar === ':');
            } else {
              isClosingQuote = (nextChar === ',' || nextChar === '}' || nextChar === ']' || nextChar === '');
            }
            
            if (isClosingQuote) {
              insideString = false;
              repaired += '"';
            } else {
              repaired += '\\"';
            }
          } else if (char === '\n') {
            repaired += '\\n';
          } else if (char === '\r') {
            repaired += '\\r';
          } else if (char === '\t') {
            repaired += '\\t';
          } else {
            repaired += char;
          }
        } else {
          // Outside string
          if (char === '"') {
            insideString = true;
            escaped = false;
            repaired += '"';
          } else {
            repaired += char;
            if (char === '{' || char === '}' || char === ',' || char === ':' || char === '[' || char === ']') {
              lastStructuralChar = char;
              if (char === '[') arrayDepth++;
              if (char === ']') arrayDepth--;
            }
          }
        }
      }
      
      // Auto-close string if ended abruptly
      if (insideString) {
        repaired += '"';
      }
      
      // Auto-close braces/brackets
      const openBraces = (repaired.match(/\{/g) || []).length;
      const closeBraces = (repaired.match(/\}/g) || []).length;
      if (openBraces > closeBraces) {
        repaired += "}".repeat(openBraces - closeBraces);
      }
      
      return JSON.parse(repaired);
    } catch (finalErr: any) {
      console.error("[JSON Clean Parser] State machine repair failed:", finalErr);
      throw new Error(`Invalid JSON format: ${err.message || String(err)}`);
    }
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
  if (!openRouterApiKey) {
    const err = "Failed: OpenRouter API Key is missing.";
    await prisma.blogAgentLog.create({
      data: { piller: pillar, status: "FAILED", errorMessage: err },
    });
    throw new Error(err);
  }

  try {
    console.log(`[Blog Agent Workflow] Starting multi-agent pipeline for pillar: ${pillar}`);
    const researchParsed = await runResearchStep(pillar, settings);
    const writerParsed = await runWriterStep(pillar, researchParsed, settings);
    const featuredImage = await runImageStep(writerParsed.imagePrompt, writerParsed.slug, settings);
    const post = await runReviewerStep(pillar, writerParsed, featuredImage, settings);
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

export async function runResearchStep(pillar: string, settings: any): Promise<ResearchOutlineResult> {
  const openRouterApiKey = settings.openRouterApiKey;
  if (!openRouterApiKey) {
    throw new Error("Failed: OpenRouter API Key is missing.");
  }

  let pillarName = "";
  switch (pillar) {
    case "marketing":
      pillarName = "Marketing Expansion (SEO, GEO, AIO, Paid Ads, Social Media growth, performance marketing, content strategy)";
      break;
    case "development":
      pillarName = "Development Expansion (Next.js, high-speed interfaces, APIs, SaaS architectures, TailwindCSS, full-stack, headless CMS, Postgres)";
      break;
    case "design":
      pillarName = "Design Expansion (Brand identity, premium UI/UX, Figma design systems, visual assets, custom website design)";
      break;
    case "ai":
      pillarName = "AI Expansion (LLM integration, n8n/Make automation workflows, RAG, custom agents, intelligent automation)";
      break;
    default:
      pillarName = "Digital Strategy & Technology";
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
      researchParsed = cleanAndParseJSON(nemoResponse);
    } catch (err) {
      console.warn("[Research Agent] Mistral Nemo OpenRouter failed or JSON invalid. Falling back to Gemini...", err);
      useFallbackModel = true;
    }
  }

  if (useFallbackModel) {
    console.log(`[Research Agent] Running fallback outline generation via OpenRouter (openrouter/free)...`);
    const fallbackText = await fetchOpenRouterBlog(researchPrompt, openRouterApiKey, "openrouter/free", true);
    researchParsed = cleanAndParseJSON(fallbackText);
  }

  // Double fallback guard if parsing somehow failed completely
  if (!researchParsed!) {
    throw new Error("Research Agent failed to produce valid topic outline payload.");
  }

  console.log(`[Research Agent Step] Outline completed. Topic: "${researchParsed.selectedTopic}"`);
  return researchParsed;
  } catch (err: any) {
    console.error(`[Research Agent Step] Outline generation failed:`, err);
    throw err;
  }
}

export async function runWriterStep(
  pillar: string,
  researchParsed: ResearchOutlineResult,
  settings: any
): Promise<BlogGenerationResult> {
  const openRouterApiKey = settings.openRouterApiKey;
  if (!openRouterApiKey) {
    throw new Error("Failed: OpenRouter API Key is missing.");
  }

  console.log(`[Blog Writer Agent Step] Reading blogagentprompt.txt styling guidelines...`);
  const promptFilePath = path.join(process.cwd(), "blogagentprompt.txt");
  let systemInstructions = "";
  try {
    systemInstructions = await fs.readFile(promptFilePath, "utf-8");
  } catch (err) {
    console.warn("[Blog Writer Agent Step] blogagentprompt.txt not read, using standard rules.", err);
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
      console.log(`[Blog Writer Agent Step] Writing blog using ${settings.blogWriterModel || "qwen/qwen-2.5-72b-instruct:free"}...`);
      const qwenResponse = await fetchOpenRouterBlog(writerPrompt, openRouterApiKey, settings.blogWriterModel || "qwen/qwen-2.5-72b-instruct:free");
      writerParsed = cleanAndParseJSON(qwenResponse);
    } catch (err) {
      console.warn("[Blog Writer Agent Step] Primary writer failed. Falling back to free router...", err);
      useFallbackWriter = true;
    }
  }

  if (useFallbackWriter) {
    console.log(`[Blog Writer Agent Step] Running fallback writing agent via OpenRouter (openrouter/free)...`);
    const fallbackText = await fetchOpenRouterBlog(writerPrompt, openRouterApiKey, "openrouter/free", true);
    writerParsed = cleanAndParseJSON(fallbackText);
  }

  if (!writerParsed!) {
    throw new Error("Blog Writer Agent failed to produce valid article content payload.");
  }

  console.log(`[Blog Writer Agent Step] Article generation complete. Title: "${writerParsed.title}"`);
  return writerParsed;
}

export async function runImageStep(imagePrompt: string, slug: string, settings: any): Promise<string> {
  const apiKey = settings?.openRouterApiKey;
  const model = settings?.blogImageModel || "google/gemini-2.5-flash-image";

  if (apiKey) {
    try {
      console.log(`[Image Creator Agent Step] Generating cover image via OpenRouter using model: ${model}...`);
      const response = await fetch("https://openrouter.ai/api/v1/images", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://domainexpansion.in",
          "X-Title": "Domain Expansion Blog System",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          prompt: imagePrompt.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const b64Json = data?.data?.[0]?.b64_json;
        if (b64Json) {
          const buffer = Buffer.from(b64Json, "base64");
          return await saveImageResilient(buffer, slug);
        }
      } else {
        const errText = await response.text();
        console.warn(`[Image Creator Agent Step] OpenRouter Image API failed with status ${response.status}: ${errText}`);
      }
    } catch (err) {
      console.warn("[Image Creator Agent Step] Failed generating image via OpenRouter, falling back to Pollinations...", err);
    }
  }

  // Fallback to Pollinations AI
  console.log(`[Image Creator Agent Step] Generating cover image via Pollinations fallback...`);
  let featuredImage = "";
  const cleanPrompt = encodeURIComponent(imagePrompt.trim().substring(0, 180));
  const randomSeed = Math.floor(Math.random() * 100000);
  const playgroundUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?model=playground-v2.5&width=1024&height=576&nologo=true&seed=${randomSeed}`;

  try {
    featuredImage = await downloadAndProcessFallback(playgroundUrl, slug);
  } catch (err) {
    console.warn("[Image Creator Agent Step] Playground fallback failed. Trying Flux...", err);
    try {
      const fluxUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?model=flux&width=1024&height=576&nologo=true&seed=${randomSeed}`;
      featuredImage = await downloadAndProcessFallback(fluxUrl, slug);
    } catch (fluxErr) {
      console.warn("[Image Creator Agent Step] Flux fallback failed as well, using direct link...", fluxErr);
      featuredImage = playgroundUrl;
    }
  }

  if (!featuredImage) {
    featuredImage = playgroundUrl;
  }
  return featuredImage;
}

export async function runReviewerStep(
  pillar: string,
  writerParsed: BlogGenerationResult,
  featuredImage: string,
  settings: any
): Promise<any> {
  const openRouterApiKey = settings.openRouterApiKey;
  if (!openRouterApiKey) {
    throw new Error("Failed: OpenRouter API Key is missing.");
  }

  let categoryLabel = "";
  switch (pillar) {
    case "marketing":
      categoryLabel = "SEO & Marketing";
      break;
    case "development":
      categoryLabel = "Development";
      break;
    case "design":
      categoryLabel = "Design Systems";
      break;
    case "ai":
      categoryLabel = "AI & Automation";
      break;
    default:
      categoryLabel = "Agency News";
  }

  console.log(`[Reviewer Agent Step] Reading blogagentprompt.txt styling guidelines...`);
  const promptFilePath = path.join(process.cwd(), "blogagentprompt.txt");
  let systemInstructions = "";
  try {
    systemInstructions = await fs.readFile(promptFilePath, "utf-8");
  } catch (err) {
    systemInstructions = "Write a comprehensive, professional blog post matching the design system and SEO/GEO/AIO requirements.";
  }

  let reviewerParsed = {
    isApproved: true,
    errors: [] as string[],
    title: writerParsed.title,
    excerpt: writerParsed.excerpt,
    bodyHTML: writerParsed.bodyHTML,
    schemaMarkup: writerParsed.schemaMarkup,
  };

  const maxAttempts = 3;
  let attempt = 0;
  let approved = false;

  let currentWriterParsed = { ...writerParsed };

  while (attempt < maxAttempts) {
    attempt++;
    console.log(`[Reviewer Agent Step] Reviewing draft (Attempt ${attempt}/${maxAttempts})...`);

    const reviewerPrompt = `
      You are an Automated Chief Editorial Bot and CMS Publisher for Domain Expansion. Your job is to review a provided blog draft against our strict rules and output a verified, publication-ready Markdown layout.

      Your Evaluation Task:
      1. Strip out any sentences that violate the Banned AI Words protocol (never use: delve, testament, tapestry, beacon, furthermore, moreover, robust, utilize, leverage, streamline, optimize, revolutionizing, game-changer, dynamic, paramount, transformative, look no further, in today's fast-paced digital world, it is crucial to note, unlock your potential, puzzle, landscape, underscore, demystify, key takeaways, in today's digital landscape).
      2. Ensure no paragraph exceeds 3 sentences. Ensure clear '##' and '###' long-tail markdown headers are correctly distributed.
      3. Verify that the AIO/GEO Snippet Block is present at the absolute top (prominent question heading and direct 30-50 words answer paragraph).
      4. Verify that a valid JSON-LD Schema string block is placed at the absolute bottom (or is provided).

      If all checkpoints are ok, set "isApproved" to true and return the verified title, excerpt, bodyHTML (which MUST be structured HTML, with EVERY paragraph properly wrapped in <p>...</p> tags, headings properly formatted as <h2>...</h2> or <h3>...</h3>, and lists formatted as <ul>/<li> elements. DO NOT output a single long paragraph or raw text block without tags), and schemaMarkup.
      If there are violations, set "isApproved" to false and list all specific violations in the "errors" array so they can be logged.

      Input Blog Details to Review:
      - Title: ${currentWriterParsed.title}
      - Excerpt: ${currentWriterParsed.excerpt}
      - BodyHTML: ${currentWriterParsed.bodyHTML}
      - SchemaMarkup: ${currentWriterParsed.schemaMarkup}

      Return your output strictly as a JSON object containing:
      {
        "isApproved": boolean,
        "errors": string[],
        "title": string,
        "excerpt": string,
        "bodyHTML": string,
        "schemaMarkup": string
      }
    `;

    let useReviewerFallback = !openRouterApiKey;
    if (!useReviewerFallback) {
      try {
        const reviewerResponse = await fetchOpenRouterBlog(
          reviewerPrompt,
          openRouterApiKey,
          settings.blogReviewerModel || "qwen/qwen3-coder:free"
        );
        reviewerParsed = cleanAndParseJSON(reviewerResponse);
      } catch (err) {
        console.warn("[Reviewer Agent Step] Qwen Coder failed. Falling back to free router...", err);
        useReviewerFallback = true;
      }
    }

    if (useReviewerFallback) {
      try {
        console.log("[Reviewer Agent Step] Running fallback reviewer via OpenRouter (openrouter/free)...");
        const fallbackText = await fetchOpenRouterBlog(reviewerPrompt, openRouterApiKey, "openrouter/free", true);
        reviewerParsed = cleanAndParseJSON(fallbackText);
      } catch (err) {
        console.warn("[Reviewer Agent Step] OpenRouter fallback failed, utilizing direct writer output.", err);
      }
    }

    if (reviewerParsed.isApproved) {
      approved = true;
      console.log(`[Reviewer Agent Step] Draft approved on attempt ${attempt}!`);
      break;
    }

    console.warn(`[Reviewer Agent Step] Draft REJECTED on attempt ${attempt}. Violations:\n${(reviewerParsed.errors || []).map(e => `- ${e}`).join("\n")}`);

    if (attempt < maxAttempts) {
      console.log(`[Blog Writer Agent Step] Reworking content to address reviewer feedback (Attempt ${attempt + 1}/${maxAttempts})...`);
      const revisionPrompt = `
        ${systemInstructions}

        You are the Second Agent: The Blog Writer Agent.
        Your previous draft was REJECTED by the Chief Editorial Bot because of formatting or styling violations.
        Please rewrite/rework the article to fix all identified errors. Ensure no paragraph exceeds 3 sentences, the Question-First hook is at the top, the Schema block is at the bottom, and no banned words are used.

        Identified Errors to Fix:
        ${(reviewerParsed.errors || ["Failed design/editorial criteria validation checks."]).map(e => `- ${e}`).join("\n")}

        Previous Rejected Draft:
        - Title: ${currentWriterParsed.title}
        - Excerpt: ${currentWriterParsed.excerpt}
        - BodyHTML: ${currentWriterParsed.bodyHTML}
        - SchemaMarkup: ${currentWriterParsed.schemaMarkup}

        Return your output strictly as a JSON object containing:
        {
          "title": string,
          "slug": string,
          "excerpt": string,
          "bodyHTML": string,
          "readTime": string,
          "schemaMarkup": string,
          "imagePrompt": string
        }
      `;

      let revisedResponse = "";
      try {
        revisedResponse = await fetchOpenRouterBlog(
          revisionPrompt,
          openRouterApiKey,
          settings.blogWriterModel || "qwen/qwen-2.5-72b-instruct:free"
        );
      } catch (err) {
        console.warn("[Blog Writer Agent Step] Rework failed via Qwen, trying fallback...", err);
        try {
          revisedResponse = await fetchOpenRouterBlog(
            revisionPrompt,
            openRouterApiKey,
            "openrouter/free",
            true
          );
        } catch (fbErr) {
          console.error("[Blog Writer Agent Step] Fallback rework failed too:", fbErr);
        }
      }
      if (revisedResponse) {
        currentWriterParsed = cleanAndParseJSON(revisedResponse);
      }
    }
  }

  if (!approved) {
    const errorMsg = `Chief Editorial Bot Rejected Publication after ${maxAttempts} attempts:\n` + (reviewerParsed.errors || ["Failed design/editorial criteria validation checks."]).map((e: string) => `- ${e}`).join("\n");
    throw new Error(errorMsg);
  }

  const finalBodyHTML = formatBlogBodyHTML(reviewerParsed.bodyHTML || currentWriterParsed.bodyHTML);
  const finalTitle = reviewerParsed.title || currentWriterParsed.title;
  const finalExcerpt = reviewerParsed.excerpt || currentWriterParsed.excerpt;
  const finalSchema = reviewerParsed.schemaMarkup || currentWriterParsed.schemaMarkup;

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const post = await prisma.blogPost.upsert({
    where: { slug: currentWriterParsed.slug },
    update: {
      title: finalTitle,
      excerpt: finalExcerpt,
      category: pillar,
      categoryLabel,
      date: formattedDate,
      readTime: currentWriterParsed.readTime,
      featuredImage,
      bodyHTML: finalBodyHTML,
      schemaMarkup: finalSchema,
    },
    create: {
      slug: currentWriterParsed.slug,
      title: finalTitle,
      excerpt: finalExcerpt,
      category: pillar,
      categoryLabel,
      date: formattedDate,
      readTime: currentWriterParsed.readTime,
      featuredImage,
      bodyHTML: finalBodyHTML,
      schemaMarkup: finalSchema,
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

  console.log(`[Reviewer Agent Step] Successfully published article: "${post.title}" at /blog/${post.slug}`);
  return post;
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

/**
 * Ensures the generated blog body HTML is correctly formatted as per the design system.
 * Prevents plain text blocks, missing paragraph tags, raw markdown headings, or unstyled tables.
 */
export function formatBlogBodyHTML(html: string): string {
  if (!html) return "";
  let formatted = html.trim();

  // If there are no HTML tags at all, or if it is purely plain text/markdown
  const hasHtmlParagraphOrHeading = /<p>|<h[1-6]>|<ul>|<ol>|<div>/i.test(formatted);
  if (!hasHtmlParagraphOrHeading) {
    console.log("[HTML Formatter] Plain text or Markdown detected. Formatting to design system HTML...");
    
    // 1. Convert markdown headers
    formatted = formatted
      .replace(/^####\s+(.+)$/gm, "<h4>$1</h4>")
      .replace(/^###\s+(.+)$/gm, "<h3>$1</h3>")
      .replace(/^##\s+(.+)$/gm, "<h2>$1</h2>")
      .replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

    // 2. Convert markdown bold/italics
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // 3. Convert markdown lists
    formatted = formatted.replace(/^\s*[-*+]\s+(.+)$/gm, "<li>$1</li>");
    // Group adjacent <li> tags into <ul>
    formatted = formatted.replace(/(<li>.*<\/li>)+/g, "<ul>$&</ul>");

    // 4. Split by double-newlines into paragraphs
    const blocks = formatted.split(/\n\s*\n/);
    formatted = blocks
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        // If it starts with h1-6, ul, ol, li, pre, div, blockquote, table, don't wrap in <p>
        if (/^<(h[1-6]|ul|ol|li|pre|div|blockquote|table)/i.test(trimmed)) {
          return trimmed;
        }
        return `<p>${trimmed}</p>`;
      })
      .filter(Boolean)
      .join("\n");
  } else {
    // Already has HTML, but let's check for any stray markdown headers like "## Heading" inside and fix them
    formatted = formatted
      .replace(/^###\s+(.+)$/gm, "<h3>$1</h3>")
      .replace(/^##\s+(.+)$/gm, "<h2>$1</h2>")
      .replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");
      
    // Sometimes the writer agent puts newlines inside text blocks that should be separate paragraphs
    // but forgot to close and reopen <p> tags. We can replace double newlines inside <p> with </p><p>
    formatted = formatted.replace(/<p>([\s\S]*?)<\/p>/gi, (match, content) => {
      const parts = content.split(/\n\s*\n/);
      if (parts.length > 1) {
        return parts.map((p: string) => `<p>${p.trim()}</p>`).join("\n");
      }
      return match;
    });
  }

  // 5. Apply design system specific styles to raw HTML components
  formatted = formatted.replace(/<p>\s*<\/p>/g, "");
  
  // Style tables for responsive design system
  formatted = formatted.replace(/<table>/g, '<table class="w-full border-collapse border border-[#E5E5E5] my-6">');
  formatted = formatted.replace(/<th>/g, '<th class="border border-[#E5E5E5] p-3 bg-[#F8F8F8] font-bold text-xs text-left">');
  formatted = formatted.replace(/<td>/g, '<td class="border border-[#E5E5E5] p-3 text-xs">');

  // Style blockquotes
  formatted = formatted.replace(/<blockquote>/g, '<blockquote class="border-left-brand border-l-4 border-[#FF6200] bg-[#F8F8F8] p-4 my-6 italic text-[#5A5A6A]">');

  // Ensure alert tags have the design system class
  formatted = formatted.replace(/<div class="alert">/g, '<div class="alert alert-important">');

  return formatted;
}

