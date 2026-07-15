import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import Preloader from "@/components/ui/Preloader";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Marketing & Web Development Agency in India | Domain Expansion",
  description: "Domain Expansion is a remote, results-driven digital agency delivering Marketing, Development, Design, and AI services. 10M+ touchpoints, 2,700+ leads generated.",
  verification: {
    google: "oXe1HQS0dxzvRU6wkQlQx1uJoV28v00gdFVNEZBcnkc",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdminPage = pathname.startsWith("/admin") || pathname.startsWith("/studio");

  // Normalize canonical URL (strip trailing slashes except for root /)
  let canonicalPath = pathname;
  if (canonicalPath.endsWith("/") && canonicalPath !== "/") {
    canonicalPath = canonicalPath.slice(0, -1);
  }
  const canonicalUrl = `https://domainexpansion.in${canonicalPath}`;

  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="canonical" href={canonicalUrl} />
      </head>
      <body className="min-h-full flex flex-col bg-[#0D0D0D] text-[#F3F4F6]">
        <Preloader />
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
        <SmoothScroll>
          <ScrollProgress />
          <Cursor />
          {!isAdminPage && <Navbar />}
          <main className={`flex-grow ${isAdminPage ? "" : "pt-24"}`}>{children}</main>
          {!isAdminPage && <Footer />}
          {!isAdminPage && <WhatsAppButton />}
        </SmoothScroll>
      </body>
    </html>
  );
}

