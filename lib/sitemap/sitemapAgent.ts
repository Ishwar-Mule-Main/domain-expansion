import { prisma } from "../db/prisma";

export interface RegisterUrlParams {
  url: string;
  changeFrequency?: string;
  priority?: number;
}

/**
 * Sitemap Agent: Automatically registers or updates dynamic website URLs in sitemap database index.
 */
export async function registerSitemapUrl({
  url,
  changeFrequency = "weekly",
  priority = 0.6,
}: RegisterUrlParams) {
  try {
    const formattedUrl = url.startsWith("http") ? url : `https://domainexpansion.in${url}`;

    // Upsert the URL into the sitemap database index
    const record = await prisma.sitemapUrl.upsert({
      where: { url: formattedUrl },
      update: {
        lastModified: new Date(),
        changeFrequency,
        priority,
      },
      create: {
        url: formattedUrl,
        changeFrequency,
        priority,
      },
    });

    console.log(`[Sitemap Agent] Successfully indexed URL: ${formattedUrl}`);
    return { success: true, record };
  } catch (err: any) {
    console.error(`[Sitemap Agent] Failed to index URL ${url}:`, err);
    return { success: false, error: err.message || String(err) };
  }
}
