'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';

// Schema básico de validação
const userSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.enum(['DEVELOPER', 'ADMIN', 'EMPLOYEE']),
  password: z.string().optional(), // Opcional na edição
});

// --- HELPER DE PERMISSÃO ---
async function checkPermission() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { authorized: false, role: null, userId: null };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, id: true }
  });

  if (!user) return { authorized: false, role: null, userId: null };
  
  // Employee não tem acesso a nada aqui
  if (user.role === 'EMPLOYEE') return { authorized: false, role: 'EMPLOYEE', userId: user.id };

  return { authorized: true, role: user.role, userId: user.id };
}

// --- CRIAR / EDITAR USUÁRIO ---
export async function upsertUserAction(formData: FormData, isEditingId?: string) {
  const { authorized, role: currentRole } = await checkPermission();
  
  if (!authorized) {
    return { success: false, message: "Acesso negado." };
  }

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as 'DEVELOPER' | 'ADMIN' | 'EMPLOYEE',
    password: formData.get('password') as string,
  };

  // 1. REGRA DE SEGURANÇA: Admin não pode criar/promover ninguém a Developer
  if (currentRole === 'ADMIN' && data.role === 'DEVELOPER') {
    return { success: false, message: "Admins não podem criar Desenvolvedores." };
  }

  // Validação Zod
  const validation = userSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: validation.error.issues[0].message };
  }

  try {
    const hashedPassword = data.password ? await hash(data.password, 10) : undefined;

    // --- CREATE ---
    if (!isEditingId) {
      if (!data.password) return { success: false, message: "Senha é obrigatória para novos usuários." };

      await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          role: data.role,
          password: hashedPassword!, // Garantido pelo check acima
        }
      });
      revalidatePath('/gestor/equipe');
      return { success: true, message: "Usuário criado com sucesso!" };
    } 
    
    // --- UPDATE ---
    else {
      // REGRA DE SEGURANÇA: Verificar se o alvo é um Developer antes de editar
      const targetUser = await prisma.user.findUnique({ where: { id: isEditingId } });
      
      if (!targetUser) return { success: false, message: "Usuário não encontrado." };

      // Se eu sou ADMIN e tento editar um DEVELOPER -> Bloqueia
      if (currentRole === 'ADMIN' && targetUser.role === 'DEVELOPER') {
        return { success: false, message: "Você não tem permissão para editar este perfil." };
      }

      const updateData: any = {
        name: data.name,
        email: data.email,
        role: data.role,
      };
      if (hashedPassword) updateData.password = hashedPassword;

      await prisma.user.update({
        where: { id: isEditingId },
        data: updateData
      });

      revalidatePath('/gestor/equipe');
      return { success: true, message: "Usuário atualizado!" };
    }

  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao salvar usuário (Email já existe?)." };
  }
}

// --- EXCLUIR USUÁRIO ---
export async function deleteUserAction(userIdToDelete: string) {
  const { authorized, role: currentRole, userId: currentUserId } = await checkPermission();

  if (!authorized) return { success: false, message: "Acesso negado." };

  if (userIdToDelete === currentUserId) {
    return { success: false, message: "Você não pode excluir a si mesmo." };
  }

  const targetUser = await prisma.user.findUnique({ where: { id: userIdToDelete } });
  if (!targetUser) return { success: false, message: "Usuário não encontrado." };

  // REGRA DE SEGURANÇA: Admin não apaga Developer
  if (currentRole === 'ADMIN' && targetUser.role === 'DEVELOPER') {
    return { success: false, message: "Permissão insuficiente para excluir este usuário." };
  }

  try {
    await prisma.user.delete({ where: { id: userIdToDelete } });
    revalidatePath('/gestor/equipe');
    return { success: true, message: "Usuário removido." };
  } catch (error) {
    return { success: false, message: "Erro ao excluir usuário." };
  }
}