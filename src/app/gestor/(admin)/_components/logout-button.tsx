// src/app/gestor/(admin)/_components/logout-button.tsx
'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

// Definimos as props que o componente pode receber
interface LogoutButtonProps {
  // Se 'asMenuItem' for true, ele renderizará apenas o conteúdo para o menu
  asMenuItem?: boolean;
}

export function LogoutButton({ asMenuItem = false }: LogoutButtonProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/gestor/login' });
  };

  // Se for para ser usado como um item de menu...
  if (asMenuItem) {
    // Renderizamos apenas o conteúdo, sem o componente <Button>.
    // O DropdownMenuItem que o envolve cuidará do clique e do estilo.
    return (
      <>
        <LogOut size={16} className="mr-2" />
        Sair
      </>
    );
  }

  // Comportamento padrão: renderiza como um botão completo e estilizado.
  return (
    <Button
      variant="outline"
      className="w-full justify-start bg-transparent border-gray-800 hover:bg-red-900/50 hover:border-red-700 hover:text-red-300"
      onClick={handleSignOut}
    >
      <LogOut size={16} className="mr-2" />
      Sair
    </Button>
  );
}