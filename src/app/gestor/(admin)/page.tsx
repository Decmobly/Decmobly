// src/app/gestor/(admin)/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Star, LayoutGrid, Users, ArrowUpRight, Database, Image as ImageIcon, UserCircle } from 'lucide-react'; 
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { list } from '@vercel/blob'; 

interface ProjectWithCategory {
  id: string;
  title: string;
  shortDesc: string;
  updatedAt: Date;
  isFeatured: boolean;
  category: {
    name: string;
  };
}

async function getDashboardMetrics() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalProjects = await prisma.project.count();
  const featuredProjects = await prisma.project.count({ where: { isFeatured: true } });
  const totalCategories = await prisma.category.count();
  const newProjectsMonth = await prisma.project.count({ where: { createdAt: { gte: firstDayOfMonth } } });

  const recentProjects = await prisma.project.findMany({
    take: 10,
    orderBy: { updatedAt: 'desc' },
    include: {
      category: { select: { name: true } }
    }
  });

  const projectsImages = await prisma.project.findMany({ select: { images: true } });
  const categoriesImages = await prisma.category.findMany({ select: { imageUrl: true } });
  const usersImages = await prisma.user.findMany({ select: { image: true } });

  // 1. Correção: "const" em vez de "let" (o objeto é mutável, mas a referência é constante)
  const blobUsage = {
    total: 0,
    projects: 0,
    categories: 0,
    profiles: 0,
    limit: 1024 * 1024 * 1024 
  };

  try {
    const { blobs } = await list({ limit: 10000 });
    const blobMap = new Map(blobs.map(b => [b.url, b.size]));

    // 2. Correção: Tipagem explícita para evitar "any"
    projectsImages.forEach((p: { images: { url: string }[] }) => {
      p.images.forEach(img => {
        if (blobMap.has(img.url)) blobUsage.projects += blobMap.get(img.url) || 0;
      });
    });

    categoriesImages.forEach((c: { imageUrl: string | null; }) => {
      if (c.imageUrl && blobMap.has(c.imageUrl)) blobUsage.categories += blobMap.get(c.imageUrl) || 0;
    });

    usersImages.forEach((u: { image: string | null; }) => {
      if (u.image && blobMap.has(u.image)) blobUsage.profiles += blobMap.get(u.image) || 0;
    });

    blobUsage.total = blobUsage.projects + blobUsage.categories + blobUsage.profiles;
  } catch (error) {
    console.error("Erro ao calcular blob:", error);
  }

  return {
    totalProjects,
    featuredProjects,
    totalCategories,
    newProjectsMonth,
    recentProjects,
    blobUsage 
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/gestor/login');
  }

  const metrics = await getDashboardMetrics();
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const projPercent = (metrics.blobUsage.projects / metrics.blobUsage.limit) * 100;
  const catPercent = (metrics.blobUsage.categories / metrics.blobUsage.limit) * 100;
  const profPercent = (metrics.blobUsage.profiles / metrics.blobUsage.limit) * 100;
  const totalPercent = Math.min((metrics.blobUsage.total / metrics.blobUsage.limit) * 100, 100);

  return (
    // Layout Principal
    <div className="space-y-4 md:space-y-4 animate-in fade-in duration-500 pt-20 md:pt-0 flex flex-col md:h-[calc(100vh-3rem)] md:overflow-hidden">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#5c4d3c]">Dashboard</h1>
        <p className="text-gray-500 text-sm md:text-base">
            Visão geral do seu portfólio e performance.
        </p>
      </div>

      {/* CARDS DE MÉTRICAS (Topo) */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 shrink-0">
            <Card className="bg-linear-to-br from-white to-blue-50/50 border-l-4 border-l-blue-600 border-y-blue-600 border-r-blue-600 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold text-blue-600 uppercase tracking-wide">Total de Projetos</CardTitle>
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <LayoutGrid className="h-4 w-4 text-blue-700" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-800 font-serif">{metrics.totalProjects}</div>
                    <p className="text-xs text-gray-500 mt-1">Projetos publicados</p>
                </CardContent>
            </Card>

            <Card className="bg-linear-to-br from-white to-yellow-50/50 border-l-4 border-l-yellow-500 border-y-yellow-500 border-r-yellow-500 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold text-yellow-600 uppercase tracking-wide">Em Destaque</CardTitle>
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Star className="h-4 w-4 text-yellow-700 fill-yellow-700" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-800 font-serif">{metrics.featuredProjects}</div>
                    <p className="text-xs text-gray-500 mt-1">Exibidos na Home</p>
                </CardContent>
            </Card>

            <Card className="bg-linear-to-br from-white to-emerald-50/50 border-l-4 border-l-emerald-500 border-y-emerald-500 border-r-emerald-500 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Categorias</CardTitle>
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <FolderKanban className="h-4 w-4 text-emerald-700" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-800 font-serif">{metrics.totalCategories}</div>
                    <p className="text-xs text-gray-500 mt-1">Ambientes cadastrados</p>
                </CardContent>
            </Card>

            <Card className="bg-linear-to-br from-white to-rose-50/50 border-l-4 border-l-rose-500 border-y-rose-500 border-r-rose-500 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold text-rose-600 uppercase tracking-wide">Novos (Mês)</CardTitle>
                    <div className="p-2 bg-rose-100 rounded-lg">
                        <Users className="h-4 w-4 text-rose-700" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-gray-800 font-serif">+{metrics.newProjectsMonth}</div>
                        {metrics.newProjectsMonth > 0 && <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 rounded-full font-bold">Novo!</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Adicionados este mês</p>
                </CardContent>
            </Card>
      </div>

      {/* SEÇÃO INFERIOR: FLEXÍVEL E ROLÁVEL */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 flex-1 min-h-0">
        
        {/* ARMAZENAMENTO */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-white border-[#efe4cd] shadow-sm flex flex-col overflow-hidden">
          <CardHeader className="pb-2 border-b border-[#f7f1e3] shrink-0">
            <CardTitle className="text-[#5c4d3c] font-serif text-lg flex items-center gap-2">
                <Database size={20} className="text-[#5c4d3c]" />
                Uso do Armazenamento
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#efe4cd] scrollbar-track-transparent">
              
              <div className="flex flex-col justify-center min-h-full">
                  {/* Mostrador Principal */}
                  <div className="text-center mb-8">
                      <div className="text-5xl md:text-6xl font-serif font-bold text-[#5c4d3c] tracking-tight">
                        {formatBytes(metrics.blobUsage.total)}
                      </div>
                      <p className="text-gray-400 mt-2 font-medium">
                        de <span className="text-[#5c4d3c] font-bold">{formatBytes(metrics.blobUsage.limit)}</span> utilizados
                      </p>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="space-y-2 mb-8">
                      <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <span>0 GB</span>
                          <span className="text-[#5c4d3c]">{totalPercent.toFixed(1)}% cheio</span>
                          <span>1 GB</span>
                      </div>
                      <div className="h-8 w-full bg-[#f7f1e3] rounded-full overflow-hidden flex shadow-inner border border-[#efe4cd]">
                          <div style={{ width: `${projPercent}%` }} className="h-full bg-[#5c4d3c] relative group">
                            <div className="absolute inset-0 flex items-center justify-center text-[9px] text-white/50 opacity-0 group-hover:opacity-100 font-bold">PROJ</div>
                          </div>
                          <div style={{ width: `${catPercent}%` }} className="h-full bg-[#c4a986] relative group">
                            <div className="absolute inset-0 flex items-center justify-center text-[9px] text-white/50 opacity-0 group-hover:opacity-100 font-bold">CAT</div>
                          </div>
                          <div style={{ width: `${profPercent}%` }} className="h-full bg-gray-400 relative group">
                              <div className="absolute inset-0 flex items-center justify-center text-[9px] text-white/50 opacity-0 group-hover:opacity-100 font-bold">USR</div>
                          </div>
                      </div>
                  </div>

                  {/* Legenda em Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Projetos */}
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-[#efe4cd] bg-[#fdfbf7] shadow-sm">
                          <div className="p-2.5 rounded-lg bg-[#5c4d3c]/10 text-[#5c4d3c]">
                              <ImageIcon size={18} />
                          </div>
                          <div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Projetos</p>
                              <p className="text-base font-bold text-[#5c4d3c]">{formatBytes(metrics.blobUsage.projects)}</p>
                          </div>
                          <div className="ml-auto w-2 h-2 rounded-full bg-[#5c4d3c]" />
                      </div>

                      {/* Categorias */}
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-[#efe4cd] bg-[#fdfbf7] shadow-sm">
                          <div className="p-2.5 rounded-lg bg-[#c4a986]/20 text-[#8a7256]">
                              <FolderKanban size={18} />
                          </div>
                          <div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Categorias</p>
                              <p className="text-base font-bold text-[#5c4d3c]">{formatBytes(metrics.blobUsage.categories)}</p>
                          </div>
                          <div className="ml-auto w-2 h-2 rounded-full bg-[#c4a986]" />
                      </div>

                      {/* Perfis */}
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-[#efe4cd] bg-[#fdfbf7] shadow-sm">
                          <div className="p-2.5 rounded-lg bg-gray-100 text-gray-600">
                              <UserCircle size={18} />
                          </div>
                          <div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Perfis</p>
                              <p className="text-base font-bold text-[#5c4d3c]">{formatBytes(metrics.blobUsage.profiles)}</p>
                          </div>
                          <div className="ml-auto w-2 h-2 rounded-full bg-gray-400" />
                      </div>
                  </div>
              </div>

          </CardContent>
        </Card>

        {/* LISTA DE RECENTES */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border-[#efe4cd] shadow-sm flex flex-col overflow-hidden">
          <CardHeader className="pb-4 bg-[#fdfbf7] border-b border-[#f7f1e3] shrink-0">
            <CardTitle className="text-[#5c4d3c] font-serif text-lg flex justify-between items-center">
                <span>Projetos Recentes</span>
                <span className="text-xs font-sans font-normal text-gray-400 bg-white px-2 py-1 rounded-full border border-[#efe4cd]">
                    Atualizações
                </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="overflow-y-auto flex-1 p-0 scrollbar-thin scrollbar-thumb-[#efe4cd] scrollbar-track-transparent">
            <div className="space-y-0 divide-y divide-[#f7f1e3]">
              {metrics.recentProjects.map((project: ProjectWithCategory) => (
                <div key={project.id} className="relative group p-4 hover:bg-[#fdfbf7] transition-colors flex gap-4 items-start">
                  
                  <div className={`mt-1 p-2 rounded-full shrink-0 ${project.isFeatured ? 'bg-yellow-100 text-yellow-600' : 'bg-[#f7f1e3] text-[#5c4d3c]'}`}>
                      {project.isFeatured ? <Star size={14} fill="currentColor" /> : <LayoutGrid size={14} />}
                  </div>
                  
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                            {project.category.name}
                        </span>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {format(new Date(project.updatedAt), "dd MMM", { locale: ptBR })}
                        </span>
                    </div>
                    
                    <p className="text-sm text-gray-800 font-bold truncate group-hover:text-[#5c4d3c] transition-colors">
                        {project.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">{project.shortDesc}</p>
                  </div>

                  <ArrowUpRight size={14} className="text-gray-300 group-hover:text-[#5c4d3c] transition-colors mt-1 opacity-0 group-hover:opacity-100" />
                </div>
              ))}
              {metrics.recentProjects.length === 0 && <p className="text-sm text-gray-500 italic p-6 text-center">Nenhum projeto encontrado.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}