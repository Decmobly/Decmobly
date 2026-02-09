'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getCategoriesForMenu } from '../layout/actions';

type MenuCategory = { name: string; slug: string };

const navItems = [
  { name: 'Início', href: '/' },
  { name: 'Ambientes', href: '/ambientes', hasSubmenu: true },
  { name: 'Portfólio', href: '/portfolio' },
  { name: 'Sobre', href: '/sobre' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const pathname = usePathname();

  // 1. Otimização de Scroll e Fetch de Dados (Restaurado)
  useEffect(() => {
    getCategoriesForMenu().then(setCategories);

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Trava o scroll do corpo (Restaurado)
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  // 3. Fecha menu ao navegar (Restaurado)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
          isScrolled 
            ? "bg-white shadow-md py-2 border-stone-200" 
            : "bg-[#fdfbf7] py-4 border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-2xl text-[#5c4d3c] font-bold tracking-tight leading-none group-hover:text-stone-700 transition-colors">
              Decmobly
            </span>
            <span className="text-[10px] text-stone-500 uppercase tracking-[0.2em] font-sans font-bold">
              Móveis Planejados
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative group px-4 py-2">
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 text-[13px] font-bold tracking-wider uppercase transition-colors",
                    pathname === item.href ? "text-stone-900" : "text-stone-600 hover:text-stone-900"
                  )}
                >
                  {item.name}
                  {item.hasSubmenu && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />}
                </Link>

                {item.hasSubmenu && (
                  <div className="absolute top-full left-0 pt-3 w-64 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div className="bg-white border border-stone-200 shadow-xl rounded-sm overflow-hidden">
                      <div className="flex flex-col py-1">
                        {categories.length > 0 ? (
                          categories.map(cat => (
                            <Link 
                              key={cat.slug} 
                              href={`/ambientes/${cat.slug}`}
                              className="px-5 py-3 text-[13px] text-stone-600 hover:bg-stone-50 hover:text-stone-900 flex items-center justify-between group/item transition-colors border-b border-stone-50 last:border-0"
                            >
                              {cat.name}
                              <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                            </Link>
                          ))
                        ) : (
                          <span className="px-5 py-4 text-xs text-stone-400 italic">Carregando ambientes...</span>
                        )}
                      </div>
                      <Link href="/ambientes" className="block bg-[#5c4d3c] p-3 text-center text-[10px] font-bold text-white uppercase tracking-[0.2em] hover:bg-stone-800 transition-colors">
                        Ver Portfólio Completo
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <Button asChild className="hidden md:flex bg-[#5c4d3c] text-white hover:bg-stone-800 rounded-none px-8 font-bold uppercase text-[11px] tracking-[0.15em]">
            <a href="https://wa.me/5597984208329?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20um%20móvel%20personalizado." target="_blank">Solicitar Orçamento</a>
          </Button>

          {/* MOBILE TOGGLE */}
          <button 
            className="md:hidden p-2 text-stone-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar Menu" : "Abrir Menu"}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        
        <div className={cn(
          "absolute top-0 right-0 w-[80%] max-w-sm h-full bg-[#fdfbf7] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex-1 overflow-y-auto pt-28 px-8 pb-8">
            <nav className="flex flex-col space-y-8">
              {navItems.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <Link 
                    href={item.href}
                    className="text-2xl font-serif text-[#5c4d3c] font-bold flex items-center justify-between"
                  >
                    {item.name}
                  </Link>
                  {item.hasSubmenu && (
                    <div className="mt-4 ml-4 flex flex-col space-y-4 border-l-2 border-stone-200 pl-4">
                      {categories.map(cat => (
                        <Link key={cat.slug} href={`/ambientes/${cat.slug}`} className="text-stone-600 text-lg">
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="p-8 bg-white border-t border-stone-100">
            <Button asChild className="w-full bg-[#5c4d3c] py-7 text-lg">
              <a href="https://wa.me/5597984208329" className="text-white">Orçamentos</a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}