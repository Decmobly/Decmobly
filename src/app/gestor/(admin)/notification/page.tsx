// src/app/gestor/(admin)/notifications/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { NotificationsClientPage } from './_components/NotificationsClientPage';

// Função principal da página
export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/gestor/login');
  }

  // Busca o usuário apenas com os dados básicos (sem permissions)
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!currentUser) {
    redirect('/gestor/login');
  }

  // REGRA DE SEGURANÇA:
  // Apenas o DEVELOPER pode acessar a página de gerenciamento de notificações.
  // Se for ADMIN ou EMPLOYEE, volta para o dashboard.
  if (currentUser.role !== 'DEVELOPER') {
    redirect('/gestor');
  }

  // Busca as notificações para o painel de gestão
  // Como é um mural global, trazemos todas ordenadas por data
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      sender: { 
        select: { 
          name: true,
          // Se quiser mostrar a foto de quem enviou, adicione: image: true 
        } 
      },
    },
    take: 50,
  });

  return (
    <NotificationsClientPage
      initialNotifications={notifications}
      currentUser={currentUser}
    />
  );
}