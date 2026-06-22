import { prisma } from "@/lib/db/prisma";
import WaitlistClient from "./WaitlistClient";

export const dynamic = "force-dynamic";

export default async function WaitlistAdminPage() {
  let list: any[] = [];
  try {
    list = await prisma.techGuildWaitlist.findMany({
      orderBy: { position: "asc" },
    });
  } catch (err) {
    console.error("Database fetch waitlist failure in page.tsx:", err);
  }

  // Format Prisma objects into plain JS arrays for serialization
  const serializedList = list.map((w) => ({
    id: w.id,
    email: w.email,
    role: w.role,
    company: w.company || undefined,
    phone: w.phone || undefined,
    position: w.position,
    createdAt: w.createdAt.toISOString(),
  }));

  return <WaitlistClient initialWaitlist={serializedList} />;
}
