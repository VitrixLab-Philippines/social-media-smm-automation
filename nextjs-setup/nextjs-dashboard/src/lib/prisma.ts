/**
 * Prisma client for Next.js App Router.
 * 
 * IMPORTANT: This module uses the real PrismaClient connected to PostgreSQL.
 * The global singleton pattern prevents multiple instances in development
 * while ensuring a single client is used in production (Vercel).
 */

import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV !== "production" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;