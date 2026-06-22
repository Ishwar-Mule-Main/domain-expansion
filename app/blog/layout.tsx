import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practitioner-Led Digital Marketing & Web Dev Blog | Domain Expansion",
  description: "Expert insights and operational guides on SEO, Next.js web development, custom design systems, and automated AI workflows written by active practitioners.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
