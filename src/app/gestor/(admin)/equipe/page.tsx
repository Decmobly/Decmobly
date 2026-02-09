import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { TeamClientPage } from './_components/TeamClientPage';

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/gestor/login');
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!currentUser) {
    redirect('/gestor/login');
  }

  // 1. BLOQUEIO TOTAL PARA EMPLOYEE
  // Employees não devem ver essa tela.
  if (currentUser.role === 'EMPLOYEE') {
    redirect('/gestor');
  }

  // 2. FILTRAGEM DE DADOS BASEADA NO ROLE
  // Se for DEVELOPER: Vê tudo.
  // Se for ADMIN: Vê apenas ADMIN e EMPLOYEE (Developer fica invisível).
  const whereClause = currentUser.role === 'DEVELOPER' 
    ? {} // Sem filtro
    : { role: { not: 'DEVELOPER' as const } }; // Admin não vê Developer

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    }
  });

  return (
    <TeamClientPage 
      initialUsers={users} 
      currentUserRole={currentUser.role} 
    />
  );
}