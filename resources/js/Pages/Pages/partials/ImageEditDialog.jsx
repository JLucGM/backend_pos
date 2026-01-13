// components/Builder/dialogs/ImageEditDialog.jsx - VERSIÓN CON ASPECT RATIO
import React, { useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import ImageSelector from '@/Components/BuilderPages/ImageSelector';
import { Button } from '@/Components/ui/button';
import { ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const ImageEditDialog = ({ 
  editContent, 
  setEditContent, 
  editStyles, 
  setEditStyles,
  products = []
}) => {
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  const normalizedContent = typeof editContent === 'string' 
    ? { src: editContent, alt: '' } 
    : editContent || { src: '', alt: '' };

  const updateContent = (key, value) => {
    setEditContent(prev => {
      const current = typeof prev === 'string' ? { src: prev, alt: '' } : prev || {};
      return {
        ...current,
        [key]: value
      };
    });
  };

  const handleImageSelect = (imageData) => {
    setEditContent({
      src: imageData.src,
      alt: imageData.alt,
      product_id: imageData.product_id,
      media_id: imageData.media_id,
      is_from_product: true
    });
  };

  const updateStyle = (key, value) => {
    setEditStyles(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="contenido" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="contenido">Contenido</TabsTrigger>
          <TabsTrigger value="bordes">Bordes</TabsTrigger>
        </TabsList>

        {/* Pestaña Contenido */}
        <TabsContent value="contenido" className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="imageUrl">URL de la Imagen</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsImageSelectorOpen(true)}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Seleccionar de Productos
              </Button>
            </div>
            <Input
              id="imageUrl"
              value={normalizedContent.src || ''}
              onChange={(e) => updateContent('src', e.target.value)}
              placeholder="URL de la imagen o selecciona de productos"
              className="w-full"
            />
            {normalizedContent.product_id && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Imagen seleccionada del producto: {normalizedContent.alt}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageAlt">Texto Alternativo (Alt)</Label>
            <Input
              id="imageAlt"
              value={normalizedContent.alt || ''}
              onChange={(e) => updateContent('alt', e.target.value)}
              placeholder="Descripción de la imagen"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Texto que se muestra si la imagen no carga
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aspectRatio">Aspect Ratio</Label>
            <Select
              value={editStyles.aspectRatio || 'square'}
              onValueChange={(value) => updateStyle('aspectRatio', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                <SelectItem value="square">Square (1:1)</SelectItem>
                <SelectItem value="portrait">Portrait (4:5)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Controla la proporción de la imagen
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectFit">Ajuste de Imagen</Label>
            <select
              id="objectFit"
              value={editStyles.objectFit || 'cover'}
              onChange={(e) => updateStyle('objectFit', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="cover">Cover (Cubrir contenedor)</option>
              <option value="contain">Contain (Mantener proporción)</option>
              <option value="fill">Fill (Estirar completamente)</option>
              <option value="none">None (Tamaño original)</option>
              <option value="scale-down">Scale-down (Reducir si es necesario)</option>
            </select>
            <p className="text-xs text-gray-500">
              Controla cómo se ajusta la imagen al contenedor
            </p>
          </div>
        </TabsContent>

        {/* Pestaña Bordes */}
        <TabsContent value="bordes" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="borderRadius">Border Radius</Label>
            <div className="flex items-center gap-2">
              <Input
                id="borderRadius"
                type="number"
                min="0"
                step="1"
                value={parseInt(editStyles.borderRadius) || 0}
                onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                placeholder="0"
                className="flex-1"
              />
              <span className="text-gray-500">px</span>
            </div>
            <p className="text-xs text-gray-500">
              Radio del borde en píxeles
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="borderWidth">Ancho del Borde (px)</Label>
              <Input
                id="borderWidth"
                type="number"
                min="0"
                step="1"
                value={parseInt(editStyles.borderWidth) || 0}
                onChange={(e) => updateStyle('borderWidth', `${e.target.value}px`)}
              />
            </div>
            <div>
              <Label htmlFor="borderStyle">Estilo del Borde</Label>
              <select
                id="borderStyle"
                value={editStyles.borderStyle || 'solid'}
                onChange={(e) => updateStyle('borderStyle', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="borderColor">Color del Borde</Label>
            <Input
              id="borderColor"
              type="color"
              value={editStyles.borderColor || '#000000'}
              onChange={(e) => updateStyle('borderColor', e.target.value)}
              className="w-full h-10 p-1"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Selector de imágenes de productos */}
      <ImageSelector
        open={isImageSelectorOpen}
        onOpenChange={setIsImageSelectorOpen}
        onSelectImage={handleImageSelect}
        products={products}
      />

      {/* Vista previa rápida */}
      <div className="mt-6 pt-4 border-t">
        <Label className="mb-2 block">Vista Previa</Label>
        <div className="flex justify-center">
          <div 
            className="border rounded p-4 bg-gray-50"
            style={{
              width: '200px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {normalizedContent.src ? (
              <div style={{
                width: '100%',
                height: '0',
                paddingBottom: editStyles.aspectRatio === 'landscape' ? '56.25%' : 
                               editStyles.aspectRatio === 'portrait' ? '125%' : '100%',
                position: 'relative'
              }}>
                <img
                  src={normalizedContent.src}
                  alt="Vista previa"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: editStyles.borderRadius || '0px',
                    borderWidth: editStyles.borderWidth || '0px',
                    borderStyle: editStyles.borderStyle || 'solid',
                    borderColor: editStyles.borderColor || '#000000',
                    objectFit: editStyles.objectFit || 'cover',
                  }}
                />
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                Ingresa una URL para ver la vista previa
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">
          Aspect ratio: {editStyles.aspectRatio || 'square'}
        </div>
      </div>
    </div>
  );
};

export default ImageEditDialog;