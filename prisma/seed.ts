import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const superAdminEmail = "info@domainexpansion.in";

  // Check if admin already exists
  const existingAdmin = await (prisma as any).adminUser.findUnique({
    where: { email: superAdminEmail },
  });

  if (existingAdmin) {
    console.log(`[Seed] Super Admin with email ${superAdminEmail} already exists.`);
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash("DomainAdmin2026!", salt);

  // Create Super Admin User
  const admin = await (prisma as any).adminUser.create({
    data: {
      email: superAdminEmail,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`[Seed] Super Admin created successfully:
- Email: ${admin.email}
- Role:  ${admin.role}
- Password: DomainAdmin2026! (change after first login)
`);
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await (prisma as any).$disconnect();
  });
