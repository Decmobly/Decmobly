// src/app/gestor/(admin)/_components/NotificationBellClient.tsx
'use client';

import { useState } from 'react';
import { Bell, RotateCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { getNotificationsForBell } from '../notification/actions';
import { toast } from 'sonner';

// Adicionei ScrollArea se estiver usando shadcn, senão div com overflow funciona
// import { ScrollArea } from "@/components/ui/scroll-area" 

type NotificationType = { 
  id: string; 
  title: string; 
  message: string; 
  createdAt: Date; 
  sender: { name: string | null } | null; 
};

interface NotificationBellClientProps { 
  initialNotifications: NotificationType[]; 
}

export function NotificationBellClient({ initialNotifications }: NotificationBellClientProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>(initialNotifications);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationType | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Verifica se há notificações para mostrar a bolinha
  const hasNotifications = notifications.length > 0;

  const handleNotificationClick = (notification: NotificationType) => {
    setSelectedNotification(notification);
    setIsPopoverOpen(false); 
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { notifications: newNotifications } = await getNotificationsForBell();
      setNotifications(newNotifications);
      toast.success("Atualizado!");
    } catch (error: any) { 
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao buscar.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative cursor-pointer text-[#5c4d3c] hover:text-[#3e342a] hover:bg-[#efe4cd] transition-colors h-10 w-10"
          >
            <Bell size={22} />
            {hasNotifications && (
               <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-[#fdfbf7] animate-pulse" />
            )}
          </Button>
        </PopoverTrigger>
        
        {/* POPOVER CONTENT RESPONSIVO 
            w-[90vw]: No mobile ocupa 90% da largura.
            sm:w-80: No desktop ocupa 320px fixos.
            mr-2: Margem direita para não colar na borda no mobile.
        */}
        <PopoverContent 
            className="w-[90vw] sm:w-80 p-0 bg-white border-[#efe4cd] shadow-xl z-50 mr-2 sm:mr-0" 
            align="end" 
            sideOffset={8}
        >
          <div className="flex flex-col max-h-[80vh]"> {/* Limite de altura para telas pequenas */}
            
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-[#efe4cd] bg-[#fdfbf7]">
                <h4 className="font-bold text-[#5c4d3c] font-serif">Mural de Avisos</h4>
                <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-[#5c4d3c] hover:bg-[#efe4cd]" 
                      onClick={handleRefresh} 
                      disabled={isRefreshing}
                      title="Atualizar"
                    >
                        <RotateCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    </Button>
                    {/* Botão fechar explícito ajuda no mobile */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-[#5c4d3c] md:hidden" 
                        onClick={() => setIsPopoverOpen(false)}
                    >
                        <X size={18} />
                    </Button>
                </div>
            </div>
            
            {/* Lista */}
            <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#efe4cd]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Bell size={32} className="text-[#efe4cd] mb-2 opacity-50" />
                      <p className="text-sm text-gray-400 font-sans">Nenhum aviso por enquanto.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#f7f1e3]">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        onClick={() => handleNotificationClick(notification)} 
                        className="flex flex-col gap-1 p-3 hover:bg-[#fdfbf7] active:bg-[#f7f1e3] cursor-pointer transition-colors group"
                      >
                        <div className="flex justify-between items-start gap-2">
                            <p className="text-sm font-bold text-[#5c4d3c] leading-tight font-serif group-hover:text-[#3e342a]">{notification.title}</p>
                            <span className="text-[9px] text-gray-400 whitespace-nowrap bg-gray-50 px-1.5 py-0.5 rounded-full border border-gray-100">
                                {new Date(notification.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 font-sans">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
            
            {/* Footer Opcional */}
            {notifications.length > 0 && (
                <div className="p-2 border-t border-[#efe4cd] bg-gray-50 text-center">
                    <span className="text-[10px] text-gray-400">Clique para ver detalhes</span>
                </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* DIALOG DE DETALHES (Mobile Friendly) */}
      <Dialog open={!!selectedNotification} onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}>
        {/* max-w-lg e w-[95%] garantem que caiba em qualquer tela */}
        <DialogContent className="w-[95%] max-w-lg bg-white border-[#efe4cd] text-gray-800 p-0 overflow-hidden rounded-xl">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-serif text-[#5c4d3c] pr-6 leading-snug">
                {selectedNotification?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="px-6 py-2 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#efe4cd]">
              <div className="prose prose-stone prose-sm max-w-none whitespace-pre-wrap text-gray-600 font-sans leading-relaxed">
                {selectedNotification?.message}
              </div>
          </div>

          <div className="bg-[#fdfbf7] border-t border-[#efe4cd] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-500 font-sans">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#5c4d3c]/50" />
                 <span>Enviado por: <span className="font-medium text-[#5c4d3c]">{selectedNotification?.sender?.name || 'Sistema'}</span></span>
              </div>
              <span className="text-[10px] uppercase tracking-wider opacity-70">
                {selectedNotification && new Date(selectedNotification.createdAt).toLocaleString('pt-BR')}
              </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}