// src/app/gestor/(admin)/portfolio/categories/_components/CategoriesClientPage.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image'; // 1. Importação adicionada
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, FolderKanban, Upload, Link as LinkIcon, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import { upsertCategoryAction, deleteCategoryAction } from '../actions';

type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  isExternal: boolean;
  _count: { projects: number };
};

export function CategoriesClientPage({ initialCategories }: { initialCategories: CategoryWithCount[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  
  const [imageSourceType, setImageSourceType] = useState<'upload' | 'external'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleOpenModal = (category?: CategoryWithCount) => {
    setEditingCategory(category || null);
    setFileName(null);
    
    if (category) {
      setImageSourceType(category.isExternal ? 'external' : 'upload');
      setPreviewUrl(category.imageUrl);
    } else {
      setImageSourceType('upload');
      setPreviewUrl(null);
    }
    
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('isExternal', imageSourceType === 'external' ? 'true' : 'false');

    toast.promise(upsertCategoryAction(formData, editingCategory?.id), {
      loading: 'Salvando...',
      success: (res) => {
        if (!res.success) throw new Error(res.message);
        setIsModalOpen(false);
        return res.message;
      },
      error: (err) => err.message
    });
  };

  const handleDelete = async (id: string) => {
    toast.promise(deleteCategoryAction(id), {
      loading: 'Excluindo...',
      success: (res) => {
        if (!res.success) throw new Error(res.message);
        return res.message;
      },
      error: (err) => err.message
    });
  };

  const ActionButtons = ({ category }: { category: CategoryWithCount }) => (
    <div className="flex justify-end gap-1 md:gap-2">
      <Button 
        variant="ghost" size="icon" 
        onClick={() => handleOpenModal(category)}
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
        <AlertDialogContent className="w-[90%] sm:w-full bg-white border-[#efe4cd] rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#5c4d3c]">Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Projetos vinculados a esta categoria podem perder a referência.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="border-[#efe4cd] text-gray-600 mt-0">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(category.id)} className="bg-red-600 text-white hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#5c4d3c]">Categorias</h1>
          <p className="text-gray-500 text-sm md:text-base">Gerencie os ambientes que aparecem no site.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full md:w-auto bg-[#5c4d3c] text-white hover:bg-[#4a3e30] shadow-md active:scale-95 transition-all">
          <Plus size={18} className="mr-2" /> Nova Categoria
        </Button>
      </div>

      {/* MOBILE LIST */}
      <div className="md:hidden space-y-4">
        {initialCategories.map((cat) => (
          <div key={cat.id} className="bg-white border border-[#efe4cd] rounded-lg p-3 shadow-sm flex gap-3 items-center relative overflow-hidden">
            {/* Adicionado 'relative' aqui para o fill funcionar */}
            <div className="shrink-0 w-16 h-16 rounded-md bg-[#f7f1e3] border border-[#efe4cd] overflow-hidden flex items-center justify-center relative">
               {cat.imageUrl ? (
                  /* Substituição 1: Mobile List Image */
                  <Image 
                    src={cat.imageUrl} 
                    alt={cat.name} 
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
               ) : (
                  <FolderKanban size={20} className="text-[#5c4d3c]/50" />
               )}
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="font-bold text-[#5c4d3c] truncate pr-8">{cat.name}</h3>
               <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-[#f7f1e3] text-[#5c4d3c] px-2 py-0.5 rounded-full font-bold">
                     {cat._count.projects} projetos
                  </span>
                  {cat.isExternal && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><LinkIcon size={10}/> Link</span>
                  )}
               </div>
            </div>
            <div className="absolute top-2 right-2">
               <ActionButtons category={cat} />
            </div>
          </div>
        ))}
        {initialCategories.length === 0 && (
           <div className="p-8 text-center text-gray-400 border border-dashed border-[#efe4cd] rounded-lg">Nenhuma categoria.</div>
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block border border-[#efe4cd] rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f7f1e3]">
            <TableRow className="border-[#efe4cd] hover:bg-[#f7f1e3]">
              <TableHead className="text-[#5c4d3c] font-bold w-25">Capa</TableHead>
              <TableHead className="text-[#5c4d3c] font-bold">Nome</TableHead>
              <TableHead className="text-[#5c4d3c] font-bold">Origem Imagem</TableHead>
              <TableHead className="text-[#5c4d3c] font-bold text-center">Projetos</TableHead>
              <TableHead className="text-right text-[#5c4d3c] font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialCategories.map((cat) => (
              <TableRow key={cat.id} className="border-[#efe4cd] hover:bg-[#fdfbf7]">
                <TableCell>
                  {cat.imageUrl ? (
                    /* Adicionado 'relative' aqui para o fill funcionar */
                    <div className="w-10 h-10 rounded overflow-hidden border border-[#efe4cd] relative">
                         {/* Substituição 2: Table Image */}
                         <Image 
                            src={cat.imageUrl} 
                            alt={cat.name} 
                            fill
                            className="object-cover"
                            sizes="40px"
                         />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded bg-[#f7f1e3] flex items-center justify-center text-[#5c4d3c]">
                      <FolderKanban size={16} />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-gray-800">{cat.name}</TableCell>
                <TableCell className="text-gray-600 text-xs">
                   {cat.isExternal ? (
                     <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                        <LinkIcon size={10}/> Link Externo
                     </span>
                   ) : (
                     <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                        <Upload size={10}/> Upload Próprio
                     </span>
                   )}
                </TableCell>
                <TableCell className="text-center">
                   <span className="bg-[#f7f1e3] text-[#5c4d3c] px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#efe4cd]">
                     {cat._count.projects}
                   </span>
                </TableCell>
                <TableCell className="text-right">
                  <ActionButtons category={cat} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialCategories.length === 0 && (
          <div className="p-12 text-center text-gray-400">Nenhuma categoria cadastrada.</div>
        )}
      </div>

      {/* MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95%] sm:max-w-lg bg-white border-[#efe4cd] max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#5c4d3c] font-serif flex items-center gap-2">
              <LayoutTemplate size={20} />
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-gray-700">Nome</Label>
                    <Input 
                        name="name" 
                        placeholder="Ex: Cozinha"
                        defaultValue={editingCategory?.name} 
                        required 
                        className="bg-white border-[#efe4cd] text-gray-800 focus-visible:ring-[#5c4d3c]"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-700">Título da Página</Label>
                    <Input 
                        name="title" 
                        placeholder="Ex: Cozinhas Modernas"
                        defaultValue={editingCategory?.title || ''} 
                        className="bg-white border-[#efe4cd] text-gray-800 focus-visible:ring-[#5c4d3c]"
                    />
                </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Descrição</Label>
              <Textarea 
                name="description" 
                rows={3}
                placeholder="Breve descrição para aparecer na página e no Google..."
                defaultValue={editingCategory?.description || ''} 
                className="bg-white border-[#efe4cd] text-gray-800 focus-visible:ring-[#5c4d3c]"
              />
            </div>

            {/* SEÇÃO DA IMAGEM */}
            <div className="space-y-4 border border-[#efe4cd] p-4 rounded-lg bg-[#fdfbf7]">
                <Label className="text-[#5c4d3c] font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
                    <ImageIcon size={16} /> Imagem de Capa
                </Label>

                <div className="space-y-2">
                    <Select 
                        value={imageSourceType} 
                        onValueChange={(val: 'upload' | 'external') => {
                          setImageSourceType(val);
                          setFileName(null);
                          if (!editingCategory) setPreviewUrl(null);
                        }}
                    >
                        <SelectTrigger className="bg-white border-[#efe4cd] text-gray-800 focus:ring-[#5c4d3c]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#efe4cd]">
                            <SelectItem value="upload" className="focus:bg-[#f7f1e3] focus:text-[#5c4d3c]">
                                <div className="flex items-center gap-2"><Upload size={14}/> Fazer Upload</div>
                            </SelectItem>
                            <SelectItem value="external" className="focus:bg-[#f7f1e3] focus:text-[#5c4d3c]">
                                <div className="flex items-center gap-2"><LinkIcon size={14}/> Link Externo</div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {imageSourceType === 'upload' ? (
                   <div className="space-y-2">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                        <Label 
                            htmlFor="imageFile" 
                            className="cursor-pointer bg-[#f7f1e3] text-[#5c4d3c] hover:bg-[#efe4cd] px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors shadow-sm border border-[#efe4cd]"
                        >
                            <Upload size={16} />
                            Escolher Arquivo
                        </Label>
                        <Input 
                            id="imageFile"
                            type="file" 
                            name="imageFile" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <span className="text-xs text-gray-500 italic break-all">
                            {fileName || "Nenhum arquivo selecionado"}
                        </span>
                      </div>
                   </div>
                ) : (
                   <div className="space-y-2">
                      <Input 
                          name="imageUrl" 
                          placeholder="https://exemplo.com/imagem.jpg" 
                          defaultValue={editingCategory?.isExternal ? (editingCategory.imageUrl || '') : ''}
                          onChange={(e) => setPreviewUrl(e.target.value)}
                          className="bg-white border-[#efe4cd] text-gray-800 focus-visible:ring-[#5c4d3c]"
                      />
                   </div>
                )}

                {/* Preview Corrigido */}
                {previewUrl && (
                    <div className="mt-4">
                        <Label className="text-xs text-gray-500 mb-2 block">Pré-visualização:</Label>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-[#efe4cd] bg-gray-50 flex items-center justify-center group p-2">
                           {/* Substituição 3: Modal Preview */}
                           {/* ATENÇÃO: unoptimized=true é essencial aqui porque previewUrl pode ser um Blob URL */}
                           <Image 
                             src={previewUrl} 
                             alt="Preview" 
                             fill
                             className="object-contain"
                             unoptimized
                           />
                        </div>
                    </div>
                )}
            </div>

            <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-4 sm:gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-[#efe4cd] text-gray-600 hover:bg-[#f7f1e3] h-10">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-[#5c4d3c] text-white hover:bg-[#4a3e30] h-10">
                {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}