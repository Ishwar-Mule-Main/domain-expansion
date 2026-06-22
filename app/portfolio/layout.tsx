import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Expansion Portfolio | Premium Agency Showcase",
  description: "Explore the official Domain Expansion Portfolio. Premium digital marketing, high-performance web engineering, social media campaigns, ads design, and custom UI/UX assets.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
