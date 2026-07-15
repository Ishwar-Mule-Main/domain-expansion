import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
  default-src 'self';
  script-src 'self' ${isDev ? "'unsafe-eval'" : ""} 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' data: https://fonts.gstatic.com;
  img-src 'self' data: blob: https://res.cloudinary.com https://cdn.sanity.io;
  connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net;
  frame-src 'self' https://calendly.com;
  object-src 'none';
  base-uri 'self';
`.replace(/\s{2,}/g, ' ').trim();


const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/blog/web3-infrastructure-scaling",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/projects/loom-video-messaging",
        destination: "/portfolio/polymint-prca",
        permanent: true,
      },
      {
        source: "/projects/agristox-platform",
        destination: "/portfolio/polymint-prca",
        permanent: true,
      },
      {
        source: "/blog/nextjs-performance-optimization",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/projects/organo-sustainable-living",
        destination: "/portfolio/polymint-prca",
        permanent: true,
      },
      {
        source: "/blog/geo-vs-seo-vs-aio",
        destination: "/blog/seo-geo-marketing-ai-blueprint",
        permanent: true,
      },
      {
        source: "/projects/datahat-analytics",
        destination: "/portfolio/data-hat-ai",
        permanent: true,
      },
      {
        source: "/blog/email-deliverability-deep-dive",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/ai-automation-cut-cac",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-json/:path*",
        has: [
          {
            type: "host",
            value: "data-hat.domainexpansion.in",
          },
        ],
        destination: "https://domainexpansion.in",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

