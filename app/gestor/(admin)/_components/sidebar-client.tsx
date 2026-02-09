'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, type ElementType, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { LogoutButton } from './logout-button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Menu, X, ChevronRight } from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface MenuItem { 
  href?: string; 
  icon: IconName; 
  label: string; 
  subItems?: Omit<MenuItem, 'subItems'>[];
}

interface NavItemProps { 
  href: string; 
  icon: ElementType; 
  label: string; 
  isCollapsed: boolean; 
  onClick?: () => void; 
}

interface SidebarClientProps { 
  user: Session['user']; 
  menuItems: MenuItem[]; 
  children: ReactNode; // Aqui entra o slot da Notificação
  isCollapsed: boolean; 
  toggleSidebar: () => void; 
}

// --- Componente de Item de Menu ---
const NavItem = ({ href, icon: Icon, label, isCollapsed, onClick }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href; 

  // Cores de Alto Contraste (Marrom e Creme)
  const activeClass = "bg-[#5c4d3c] text-white shadow-md font-semibold";
  const inactiveClass = "text-[#5c4d3c] hover:bg-[#efe4cd] hover:text-[#3e342a] font-medium";

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link 
              href={href} 
              className={`flex items-center justify-center h-10 w-10 mx-auto rounded-lg transition-all duration-200 ${isActive ? activeClass : inactiveClass}`}
            >
              <Icon size={22} />
              <span className="sr-only">{label}</span>
            </Link>
          </TooltipTrigger>
          {/* Tooltip sem seta, flutuando ao lado */}
          <TooltipContent side="right" sideOffset={10} className="bg-[#5c4d3c] text-white border-none shadow-xl z-50">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? activeClass : inactiveClass}`}
    >
      <Icon size={20} className="shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
};

// --- Componente Principal ---
export const SidebarClient = ({ user, menuItems, children, isCollapsed, toggleSidebar }: SidebarClientProps) => {
  const firstName = user?.name?.split(' ')[0] || 'Usuário';
  const role = "Administrador"; // Pode vir via props se necessário
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(pathname.startsWith('/gestor/site') ? 'Gerenciar Site' : '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCollapsedItemClick = (itemLabel: string) => {
    if (window.innerWidth >= 768) {
        toggleSidebar();
    }
    setOpenMenu(itemLabel);
  };

  // Renderização Recursiva do Menu
  const renderMenuContent = (mobileMode = false) => (
    <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-[#efe4cd] scrollbar-track-transparent pr-1 mt-4">
        {menuItems.map((item: MenuItem) => {
          const Icon = (LucideIcons[item.icon] || LucideIcons.HelpCircle) as ElementType;
          
          // Desktop Colapsado
          if (item.subItems && isCollapsed && !mobileMode) {
            return (
              <TooltipProvider key={item.label} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleCollapsedItemClick(item.label)}
                      className="flex items-center justify-center h-10 w-10 mx-auto rounded-lg transition-colors text-[#5c4d3c] hover:bg-[#efe4cd] cursor-pointer"
                    >
                      <Icon size={22} />
                      <span className="sr-only">{item.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10} className="bg-[#5c4d3c] text-white border-none shadow-xl z-50">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          // Submenu Expandido (Mobile ou Desktop Aberto)
          if (item.subItems && (!isCollapsed || mobileMode)) {
            return (
              <Collapsible 
                key={item.label} 
                className="space-y-1"
                open={openMenu === item.label}
                onOpenChange={(isOpen) => setOpenMenu(isOpen ? item.label : '')}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg transition-colors text-[#5c4d3c] hover:bg-[#efe4cd] group font-bold cursor-pointer">
                  <div className="flex items-center gap-3"><Icon size={20} />{item.label}</div>
                  <LucideIcons.ChevronDown size={16} className={`transition-transform duration-200 ${openMenu === item.label ? 'rotate-180' : ''} text-[#5c4d3c]/70`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-2 space-y-1 ml-2 border-l-2 border-[#efe4cd] animate-in slide-in-from-top-2 duration-200">
                  {item.subItems.map(subItem => {
                    const SubIcon = (LucideIcons[subItem.icon] || LucideIcons.HelpCircle) as ElementType;
                    return <NavItem key={subItem.href!} href={subItem.href!} icon={SubIcon} label={subItem.label} isCollapsed={false} onClick={() => setIsMobileMenuOpen(false)} />
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          }

          return <NavItem key={item.href || item.label} href={item.href || '#'} icon={Icon} label={item.label} isCollapsed={isCollapsed && !mobileMode} onClick={() => setIsMobileMenuOpen(false)} />;
        })}
    </nav>
  );

  return (
    <>
      {/* ========================================================
          MOBILE HEADER FIXO 
          (inset-x-0 e z-50 evitam tremedeira ao rolar)
         ======================================================== */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-[#fdfbf7] border-b border-[#efe4cd] flex items-center justify-between px-4 z-50 shadow-sm transition-transform duration-200">
        <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="text-[#5c4d3c] hover:bg-[#efe4cd]">
                 <Menu size={28} />
             </Button>
             <span className="font-serif font-bold text-[#5c4d3c] text-xl">Painel Gestor</span>
        </div>
        
        <div className="flex items-center gap-3">
             {/* Componente de Notificação (Sino) Renderizado Aqui */}
             {children} 
             
             <Link href="/gestor/perfil" className="w-10 h-10 rounded-full bg-[#efe4cd] border-2 border-[#5c4d3c] overflow-hidden relative shadow-sm shrink-0">
                {user?.image ? (
                    <Image src={user.image} alt="Perfil" fill className="object-cover" />
                ) : (
                    <LucideIcons.User className="w-full h-full p-2 text-[#5c4d3c]" />
                )}
            </Link>
        </div>
      </div>

      {/* ========================================================
          MOBILE DRAWER (MENU LATERAL)
         ======================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 md:hidden flex justify-start">
             {/* Backdrop escuro - overscroll-contain evita rolar o fundo */}
             <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300 overscroll-contain" onClick={() => setIsMobileMenuOpen(false)} />
             
             {/* Drawer Branco Sólido/Leve Transparência */}
             <div className="relative w-[85%] max-w-xs h-full bg-[#fdfbf7] shadow-2xl p-4 flex flex-col animate-in slide-in-from-left duration-300 border-r border-[#efe4cd]">
                 
                 {/* Header do Drawer */}
                 <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#efe4cd] shrink-0">
                     <span className="font-serif font-bold text-[#5c4d3c] text-lg">Menu</span>
                     <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-[#5c4d3c]">
                         <X size={24} />
                     </Button>
                 </div>
                 
                 {/* PERFIL MOBILE COMPACTO E CLICÁVEL */}
                 <Link href="/gestor/perfil" onClick={() => setIsMobileMenuOpen(false)} className="block mb-6 shrink-0">
                    <div className="flex items-center gap-3 p-3 bg-white border border-[#efe4cd] rounded-xl shadow-sm hover:bg-[#efe4cd]/30 transition-colors cursor-pointer group">
                        {/* Foto */}
                        <div className="w-12 h-12 rounded-full bg-[#efe4cd] border border-[#5c4d3c] overflow-hidden relative shrink-0">
                            {user?.image ? <Image src={user.image} alt="Perfil" fill className="object-cover" /> : <LucideIcons.User className="w-full h-full p-2 text-[#5c4d3c]" />}
                        </div>
                        
                        {/* Texto */}
                        <div className="overflow-hidden flex-1">
                            <p className="font-bold text-[#5c4d3c] text-sm truncate group-hover:text-black transition-colors">{firstName}</p>
                            <span className="text-[10px] text-[#5c4d3c] font-medium mt-0.5 flex items-center gap-1 uppercase tracking-wide">
                                Editar Perfil <ChevronRight size={10} />
                            </span>
                        </div>
                    </div>
                 </Link>

                 {/* Lista de Links (com Scroll Independente) */}
                 <div className="flex-1 overflow-y-auto min-h-0">
                    {renderMenuContent(true)}
                 </div>

                 {/* Footer do Drawer */}
                 <div className="mt-4 border-t border-[#efe4cd] pt-4 shrink-0">
                     <LogoutButton />
                 </div>
             </div>
        </div>
      )}

      {/* ========================================================
          DESKTOP SIDEBAR FIXA
          fixed top-0 bottom-0: Garante altura total fixa na janela
         ======================================================== */}
      <aside className={`hidden md:flex fixed top-0 left-0 bottom-0 bg-[#fdfbf7] h-screen flex-col border-r border-[#efe4cd] transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'w-20 p-3' : 'w-64 p-5'}`}>
        
        {/* Header da Sidebar */}
        <div className={`mb-6 shrink-0 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <DropdownMenu>
            <DropdownMenuTrigger 
              className={`flex items-center gap-3 min-w-0 hover:bg-[#efe4cd] transition-colors text-left outline-none w-full cursor-pointer
                          ${isCollapsed ? 'justify-center rounded-full h-12 w-12' : 'p-2.5 rounded-xl border border-[#efe4cd] bg-white shadow-sm'}`}
            >
                <div className="w-10 h-10 rounded-full border border-[#efe4cd] bg-[#efe4cd] flex items-center justify-center overflow-hidden shrink-0 relative text-[#5c4d3c]">
                  {user?.image ? (
                     <Image src={user.image} alt="Perfil" fill className="object-cover" sizes="40px" />
                  ) : (
                     <LucideIcons.User size={20} />
                  )}
                </div>
                {!isCollapsed && (
                    <div className="overflow-hidden flex-1">
                        <div className="min-w-0">
                            <p className="font-bold text-[#5c4d3c] truncate text-sm">{firstName}</p>
                            <p className="text-xs text-gray-500 truncate">Ver perfil</p>
                        </div>
                    </div>
                )}
                 {!isCollapsed && <LucideIcons.ChevronDown size={14} className="ml-auto text-[#5c4d3c] shrink-0" />}
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-56 bg-white border-[#efe4cd] text-[#5c4d3c] shadow-xl z-50" side={isCollapsed ? "right" : "bottom"} align="start">
                <DropdownMenuItem className="focus:bg-[#efe4cd] focus:text-[#5c4d3c] cursor-pointer" asChild>
                  <Link href="/gestor/perfil"><LucideIcons.UserCog size={16} className="mr-2" />Editar Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#efe4cd]" />
                <DropdownMenuItem 
                  onSelect={() => signOut({ callbackUrl: '/gestor/login' })} 
                  className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                >
                  <LogoutButton asMenuItem />
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Links de Navegação (Scroll APENAS aqui dentro) */}
        {renderMenuContent(false)}

        {/* Footer da Sidebar */}
        <div className="mt-auto pt-4 pb-2 border-t border-[#efe4cd] flex flex-col items-center shrink-0">
          <div className={`flex items-center justify-center gap-3 ${isCollapsed ? 'flex-col gap-4 mb-2' : 'flex-row w-full justify-between px-2'}`}>
             <Button 
               variant="ghost" 
               size="icon" 
               onClick={toggleSidebar} 
               className="text-[#5c4d3c] hover:bg-[#efe4cd] cursor-pointer"
             >
                 {isCollapsed ? <LucideIcons.ChevronsRight size={20} /> : <LucideIcons.ChevronsLeft size={20} />}
             </Button>

             <div className="text-[#5c4d3c] flex items-center justify-center relative">
                {children}
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};