import { PrismaClient } from "@prisma/client";

import { DATABASE_URL, NODE_ENV } from "@/config";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: DATABASE_URL,
    log:
      NODE_ENV === "development"
        ? // ? ['query', 'info', 'warn', 'error']
          ["warn", "error"]
        : undefined,
  });

if (NODE_ENV !== "production") globalForPrisma.prisma = prisma;
