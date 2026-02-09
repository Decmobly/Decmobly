export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image'; // 1. Importação do componente Image
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Ruler, Clock, ShieldCheck, LayoutTemplate, Quote, CalendarCheck, MessageCircle } from 'lucide-react';
import { Metadata } from 'next';
// 2. Importação dos tipos do Prisma para eliminar o "any"
import type { Category, Project } from '@prisma/client';

// 3. Definição de tipo auxiliar para o projeto com as relações (includes)
type ProjectImage = {
  id: string;
  url: string;
  projectId: string;
};

type FeaturedProject = Project & {
  category: Category;
  images: ProjectImage[];
};

const testimonials = [
  { name: "Ana Souza", comment: "Transformaram minha cozinha! O acabamento é impecável e o prazo foi cumprido rigorosamente.", stars: 5 },
  { name: "Roberto Lima", comment: "Profissionais excelentes. O projeto ficou exatamente como eu imaginava, super funcional.", stars: 5 },
  { name: "Carla Mendes", comment: "Atendimento nota 10 desde o primeiro contato até a instalação. Recomendo muito!", stars: 5 },
];

const steps = [
  { num: "01", title: "Atendimento", desc: "Briefing detalhado sobre suas necessidades." },
  { num: "02", title: "Medição", desc: "Levantamento técnico preciso no local." },
  { num: "03", title: "Projeto", desc: "Visualização do seu sonho." },
  { num: "04", title: "Aprovação", desc: "Ajustes finais e escolha de materiais." },
  { num: "05", title: "Fabricação", desc: "Produção de alta precisão." },
  { num: "06", title: "Instalação", desc: "Montagem rápida e organizada." },
];

export const metadata: Metadata = {
  title: 'Móveis Planejados em Manaus',
  description: 'Transforme seu lar com móveis sob medida. Design exclusivo, acabamento premium e entrega pontual. Manaus e região.',
};

