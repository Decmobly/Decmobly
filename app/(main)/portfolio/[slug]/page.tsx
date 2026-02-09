import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectInterface from './_components/project-interface';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  
  return {
    title: project ? `${project.title} ` : 'Ambiente ',
    description: project?.shortDesc || 'Móveis planejados de alto padrão em Manaus.',
  };
}

export default async function ProjectDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const projectData = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: { select: { id: true, url: true } }, // Busca apenas o essencial
      category: { select: { name: true } },
    }
  });

  if (!projectData) notFound();

  // Mapeamento manual: O Turbopack adora objetos planos e simples
  const project = {
    title: projectData.title,
    h1Title: projectData.h1Title,
    h2Title: projectData.h2Title || "",
    description: projectData.description,
    location: projectData.location || "",
    colorPalette: projectData.colorPalette || "",
    images: projectData.images,
    category: projectData.category,
  };

  const techSpecs = (projectData.techSpecs as any[]) || [];
  
  return (
    <main className="min-h-screen bg-[#fdfbf7]">
      <ProjectInterface project={project as any} techSpecs={techSpecs} />
    </main>
  );
}