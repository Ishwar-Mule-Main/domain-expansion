import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import Preloader from "@/components/ui/Preloader";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0D0D0D] text-[#F3F4F6]">
        <Preloader />
        <GoogleAnalytics />
        <SmoothScroll>
          <ScrollProgress />
          <Cursor />
          <Navbar />
          <main className="flex-grow pt-24">{children}</main>
          <Footer />
          <WhatsAppButton />
        </SmoothScroll>
      </body>
    </html>
  );
}

