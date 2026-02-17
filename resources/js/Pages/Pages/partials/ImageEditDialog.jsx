// components/BuilderPages/partials/ImageEditDialog.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { Button } from '@/Components/ui/button';
import { ImageIcon, X } from 'lucide-react';
import ImageSelector from '@/Components/BuilderPages/ImageSelector';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const ImageEditDialog = ({
  editContent,
  setEditContent,
  editStyles,
  setEditStyles,
  products = [],
  isLiveEdit = true,
  dynamicPages = [],
  allImages = [],
  page,
  themeSettings,
  appliedTheme,
}) => {
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [linkType, setLinkType] = useState('none');
  const [selectedPage, setSelectedPage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const resolveValue = useCallback((value) => {
    return resolveStyleValue(value, themeSettings, appliedTheme);
  }, [themeSettings, appliedTheme]);

  const debouncedContent = useDebounce(editContent, 300);
  const debouncedStyles = useDebounce(editStyles, 300);

  // Efecto para cambios en vivo (opcional)
  useEffect(() => {
    if (isLiveEdit) {
      // Las actualizaciones se manejan automáticamente
    }
  }, [debouncedContent, debouncedStyles, isLiveEdit]);

  // 1. INICIALIZACIÓN UNA SOLA VEZ
  useEffect(() => {
    if (isInitialized) return;

    const currentUrl = editStyles?.imageUrl || '';

    if (currentUrl) {
      if (currentUrl.startsWith('/')) {
        const pageSlug = currentUrl.replace('/', '');
        const foundPage = dynamicPages.find(p => p.slug === pageSlug);
        if (foundPage) {
          setLinkType('page');
          setSelectedPage(foundPage.slug);
        } else {
          const productMatch = currentUrl.match(/\/detalles-del-producto\?product=(.+)/);
          if (productMatch) {
            const productSlug = productMatch[1];
            const foundProduct = products.find(p => p.slug === productSlug);
            if (foundProduct) {
              setLinkType('product');
              setSelectedProduct(foundProduct.slug);
            } else {
              setLinkType('custom');
              setCustomUrl(currentUrl);
            }
          } else {
            setLinkType('custom');
            setCustomUrl(currentUrl);
          }
        }
      } else if (currentUrl.startsWith('http')) {
        setLinkType('custom');
        setCustomUrl(currentUrl);
      }
    } else {
      setLinkType('none');
    }

    setIsInitialized(true);
  }, [editStyles, dynamicPages, products, isInitialized]);

  // 2. ACTUALIZAR LA URL CUANDO CAMBIAN LOS CONTROLES
  useEffect(() => {
    if (!isInitialized) return;

    let newUrl = '';

    switch (linkType) {
      case 'page':
        if (selectedPage) {
          newUrl = `/${selectedPage}`;
        }
        break;
      case 'product':
        if (selectedProduct) {
          newUrl = `/detalles-del-producto?product=${selectedProduct}`;
        }
        break;
      case 'custom':
        newUrl = customUrl;
        break;
      case 'none':
        newUrl = '';
        break;
    }

    const currentUrl = editStyles?.imageUrl || '';
    if (newUrl !== currentUrl) {
      setEditStyles(prev => ({ ...prev, imageUrl: newUrl }));
    }
  }, [linkType, selectedPage, selectedProduct, customUrl, isInitialized, editStyles?.imageUrl, setEditStyles]);

  // Memoizar contenido normalizado
  const normalizedContent = useMemo(() => {
    return typeof editContent === 'string'
      ? { src: editContent, alt: '' }
      : editContent || { src: '', alt: '' };
  }, [editContent]);

  // Funciones memoizadas
  const updateContent = useCallback((key, value) => {
    setEditContent(prev => {
      const current = typeof prev === 'string' ? { src: prev, alt: '' } : prev || {};
      return {
        ...current,
        [key]: value
      };
    });
  }, [setEditContent]);

  const updateStyle = useCallback((key, value) => {
    setEditStyles(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setEditStyles]);

  const handleImageSelect = useCallback((imageData) => {
    setEditContent({
      src: imageData.src,
      alt: imageData.alt,
      product_id: imageData.product_id,
      media_id: imageData.media_id,
      is_from_product: imageData.is_from_product,
    });
    setIsImageSelectorOpen(false);
  }, [setEditContent]);

  const handleClearImage = useCallback(() => {
    setEditContent({
      src: '',
      alt: '',
      product_id: null,
      media_id: null,
      is_from_product: false,
    });
  }, [setEditContent]);

  const handleCustomUrlChange = useCallback((value) => {
    setCustomUrl(value);
    if (linkType === 'custom') {
      setEditStyles(prev => ({ ...prev, imageUrl: value }));
    }
  }, [linkType, setEditStyles]);

  const imageUrl = normalizedContent.src;
  const borderColorValue = resolveValue(editStyles.borderColor) || '#000000';

  return (
    <div className="space-y-4">
      
      {/* SECCIÓN DE IMAGEN */}
      <div className="space-y-2">
        <Label>Imagen</Label>

        {imageUrl ? (
          <div className="relative border rounded-md overflow-hidden">
            <img
              src={imageUrl}
              alt={normalizedContent.alt || 'Vista previa'}
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-8 h-8 bg-white/90 hover:bg-white"
                  onClick={() => setIsImageSelectorOpen(true)}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="w-8 h-8"
                  onClick={handleClearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {normalizedContent.is_from_product && (
              <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Imagen de producto
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsImageSelectorOpen(true)}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Seleccionar imagen
            </Button>
          </div>
        )}

        {/* Input de respaldo para URL manual */}
        <div className="mt-2">
          <Label htmlFor="imageUrl" className="text-xs text-gray-500">
            O ingresa una URL manualmente
          </Label>
          <Input
            id="imageUrl"
            value={imageUrl || ''}
            onChange={(e) => updateContent('src', e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="mt-1"
          />
        </div>
      </div>

      {/* CONFIGURACIÓN DE ENLACE */}
      <div>
        <Label htmlFor="linkType">Tipo de Enlace</Label>
        <Select
          value={linkType}
          onValueChange={(value) => {
            setLinkType(value);
            if (value === 'custom') {
              const currentUrl = editStyles?.imageUrl || '';
              if (currentUrl && !customUrl) {
                setCustomUrl(currentUrl);
              }
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de enlace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin enlace (solo imagen)</SelectItem>
            <SelectItem value="page">Página Dinámica</SelectItem>
            <SelectItem value="product">Página de Producto</SelectItem>
            <SelectItem value="custom">URL Personalizada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Selector de Página Dinámica */}
      {linkType === 'page' && (
        <div>
          <Label htmlFor="dynamicPage">Seleccionar Página</Label>
          <Select
            value={selectedPage}
            onValueChange={setSelectedPage}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una página" />
            </SelectTrigger>
            <SelectContent>
              {dynamicPages.length > 0 ? (
                dynamicPages.map((page) => (
                  <SelectItem key={page.slug} value={page.slug}>
                    {page.title} (/{page.slug})
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">
                  No hay páginas dinámicas disponibles
                </div>
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            URL: /{selectedPage || '[selecciona una página]'}
          </p>
        </div>
      )}

      {/* Selector de Producto */}
      {linkType === 'product' && (
        <div>
          <Label htmlFor="product">Seleccionar Producto</Label>
          <Select
            value={selectedProduct}
            onValueChange={setSelectedProduct}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un producto" />
            </SelectTrigger>
            <SelectContent>
              {products.length > 0 ? (
                products.map((product) => (
                  <SelectItem key={product.slug} value={product.slug}>
                    {product.product_name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">
                  No hay productos disponibles
                </div>
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            URL: /detalles-del-producto?product={selectedProduct || '[selecciona un producto]'}
          </p>
        </div>
      )}

      {/* URL Personalizada */}
      {linkType === 'custom' && (
        <div>
          <Label htmlFor="customUrl">URL Personalizada</Label>
          <Input
            id="customUrl"
            value={customUrl}
            onChange={(e) => handleCustomUrlChange(e.target.value)}
            placeholder="https://ejemplo.com o /ruta-interna"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ejemplos:<br />
            • Enlace interno: /contacto<br />
            • Enlace externo: https://google.com<br />
            • Página estática: /inicio
          </p>
        </div>
      )}

      <Separator />

      {/* CONFIGURACIÓN DE ESTILOS DE IMAGEN */}
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="objectFit">Ajuste de Imagen</Label>
        <Select
          value={editStyles.objectFit || 'cover'}
          onValueChange={(value) => updateStyle('objectFit', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover (Cubrir contenedor)</SelectItem>
            <SelectItem value="contain">Contain (Mantener proporción)</SelectItem>
            <SelectItem value="fill">Fill (Estirar completamente)</SelectItem>
            <SelectItem value="none">None (Tamaño original)</SelectItem>
            <SelectItem value="scale-down">Scale-down (Reducir si es necesario)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="borderWidth">Ancho del Borde</Label>
          <Input
            id="borderWidth"
            type="number"
            min="0"
            step="1"
            value={parseInt(editStyles.borderWidth) || 0}
            onChange={(e) => updateStyle('borderWidth', e.target.value)}
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
        <ColorPicker
          value={borderColorValue}
          onChange={(hex) => updateStyle('borderColor', hex)}
          showOpacity={false}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="borderRadius">Radio de Borde</Label>
        <Input
          id="borderRadius"
          type="number"
          min="0"
          step="1"
          value={parseInt(editStyles.borderRadius) || 0}
          onChange={(e) => updateStyle('borderRadius', e.target.value)}
          placeholder="0"
          className="w-full"
        />
      </div>

      {/* Selector de imágenes */}
      <ImageSelector
        open={isImageSelectorOpen}
        onOpenChange={setIsImageSelectorOpen}
        onSelectImage={handleImageSelect}
        allImages={allImages}
        page={page}
      />
    </div>
  );
};

export default React.memo(ImageEditDialog);