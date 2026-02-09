// src/app/gestor/(admin)/notifications/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// --- HELPER DE SEGURANÇA ---
// CORREÇÃO: Apenas DEVELOPER pode gerenciar (criar/excluir).
// Admins e Employees apenas visualizam.
async function canManageNotifications() {
  const session = await getServerSession(authOptions);
  
  // Se não tiver sessão ou role, nega
  if (!session?.user?.email) return false;

  // Verifica estritamente se é DEVELOPER
  // (Certifique-se que o role está sendo passado no session callback do NextAuth)
  return session.user.role === 'DEVELOPER';
}

// --- SCHEMA DE VALIDAÇÃO (Zod) ---
const notificationSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres."),
  message: z.string().min(5, "A mensagem deve ter no mínimo 5 caracteres."),
});


// --- ACTION 1: ENVIAR UMA NOTIFICAÇÃO (Somente Developer) ---
export async function sendNotificationAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    
    // 1. Verifica se tem sessão
    if (!session?.user?.id) {
       return { success: false, message: "Não autenticado." };
    }

    // 2. Verifica se é DEVELOPER
    const isDeveloper = await canManageNotifications();
    if (!isDeveloper) {
      return { success: false, message: "Apenas o Desenvolvedor pode enviar avisos." };
    }

    const data = {
      title: formData.get('title'),
      message: formData.get('message'),
    };

    const validatedFields = notificationSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, message: validatedFields.error.issues[0].message };
    }

    const { title, message } = validatedFields.data;

    await prisma.notification.create({
      data: {
        title,
        message,
        senderId: session.user.id,
      }
    });

    revalidatePath('/gestor', 'layout');
    return { success: true, message: "Aviso publicado no mural!" };

  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    return { success: false, message: "Erro interno no servidor." };
  }
}

// --- ACTION 2: BUSCAR AS NOTIFICAÇÕES (Todos podem ver) ---
export async function getNotificationsForBell() {
  const session = await getServerSession(authOptions);
  
  // Qualquer usuário logado pode ler as notificações
  if (!session?.user?.id) {
    return { notifications: [] };
  }

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      sender: {
        select: { name: true }
      }
    }
  });

  return { notifications };
}

// --- ACTION 3: DELETAR NOTIFICAÇÃO (Somente Developer) ---
export async function deleteNotificationAction(notificationId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, message: "Não autorizado" };

    // Verifica permissão estrita de DEVELOPER
    const isDeveloper = await canManageNotifications();

    if (!isDeveloper) {
      return { success: false, message: "Apenas o Desenvolvedor pode remover avisos." };
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    revalidatePath('/gestor', 'layout');

    return { success: true, message: "Aviso removido." };
  } catch (error) {
    console.error("Erro ao deletar notificação:", error);
    return { success: false, message: "Erro ao remover aviso." };
  }
}