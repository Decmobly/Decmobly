// src/app/gestor/layout.tsx

// 1. Importe o componente Toaster
import { Toaster } from "@/components/ui/sonner";

export default function GestorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 2. Renderize o conteúdo da página (seja login, primeiro-acesso, ou o dashboard) */}
      {children}
      
      {/* 3. Adicione o Toaster aqui. Ele agora estará disponível para todas as páginas do gestor. */}
      <Toaster 
  richColors 
  closeButton
  position="top-right"
  toastOptions={{
    style: {
      background: '#fdfbf7',   // Bege bem clarinho (fundo)
      color: '#5c4d3c',        // Marrom madeira escura (texto)
      border: '1px solid #efe4cd', // Bordas em tom palha
    },
    classNames: {
      toast: 'font-sans shadow-lg rounded-xl',
      title: 'font-bold text-[#5c4d3c]',
      description: 'text-[#8c7a66]', // Marrom mais suave para descrições
      actionButton: 'bg-[#5c4d3c] text-white',
      closeButton: 'hover:bg-[#efe4cd]',
    }
  }}
/>
    </>
  );
}