import { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";
import { blogPosts } from "@/lib/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://domainexpansion.in";

  // Base static pages
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/services",
    "/portfolio",
    "/case-studies",
    "/blog",
    "/techguild",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Service pillars
  const serviceSlugs = [
    "marketing-expansion",
    "development-expansion",
    "design-expansion",
    "ai-expansion",
  ];
  const servicePages = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Portfolio items
  const portfolioPages = projects.map((p) => ({
    url: `${baseUrl}/portfolio/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Case studies
  const caseStudyPages = projects.map((p) => ({
    url: `${baseUrl}/case-studies/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog posts
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...portfolioPages,
    ...caseStudyPages,
    ...blogPages,
  ];
}
