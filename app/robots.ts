import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allowedAIBots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-Web",
    "Google-Extended",
    "PerplexityBot",
    "YouBot",
    "Applebot-Extended",
    "facebookexternalhit",
    "Meta-ExternalAgent",
    "cohere-ai",
    "Amazonbot",
  ];

  const disallowedTestBots = [
    "TestBot",
    "discobot",
    "DotBot",
    "HTTrack",
    "WebCopier",
    "Offline Explorer",
    "cyberalert",
    "linkdexbot",
    "Sogou web spider",
    "Screaming Frog SEO Spider",
  ];

  const aiRules = allowedAIBots.map((bot) => ({
    userAgent: bot,
    allow: "/",
    disallow: ["/admin", "/api", "/studio", "/_next/*", "/__next*"],
  }));

  const testBotRules = disallowedTestBots.map((bot) => ({
    userAgent: bot,
    disallow: "/",
  }));

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/studio", "/_next/*", "/__next*"],
      },
      ...aiRules,
      ...testBotRules,
    ],
    sitemap: "https://domainexpansion.in/sitemap.xml",
  };
}
