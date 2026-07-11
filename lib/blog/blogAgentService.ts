import { prisma } from "../db/prisma";
import { registerSitemapUrl } from "../sitemap/sitemapAgent";

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
 * Call OpenRouter API
 */
async function fetchOpenRouterBlog(prompt: string, apiKey: string, model: string): Promise<string> {
  const endpoint = "https://openrouter.ai/api/v1/chat/completions";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://domainexpansion.in",
      "X-Title": "Domain Expansion Blog System",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model || "google/gemini-2.0-flash",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenRouter API");
  }
  return content;
}

/**
 * Generate a daily blog post for a specific pillar
 */
export async function generatePillarBlog(pillar: string, settings: any) {
  const isGoogle = settings.preferredProvider === "GOOGLE";
  const apiKey = isGoogle ? settings.geminiApiKey : settings.openRouterApiKey;
  const model = isGoogle ? "gemini-2.0-flash" : settings.openRouterModel;

  if (!apiKey) {
    const err = `Failed: ${settings.preferredProvider} API Key missing.`;
    await prisma.blogAgentLog.create({
      data: { piller: pillar, status: "FAILED", errorMessage: err },
    });
    throw new Error(err);
  }

  let pillarName = "";
  let categoryLabel = "";
  switch (pillar) {
    case "marketing":
      pillarName = "Marketing Expansion (SEO, GEO, AIO, Paid Ads, Social Media growth)";
      categoryLabel = "SEO & Marketing";
      break;
    case "development":
      pillarName = "Development Expansion (Next.js, high-speed interfaces, APIs, SaaS architectures)";
      categoryLabel = "Development";
      break;
    case "design":
      pillarName = "Design Expansion (Brand identity, premium UI/UX, visual assets)";
      categoryLabel = "Design Systems";
      break;
    case "ai":
      pillarName = "AI Expansion (LLM integration, n8n/Make automation workflows, RAG, custom agents)";
      categoryLabel = "AI & Automation";
      break;
    default:
      pillarName = "Digital Strategy & Technology";
      categoryLabel = "Agency News";
  }

  const prompt = `
    You are an elite, authoritative tech journalist and lead strategist at Domain Expansion.
    Your goal is to write a highly detailed, professional, human-written blog article about the latest news, updates, or trends in: "${pillarName}".
    
    IMPORTANT: Research the absolute latest industry updates, news, or breakthroughs as of July 2026. Select the single best news item or trend that will drive the highest website traffic and cause search engines and LLM engines (ChatGPT, Gemini, Perplexity) to recommend our brand content.
    
    Format requirements:
    1. Title: Compelling, SEO/GEO-friendly headline.
    2. Slug: URL-safe hyphenated slug matching the title (e.g. "latest-nextjs-rendering-features").
    3. Excerpt: A high-density summary (under 180 characters) of the post.
    4. BodyHTML: Complete, long-form post body in HTML format.
       - STRICT TONE RULE: Avoid standard AI clichés (e.g. "in today's fast-paced digital world", "delve", "testament", "pave the way", "demystify", "vital", "crucial", "beacon").
       - MUST read like a highly opinionated, seasoned human practitioner wrote it based on first-hand experiences (EEAT Framework).
       - Use headings (<h2> and <h3>), formatted bullet lists, bold text, code blocks (<pre><code>), tables with real data parameters, and an alert box (<div class="alert alert-important">) for essential guidance.
    5. ReadTime: Estimated read time (e.g. "8 min read").
    6. SchemaMarkup: Stringified JSON-LD schema object mapping author (Ishwar Mule), publisher (Domain Expansion), and dynamic TechArticle/FAQ details.
    7. ImagePrompt: A highly descriptive prompt for Pollinations AI to generate a horizontal, beautiful tech-oriented, sleek dark-themed visual matching the article.

    Return your output strictly as a JSON object containing:
    {
      "title": string,
      "slug": string,
      "excerpt": string,
      "bodyHTML": string,
      "readTime": string,
      "schemaMarkup": string, // JSON string
      "imagePrompt": string
    }
  `;

  try {
    let resultText = "";
    if (isGoogle) {
      // Enable Google Search grounding for real-time news retrieval
      resultText = await fetchGeminiWithGrounding(prompt, apiKey, true);
    } else {
      resultText = await fetchOpenRouterBlog(prompt, apiKey, model);
    }

    let parsed: BlogGenerationResult;
    try {
      let cleaned = resultText.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "").trim();
      }
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.warn("JSON parsing of generated blog failed, trying raw match:", resultText);
      throw new Error(`Failed to parse AI output as JSON: ${resultText.substring(0, 100)}...`);
    }

    // Generate Pollinations AI image link using the generated imagePrompt
    const cleanPrompt = encodeURIComponent(parsed.imagePrompt.trim().substring(0, 150));
    const randomSeed = Math.floor(Math.random() * 100000);
    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=576&nologo=true&seed=${randomSeed}`;

    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Upsert the Blog Post into the database
    const post = await prisma.blogPost.upsert({
      where: { slug: parsed.slug },
      update: {
        title: parsed.title,
        excerpt: parsed.excerpt,
        category: pillar,
        categoryLabel,
        date: formattedDate,
        readTime: parsed.readTime,
        featuredImage: imageUrl,
        bodyHTML: parsed.bodyHTML,
        schemaMarkup: parsed.schemaMarkup,
      },
      create: {
        slug: parsed.slug,
        title: parsed.title,
        excerpt: parsed.excerpt,
        category: pillar,
        categoryLabel,
        date: formattedDate,
        readTime: parsed.readTime,
        featuredImage: imageUrl,
        bodyHTML: parsed.bodyHTML,
        schemaMarkup: parsed.schemaMarkup,
      },
    });

    // Trigger sitemap agent indexing
    await registerSitemapUrl({
      url: `/blog/${post.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });

    // Log success
    await prisma.blogAgentLog.create({
      data: {
        piller: pillar,
        status: "SUCCESS",
        topicSelected: parsed.title,
      },
    });

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
