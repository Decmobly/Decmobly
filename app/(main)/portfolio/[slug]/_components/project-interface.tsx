'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Palette, Layers, Share2, MessageCircle, ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProjectInterface({ project, techSpecs }: { project: any, techSpecs: any[] }) {
  const images = project.images || [];
  const [selectedImage, setSelectedImage] = useState(images[0] || { url: '' });
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  if (images.length === 0) return <div className="p-20 text-center">Nenhuma imagem encontrada.</div>;

  const canNext = startIndex + itemsPerPage < images.length;
  const canPrev = startIndex > 0;

  return (
    <div className="animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <section className="relative pt-32 pb-12 px-6 bg-[#f7f1e3]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-4">
              <nav className="text-[10px] font-black tracking-[0.2em] uppercase text-stone-400 flex items-center gap-2">
                <Link href="/" className="hover:text-stone-900 transition-colors">Início</Link>
                <span className="text-stone-300">/</span>
                <Link href="/portfolio" className="hover:text-stone-900 transition-colors">Portfólio</Link>
                <span className="text-stone-300">/</span>
                <span className="text-[#5c4d3c]">{project.title}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-serif font text-[#5c4d3c] leading-[0.9]">
                {project.h1Title}
              </h1>
              {project.location && (
                <div className="flex items-center text-stone-500 text-sm font-medium">
                  <MapPin size={16} className="mr-2 text-[#c4a986]" />
                  {project.location}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Button onClick={() => window.open(`https://wa.me/?text=Olha%20esse%20projeto%20de%20${project.title} da *Decmobly*. Acesse em ${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`)} variant="outline" className="flex-1 md:flex-none h-12 border-stone-300 text-stone-600 hover:bg-stone-200 transition-all rounded-none font-bold text-[11px] uppercase tracking-widest">
                <Share2 size={16} className="mr-2" /> Compartilhar
              </Button>
              <Button onClick={() => window.open(`https://wa.me/5597984208329?text=Vi esse projeto de "${project.title}" em "${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}" e quero um similar.`)} variant="outline" className="flex-1 md:flex-none h-12 bg-[#5c4d3c] text-white hover:bg-stone-800 rounded-none font-bold text-[11px] uppercase tracking-widest">
                  <MessageCircle size={16} className="mr-2" /> Solicitar Similar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* GALERIA */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-6">
            <div className="relative w-full aspect-4/3 md:aspect-16/10 bg-white border border-stone-200 overflow-hidden flex items-center justify-center">
              {images.map((img: any) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={project.title}
                  className={cn(
                    "absolute inset-0 w-full h-full object-contain p-4 md:p-8 transition-opacity duration-500",
                    selectedImage.id === img.id ? "opacity-100 z-10" : "opacity-0 z-0"
                  )}
                />
              ))}
            </div>
            
            {/* MINIATURAS */}
            <div className="relative flex items-center px-1">
              {images.length > itemsPerPage && (
                <>
                  <button onClick={() => setStartIndex(s => Math.max(0, s-1))} className={cn("absolute -left-2 z-20 p-2 bg-white shadow-md rounded-full border border-stone-100", !canPrev && "opacity-0")}><ChevronLeft size={18} /></button>
                  <button onClick={() => setStartIndex(s => s+1)} className={cn("absolute -right-2 z-20 p-2 bg-white shadow-md rounded-full border border-stone-100", !canNext && "opacity-0")}><ChevronRight size={18} /></button>
                </>
              )}
              <div className="overflow-hidden w-full">
                <div 
                  className="flex gap-4 transition-transform duration-500"
                  style={{ transform: `translateX(-${startIndex * (100 / itemsPerPage)}%)` }}
                >
                  {images.map((img: any) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className={cn(
                        "relative flex-none aspect-square rounded-sm overflow-hidden border-2 transition-all",
                        selectedImage.id === img.id ? "border-stone-800 scale-95" : "border-transparent opacity-40 hover:opacity-100"
                      )}
                      style={{ width: `calc(${100 / itemsPerPage}% - 12px)` }}
                    >
                      <img src={img.url} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* CTA DESKTOP */}
            <div className="hidden lg:block pt-8">
              <div className="bg-[#5c4d3c] p-10 text-center space-y-6">
                <h4 className="text-2xl font-serif font-bold text-white tracking-tight">Gostou deste ambiente?</h4>
                <Button asChild className="w-full bg-[#efe4cd] text-stone-900 hover:bg-white rounded-none font-bold uppercase text-[10px] tracking-widest h-14">
                  <a href={`https://wa.me/5597984208329?text=Olá%20gostaria%20de%20realizar%20um%20orçamento.`}><CalendarCheck size={16} className="mr-2" /> Solicitar orçamento</a>
                </Button>
              </div>
            </div>
          </div>

          {/* TEXTO E ESPECIFICAÇÕES */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-stone-900 border-l-4 border-[#c4a986] pl-4">
                {project.h2Title || "Sobre o Projeto"}
              </h2>
              <p className="text-stone-500 leading-relaxed font-light whitespace-pre-wrap">{project.description}</p>
            </div>

            {project.colorPalette && (
              <div className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5c4d3c] flex items-center"><Palette size={14} className="mr-2" /> Paleta de cores</h3>
                <p className="text-stone-600 font-serif italic pl-4 border-l border-stone-200">{project.colorPalette}</p>
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5c4d3c] flex items-center"><Layers size={14} className="mr-2" /> Especificações Técnicas</h3>
              <table className="w-full text-sm">
                <tbody>
                  {techSpecs.map((spec, idx) => (
                    <tr key={idx} className="border-b border-stone-100">
                      <td className="py-4 pr-4 font-bold text-[#5c4d3c] text-[10px] uppercase tracking-widest w-1/3">{spec.title}</td>
                      <td className="py-4 text-stone-500 font-light">{spec.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            
          </div>
        </div>
      </section>
    </div>
  );
}