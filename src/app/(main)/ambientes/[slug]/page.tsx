// src/app/ambientes/[slug]/page.tsx

import Link from 'next/link';
import Image from 'next/image'; // 1. Importação adicionada
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { 
  Check, 
  Ruler, 
  Lightbulb, 
  Droplets, 
  Cog, 
  Hammer, 
  CreditCard,
  MessageCircle,
  CalendarCheck,
  ArrowRight,
  Star,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import type { Project } from '@prisma/client';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  
  return {
    title: category ? `${category.name} ` : 'Ambiente ',
    description: category?.description || 'Móveis planejados de alto padrão em Manaus.',
  };
}

export default async function CategoryDynamicPage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      projects: {
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: {
          images: true,
        }
      }
    }
  });

  if (!category) {
    notFound();
  }

  // --- DADOS ESTÁTICOS ---
  const differentials = [
    { icon: Ruler, title: "100% Personalizado", desc: "Cada centímetro planejado para seu estilo." },
    { icon: Lightbulb, title: "Soluções Inteligentes", desc: "Aproveitamento total do espaço." },
    { icon: Droplets, title: "Resistência à Umidade", desc: "Materiais de alta performance." },
    { icon: Cog, title: "Ferragens Premium", desc: "Sistemas de amortecimento suave." },
    { icon: Hammer, title: "Instalação Própria", desc: "Equipe especializada e limpa." },
    { icon: CreditCard, title: "Pagamento Facilitado", desc: "Parcelamento em até 12x." },
  ];

  const steps = [
    { num: "01", title: "Atendimento", desc: "Briefing detalhado sobre suas necessidades." },
    { num: "02", title: "Medição", desc: "Levantamento técnico preciso no local." },
    { num: "03", title: "Projeto", desc: "Visualização do seu sonho." },
    { num: "04", title: "Aprovação", desc: "Ajustes finais e escolha de materiais." },
    { num: "05", title: "Fabricação", desc: "Produção de alta precisão." },
    { num: "06", title: "Instalação", desc: "Montagem rápida e organizada." },
  ];

  const testimonials = [
    { name: "Ana Souza", comment: "Transformaram minha cozinha! O acabamento é impecável e o prazo foi cumprido rigorosamente.", stars: 5 },
    { name: "Roberto Lima", comment: "Profissionais excelentes. O projeto ficou exatamente como eu imaginava, super funcional.", stars: 5 },
    { name: "Carla Mendes", comment: "Atendimento nota 10 desde o primeiro contato até a instalação. Recomendo muito!", stars: 5 },
  ];

  return (
    <main className="min-h-screen bg-[#fdfbf7]">
      
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 bg-[#f7f1e3] overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6 text-gray-400 flex flex-wrap gap-2">
            <Link href="/" className="hover:text-[#5c4d3c] transition-colors">INÍCIO</Link>
            <span>&gt;</span>
            <Link href="/ambientes" className="hover:text-[#5c4d3c] transition-colors">AMBIENTES</Link>
            <span>&gt;</span>
            <span className="text-[#5c4d3c] font-bold">{category.name}</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#5c4d3c] mb-4 leading-tight">
            {category.name} <span className="block sm:inline text-gray-400 font-light italic text-2xl sm:text-4xl md:text-5xl">sob medida</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl">
            Design inteligente e sofisticação para seu lar.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 md:w-64 md:h-64 bg-[#efe4cd] rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob pointer-events-none"></div>
      </section>

      {/* INTRODUÇÃO */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row gap-10 md:gap-16 items-center">
          <div className="lg:w-1/2 w-full">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#5c4d3c] mb-6 leading-snug">
              {category.title || `O melhor projeto de ${category.name} para você`}
            </h2>
            <div className="prose prose-stone prose-lg text-gray-600 mb-8 leading-relaxed">
              <p>{category.description || "Nossos projetos unem funcionalidade e estética para criar ambientes únicos, aproveitando cada milímetro do seu espaço com elegância."}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Otimização de Espaço", "Ergonomia Avançada", "Design Personalizado", "Organização Inteligente"].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white  border border-[#efe4cd]/50 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#f7f1e3] flex items-center justify-center text-[#5c4d3c] shrink-0">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 2. Correção Imagem 1: Usando Image com fill e sizes */}
          <div className="lg:w-1/2 w-full relative h-96 sm:h-96 md:h-96 lg:h-120 overflow-hidden shadow-xl border border-white/20 rounded-lg">
            <Image 
              src={category.imageUrl || "/hero-section.jpeg"} 
              alt={category.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent lg:hidden pointer-events-none" />
          </div>
        </div>
      </section>

      {/* NOSSOS DIFERENCIAIS */}
      <section className="py-16 md:py-20 bg-white border-y border-[#efe4cd]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <span className="text-[#c4a986] font-bold text-xs uppercase tracking-widest">Por que escolher a Decmobly?</span>
             <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#5c4d3c] mt-2">Qualidade em cada detalhe</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {differentials.map((diff, idx) => (
              <div key={idx} className="p-6  bg-[#fdfbf7] border border-[#efe4cd] hover:border-[#c4a986] hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-[#efe4cd] text-[#5c4d3c] group-hover:bg-[#5c4d3c] group-hover:text-white transition-colors rounded-lg flex items-center justify-center mb-4">
                  <diff.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#5c4d3c] mb-2">{diff.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{diff.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJETOS RELACIONADOS */}
      {category.projects.length > 0 && (
        <section className="py-16 md:py-20 bg-[#fdfbf7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <span className="text-[#5c4d3c] text-xs font-bold uppercase tracking-widest block mb-2">Inspirar para Criar</span>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#5c4d3c]">
                  Nossos Projetos em destaque de {category.name}
                </h2>
              </div>
              <Link href="/portfolio" className="group flex items-center text-[#5c4d3c] font-bold text-sm hover:text-black transition-colors">
                Ver portfólio completo 
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.projects.map((project: Project & { images: { url: string }[] }) => (
                <Link key={project.id} href={`/portfolio/${project.slug}`} className="group cursor-pointer block h-full">
                  <article className="flex flex-col h-full bg-white  overflow-hidden border border-[#efe4cd] hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-4/3 overflow-hidden">
                        {/* Adicionado 'relative' aqui para o fill funcionar */}
                       <div className="w-full h-full bg-gray-200 group-hover:scale-105 transition-transform duration-700 relative">
                          {project.images[0] ? (
                            /* 3. Correção Imagem 2: Image com fill */
                            <Image 
                              src={project.images[0].url} 
                              alt={project.title} 
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#5c4d3c] opacity-50 bg-[#efe4cd]">
                            Sem imagem
                          </div>
                        )}
                       </div>
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-serif text-lg font-bold text-[#5c4d3c] group-hover:text-[#c4a986] transition-colors  mb-1">
                          {project.title}
                        </h3>
                        <p className="text-xs text-gray-500 text-justify leading-relaxed line-clamp-3">
                          {project.shortDesc}
                        </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PASSO A PASSO (TIMELINE) - CÓDIGO MANTIDO IDÊNTICO, OMITIDO PARA BREVIDADE SE NÃO HOUVER ERRO, MAS INCLUÍDO NO FINAL PARA INTEGRIDADE */}
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

            {/* DESKTOP TIMELINE */}
            <div className="hidden md:block relative w-full h-90 my-auto">
              <div className="absolute top-1/2 left-0 w-full h-px bg-[#efe4cd]/20 -translate-y-1/2 rounded-full"></div>
              <div className="flex justify-between items-center w-full h-full relative">
                {steps.map((step, idx) => {
                  const isTop = idx % 2 === 0;
                  return (
                    <div key={idx} className="relative flex-1 h-full group">
                      <div className={`absolute left-0 right-0 w-[90%] mx-auto p-6 border border-[#efe4cd]/10  bg-[#5c4d3c] hover:bg-[#fdfbf7]/5 transition-all duration-300 hover:shadow-xl hover:border-[#efe4cd]/30 z-10
                        ${isTop ? 'bottom-1/2 mb-10 hover:-translate-y-2' : 'top-1/2 mt-10 hover:translate-y-2' }`}>
                        <h3 className="text-xl font-serif font-bold mb-2 text-white group-hover:text-[#efe4cd] transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-[#efe4cd]/70 leading-relaxed group-hover:text-[#efe4cd]/90 transition-colors">
                          {step.desc}
                        </p>
                        <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#5c4d3c] border-r border-b border-[#efe4cd]/10 transform rotate-45
                           ${isTop ? '-bottom-2.5' : '-top-2.5 border-r-0 border-b-0 border-l border-t'}
                        `}></div>
                      </div>
                      <div className={`absolute left-1/2 -translate-x-1/2 w-px bg-[#efe4cd]/40 group-hover:bg-[#efe4cd] transition-colors duration-300
                        ${isTop ? 'bottom-1/2 h-10 mb-0' : 'top-1/2 h-10 mt-0' }
                      `}></div>
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

      {/* ================= AVALIAÇÕES (CORRIGIDO) ================= */}
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
                
                {/* 4. Correção: Aspas escapadas (&ldquo; e &rdquo;) */}
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
            Pronto para transformar seu projeto de &quot;{category.name}&quot;?
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Agende uma visita técnica sem compromisso ou solicite um orçamento preliminar agora mesmo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none mx-auto">
            <a 
              href={`https://wa.me/5597984208329?text=Olá, gostaria de agendar uma visita técnica para um projeto de ${category.name}.`}
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
              href={`https://wa.me/5597984208329?text=Olá, gostaria de um orçamento preliminar para ${category.name}.`}
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