// src/app/gestor/(admin)/portfolio/projects/page.tsx (ou o caminho correto do seu arquivo)

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { ProjectsClientPage } from './_components/ProjectsClientPage';
import { list } from '@vercel/blob';
import type { Project, ProjectImage } from '@prisma/client';

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/gestor/login');
  }

  // --- 1. BUSCA DADOS DO BANCO (Paralelo para performance) ---
  const [projects, categories, users] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, images: true }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, imageUrl: true }
    }),
    prisma.user.findMany({
      select: { image: true }
    })
  ]);

  // --- 2. CÁLCULO DE ARMAZENAMENTO (BLOB) ---
  const blobUsage = {
    total: 0,
    projects: 0,
    categories: 0,
    profiles: 0,
    limit: 1024 * 1024 * 1024 // 1GB (Limite Grátis Vercel)
  };

  try {
    // Lista todos os blobs da conta (pode ser pesado se tiver muitos arquivos, use com cuidado)
    const { blobs } = await list({ limit: 10000 });
    const blobMap = new Map(blobs.map(b => [b.url, b.size]));

    // A. Calcula uso de Projetos
    projects.forEach((p: Project & { images: ProjectImage[] }) => {
      p.images.forEach((img) => {
        if (blobMap.has(img.url)) {
          blobUsage.projects += blobMap.get(img.url) || 0;
        }
      });
    });

    // B. Calcula uso de Categorias
    categories.forEach((c: { imageUrl: string | null }) => {
      if (c.imageUrl && blobMap.has(c.imageUrl)) {
        blobUsage.categories += blobMap.get(c.imageUrl) || 0;
      }
    });

    // C. Calcula uso de Perfis
    // CORREÇÃO: Tipagem para 'u' (Objeto com image)
    users.forEach((u: { image: string | null }) => {
      if (u.image && blobMap.has(u.image)) {
        blobUsage.profiles += blobMap.get(u.image) || 0;
      }
    });


    blobUsage.total = blobUsage.projects + blobUsage.categories + blobUsage.profiles;

  } catch (error) {
    console.error("Erro ao calcular armazenamento:", error);
    // Não quebra a página se a API do Blob falhar
  }

  return (
    // AJUSTE MOBILE: 'pt-20' garante que o conteúdo não fique atrás do Header Fixo (h-16).
    // 'md:pt-0' remove esse espaço no desktop, onde o layout é diferente.
    <div className="pt-20 md:pt-0 h-full">
      <ProjectsClientPage 
        initialProjects={projects} 
        categories={categories}
        storageStats={blobUsage} 
      />
    </div>
  );
}