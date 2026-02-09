// src/app/gestor/(admin)/_components/AdminLayoutClient.tsx
'use client';

import { useState } from 'react';
import { SidebarClient } from './sidebar-client';
import { Role } from '@prisma/client';

// Define o formato exato que o SidebarClient espera para o User
interface AdminUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

// REMOVIDO: interface MenuItem (não estava sendo usada e gerava erro de variável não utilizada)

interface AdminLayoutClientProps {
  user: AdminUser;
  
  // Usamos o comentário abaixo para permitir 'any' explicitamente.
  // Isso evita erros de build devido à complexidade dos tipos de ícones do SidebarClient.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuItems: any[]; 
  
  notificationSlot?: React.ReactNode;
  children: React.ReactNode;
}

export function AdminLayoutClient({ 
  user, 
  menuItems, 
  notificationSlot, 
  children 
}: AdminLayoutClientProps) {
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#fdfbf7]">
      
      <SidebarClient
        user={user}
        menuItems={menuItems}
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      >
         {notificationSlot}
      </SidebarClient>

      {/* ÁREA PRINCIPAL */}
      <main 
        className={`
          flex-1 
          transition-all duration-300 ease-in-out 
          w-full 
          p-4 md:p-8 
          min-h-screen
          ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} 
          ml-0 
        `}
      >
        <div className="max-w-400 mx-auto">
           {children}
        </div>
      </main>
      
    </div>
  );
}