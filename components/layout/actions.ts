'use server';

import { prisma } from '@/lib/prisma';

export async function getCategoriesForMenu() {
  try {
    const categories = await prisma.category.findMany({
      select: { name: true, slug: true },
      orderBy: { name: 'asc' },
    });
    return categories;
  } catch (error) {
    return [];
  }
}