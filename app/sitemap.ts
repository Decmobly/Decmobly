// src/app/sitemap.ts

import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.decmobly.com.br';

  // 1. Busca AMBIENTES (Baseado no model Category)
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // 2. Busca PROJETOS DO PORTFÓLIO
  // Nota: Usamos 'slug' em vez de 'id' pois é melhor para SEO e o campo existe no seu schema
  const projects = await prisma.project.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // --- Mapeamento das URLs Dinâmicas ---
// Rota: /portfolio/nome-do-projeto
  const portfolioRoutes = projects.map((project: { slug: any; updatedAt: any; }) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Rota: /ambientes/cozinha, /ambientes/sala, etc.
  const environmentRoutes = categories.map((category: { slug: any; updatedAt: any; }) => ({
    url: `${baseUrl}/ambientes/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  

  // --- Rotas Estáticas ---
  const staticRoutes = [
    '',                       // Home
    '/ambientes',             // Página de listagem de ambientes
    '/portfolio',             // Página de listagem de projetos
    '/sobre',                 // Institucional
    '/termos',    // Legal
    '/privacidade'// Legal
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.6, // Home tem prioridade máxima
  }));

  return [
    ...staticRoutes,
    ...environmentRoutes,
    ...portfolioRoutes,
  ];
}