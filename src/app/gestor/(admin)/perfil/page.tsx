// src/app/gestor/(admin)/profile/page.tsx (ou o caminho correto)

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { ProfileClientPage } from './_components/ProfileClientPage';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/gestor/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      // Segurança: Senha nunca é selecionada
    }
  });

  // Caso o usuário tenha sido deletado do banco mas a sessão ainda exista
  if (!user) {
    redirect('/gestor/login');
  }

  return (
    // AJUSTE MOBILE: 'pt-20' evita que o conteúdo fique atrás do Header Fixo (h-16).
    // 'md:pt-0' remove esse espaço no desktop.
    <div className="pt-20 md:pt-0 animate-in fade-in duration-500">
      <ProfileClientPage user={user} />
    </div>
  );
}