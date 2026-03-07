import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { Info, Package, Library, Calendar, HardDrive, Type } from 'lucide-react';

const MediaDetailsDialog = ({ open, onOpenChange, image }) => {
  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Detalles de la Imagen
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Vista previa de la imagen */}
          <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
            <img
              src={image.url || image.src}
              alt={image.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Información técnica y de uso */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Type className="h-4 w-4" /> Información del Archivo
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span className="font-medium truncate max-w-[180px]" title={image.name}>{image.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Archivo:</span>
                  <span className="font-medium truncate max-w-[180px]" title={image.file_name}>{image.file_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tamaño:</span>
                  <span className="font-medium">{image.size || 'N/A'}</span>
                </div>
                {image.created_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Subido:
                    </span>
                    <span className="font-medium">{image.created_at}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <HardDrive className="h-4 w-4" /> Estadísticas de Uso
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border bg-accent/50 flex flex-col items-center justify-center text-center">
                  <Package className="h-5 w-5 mb-1 text-blue-500" />
                  <span className="text-2xl font-bold">{image.usage_products || 0}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Productos</span>
                </div>
                <div className="p-3 rounded-lg border bg-accent/50 flex flex-col items-center justify-center text-center">
                  <Library className="h-5 w-5 mb-1 text-green-500" />
                  <span className="text-2xl font-bold">{image.usage_collections || 0}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Colecciones</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground text-center italic">
                * El uso se calcula basándose en réplicas del mismo archivo en el sistema.
              </p>
            </div>

            {image.is_from_product && (
              <Badge variant="outline" className="w-full justify-center py-1">
                Origen: Producto {image.product_name ? `(${image.product_name})` : ''}
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDetailsDialog;
