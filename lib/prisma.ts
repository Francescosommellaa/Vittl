import { PrismaClient } from "../app/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof buildClient>;
};

function buildClient() {
  return new PrismaClient({
    accelerateUrl: process.env.DATABASE_ACCELERATE_URL!,
  }).$extends(withAccelerate());
}

export const prisma = globalForPrisma.prisma ?? buildClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
