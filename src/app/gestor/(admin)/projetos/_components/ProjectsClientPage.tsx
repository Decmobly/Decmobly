'use client';

import { useState, useRef } from 'react';
import Image from 'next/image'; // Importação adicionada
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; // DialogClose removido
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { Database, UserCircle, Plus, Pencil, Trash2, MapPin, Image as ImageIcon, Layers, X, FolderKanban, Link as LinkIcon, UploadCloud } from 'lucide-react';
import { upsertProjectAction, deleteProjectAction } from '../actions';
import type { Project, Category, ProjectImage } from '@prisma/client';

type StorageStats = {
  total: number;
  projects: number;
  categories: number;
  profiles: number;
  limit: number;
};

type ProjectWithDetails = Project & {
  category: Category;
  images: ProjectImage[];
};

type TechSpec = { title: string; description: string };

export function ProjectsClientPage({ initialProjects, categories, storageStats }: { initialProjects: ProjectWithDetails[], categories: {id: string, name: string}[], storageStats: StorageStats }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithDetails | null>(null);

  // --- ESTADOS DO FORMULÁRIO ---
  const [techSpecs, setTechSpecs] = useState<TechSpec[]>([]);
  const [currentImages, setCurrentImages] = useState<ProjectImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  
  // Novos estados para gerenciamento de upload/links
  const [newFileImages, setNewFileImages] = useState<File[]>([]); // Arquivos reais
  const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]); // URLs para preview
  const [externalLinks, setExternalLinks] = useState<string[]>([]); // Links adicionados manualmente
  const [tempLinkInput, setTempLinkInput] = useState(''); // Input temporário do link
  const [isFeatured, setIsFeatured] = useState(false); // Estado manual para o Switch

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = (project?: ProjectWithDetails) => {
    if (project) {
      setEditingProject(project);
      setTechSpecs((project.techSpecs as unknown as TechSpec[]) || []);
      setCurrentImages(project.images);
      setIsFeatured(project.isFeatured);
    } else {
      setEditingProject(null);
      setTechSpecs([{ title: '', description: '' }]); 
      setCurrentImages([]);
      setIsFeatured(false);
    }
    // Reseta estados temporários
    setDeletedImageIds([]);
    setNewFileImages([]);
    setNewFilePreviews([]);
    setExternalLinks([]);
    setTempLinkInput('');
    
    setIsModalOpen(true);
  };

  // --- Handlers de Ficha Técnica ---
  const addSpec = () => setTechSpecs([...techSpecs, { title: '', description: '' }]);
  const removeSpec = (index: number) => setTechSpecs(techSpecs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: 'title' | 'description', value: string) => {
    const newSpecs = [...techSpecs];
    newSpecs[index][field] = value;
    setTechSpecs(newSpecs);
  };

  // --- Handlers de Imagem ---
  const markImageForDeletion = (imgId: string) => {
    setDeletedImageIds([...deletedImageIds, imgId]);
    setCurrentImages(currentImages.filter(img => img.id !== imgId));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const previews = files.map(file => URL.createObjectURL(file));
      
      setNewFileImages([...newFileImages, ...files]);
      setNewFilePreviews([...newFilePreviews, ...previews]);
      
      // Limpa o input para permitir selecionar o mesmo arquivo novamente se quiser
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeNewFile = (index: number) => {
    const updatedFiles = [...newFileImages];
    const updatedPreviews = [...newFilePreviews];
    
    // Revoga a URL para evitar memory leak
    URL.revokeObjectURL(updatedPreviews[index]);
    
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setNewFileImages(updatedFiles);
    setNewFilePreviews(updatedPreviews);
  };

  const addExternalLink = () => {
    if (tempLinkInput.trim()) {
      setExternalLinks([...externalLinks, tempLinkInput.trim()]);
      setTempLinkInput('');
    }
  };

  const removeExternalLink = (index: number) => {
    setExternalLinks(externalLinks.filter((_, i) => i !== index));
  };

  // --- SUBMIT ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    formData.set('techSpecs', JSON.stringify(techSpecs));
    formData.set('deletedImageIds', JSON.stringify(deletedImageIds));
    formData.set('isFeatured', isFeatured ? 'true' : 'false');
    formData.set('externalImageLinks', JSON.stringify(externalLinks)); // Envia array de links

    // Anexa os arquivos manualmente pois controlamos o estado deles
    newFileImages.forEach(file => {
        formData.append('newImages', file);
    });

    toast.promise(upsertProjectAction(formData, editingProject?.id), {
      loading: 'Salvando projeto...',
      success: (res) => {
        if (!res.success) throw new Error(res.message);
        setIsModalOpen(false);
        return res.message;
      },
      error: (err) => err.message
    });
  };

  const handleDelete = async (id: string) => {
    toast.promise(deleteProjectAction(id), {
      loading: 'Excluindo...',
      success: (res) => {
        if (!res.success) throw new Error(res.message);
        return res.message;
      },
      error: (err) => err.message
    });
  };

  // --- Subcomponente de Ações ---
  const ActionButtons = ({ project }: { project: ProjectWithDetails }) => (
    <div className="flex justify-end gap-1 md:gap-2">
        <Button 
            variant="ghost" size="icon" 
            onClick={() => handleOpenModal(project)}
            className="text-gray-400 hover:text-[#5c4d3c] hover:bg-[#f7f1e3] h-8 w-8 md:h-9 md:w-9"
        >
            <Pencil size={16} />
        </Button>

        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 md:h-9 md:w-9">
                    <Trash2 size={16} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-[#efe4cd] w-[90%] sm:w-full rounded-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#5c4d3c]">Excluir projeto?</AlertDialogTitle>
                    <AlertDialogDescription>Isso apagará todas as imagens permanentemente.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                    <AlertDialogCancel className="border-[#efe4cd] mt-0">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-red-600 text-white hover:bg-red-700">Excluir</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );

  // --- FUNÇÃO AUXILIAR PARA FORMATAR BYTES ---
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Cálculos de porcentagem
  // Removido totalPercent que não era usado
  const projPercent = (storageStats.projects / storageStats.limit) * 100;
  const catPercent = (storageStats.categories / storageStats.limit) * 100;
  const profPercent = (storageStats.profiles / storageStats.limit) * 100;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 md:pb-0">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#5c4d3c]">Projetos</h1>
          <p className="text-gray-500 text-sm md:text-base">Gerencie seu portfólio completo.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full md:w-auto bg-[#5c4d3c] text-white hover:bg-[#4a3e30] shadow-md active:scale-95 transition-all">
          <Plus size={18} className="mr-2" /> Novo Projeto
        </Button>
      </div>

      {/* --- NOVO COMPONENTE: BARRA DE ARMAZENAMENTO --- */}
      <div className="bg-white border border-[#efe4cd] rounded-xl p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2 text-[#5c4d3c] font-bold">
                <Database size={18} />
                <span>Armazenamento</span>
            </div>
            <div className="text-right">
                <span className="text-2xl font-bold text-[#5c4d3c]">{formatBytes(storageStats.total)}</span>
                <span className="text-xs text-gray-400 ml-1">/ {formatBytes(storageStats.limit)}</span>
            </div>
        </div>

        {/* Barra de Progresso Segmentada */}
        <div className="relative h-4 w-full bg-[#f7f1e3] rounded-full overflow-hidden flex">
            {/* Projetos (Azul/Madeira Escuro) */}
            <div style={{ width: `${projPercent}%` }} className="h-full bg-[#5c4d3c] hover:opacity-90 transition-all" title={`Projetos: ${formatBytes(storageStats.projects)}`} />
            {/* Categorias (Verde/Madeira Claro) */}
            <div style={{ width: `${catPercent}%` }} className="h-full bg-[#c4a986] hover:opacity-90 transition-all" title={`Categorias: ${formatBytes(storageStats.categories)}`} />
            {/* Perfis (Roxo/Cinza) */}
            <div style={{ width: `${profPercent}%` }} className="h-full bg-gray-400 hover:opacity-90 transition-all" title={`Perfis: ${formatBytes(storageStats.profiles)}`} />
        </div>

        {/* Legenda Descritiva */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-[#efe4cd] hover:bg-[#fdfbf7] transition-all">
                <div className="p-2 rounded-md bg-[#5c4d3c]/10 text-[#5c4d3c]">
                    <ImageIcon size={16} />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Projetos</p>
                    <p className="text-sm font-bold text-[#5c4d3c]">{formatBytes(storageStats.projects)}</p>
                </div>
                <div className="ml-auto w-2 h-2 rounded-full bg-[#5c4d3c]" />
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-[#efe4cd] hover:bg-[#fdfbf7] transition-all">
                <div className="p-2 rounded-md bg-[#c4a986]/20 text-[#8a7256]">
                    <FolderKanban size={16} />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Categorias</p>
                    <p className="text-sm font-bold text-[#5c4d3c]">{formatBytes(storageStats.categories)}</p>
                </div>
                <div className="ml-auto w-2 h-2 rounded-full bg-[#c4a986]" />
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-[#efe4cd] hover:bg-[#fdfbf7] transition-all">
                <div className="p-2 rounded-md bg-gray-100 text-gray-600">
                    <UserCircle size={16} />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Fotos de Perfil</p>
                    <p className="text-sm font-bold text-[#5c4d3c]">{formatBytes(storageStats.profiles)}</p>
                </div>
                <div className="ml-auto w-2 h-2 rounded-full bg-gray-400" />
            </div>
        </div>
      </div>
      {/* --- FIM DA BARRA --- */}

      {/* LISTA (MOBILE CARDS / DESKTOP TABLE) */}
      <div className="md:hidden space-y-4">
        {initialProjects.map((proj) => (
            <div key={proj.id} className="bg-white border border-[#efe4cd] rounded-lg p-3 shadow-sm flex gap-3 relative overflow-hidden">
                <div className="shrink-0 w-20 h-20 rounded-md bg-[#f7f1e3] border border-[#efe4cd] overflow-hidden relative">
                    {proj.images[0] ? (
                        <Image 
                            src={proj.images[0].url} 
                            alt={proj.title} 
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#5c4d3c]/30"><ImageIcon size={20}/></div>
                    )}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                    <h3 className="font-bold text-[#5c4d3c] truncate leading-tight mb-1">{proj.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <FolderKanban size={12} className="text-[#5c4d3c]/70"/> <span>{proj.category.name}</span>
                    </div>
                    {proj.isFeatured && (
                        <span className="inline-block mt-2 text-[10px] bg-yellow-50 text-yellow-700 border border-yellow-200 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                            Destaque
                        </span>
                    )}
                </div>
                <div className="absolute top-2 right-2">
                    <ActionButtons project={proj} />
                </div>
            </div>
        ))}
        {initialProjects.length === 0 && <div className="p-8 text-center text-gray-400 border border-dashed border-[#efe4cd] rounded-lg">Nenhum projeto.</div>}
      </div>

      <div className="hidden md:block border border-[#efe4cd] rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f7f1e3]">
            <TableRow className="border-[#efe4cd] hover:bg-[#f7f1e3]">
              <TableHead className="text-[#5c4d3c] font-bold w-20">Capa</TableHead>
              <TableHead className="text-[#5c4d3c] font-bold">Título</TableHead>
              <TableHead className="text-[#5c4d3c] font-bold">Categoria</TableHead>
              <TableHead className="text-[#5c4d3c] font-bold">Local</TableHead>
              <TableHead className="text-right text-[#5c4d3c] font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialProjects.map((proj) => (
              <TableRow key={proj.id} className="border-[#efe4cd] hover:bg-[#fdfbf7]">
                <TableCell>
                  {proj.images[0] ? (
                    <div className="w-10 h-10 rounded overflow-hidden border border-[#efe4cd] relative">
                        <Image 
                            src={proj.images[0].url} 
                            alt={proj.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    </div>
                  ) : <div className="w-10 h-10 bg-[#f7f1e3] rounded flex items-center justify-center text-[#5c4d3c]/30"><ImageIcon size={16}/></div>}
                </TableCell>
                <TableCell className="font-medium text-gray-800">
                    {proj.title}
                    {proj.isFeatured && <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200 uppercase font-bold">Destaque</span>}
                </TableCell>
                <TableCell className="text-gray-600">{proj.category.name}</TableCell>
                <TableCell className="text-gray-500 text-xs">{proj.location || '-'}</TableCell>
                <TableCell className="text-right">
                  <ActionButtons project={proj} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialProjects.length === 0 && <div className="p-12 text-center text-gray-400">Nenhum projeto encontrado.</div>}
      </div>

      {/* --- MODAL DE EDIÇÃO --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95%] max-w-4xl h-[95vh] md:h-[85vh] flex flex-col bg-white border-[#efe4cd] p-0 rounded-xl overflow-hidden">
          
          <DialogHeader className="p-4 md:p-6 border-b border-[#efe4cd] bg-[#fdfbf7] shrink-0">
            <DialogTitle className="text-[#5c4d3c] font-serif text-xl md:text-2xl">
              {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <form id="project-form" onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                
                {/* 1. DADOS BÁSICOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <Label className="text-gray-700">Nome do Projeto</Label>
                        <Input name="title" defaultValue={editingProject?.title} required className="bg-white border-[#efe4cd] focus-visible:ring-[#5c4d3c]" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-700">Título da Página (H1)</Label>
                        <Input name="h1Title" defaultValue={editingProject?.h1Title} required className="bg-white border-[#efe4cd]" placeholder="Ex: Cozinha Integrada" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-700">Categoria</Label>
                        <Select name="categoryId" defaultValue={editingProject?.categoryId}>
                            <SelectTrigger className="bg-white border-[#efe4cd]"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent className="bg-white border-[#efe4cd]">
                                {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-700">Localização</Label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                            <Input name="location" defaultValue={editingProject?.location || ''} className="pl-9 bg-white border-[#efe4cd]" placeholder="Bairro, Cidade - UF" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-gray-700">Descrição Curta (Card)</Label>
                    <Input name="shortDesc" defaultValue={editingProject?.shortDesc} required maxLength={255} className="bg-white border-[#efe4cd]" />
                </div>

                {/* 2. CONTEÚDO DETALHADO */}
                <div className="border border-[#efe4cd] rounded-lg p-4 bg-[#fdfbf7] space-y-4">
                    <h3 className="font-bold text-[#5c4d3c] flex items-center gap-2 text-sm uppercase tracking-wide"><Pencil size={16}/> Conteúdo da Página</h3>
                    <div className="space-y-2">
                        <Label className="text-gray-700">Subtítulo (H2)</Label>
                        <Input name="h2Title" defaultValue={editingProject?.h2Title || ''} className="bg-white border-[#efe4cd]" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-700">Descrição Completa</Label>
                        <Textarea name="description" defaultValue={editingProject?.description} required rows={6} className="bg-white border-[#efe4cd]" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-700">Paleta de Cores</Label>
                        <Input name="colorPalette" defaultValue={editingProject?.colorPalette || ''} className="bg-white border-[#efe4cd]" placeholder="Ex: MDF Nogueira, Laca Branca" />
                    </div>
                </div>

                {/* 3. FICHA TÉCNICA */}
                <div className="border border-[#efe4cd] rounded-lg p-4 bg-white space-y-4">
                    <div className="flex justify-between items-center">
                          <h3 className="font-bold text-[#5c4d3c] flex items-center gap-2 text-sm uppercase tracking-wide"><Layers size={16}/> Ficha Técnica</h3>
                          <Button type="button" variant="outline" size="sm" onClick={addSpec} className="text-xs border-[#efe4cd] h-7">Adicionar +</Button>
                    </div>
                    {techSpecs.length === 0 && <p className="text-xs text-gray-400 italic">Nenhum item adicionado.</p>}
                    <div className="space-y-2">
                        {techSpecs.map((spec, index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <Input placeholder="Título" value={spec.title} onChange={(e) => updateSpec(index, 'title', e.target.value)} className="w-1/3 bg-white border-[#efe4cd] h-9 text-sm" />
                                <Input placeholder="Descrição" value={spec.description} onChange={(e) => updateSpec(index, 'description', e.target.value)} className="flex-1 bg-white border-[#efe4cd] h-9 text-sm" />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(index)} className="h-9 w-9 text-red-400 hover:text-red-600 shrink-0"><X size={16}/></Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. IMAGENS (Área Melhorada) */}
                <div className="border border-[#efe4cd] rounded-lg p-4 bg-[#fdfbf7] space-y-6">
                    <h3 className="font-bold text-[#5c4d3c] flex items-center gap-2 text-sm uppercase tracking-wide"><ImageIcon size={16}/> Galeria de Imagens</h3>
                    
                    {/* A. Imagens já salvas */}
                    {currentImages.length > 0 && (
                        <div>
                            <Label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Imagens Atuais</Label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {currentImages.map(img => (
                                    <div key={img.id} className="relative group aspect-square rounded-md overflow-hidden border border-[#efe4cd] bg-white">
                                        <Image 
                                            src={img.url} 
                                            alt="Imagem do projeto" 
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 33vw, 16vw"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => markImageForDeletion(img.id)}
                                            className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 hover:bg-red-700 transition-colors shadow-sm z-10"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* B. Novos Uploads (Previews) */}
                    {(newFilePreviews.length > 0 || externalLinks.length > 0) && (
                        <div>
                            <Label className="text-xs font-bold text-green-600 mb-2 block uppercase">Novas Imagens (Não salvas)</Label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {/* Uploads */}
                                {newFilePreviews.map((url, idx) => (
                                    <div key={`new-${idx}`} className="relative aspect-square rounded-md overflow-hidden border-2 border-green-200 bg-white">
                                        <Image 
                                            src={url} 
                                            alt={`Preview ${idx}`}
                                            fill
                                            className="object-cover"
                                            unoptimized // Crucial para blob URLs
                                        />
                                        <button type="button" onClick={() => removeNewFile(idx)} className="absolute top-1 right-1 bg-gray-800/80 text-white rounded-full p-1 hover:bg-black z-10"><X size={10} /></button>
                                        <div className="absolute bottom-0 w-full bg-green-100 text-[9px] text-center text-green-800 font-bold py-0.5 z-10">ARQUIVO</div>
                                    </div>
                                ))}
                                {/* Links Externos */}
                                {externalLinks.map((link, idx) => (
                                    <div key={`link-${idx}`} className="relative aspect-square rounded-md overflow-hidden border-2 border-blue-200 bg-white">
                                        <Image 
                                            src={link} 
                                            alt={`Link externo ${idx}`}
                                            fill
                                            className="object-cover"
                                            unoptimized // Crucial para links externos desconhecidos
                                        />
                                        <button type="button" onClick={() => removeExternalLink(idx)} className="absolute top-1 right-1 bg-gray-800/80 text-white rounded-full p-1 hover:bg-black z-10"><X size={10} /></button>
                                        <div className="absolute bottom-0 w-full bg-blue-100 text-[9px] text-center text-blue-800 font-bold py-0.5 z-10">LINK</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* C. Controles de Adição */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#efe4cd]">
                        {/* Input Arquivo */}
                        <div className="space-y-2">
                            <Label className="text-gray-700 text-xs font-bold flex items-center gap-2"><UploadCloud size={14}/> Upload de Arquivos</Label>
                            <Input 
                                ref={fileInputRef}
                                type="file" 
                                multiple 
                                accept="image/*" 
                                onChange={handleFileSelect}
                                className="bg-white border-[#efe4cd] text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#f7f1e3] file:text-[#5c4d3c] hover:file:bg-[#efe4cd]" 
                            />
                        </div>
                        
                        {/* Input Link */}
                        <div className="space-y-2">
                             <Label className="text-gray-700 text-xs font-bold flex items-center gap-2"><LinkIcon size={14}/> Adicionar por Link</Label>
                             <div className="flex gap-2">
                                <Input 
                                    placeholder="https://exemplo.com/imagem.jpg" 
                                    value={tempLinkInput}
                                    onChange={(e) => setTempLinkInput(e.target.value)}
                                    className="bg-white border-[#efe4cd] h-9 text-sm" 
                                />
                                <Button type="button" onClick={addExternalLink} size="sm" className="bg-[#5c4d3c] text-white hover:bg-[#4a3e30] h-9">Adicionar</Button>
                             </div>
                        </div>
                    </div>
                </div>

                {/* 5. DESTAQUE (Switch Melhorado) */}
                <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex flex-col">
                        <Label htmlFor="isFeatured" className="text-yellow-900 font-bold text-base cursor-pointer">Destaque na Home?</Label>
                        <span className="text-xs text-yellow-700">Se ativado, este projeto aparecerá na página inicial.</span>
                    </div>
                    {/* Switch controlado manualmente */}
                    <Switch 
                        id="isFeatured" 
                        checked={isFeatured}
                        onCheckedChange={setIsFeatured}
                        className="data-[state=checked]:bg-yellow-600 data-[state=unchecked]:bg-gray-300"
                    />
                    {/* Input hidden para garantir o envio no FormData */}
                    <input type="hidden" name="isFeatured" value={isFeatured ? 'true' : 'false'} />
                </div>

            </form>
          </div>

          {/* FOOTER FIXO */}
          <DialogFooter className="p-4 md:p-6 border-t border-[#efe4cd] bg-[#fdfbf7] flex flex-col-reverse sm:flex-row gap-3 sm:gap-2 shrink-0">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-[#efe4cd] text-gray-600 h-10 w-full sm:w-auto">Cancelar</Button>
            <Button type="submit" form="project-form" className="bg-[#5c4d3c] text-white hover:bg-[#4a3e30] h-10 w-full sm:w-auto">Salvar Projeto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}