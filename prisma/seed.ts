import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Technology", slug: "technology" },
  { name: "Design", slug: "design" },
  { name: "Programming", slug: "programming" },
  { name: "AI", slug: "ai" },
  { name: "Startups", slug: "startups" },
  { name: "Productivity", slug: "productivity" },
];

async function main() {
  console.log("🌱 Seeding categories started...");

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