export default async function HomePage() {
  // MANTIDO: Integrações com Backend
  const featuredProjects = await prisma.project.findMany({
    where: { isFeatured: true },
    take: 3,
    orderBy: { updatedAt: 'desc' },
    include: {
      category: true,
      images: { take: 1 },
    },
  });

  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: { name: 'asc' },
  });

  return (
    <main className="min-h-screen bg-white selection:bg-stone-800 selection:text-stone-100">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-auto w-full flex flex-col lg:flex-row items-stretch overflow-hidden bg-[#5c4d3c]">
        
        {/* --- IMAGEM / BACKGROUND --- */}
        <div className="absolute inset-0 z-0 lg:relative lg:w-1/2 lg:order-2 lg:h-auto lg:max-h-200">
          {/* CORREÇÃO 1: Next/Image com fill e priority */}
          <Image 
            src="/hero-section.jpeg" 
            alt="Cozinha com móveis planejados em Manaus" 
            fill
            priority
            className="object-cover transition-transform duration-[10s] hover:scale-110 ease-out"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          
          {/* Overlay Mobile */}
          <div className="absolute inset-0 bg-black/60 lg:hidden" />
          
          {/* Overlay Desktop */}
          <div className="hidden lg:block absolute inset-0 bg-linear-to-t from-stone-950/50 to-transparent" />
        </div>

        {/* --- CONTEÚDO / TEXTO --- */}
        <div className="relative z-10 w-full flex flex-col justify-center px-6 pt-32 pb-20 lg:w-1/2 lg:order-1 lg:px-20 lg:pt-32 lg:pb-12 lg:justify-start lg:bg-[#5c4d3c]">
          <div className="max-w-5xl mx-auto lg:mx-0 space-y-8 text-center lg:text-left">
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-serif font-bold text-white leading-[1.1] tracking-tight">
                Design que conta a <br />
                <span className="italic font-light text-stone-200">sua história</span>
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-stone-200/90 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Criamos ambientes que unem a precisão tecnológica ao toque artesanal. Sofisticação e funcionalidade em cada milímetro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button asChild className="h-16 px-10 text-xs uppercase tracking-widest bg-[#efe4cd] text-stone-900 hover:bg-white transition-all font-bold rounded-none">
                <a href="https://wa.me/5597984208329">Solicitar Orçamento</a>
              </Button>
              <Button asChild variant="outline" className="h-16 px-10 text-xs uppercase tracking-widest border-white/40 text-white hover:bg-white hover:text-stone-900 bg-transparent transition-all font-bold rounded-none">
                <Link href="/portfolio">Ver Portfólio</Link>
              </Button>
            </div>

          </div>
        </div>

      </section>

      {/* ================= CATEGORIAS (Grid Refinado) ================= */}
      <section className="relative z-20 px-4 md:px-10 lg:px-40 items-center max-w-7xl mx-auto -mt-10 lg:-mt-8 mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          {/* CORREÇÃO 2: Tipagem correta (Category) */}
          {categories.map((cat: Category) => (
            <Link 
              key={cat.id} 
              href={`/ambientes/${cat.slug}`} 
              className="group w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)]"
            >
              <div className="bg-white p-8 border border-stone-200 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 text-center h-full flex flex-col justify-center items-center">
                <LayoutTemplate size={24} className="mx-auto mb-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
                <h3 className="font-serif font-bold text-stone-800 text-lg mb-1">{cat.name}</h3>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Explorar</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= PROJETOS EM DESTAQUE ================= */}
      {featuredProjects.length > 0 && (
        <section className="py-10 md:py-14 px-4 md:px-6 max-w-7xl mx-auto"> 
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 border-b border-stone-100 pb-6 md:pb-8">
            <div className="space-y-2">
              <span className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.3em]">Portfólio Selecionado</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#5c4d3c]">Projetos em Destaque</h2>
            </div>
            
            <Link href="/portfolio" className="hidden md:flex items-center text-[#5c4d3c] font-bold hover:text-stone-500 transition-colors group text-[11px] uppercase tracking-widest">
              Ver Coleção Completa <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-12">
            {/* CORREÇÃO 3: Tipagem correta (FeaturedProject) */}
            {featuredProjects.map((project: FeaturedProject) => (
              <Link key={project.id} href={`/portfolio/${project.slug}`} className="group block h-full">
                <article className="flex flex-col h-full space-y-3 md:space-y-6">
                  
                  {/* IMAGEM DO PROJETO */}
                  <div className="relative aspect-4/5 md:aspect-3/4 overflow-hidden bg-stone-100 shadow-sm md:shadow-inner group-hover:shadow-md transition-all">
                    {project.images[0] ? (
                      /* CORREÇÃO 4: Next/Image com fill */
                      <Image 
                        src={project.images[0].url} 
                        alt={String(project.title)}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#5c4d3c] text-xs">Sem Imagem</div>
                    )}
                    
                    <div className="absolute top-3 left-3 md:top-6 md:left-6 bg-white px-2 py-1 md:px-3 md:py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#5c4d3c] shadow-sm z-10">
                      {project.category.name}
                    </div>
                  </div>
                  
                  <div className="flex flex-col grow space-y-2 md:space-y-3">
                    <h3 className="text-base md:text-2xl font-serif font-bold text-[#5c4d3c] group-hover:text-stone-600 transition-colors leading-tight">
                      {project.title}
                    </h3>
                    
                    <p className="hidden md:block text-stone-500 line-clamp-2 text-sm leading-relaxed font-light">
                      {project.shortDesc}
                    </p>
                    
                    <div className="pt-1 md:pt-2 mt-auto">
                      <span className="text-[9px] md:text-[10px] font-bold text-[#5c4d3c] border-b md:border-b-2 border-[#5c4d3c] pb-0.5 md:pb-1 group-hover:border-stone-400 group-hover:text-stone-400 transition-all uppercase tracking-widest">
                        Ver Projeto
                      </span>
                    </div>
                  </div>

                </article>
              </Link>
            ))}
          </div>

          <div className="md:hidden mt-10 flex justify-center">
            <Link href="/portfolio" className="inline-flex items-center text-stone-900 font-bold border border-stone-200 px-6 py-3 rounded-full text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-colors">
              Ver Coleção Completa
            </Link>
          </div>

        </section>
      )}

      {/* ================= DIFERENCIAIS (Design Clean) ================= */}
      <section className="py-24 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            {[
                { icon: Ruler, title: "Precisão Sob Medida", text: "Aproveitamento inteligente de cada centímetro." },
                { icon: ShieldCheck, title: "Durabilidade", text: "Ferragens e acabamentos de padrão internacional." },
                { icon: Star, title: "Montagem Própria", text: "Equipe técnica especializada e treinada internamente." },
                { icon: Clock, title: "Pontualidade", text: "Cronograma levado a sério, do projeto à entrega." }
            ].map((item, idx) => (
                <div key={idx} className="space-y-4">
                    <item.icon size={28} className="text-stone-400" strokeWidth={1.2} />
                    <h3 className="font-bold text-stone-900 uppercase text-xs tracking-widest">{item.title}</h3>
                    <p className="text-sm text-stone-500 leading-relaxed font-light">{item.text}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASSO A PASSO */}
      <section className="py-16 md:py-24 bg-[#5c4d3c] text-[#fdfbf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[#efe4cd] text-xs font-bold uppercase tracking-widest block mb-3 opacity-80">
              Processo Produtivo
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              Como nasce seu móvel sob medida
            </h2>
            <p className="text-[#efe4cd]/70 max-w-2xl mx-auto text-base leading-relaxed">
              Do primeiro rascunho à instalação final, cuidamos de cada etapa com precisão milimétrica.
            </p>
          </div>

          {/* WRAPPER GERAL DOS PASSOS */}
          <div className="w-auto mx-auto">

            {/* MOBILE TIMELINE */}
            <div className="md:hidden relative border-l border-[#efe4cd]/20 ml-6 space-y-10 my-4">
              {steps.map((step, idx) => (
                <div key={idx} className="relative pl-10">
                  <div className="absolute -left-6.25 top-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#efe4cd] text-[#5c4d3c] font-bold text-lg shadow-lg border-4 border-[#5c4d3c]">
                    {step.num}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-serif font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-[#efe4cd]/70 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP HORIZONTAL TIMELINE */}
            <div className="hidden md:block relative w-full h-90 my-auto">
              
              {/* Linha Central Horizontal */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-[#efe4cd]/20 -translate-y-1/2 rounded-full"></div>

              {/* Container dos Items */}
              <div className="flex justify-between items-center w-full h-full relative">
                {steps.map((step, idx) => {
                  const isTop = idx % 2 === 0;
                  
                  return (
                    <div key={idx} className="relative flex-1 h-full group">
                      
                      {/* O CARD */}
                      <div className={`absolute left-0 right-0 w-[90%] mx-auto p-6 border border-[#efe4cd]/10  bg-[#5c4d3c] hover:bg-[#fdfbf7]/5 transition-all duration-300 hover:shadow-xl hover:border-[#efe4cd]/30 z-10
                        ${isTop 
                          ? 'bottom-1/2 mb-10 hover:-translate-y-2' 
                          : 'top-1/2 mt-10 hover:translate-y-2' 
                        }
                      `}>
                        <h3 className="text-xl font-serif font-bold mb-2 text-white group-hover:text-[#efe4cd] transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-[#efe4cd]/70 leading-relaxed group-hover:text-[#efe4cd]/90 transition-colors">
                          {step.desc}
                        </p>
                        
                        {/* Seta do Card */}
                        <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#5c4d3c] border-r border-b border-[#efe4cd]/10 transform rotate-45
                           ${isTop ? '-bottom-2.5' : '-top-2.5 border-r-0 border-b-0 border-l border-t'}
                        `}></div>
                      </div>

                      {/* A LINHA CONECTORA VERTICAL */}
                      <div className={`absolute left-1/2 -translate-x-1/2 w-px bg-[#efe4cd]/40 group-hover:bg-[#efe4cd] transition-colors duration-300
                        ${isTop 
                          ? 'bottom-1/2 h-10 mb-0' 
                          : 'top-1/2 h-10 mt-0' 
                        }
                      `}></div>

                      {/* A BOLINHA CENTRAL */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="w-12 h-12 rounded-full bg-[#efe4cd] text-[#5c4d3c] flex items-center justify-center font-bold text-lg shadow-md border-4 border-[#5c4d3c] group-hover:scale-110 transition-transform duration-300">
                          {step.num}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= AVALIAÇÕES ================= */}
      <section className="py-16 md:py-24 bg-white border-b border-[#efe4cd]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
             <span className="text-[#c4a986] font-bold text-xs uppercase tracking-widest">Depoimentos</span>
             <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#5c4d3c] mt-2">O que dizem nossos clientes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="relative p-8 rounded-xl bg-[#fdfbf7] border border-[#efe4cd] hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <Quote size={40} className="absolute top-6 right-6 text-[#5c4d3c]/10" />
                
                <div className="flex gap-1 mb-6 text-yellow-500">
                  {[...Array(t.stars)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                
                {/* CORREÇÃO 5: Aspas escapadas */}
                <p className="text-gray-600 italic mb-6 leading-relaxed flex-1">
                  &ldquo;{t.comment}&rdquo;
                </p>
                
                <div className="mt-auto pt-4 border-t border-[#efe4cd]/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#efe4cd] flex items-center justify-center text-[#5c4d3c] font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <span className="font-bold text-[#5c4d3c] font-serif">
                      {t.name}
                    </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / ORÇAMENTO */}
      <section className="py-20 md:py-24 bg-[#f7f1e3]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#5c4d3c] mb-4">
            Pronto para transformar seu projeto?
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Agende uma visita técnica sem compromisso ou solicite um orçamento preliminar agora mesmo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none mx-auto">
            <a 
              href={`https://wa.me/5597984208329?text=Olá, gostaria de agendar uma visita técnica para um projeto.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button className="w-full h-14 px-8 text-lg bg-[#5c4d3c] hover:bg-[#3e342a] text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 rounded-md font-bold">
                <CalendarCheck className="mr-2" size={20} />
                Agendar Visita
              </Button>
            </a>

            <a 
              href={`https://wa.me/5597984208329?text=Olá, gostaria de um orçamento preliminar para um projeto.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" className="w-full h-14 px-8 text-lg border-2 border-[#5c4d3c] text-[#5c4d3c] hover:bg-[#5c4d3c] hover:text-white transition-all rounded-md font-bold bg-transparent">
                <MessageCircle className="mr-2" size={20} />
                Solicitar Orçamento
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}