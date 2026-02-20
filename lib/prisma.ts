import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma: any };

function getClient() {
  // Vercel inietta le env vars a runtime — leggiamo qui dentro la funzione
  const url =
    process.env.DATABASE_URL ?? process.env.DATABASE_POSTGRES_PRISMA_URL;

  if (!url) {
    throw new Error("[Prisma] Nessuna DATABASE_URL trovata nelle env vars.");
  }

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaNeon(pool);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (PrismaClient as any)({ adapter });
}

export const prisma = globalForPrisma.prisma ?? getClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
