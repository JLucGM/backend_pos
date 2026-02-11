// components/BuilderPages/ImageSelector.jsx

import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Search, Upload, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ImageSelector = ({
  open,
  onOpenChange,
  onSelectImage,
  allImages = [], // 📌 Única fuente de verdad
  page,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [images, setImages] = useState(allImages);

  // Sincronizar cuando la prop cambie (después de reload)
  useEffect(() => {
    setImages(allImages);
  }, [allImages]);

  // Filtrar por búsqueda
  const filteredImages = searchTerm
    ? images.filter(img =>
        img.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : images;

  // Subir imagen
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    router.post(route('pages.upload-image', page.slug), formData, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setIsUploading(false);
        toast.success('Imagen subida correctamente');
        // ♻️ Recargar solo la prop allImages
        router.reload({
          only: ['allImages'],
          preserveState: true,
          preserveScroll: true,
        });
      },
      onError: (errors) => {
        setIsUploading(false);
        toast.error(errors.upload || 'Error al subir la imagen');
      },
    });
    e.target.value = '';
  };

  // Eliminar imagen (solo si es de la página)
  const handleDeleteImage = (image, e) => {
    e.stopPropagation();
    if (!image.is_page_image) {
      toast.error('No se puede eliminar una imagen de producto');
      return;
    }
    if (!confirm('¿Eliminar esta imagen?')) return;

    setIsDeleting(image.media_id);
    router.delete(route('pages.delete-image', [page.slug, image.media_id]), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setIsDeleting(null);
        toast.success('Imagen eliminada');
        router.reload({
          only: ['allImages'],
          preserveState: true,
          preserveScroll: true,
        });
      },
      onError: (errors) => {
        setIsDeleting(null);
        toast.error(errors.delete || 'Error al eliminar');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Selector de imágenes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Buscador y botón de subida */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar imágenes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Button
                variant="outline"
                disabled={isUploading}
                onClick={() => document.getElementById('image-upload-input').click()}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Subir imagen
              </Button>
              <input
                id="image-upload-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Grid de imágenes */}
          <ScrollArea className="h-[450px]">
            <div className="grid grid-cols-4 gap-4 p-2">
              {filteredImages.length > 0 ? (
                filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500"
                    onClick={() => {
                      onSelectImage(image);
                      onOpenChange(false);
                    }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-32 object-cover"
                    />
                    {/* Overlay para eliminar (solo imágenes de página) */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      {image.is_page_image && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="w-8 h-8"
                          onClick={(e) => handleDeleteImage(image, e)}
                          disabled={isDeleting === image.media_id}
                        >
                          {isDeleting === image.media_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    {/* Etiqueta de origen */}
                    <div className="absolute top-1 left-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        image.is_page_image
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {image.is_page_image ? 'Mi imagen' : 'Producto'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center text-gray-500 py-12">
                  No hay imágenes disponibles
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSelector;