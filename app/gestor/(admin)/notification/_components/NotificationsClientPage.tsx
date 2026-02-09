// src/app/gestor/(admin)/notifications/_components/NotificationsClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import type { User, Notification } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send, Trash2, Calendar, User as UserIcon } from 'lucide-react';
import { sendNotificationAction, deleteNotificationAction } from '../actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos simplificados para o Mural
type NotificationWithSender = Notification & {
  sender: { name: string | null } | null;
};

// --- Subcomponente do Formulário ---
function SendNotificationForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    setIsLoading(true);

    const formData = new FormData(formRef.current);

    toast.promise(sendNotificationAction(formData), {
      loading: 'Publicando aviso...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        onFormSubmit();
        return result.message;
      },
      error: (error) => error.message,
    });
    
    setIsLoading(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-gray-700">Título</Label>
        <Input 
            id="title" 
            name="title" 
            required 
            placeholder="Ex: Reunião Geral"
            className="bg-white border-[#efe4cd] text-gray-800 focus-visible:ring-[#5c4d3c]" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700">Mensagem</Label>
        <Textarea 
            id="message" 
            name="message" 
            required 
            rows={5} 
            placeholder="Digite o conteúdo do aviso..."
            className="bg-white border-[#efe4cd] text-gray-800 focus-visible:ring-[#5c4d3c]" 
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <DialogClose asChild><Button type="button" variant="outline" className="border-[#efe4cd] text-gray-600 hover:bg-[#f7f1e3]">Cancelar</Button></DialogClose>
        <Button type="submit" disabled={isLoading} className="bg-[#5c4d3c] text-white hover:bg-[#4a3e30]">
            {isLoading ? 'Enviando...' : 'Publicar Aviso'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- Componente Principal da Página ---
export function NotificationsClientPage({
  initialNotifications,
  currentUser,
}: {
  initialNotifications: NotificationWithSender[];
  currentUser: User;
}) {
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [readingNotification, setReadingNotification] = useState<NotificationWithSender | null>(null);

  const handleDelete = (notificationId: string) => {
    toast.promise(deleteNotificationAction(notificationId), {
      loading: 'Removendo aviso...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  // Botão de Excluir Reutilizável
  const DeleteButton = ({ notification }: { notification: NotificationWithSender }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
          disabled={currentUser.role !== 'DEVELOPER' && notification.senderId !== currentUser.id}
          onClick={(e) => e.stopPropagation()} // Impede abrir o modal de leitura
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[90%] sm:w-full bg-white border-[#efe4cd] rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#5c4d3c]">Remover aviso?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500">
              Isso removerá o aviso do mural de todos os usuários permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="border-[#efe4cd] text-gray-600 mt-0">Cancelar</AlertDialogCancel>
          <AlertDialogAction 
              onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(notification.id);
              }}
              className="bg-red-600 text-white hover:bg-red-700"
          >
              Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    // Padding top adicionado para mobile header fixo
    <div className="space-y-6 animate-in fade-in duration-500 pt-20 md:pt-0 pb-20 md:pb-0">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#5c4d3c]">Mural de Avisos</h1>
          <p className="text-gray-500 text-sm md:text-base">Publique comunicados para toda a equipe.</p>
        </div>
        
        {/* Botão de Envio */}
        <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-[#5c4d3c] text-white hover:bg-[#4a3e30] shadow-md transition-all active:scale-95">
              <Send size={18} className="mr-2" />
              Novo Aviso
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] sm:max-w-lg max-h-[90vh] flex flex-col bg-white border-[#efe4cd] rounded-xl">
            <DialogHeader>
                <DialogTitle className="text-[#5c4d3c] font-serif">Novo Aviso</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto pr-2">
                <SendNotificationForm onFormSubmit={() => setIsSendOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- VERSÃO MOBILE: CARDS (Visível apenas em < md) --- */}
      <div className="md:hidden space-y-3">
        {initialNotifications.map((notification) => (
            <div 
                key={notification.id}
                onClick={() => setReadingNotification(notification)}
                className="bg-white border border-[#efe4cd] rounded-lg p-4 shadow-sm active:bg-[#fdfbf7] transition-colors relative"
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#5c4d3c] text-lg pr-8 leading-tight">{notification.title}</h3>
                    {/* Posicionamento absoluto do botão de excluir no card mobile */}
                    <div className="absolute top-3 right-2">
                        <DeleteButton notification={notification} />
                    </div>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 font-sans">
                    {notification.message}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-[#f7f1e3]">
                    <div className="flex items-center gap-1">
                        <UserIcon size={12} />
                        <span>{notification.sender?.name || 'Sistema'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{format(new Date(notification.createdAt), "dd/MM", { locale: ptBR })}</span>
                    </div>
                </div>
            </div>
        ))}
         {initialNotifications.length === 0 && (
          <div className="text-center p-8 bg-white rounded-lg border border-[#efe4cd] border-dashed">
             <p className="text-gray-400 text-sm">Nenhum aviso.</p>
          </div>
        )}
      </div>

      {/* --- VERSÃO DESKTOP: TABELA (Visível apenas em >= md) --- */}
      <div className="hidden md:block border border-[#efe4cd] rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f7f1e3]">
            <TableRow className="border-[#efe4cd] hover:bg-[#f7f1e3]">
              <TableHead className="text-[#5c4d3c] font-bold w-[40%]">Título</TableHead>
              <TableHead className="text-[#5c4d3c] font-bold">Enviado por</TableHead>
              <TableHead className="text-[#5c4d3c] font-bold">Data</TableHead>
              <TableHead className="text-right text-[#5c4d3c] font-bold">Ações</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialNotifications.map((notification) => (
              <TableRow 
                key={notification.id} 
                className="border-[#efe4cd] cursor-pointer hover:bg-[#fdfbf7] transition-colors"
                onClick={() => setReadingNotification(notification)} 
              >
                <TableCell className="font-medium text-gray-800">{notification.title}</TableCell>
                <TableCell className="text-gray-600">{notification.sender?.name || 'Sistema'}</TableCell>
                <TableCell className="text-xs text-gray-500">
                  {format(new Date(notification.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                   <DeleteButton notification={notification} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {initialNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-gray-400">
              <p className="text-sm">O mural está vazio.</p>
          </div>
        )}
      </div>

      {/* MODAL DE LEITURA (Responsivo) */}
      <Dialog open={!!readingNotification} onOpenChange={(isOpen) => !isOpen && setReadingNotification(null)}>
        <DialogContent className="w-[95%] sm:max-w-lg max-h-[90vh] flex flex-col bg-white border-[#efe4cd] rounded-xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-serif text-[#5c4d3c]">{readingNotification?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="px-6 py-2 overflow-y-auto max-h-[60vh]">
             <div className="prose prose-stone prose-sm max-w-none whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                {readingNotification?.message}
             </div>
          </div>

          <div className="bg-[#fdfbf7] border-t border-[#efe4cd] px-6 py-4 mt-auto flex justify-between items-center text-xs text-gray-500">
             <span className="font-medium text-[#5c4d3c]">
                Enviado por: {readingNotification?.sender?.name || 'Sistema'}
             </span>
             <span className="opacity-70">
                {readingNotification && format(new Date(readingNotification.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
             </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}