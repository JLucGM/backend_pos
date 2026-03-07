// components/BuilderPages/ImageSelector.jsx
import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Search, Upload, Trash2, Loader2, FileImage } from 'lucide-react';
import { toast } from 'sonner';

const ImageSelector = ({
  open,
  onOpenChange,
  onSelectImage,
  allImages = [], 
  uploadRoute = null, 
  deleteRoute = null, 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  // --- Lógica de Deduplicación y Filtrado ---
  const processedImages = useMemo(() => {
    const unique = new Map();
    
    allImages.forEach(img => {
      // Usamos el nombre del archivo como clave para deduplicar
      // Si el archivo ya existe en el mapa, preferimos el que tenga URL más limpia o metadata más completa
      const fileName = img.file_name || (img.src ? img.src.split('/').pop() : null) || img.name;
      
      if (!unique.has(fileName)) {
        unique.set(fileName, img);
      }
    });

    const items = Array.from(unique.values());

    if (!searchTerm) return items;

    return items.filter(img =>
        (img.alt || img.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.product_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.file_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allImages, searchTerm]);

  // Subir imagen
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append(uploadRoute ? 'image' : 'file', file);

    const targetRoute = uploadRoute || route('media.store');

    router.post(targetRoute, formData, {
      preserveScroll: true,
      onSuccess: () => {
        setIsUploading(false);
        toast.success('Imagen subida correctamente');
      },
      onError: () => {
        setIsUploading(false);
        toast.error('Error al subir la imagen');
      },
    });
    e.target.value = '';
  };

  // Eliminar imagen
  const handleDeleteImage = (image, e) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar esta imagen permanentemente?')) return;

    setIsDeleting(image.media_id || image.id);
    
    const targetRoute = deleteRoute 
        ? route(deleteRoute, image.media_id || image.id) 
        : route('media.destroy', image.media_id || image.id);

    router.delete(targetRoute, {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleting(null);
        toast.success('Imagen eliminada');
      },
      onError: () => {
        setIsDeleting(null);
        toast.error('Error al eliminar');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Librería de imágenes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar en toda la librería..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Button
                variant="outline"
                disabled={isUploading}
                onClick={() => document.getElementById('global-image-upload').click()}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Subir imagen
              </Button>
              <input
                id="global-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 pr-4">
            {processedImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1">
                {processedImages.map((image) => (
                  <div
                    key={image.id || image.media_id}
                    className="relative group border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary bg-gray-50 aspect-square"
                    onClick={() => {
                      onSelectImage({
                        src: image.src || image.url,
                        alt: image.alt || image.name || '',
                        media_id: image.media_id || image.id,
                      });
                      onOpenChange(false);
                    }}
                  >
                    <img
                      src={image.thumb || image.src || image.url}
                      alt={image.alt || image.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="w-8 h-8"
                          onClick={(e) => handleDeleteImage(image, e)}
                          disabled={isDeleting === (image.media_id || image.id)}
                        >
                          {isDeleting === (image.media_id || image.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <FileImage className="h-12 w-12 mb-4 opacity-20" />
                <p>No se encontraron imágenes</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSelector;
