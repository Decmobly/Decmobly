'use server';

import { prisma } from '@/lib/prisma'; // 1. Removido 'z'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';

// Helper de Slug
function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Permissões
async function checkPermission() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  return user?.role === 'DEVELOPER' || user?.role === 'ADMIN';
}

// --- UPSERT (CRIAR OU EDITAR) ---
export async function upsertProjectAction(formData: FormData, projectId?: string) {
  if (!await checkPermission()) return { success: false, message: "Sem permissão." };

  try {
    // 1. Coleta de Dados Básicos
    const title = formData.get('title') as string;
    const h1Title = formData.get('h1Title') as string;
    const location = formData.get('location') as string;
    const shortDesc = formData.get('shortDesc') as string;
    const h2Title = formData.get('h2Title') as string;
    const description = formData.get('description') as string;
    const colorPalette = formData.get('colorPalette') as string;
    const categoryId = formData.get('categoryId') as string;
    const isFeatured = formData.get('isFeatured') === 'true';
    
    // Parse da Ficha Técnica (vem como string JSON do front)
    const techSpecs = JSON.parse(formData.get('techSpecs') as string || '[]');

    const slug = generateSlug(title);

    // 2. Operações de Banco de Dados
    let project;

    if (projectId) {
      // --- EDIÇÃO ---
      
      // A. Lidar com imagens deletadas pelo usuário na edição
      const deletedImageIds = JSON.parse(formData.get('deletedImageIds') as string || '[]');
      
      if (deletedImageIds.length > 0) {
        // Busca info das imagens antes de deletar do banco para poder deletar do Blob
        const imagesToDelete = await prisma.projectImage.findMany({
          where: { id: { in: deletedImageIds } }
        });

        for (const img of imagesToDelete) {
          if (!img.isExternal) {
            await del(img.url); // Deleta do Vercel Blob
          }
        }

        // Deleta do Banco
        await prisma.projectImage.deleteMany({
          where: { id: { in: deletedImageIds } }
        });
      }

      // B. Atualizar dados do projeto
      project = await prisma.project.update({
        where: { id: projectId },
        data: {
          title, slug, h1Title, location, shortDesc, h2Title, description, 
          colorPalette, isFeatured, categoryId, techSpecs
        }
      });

    } else {
      // --- CRIAÇÃO ---
      project = await prisma.project.create({
        data: {
          title, slug, h1Title, location, shortDesc, h2Title, description, 
          colorPalette, isFeatured, categoryId, techSpecs
        }
      });
    }

    // 3. Upload de Novas Imagens (Para Criação e Edição - Arquivos)
    // O FormData traz arquivos com keys 'newImages' (múltiplos)
    const newFiles = formData.getAll('newImages') as File[];
    
    for (const file of newFiles) {
      if (file.size > 0) {
        const blob = await put(file.name, file, { access: 'public' });
        
        await prisma.projectImage.create({
          data: {
            url: blob.url,
            isExternal: false,
            projectId: project.id
          }
        });
      }
    }

    // 4. Adicionar Links Externos (Lista)
    // O frontend manda 'externalImageLinks' como JSON string de um array
    const externalLinksJson = formData.get('externalImageLinks') as string;
    const externalLinks = JSON.parse(externalLinksJson || '[]');

    if (externalLinks.length > 0) {
       for (const link of externalLinks) {
          if (link && link.trim() !== '') {
             await prisma.projectImage.create({
                data: { 
                    url: link, 
                    isExternal: true, 
                    projectId: project.id 
                }
             });
          }
       }
    }

    revalidatePath('/gestor/portfolio/projects');
    return { success: true, message: "Projeto salvo com sucesso!" };

  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao salvar (verifique campos obrigatórios)." };
  }
}

// --- DELETAR ---
export async function deleteProjectAction(id: string) {
  if (!await checkPermission()) return { success: false, message: "Sem permissão." };

  try {
    // 1. Buscar todas as imagens do projeto antes de deletar
    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: true }
    });

    if (!project) return { success: false, message: "Projeto não encontrado." };

    // 2. Deletar arquivos do Blob (Limpeza)
    for (const img of project.images) {
      if (!img.isExternal) {
        try {
          await del(img.url);
        // 2. Removido 'e' não utilizado
        } catch { 
          console.error("Erro ao limpar imagem do blob:", img.url);
          // Continua mesmo se der erro no blob para não travar a exclusão do banco
        }
      }
    }

    // 3. O 'Cascade' do Prisma deletará os registros de ProjectImage automaticamente
    // quando deletarmos o Project.
    await prisma.project.delete({ where: { id } });

    revalidatePath('/gestor/portfolio/projects');
    return { success: true, message: "Projeto e imagens removidos." };
  // 3. Removido 'error' não utilizado
  } catch {
    return { success: false, message: "Erro ao excluir projeto." };
  }
}