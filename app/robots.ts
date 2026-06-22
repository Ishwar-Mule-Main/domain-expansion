import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/studio"],
    },
    sitemap: "https://domainexpansion.in/sitemap.xml",
  };
}
