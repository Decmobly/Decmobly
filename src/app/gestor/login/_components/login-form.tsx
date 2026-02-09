// src/app/gestor/login/_components/login-form.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.ok && !result.error) {
      // Uso de window.location garante refresh limpo dos estados do NextAuth
      window.location.href = '/gestor';
    } else {
      setIsLoading(false);
      setError('Credenciais inválidas. Verifique e tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      
      {/* CAMPO E-MAIL */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
          E-mail
        </Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="seu.email@exemplo.com" 
          required 
          disabled={isLoading}
          // text-base impede zoom no iOS. appearance-none remove estilos nativos.
          className="h-12 w-full bg-white text-base appearance-none border-gray-300 text-gray-900 
                     focus-visible:ring-2 focus-visible:ring-[#5c4d3c] focus-visible:border-transparent 
                     placeholder:text-gray-400 rounded-md transition-all shadow-sm" 
        />
      </div>
      
      {/* CAMPO SENHA */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-gray-700 font-medium text-sm sm:text-base">
            Senha
          </Label>
          {/* Espaço para um futuro "Esqueci minha senha" se necessário */}
        </div>
        
        <div className="relative group">
          <Input 
            id="password" 
            name="password" 
            type={showPassword ? 'text' : 'password'} 
            placeholder="**********" 
            required 
            disabled={isLoading}
            className="h-12 w-full bg-white text-base appearance-none border-gray-300 text-gray-900 pr-12 
                       focus-visible:ring-2 focus-visible:ring-[#5c4d3c] focus-visible:border-transparent 
                       placeholder:text-gray-400 rounded-md transition-all shadow-sm" 
          />
          
          {/* Botão de Toggle Senha Otimizado para Toque */}
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-12 
                       text-gray-400 hover:text-[#5c4d3c] transition-colors cursor-pointer 
                       focus:outline-none focus:text-[#5c4d3c]" 
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            tabIndex={-1} // Remove da navegação via Tab para focar no input direto, opcional
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* MENSAGEM DE ERRO */}
      {error && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-300">
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md font-medium flex items-center gap-2">
            <span className="block w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
            {error}
          </p>
        </div>
      )}

      {/* BOTÃO DE SUBMIT COM WRAPPER */}
      <div className="pt-2">
        <div className="relative w-full group">
            {/* O Wrapper ajuda a garantir que a área de clique seja sólida */}
            <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold text-white rounded-md shadow-md 
                           transition-all duration-200 hover:brightness-110 hover:shadow-lg
                           flex items-center justify-center cursor-pointer active:scale-[0.98]"
                style={{ backgroundColor: '#5c4d3c' }} 
                disabled={isLoading}
            >
                {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Verificando...</span>
                </>
                ) : (
                'Acessar Painel'
                )}
            </Button>
        </div>
      </div>
    </form>
  );
}