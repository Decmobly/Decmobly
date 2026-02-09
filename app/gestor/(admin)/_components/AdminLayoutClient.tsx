'use client';

import { useState } from 'react';
import { SidebarClient } from './sidebar-client';

interface AdminLayoutClientProps {
  user: any;
  menuItems: any[];
  // Slot dedicado para receber o componente de notificações do servidor
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
      
      {/* Sidebar recebe o NotificationBell dentro do slot children */}
      <SidebarClient
        user={user}
        menuItems={menuItems}
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      >
         {notificationSlot}
      </SidebarClient>

      {/* ÁREA PRINCIPAL
          - Mobile (ml-0): Margem zero porque o header é fixo e o menu é drawer.
          - Desktop (ml-64/20): Margem física para empurrar o conteúdo.
      */}
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