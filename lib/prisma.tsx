import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function getDbUrl() {
  if (!process.env.VERCEL) return undefined;
  const src = path.join(process.cwd(), "prisma", "dev.db");
  const dest = "/tmp/dev.db";
  if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
  return "file:/tmp/dev.db";
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: getDbUrl() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;