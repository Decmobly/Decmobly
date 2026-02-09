'use client';

import { useState } from 'react'; // useRef removido
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { UserPlus, Pencil, Trash2, Shield, User as UserIcon, Wrench, Mail, Calendar } from 'lucide-react';
import { upsertUserAction, deleteUserAction } from '../actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipagem vinda do prisma select no page.tsx
type TeamUser = {
  id: string;
  name: string;
  email: string;
  role: 'DEVELOPER' | 'ADMIN' | 'EMPLOYEE';
  createdAt: Date;
};

interface TeamClientPageProps {
  initialUsers: TeamUser[];
  currentUserRole: 'DEVELOPER' | 'ADMIN' | 'EMPLOYEE';
}

export function TeamClientPage({ initialUsers, currentUserRole }: TeamClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamUser | null>(null);
  // Removido: const formRef = useRef<HTMLFormElement>(null);

  // --- Função para abrir modal (Criar ou Editar) ---
  const handleOpenModal = (user?: TeamUser) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  // --- Submit do Formulário ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    // Fallback manual para o select caso necessário, mas o Shadcn geralmente lida bem.
    
    toast.promise(upsertUserAction(formData, editingUser?.id), {
      loading: 'Salvando...',
      success: (res) => {
        if (!res.success) throw new Error(res.message);
        setIsModalOpen(false);
        return res.message;
      },
      error: (err) => err.message
    });
  };

  // --- Deletar ---
  const handleDelete = async (id: string) => {
    toast.promise(deleteUserAction(id), {
      loading: 'Excluindo...',
      success: (res) => {
        if (!res.success) throw new Error(res.message);
        return res.message;
      },
      error: (err) => err.message
    });
  };

  // Ícone e Cor por Role
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'DEVELOPER': return <span className="inline-flex items-center gap-1.5 text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide"><Wrench size={12} /> DEV</span>;
      case 'ADMIN': return <span className="inline-flex items-center gap-1.5 text-[#5c4d3c] bg-[#f7f1e3] border border-[#efe4cd] px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide"><Shield size={12} /> ADMIN</span>;
      default: return <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide"><UserIcon size={12} /> EQUIPE</span>;
    }
  };

  // Botões de Ação Reutilizáveis (Para evitar duplicação Mobile/Desktop)
  const ActionButtons = ({ user }: { user: TeamUser }) => (
    <div className="flex justify-end gap-1 md:gap-2">
        <Button 
            variant="ghost" size="icon" 
            onClick={() => handleOpenModal(user)}
            className="text-gray-400 hover:text-[#5c4d3c] hover:bg-[#f7f1e3] h-8 w-8 md:h-9 md:w-9"
        >
            <Pencil size={16} />
        </Button>

        <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button 
                variant="ghost" size="icon" 
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 md:h-9 md:w-9"
            >
                <Trash2 size={16} />
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90%] sm:w-full bg-white border-[#efe4cd] rounded-xl">
            <AlertDialogHeader>
                <AlertDialogTitle className="text-[#5c4d3c]">Excluir usuário?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500">
                Esta ação removerá o acesso de <strong>{user.name}</strong> permanentemente.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
                <AlertDialogCancel className="border-[#efe4cd] text-gray-600 mt-0">Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                onClick={() => handleDelete(user.id)}
                className="bg-red-600 text-white hover:bg-red-700"
                >
                Excluir
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#5c4d3c]">Gerenciar Equipe</h1>
          <p className="text-gray-500 text-sm md:text-base">Controle de acesso e usuários do sistema.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full md:w-auto bg-[#5c4d3c] text-white hover:bg-[#4a3e30] shadow-md active:scale-95 transition-all">
          <UserPlus size={18} className="mr-2" /> Novo Usuário
        </Button>
      </div>

      {/* --- VERSÃO MOBILE: LISTA DE CARDS (Visível < md) --- */}
      <div className="md:hidden space-y-4">
        {initialUsers.map((user) => (
            <div key={user.id} className="bg-white border border-[#efe4cd] rounded-lg p-4 shadow-sm relative overflow-hidden">
                {/* Cabeçalho do Card */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                        <span className="font-bold text-[#5c4d3c] text-lg leading-tight mb-1">{user.name}</span>
                        
                    </div>
                    
                    {/* Ações no topo direito */}
                    <div className="absolute top-2 right-2">
                        <div className="flex flex-col items-end gap-2">
                             <ActionButtons user={user} />
                             {getRoleBadge(user.role)}
                        </div>
                    </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="space-y-2 text-sm text-gray-600 mt-2 pt-3 border-t border-[#f7f1e3]">
                    <div className="flex items-center gap-2">
                        <Mail size={14} className="text-[#5c4d3c]/70" />
                        <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={14} className="text-[#5c4d3c]/70" />
                        <span>Criado em {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                    </div>
                </div>
            </div>
        ))}
        {initialUsers.length === 0 && (
            <div className="p-8 text-center text-gray-400 border border-dashed border-[#efe4cd] rounded-lg bg-gray-50/50">
                Nenhum usuário encontrado.
            </div>
        )}
      </div>

      {/* --- VERSÃO DESKTOP: TABELA (Visível >= md) --- */}
      <div className="hidden md:block border border-[#efe4cd] rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f7f1e3]">
            <TableRow className="border-[#efe4cd] hover:bg-[#f7f1e3]">
              <TableHead className="text-[#5c4d3c] font-bold">Nome</TableHead>
              <TableHead className="text-[#5c4d3c] font-bold">Email</TableHead>
              <TableHead className="text-[#5c4d3c] font-bold">Função</TableHead>
              <TableHead className="text-[#5c4d3c] font-bold">Data Criação</TableHead>
              <TableHead className="text-right text-[#5c4d3c] font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialUsers.map((user) => (
              <TableRow key={user.id} className="border-[#efe4cd] hover:bg-[#fdfbf7]">
                <TableCell className="font-medium text-gray-800">{user.name}</TableCell>
                <TableCell className="text-gray-600">{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell className="text-xs text-gray-500">
                  {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <ActionButtons user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialUsers.length === 0 && (
          <div className="p-12 text-center text-gray-400">Nenhum usuário encontrado.</div>
        )}
      </div>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95%] sm:max-w-md bg-white border-[#efe4cd] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#5c4d3c] font-serif">
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-gray-700">Nome Completo</Label>
              <Input 
                name="name" 
                defaultValue={editingUser?.name} 
                required 
                placeholder="Ex: João Silva"
                className="bg-white border-[#efe4cd] text-gray-800 focus-visible:ring-[#5c4d3c]"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-700">E-mail</Label>
              <Input 
                name="email" 
                type="email" 
                defaultValue={editingUser?.email} 
                required 
                placeholder="nome@empresa.com"
                className="bg-white border-[#efe4cd] text-gray-800 focus-visible:ring-[#5c4d3c]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Função (Role)</Label>
              <Select name="role" defaultValue={editingUser?.role || 'EMPLOYEE'}>
                <SelectTrigger className="bg-white border-[#efe4cd] text-gray-800 focus:ring-[#5c4d3c]">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#efe4cd]">
                  {currentUserRole === 'DEVELOPER' && (
                    <SelectItem value="DEVELOPER" className="focus:bg-[#f7f1e3] focus:text-[#5c4d3c]">Desenvolvedor (Acesso Total)</SelectItem>
                  )}
                  <SelectItem value="ADMIN" className="focus:bg-[#f7f1e3] focus:text-[#5c4d3c]">Administrador (Gestor)</SelectItem>
                  <SelectItem value="EMPLOYEE" className="focus:bg-[#f7f1e3] focus:text-[#5c4d3c]">Colaborador (Equipe)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">
                {editingUser ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
              </Label>
              <Input 
                name="password" 
                type="password" 
                required={!editingUser} 
                placeholder={editingUser ? "••••••••" : "Mínimo 6 caracteres"}
                className="bg-white border-[#efe4cd] text-gray-800 focus-visible:ring-[#5c4d3c]"
              />
            </div>

            <DialogFooter className="mt-6 gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-[#efe4cd] text-gray-600 hover:bg-[#f7f1e3]">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-[#5c4d3c] text-white hover:bg-[#4a3e30]">
                {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}