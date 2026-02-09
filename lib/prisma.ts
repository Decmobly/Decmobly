import * as PrismaClientPkg from '@prisma/client';

// No Prisma 7, dependendo da config, a exportação pode estar em sub-objetos
const PrismaClient = (PrismaClientPkg as any).PrismaClient || PrismaClientPkg.PrismaClient;

const globalForPrisma = global as unknown as { prisma: any };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;