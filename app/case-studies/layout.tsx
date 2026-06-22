import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detailed Client Case Studies & Marketing Growth | Domain Expansion",
  description: "Read in-depth case study reports detailing real problems, engineered strategies, and trackable outcomes from our 21 client engagements.",
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
