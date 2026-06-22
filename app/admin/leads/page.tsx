import { prisma } from "@/lib/db/prisma";
import LeadsListClient from "./LeadsListClient";

export const dynamic = "force-dynamic";

export default async function LeadsAdminPage() {
  let leads: any[] = [];
  try {
    leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Database fetch leads failure in page.tsx:", err);
  }

  // Format Prisma items into plain JS object array for serialization
  const serializedLeads = leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone || undefined,
    company: l.company || undefined,
    service: l.service,
    budget: l.budget || undefined,
    message: l.message,
    status: l.status,
    createdAt: l.createdAt.toISOString(),
  }));

  return <LeadsListClient initialLeads={serializedLeads} />;
}
