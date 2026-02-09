// app\gestor\(admin)\categories\actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob'; // Importando 'del' para exclusão

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

const categorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isExternal: z.boolean().optional(),
});

async function checkPermission() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  return user?.role === 'DEVELOPER' || user?.role === 'ADMIN';
}

// Helper para verificar se a URL é do Vercel Blob
function isVercelBlob(url: string) {
  return url.includes('public.blob.vercel-storage.com');
}

export async function upsertCategoryAction(formData: FormData, categoryId?: string) {
  if (!await checkPermission()) return { success: false, message: "Sem permissão." };

  try {
    const isExternal = formData.get('isExternal') === 'true';
    let imageUrl = formData.get('imageUrl') as string | null;
    const imageFile = formData.get('imageFile') as File | null;
    const hasNewFile = !isExternal && imageFile && imageFile.size > 0;

    // Se estiver editando, busca os dados atuais
    let existingCategory = null;
    if (categoryId) {
      existingCategory = await prisma.category.findUnique({ where: { id: categoryId } });
    }

    // --- LÓGICA DE LIMPEZA (DELETE) ---
    // Se já existia uma imagem no Blob E (estamos subindo uma nova OU mudando para link externo)
    if (existingCategory?.imageUrl && isVercelBlob(existingCategory.imageUrl)) {
      const shouldDeleteOld = hasNewFile || isExternal;

      if (shouldDeleteOld) {
        try {
            await del(existingCategory.imageUrl);
        } catch (error) {
            console.error("Falha ao deletar imagem antiga do Blob:", error);
            // Não interrompemos o fluxo, pois queremos salvar a nova
        }
      }
    }

    // --- LÓGICA DE UPLOAD (PUT) ---
    if (hasNewFile) {
        // Upload de arquivo novo
        const blob = await put(imageFile!.name, imageFile!, {
          access: 'public',
        });
        imageUrl = blob.url;
    } else if (!imageUrl && existingCategory && !isExternal) {
        // Mantém a imagem antiga se não enviou nada novo e não é externo
        imageUrl = existingCategory.imageUrl;
    }

    const rawData = {
      name: formData.get('name') as string,
      title: (formData.get('title') as string) || null,
      description: (formData.get('description') as string) || null,
      imageUrl: imageUrl || null,
      isExternal: isExternal,
    };

    const validation = categorySchema.safeParse(rawData);
    if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message };
    }

    const data = validation.data;
    const slug = generateSlug(data.name);

    const payload = {
      name: data.name,
      slug,
      title: data.title || data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      isExternal: data.isExternal || false,
    };

    if (categoryId) {
      await prisma.category.update({
        where: { id: categoryId },
        data: payload
      });
    } else {
      await prisma.category.create({
        data: payload
      });
    }

    revalidatePath('/gestor/portfolio');
    return { success: true, message: "Categoria salva com sucesso!" };

  } catch (error) {
    console.error("Erro na action:", error);
    return { success: false, message: "Erro ao salvar (verifique se o nome já existe)." };
  }
}

export async function deleteCategoryAction(id: string) {
  if (!await checkPermission()) return { success: false, message: "Sem permissão." };

  try {
    // 1. Buscar a categoria para pegar a URL da imagem
    const category = await prisma.category.findUnique({
        where: { id },
        select: { imageUrl: true }
    });

    // 2. Se tiver imagem e for do Blob, deleta do Vercel
    if (category?.imageUrl && isVercelBlob(category.imageUrl)) {
        try {
            await del(category.imageUrl);
        } catch (error) {
            console.error("Erro ao deletar imagem do Blob (ignorando para deletar do banco):", error);
        }
    }

    // 3. Deleta do banco de dados
    await prisma.category.delete({ where: { id } });
    
    revalidatePath('/gestor/portfolio');
    return { success: true, message: "Categoria removida." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao remover (pode ter projetos vinculados)." };
  }
}