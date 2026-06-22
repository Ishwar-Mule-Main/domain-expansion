import { prisma } from "@/lib/db/prisma";
import PortfolioClient from "./PortfolioClient";

export const dynamic = "force-dynamic";

export default async function PortfolioAdminPage() {
  let items: any[] = [];
  try {
    items = await prisma.portfolioItem.findMany({
      orderBy: { order: "asc" },
    });
  } catch (err) {
    console.error("Database fetch portfolio failure in page.tsx:", err);
  }

  // Format Prisma items into plain JS objects for serialization
  const serializedItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    clientName: item.clientName,
    slug: item.slug,
    categories: item.categories,
    metricHeadline: item.metricHeadline,
    published: item.published,
    featured: item.featured,
  }));

  return <PortfolioClient initialItems={serializedItems} />;
}
