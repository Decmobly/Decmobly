// src/app/gestor/login/page.tsx

import { LoginForm } from './_components/login-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    // 1. min-h-[100dvh]: Garante altura total correta em mobile (ignora barra de navegação do browser)
    // 2. p-4 sm:p-8: Padding menor em mobile, maior em tablets/desktop
    <div className="min-h-screen supports-[min-h-[100dvh]]:min-h-dvh bg-[#fdfbf7] flex flex-col items-center justify-center p-4 sm:p-8 relative animate-in fade-in duration-500">
      
      {/* BOTÃO VOLTAR RESPONSIVO:
         Mobile: Static (fluxo normal), largura total, margem inferior.
         Desktop (md): Absolute, posicionado no canto, sem margem.
      */}
      <div className="w-full max-w-md mb-6 md:absolute md:top-8 md:left-8 md:w-auto md:mb-0">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#5c4d3c] hover:text-gray-900 transition-colors font-medium py-2 px-2 -ml-2 rounded-lg hover:bg-[#5c4d3c]/5"
        >
          <ChevronLeft size={20} />
          <span>Voltar para o site</span>
        </Link>
      </div>
      
      {/* CARD DE LOGIN */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-xl shadow-[#5c4d3c]/5 border border-[#efe4cd]">
        
        {/* Header do Card */}
        <div className="flex flex-col items-center justify-center mb-8">
          {/* Container do Logo com altura fixa para evitar CLS (Cumulative Layout Shift) */}
          <p className="text-gray-500 text-sm mt-4 font-sans text-center">
            Acesse sua Área Administrativa
          </p>
        </div>

        {/* Formulário */}
        <LoginForm />

        {/* Footer do Card */}
        <div className="mt-8 text-center pt-6 border-t border-gray-100">
             <p className="text-xs text-gray-400 leading-relaxed">
               Ambiente seguro &copy; Decmobly | <br className="sm:hidden" />
               Desenvolvido por{' '}
               <a 
                 href="https://levbrands.com.br" 
                 className="text-[#5c4d3c] font-semibold hover:underline decoration-[#5c4d3c]/30 underline-offset-2 transition-all" 
                 target="_blank"
                 rel="noopener noreferrer" // Segurança adicional para links externos
               >
                 LevBrands
               </a>
             </p>
        </div>
      </div>
    </div>
  );
}