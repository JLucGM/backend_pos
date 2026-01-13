// components/Builder/dialogs/ImageEditDialog.jsx - VERSIÓN SOLO PORCENTAJES
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';

const ImageEditDialog = ({ 
  editContent, 
  setEditContent, 
  editStyles, 
  setEditStyles 
}) => {
  // Normalizar editContent para manejar tanto string como objeto
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

  const updateStyle = (key, value) => {
    setEditStyles(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Función para manejar el cambio de porcentaje
  const handlePercentChange = (dimension, value) => {
    // Asegurarse de que el valor termine con % o esté vacío
    if (value === '') {
      updateStyle(dimension, '');
    } else if (value === '%') {
      updateStyle(dimension, '100%');
    } else {
      // Remover cualquier carácter que no sea número o punto decimal
      const numValue = value.replace(/[^0-9.]/g, '');
      if (numValue === '') {
        updateStyle(dimension, '0%');
      } else {
        updateStyle(dimension, `${numValue}%`);
      }
    }
  };

  // Obtener el valor numérico sin el símbolo %
  const getPercentValue = (dimension) => {
    const value = editStyles[dimension] || '';
    if (value.endsWith('%')) {
      return value.replace('%', '');
    }
    // Si no tiene %, asumir que es 100% por defecto
    return dimension === 'width' || dimension === 'height' ? '100' : '';
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="contenido" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="contenido">Contenido</TabsTrigger>
          {/* <TabsTrigger value="tamaño">Tamaño</TabsTrigger> */}
          <TabsTrigger value="bordes">Bordes</TabsTrigger>
        </TabsList>

        {/* Pestaña Contenido */}
        <TabsContent value="contenido" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de la Imagen</Label>
            <Input
              id="imageUrl"
              value={normalizedContent.src || ''}
              onChange={(e) => updateContent('src', e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ingresa la URL completa de la imagen
            </p>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageWidth">Ancho (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="imageWidth"
                  type="number"
                  min="0"
                  max="1000"
                  step="1"
                  value={getPercentValue('width')}
                  onChange={(e) => handlePercentChange('width', e.target.value)}
                  placeholder="100"
                  className="flex-1"
                />
                <span className="text-gray-500">%</span>
              </div>
              <p className="text-xs text-gray-500">
                0-1000% del contenedor padre
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageHeight">Alto (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="imageHeight"
                  type="number"
                  min="0"
                  max="1000"
                  step="1"
                  value={getPercentValue('height')}
                  onChange={(e) => handlePercentChange('height', e.target.value)}
                  placeholder="100"
                  className="flex-1"
                />
                <span className="text-gray-500">%</span>
              </div>
              <p className="text-xs text-gray-500">
                0-1000% del contenedor padre
              </p>
            </div>
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

        {/* Pestaña Tamaño */}
        {/* <TabsContent value="tamaño" className="space-y-4">
          

          <div className="pt-4 border-t">
            <Label className="mb-2 block">Márgenes (px)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marginTop" className="text-xs">Superior</Label>
                <Input
                  id="marginTop"
                  type="number"
                  value={parseInt(editStyles.marginTop) || 0}
                  onChange={(e) => updateStyle('marginTop', `${e.target.value}px`)}
                />
              </div>
              <div>
                <Label htmlFor="marginRight" className="text-xs">Derecha</Label>
                <Input
                  id="marginRight"
                  type="number"
                  value={parseInt(editStyles.marginRight) || 0}
                  onChange={(e) => updateStyle('marginRight', `${e.target.value}px`)}
                />
              </div>
              <div>
                <Label htmlFor="marginBottom" className="text-xs">Inferior</Label>
                <Input
                  id="marginBottom"
                  type="number"
                  value={parseInt(editStyles.marginBottom) || 0}
                  onChange={(e) => updateStyle('marginBottom', `${e.target.value}px`)}
                />
              </div>
              <div>
                <Label htmlFor="marginLeft" className="text-xs">Izquierda</Label>
                <Input
                  id="marginLeft"
                  type="number"
                  value={parseInt(editStyles.marginLeft) || 0}
                  onChange={(e) => updateStyle('marginLeft', `${e.target.value}px`)}
                />
              </div>
            </div>
          </div>
        </TabsContent> */}

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

      {/* Vista previa rápida */}
      <div className="mt-6 pt-4 border-t">
        <Label className="mb-2 block">Vista Previa</Label>
        <div className="flex justify-center">
          <div 
            className="border rounded p-4 bg-gray-50"
            style={{
              width: '200px',
              height: '150px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {normalizedContent.src ? (
              <img
                src={normalizedContent.src}
                alt="Vista previa"
                style={{
                  width: editStyles.width || '100%',
                  height: editStyles.height || '100%',
                  borderRadius: editStyles.borderRadius || '0px',
                  borderWidth: editStyles.borderWidth || '0px',
                  borderStyle: editStyles.borderStyle || 'solid',
                  borderColor: editStyles.borderColor || '#000000',
                  objectFit: editStyles.objectFit || 'cover',
                  marginTop: editStyles.marginTop || '0px',
                  marginRight: editStyles.marginRight || '0px',
                  marginBottom: editStyles.marginBottom || '0px',
                  marginLeft: editStyles.marginLeft || '0px',
                }}
                className="max-w-full max-h-full"
              />
            ) : (
              <div className="text-center text-gray-400 py-8">
                Ingresa una URL para ver la vista previa
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">
          Tamaño del contenedor: 200x150px - Imagen: {editStyles.width || '100%'} × {editStyles.height || '100%'}
        </div>
      </div>
    </div>
  );
};

export default ImageEditDialog;