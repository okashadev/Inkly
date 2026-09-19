import { Pool, PoolConfig } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: process.env.NODE_ENV === "production" ? 15 : 5,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

const pool = globalForPrisma.pool || new Pool(poolConfig);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
}

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
