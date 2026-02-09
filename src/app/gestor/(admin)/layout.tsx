import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as LucideIcons from 'lucide-react';
import { AdminLayoutClient } from './_components/AdminLayoutClient';
import { NotificationBell } from './_components/NotificationBell';
import { Metadata } from 'next';

// Tipos
type IconName = keyof typeof LucideIcons;
interface MenuItem { 
  href?: string; 
  icon: IconName; 
  label: string; 
}

export const metadata: Metadata = {
  title: "Painel Gestor",
  description: "Painel gestor da Decmobly - Acesso restrito.",
};

export default async function GestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/gestor/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect('/gestor/login');
  }

  // --- MONTAGEM DO MENU ---
  const menuItems: MenuItem[] = [
    { href: "/gestor", icon: 'LayoutDashboard', label: "Dashboard" },
  ];

  if (user.role === 'DEVELOPER') {
    menuItems.push(
      { href: "/gestor/notification", icon: 'Bell', label: "Notificações" }
    );
  }

  if (user.role === 'DEVELOPER' || user.role === 'ADMIN') {
     menuItems.push(
      { href: "/gestor/equipe", icon: 'Users', label: "Gerenciar Equipe" }
);
  }
  menuItems.push(
    { href: "/gestor/categories", icon: 'LayoutDashboard', label: "Gerenciar Categorias" },
    { href: "/gestor/projetos", icon: 'Briefcase', label: "Gerenciar Projetos" },
  );

  return (
    // Define a cor de fundo global creme (#fdfbf7)
    <div className="min-h-screen bg-[#fdfbf7] text-gray-900 font-sans selection:bg-[#5c4d3c] selection:text-white">
      <AdminLayoutClient
        user={user}
        menuItems={menuItems}
        // Injeta o Server Component do sino dentro do Client Component
        notificationSlot={<NotificationBell />} 
      >
        {children}
      </AdminLayoutClient>
    </div>
  );
}