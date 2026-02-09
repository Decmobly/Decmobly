'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';
import { hash, compare } from 'bcryptjs';

// --- ATUALIZAR DADOS GERAIS (FOTO E NOME) ---
export async function updateProfileAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Não autorizado." };

  const name = formData.get('name') as string;
  const email = formData.get('email') as string; // Opcional permitir troca de email
  const imageFile = formData.get('imageFile') as File;

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { success: false, message: "Usuário não encontrado." };

    let imageUrl = user.image;

    // Se enviou uma nova foto
    if (imageFile && imageFile.size > 0) {
      // 1. Tenta apagar a foto antiga do Blob para não acumular lixo
      if (user.image && user.image.includes('public.blob.vercel-storage.com')) {
        try {
          await del(user.image); 
        } catch (e) {
          console.log("Erro ao apagar imagem antiga:", e);
        }
      }

      // 2. Faz o upload da nova
      const blob = await put(imageFile.name, imageFile, { access: 'public' });
      imageUrl = blob.url;
    }

    // Atualiza no banco
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email, // Se permitir troca de email
        image: imageUrl
      }
    });

    revalidatePath('/gestor/perfil');
    // Revalida o layout para atualizar o avatar no header/sidebar imediatamente
    revalidatePath('/', 'layout'); 
    
    return { success: true, message: "Perfil atualizado com sucesso!" };

  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao atualizar perfil." };
  }
}

// --- ATUALIZAR SENHA ---
export async function updatePasswordAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Não autorizado." };

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (newPassword !== confirmPassword) {
    return { success: false, message: "As novas senhas não coincidem." };
  }

  if (newPassword.length < 6) {
    return { success: false, message: "A nova senha deve ter no mínimo 6 caracteres." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { success: false, message: "Usuário não encontrado." };

    // 1. Verifica se a senha atual está correta
    // Nota: Se o usuário foi criado sem senha (ex: Google Auth), isso pode falhar. 
    // Assumindo login por credenciais aqui.
    if (!user.password) {
        return { success: false, message: "Usuário não possui senha definida (Login social?)." };
    }

    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, message: "A senha atual está incorreta." };
    }

    // 2. Hash da nova senha
    const hashedPassword = await hash(newPassword, 10);

    // 3. Salva
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return { success: true, message: "Senha alterada com sucesso!" };

  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao alterar senha." };
  }
}