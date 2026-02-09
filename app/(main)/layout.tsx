import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Fixo/Glassmorphism */}
      <Header />
      
      {/* Conteúdo Principal 
         flex-grow garante que o footer vá para o fundo se o conteúdo for curto
      */}
      <main className="grow">
        {children}
      </main>

      {/* Footer Padrão */}
      <Footer />
    </div>
  );
}