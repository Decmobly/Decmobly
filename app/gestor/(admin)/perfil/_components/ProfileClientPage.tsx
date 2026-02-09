'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { User as UserIcon, Camera, Lock, Save, ShieldCheck } from 'lucide-react';
import { updateProfileAction, updatePasswordAction } from '../actions';
import type { User } from '@prisma/client';

// Tipo parcial pois não trazemos a senha
type UserProfile = Pick<User, 'id' | 'name' | 'email' | 'image' | 'role'>;

export function ProfileClientPage({ user }: { user: UserProfile }) {
  // Estado para Preview da Imagem
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  // --- HANDLER: Troca de Imagem ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- HANDLER: Atualizar Perfil ---
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingProfile(true);
    
    const formData = new FormData(e.currentTarget);
    
    toast.promise(updateProfileAction(formData), {
        loading: 'Atualizando perfil...',
        success: (res) => {
            setLoadingProfile(false);
            if (!res.success) throw new Error(res.message);
            return res.message;
        },
        error: (err) => {
            setLoadingProfile(false);
            return err.message;
        }
    });
  };

  // --- HANDLER: Atualizar Senha ---
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPass(true);
    
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget; // Para resetar depois

    toast.promise(updatePasswordAction(formData), {
        loading: 'Verificando e atualizando senha...',
        success: (res) => {
            setLoadingPass(false);
            if (!res.success) throw new Error(res.message);
            form.reset(); // Limpa os campos de senha
            return res.message;
        },
        error: (err) => {
            setLoadingPass(false);
            return err.message;
        }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#5c4d3c]">Meu Perfil</h1>
        <p className="text-gray-500">Gerencie suas informações pessoais e credenciais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARD 1: INFORMAÇÕES GERAIS */}
        <div className="bg-white border border-[#efe4cd] rounded-xl p-6 shadow-sm flex flex-col h-fit">
          <div className="flex items-center gap-2 mb-6 text-[#5c4d3c] border-b border-[#efe4cd] pb-2">
            <UserIcon size={20} />
            <h2 className="font-bold">Informações Pessoais</h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            
            {/* Área de Avatar */}
            <div className="flex flex-col items-center justify-center space-y-4">
               <div className="relative w-32 h-32 rounded-full border-4 border-[#f7f1e3] shadow-inner bg-[#fdfbf7] overflow-hidden group">
                  {previewUrl ? (
                     <Image 
                       src={previewUrl} 
                       alt="Avatar" 
                       fill 
                       className="object-cover"
                     />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-[#5c4d3c]">
                        <UserIcon size={48} />
                     </div>
                  )}
                  
                  {/* Overlay para Upload */}
                  <div 
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                     <Camera className="text-white" size={24} />
                  </div>
               </div>
               
               <div className="text-center">
                  <p className="text-xs text-gray-400">Clique na foto para alterar</p>
                  <p className="text-[10px] text-gray-300 uppercase font-bold tracking-wider mt-1">{user.role}</p>
               </div>

               {/* Input File Escondido */}
               <input 
                 type="file" 
                 name="imageFile" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*"
                 onChange={handleImageChange}
               />
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                  <Label className="text-gray-700">Nome Completo</Label>
                  <Input 
                    name="name" 
                    defaultValue={user.name} 
                    required 
                    className="bg-white border-[#efe4cd] focus-visible:ring-[#5c4d3c]" 
                  />
               </div>
               
               <div className="space-y-2">
                  <Label className="text-gray-700">E-mail</Label>
                  <Input 
                    name="email" 
                    defaultValue={user.email} 
                    required 
                    type="email"
                    className="bg-white border-[#efe4cd] focus-visible:ring-[#5c4d3c]" 
                  />
               </div>
            </div>

            <Button type="submit" disabled={loadingProfile} className="w-full bg-[#5c4d3c] text-white hover:bg-[#4a3e30] mt-4">
               {loadingProfile ? 'Salvando...' : (
                 <span className="flex items-center gap-2"><Save size={16}/> Salvar Alterações</span>
               )}
            </Button>
          </form>
        </div>

        {/* CARD 2: SEGURANÇA */}
        <div className="bg-white border border-[#efe4cd] rounded-xl p-6 shadow-sm flex flex-col h-fit">
          <div className="flex items-center gap-2 mb-6 text-[#5c4d3c] border-b border-[#efe4cd] pb-2">
            <ShieldCheck size={20} />
            <h2 className="font-bold">Segurança e Senha</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800 mb-4">
               Para sua segurança, é necessário informar a senha atual antes de criar uma nova.
            </div>

            <div className="space-y-2">
                <Label className="text-gray-700">Senha Atual</Label>
                <div className="relative">
                   <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                   <Input 
                     name="currentPassword" 
                     type="password" 
                     required 
                     className="pl-9 bg-white border-[#efe4cd]" 
                   />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-gray-700">Nova Senha</Label>
                <div className="relative">
                   <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                   <Input 
                     name="newPassword" 
                     type="password" 
                     required 
                     minLength={6}
                     className="pl-9 bg-white border-[#efe4cd]" 
                   />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-gray-700">Confirmar Nova Senha</Label>
                <div className="relative">
                   <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                   <Input 
                     name="confirmPassword" 
                     type="password" 
                     required 
                     minLength={6}
                     className="pl-9 bg-white border-[#efe4cd]" 
                   />
                </div>
            </div>

            <Button type="submit" disabled={loadingPass} variant="outline" className="w-full border-[#5c4d3c] text-[#5c4d3c] hover:bg-[#f7f1e3] mt-4">
               {loadingPass ? 'Atualizando...' : 'Atualizar Senha'}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}