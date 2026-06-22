import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechGuild B2B Agency Marketplace | Domain Expansion",
  description: "Join the waitlist for TechGuild, the first verified B2B marketplace built exclusively for digital agencies. No freelancers. No guesswork. Launching Q3 2026.",
};

export default function TechGuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
