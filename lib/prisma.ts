import { PrismaClient } from '@prisma/client';

// 1. Tipamos o global corretamente para aceitar o PrismaClient ou undefined
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;