import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClientType = any;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

function createPrismaClient(): PrismaClientType {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "[Prisma] DATABASE_URL is not set. Check your environment variables.",
    );
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  return new (PrismaClient as PrismaClientType)({ adapter });
}

export const prisma: PrismaClientType =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
