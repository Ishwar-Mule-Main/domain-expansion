import fs from "fs";
import path from "path";

// Load .env manually to ensure DATABASE_URL is available to the Prisma pg pool connection
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const equalIdx = trimmed.indexOf("=");
        if (equalIdx > 0) {
          const key = trimmed.substring(0, equalIdx).trim();
          const val = trimmed.substring(equalIdx + 1).trim().replace(/^"|"$/g, "");
          process.env[key] = val;
        }
      }
    }
    console.log("Loaded .env parameters manually.");
  }
} catch (e) {
  console.warn("Failed to load .env manually:", e);
}

async function main() {
  console.log("Dynamically importing Prisma client...");
  const { prisma } = await import("../lib/db/prisma");

  console.log("Starting cleanup of Lead and TechGuildWaitlist records...");
  
  const deletedLeads = await prisma.lead.deleteMany();
  console.log(`Successfully deleted ${deletedLeads.count} Lead records.`);

  const deletedWaitlist = await prisma.techGuildWaitlist.deleteMany();
  console.log(`Successfully deleted ${deletedWaitlist.count} TechGuildWaitlist records.`);
  
  console.log("Cleanup complete!");
}

main()
  .catch((e) => {
    console.error("Cleanup failed:", e);
    process.exit(1);
  });
