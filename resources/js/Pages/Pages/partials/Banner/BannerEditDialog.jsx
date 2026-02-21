import React, { useEffect, useState, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { ImageIcon, X, Trash2, Plus } from 'lucide-react';
import ImageSelector from '@/Components/BuilderPages/ImageSelector';
import { Button } from '@/Components/ui/button';
import { resolveStyleValue } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const BannerEditDialog = ({
  editContent,
  setEditContent,
  editStyles,
  setEditStyles,
  isLiveEdit = true,
  page,
  allImages = [],
  themeSettings,
  appliedTheme
}) => {
  const debouncedContent = useDebounce(editContent, 300);
  const debouncedStyles = useDebounce(editStyles, 300);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  const resolveValue = useCallback((value) => {
    return resolveStyleValue(value, themeSettings, appliedTheme);
  }, [themeSettings, appliedTheme]);

  useEffect(() => {
    if (isLiveEdit) {
      // Las actualizaciones se manejan automáticamente
    }
  }, [debouncedContent, debouncedStyles, isLiveEdit]);

  const updateBannerConfig = useCallback((key, value) => {
    setEditContent(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setEditContent]);

  const handleBackgroundImageSelect = useCallback((imageData) => {
    updateBannerConfig('backgroundImage', imageData.src);
    setIsImageSelectorOpen(false);
  }, [updateBannerConfig]);

  const handleClearBackgroundImage = useCallback(() => {
    updateBannerConfig('backgroundImage', '');
  }, [updateBannerConfig]);

  // Estado para controlar si se muestra el fondo del contenedor interno
  const hasInnerContainerBackground = editContent.innerContainerHasBackground !== false;

  // Valores calculados para el render (se definen antes del useCallback que podría usarlos)
  const innerContainerBackgroundColor = resolveValue(editContent.innerContainerBackgroundColor) || '#ffffff';
  const defaultInnerColor = (innerContainerBackgroundColor && innerContainerBackgroundColor !== 'transparent') ? innerContainerBackgroundColor : '#ffffff';
  const bgColor = resolveValue(editContent.backgroundColor) || '#ffffff';

  // ✅ Estados para gradiente - con valores por defecto
  const [gradientColors, setGradientColors] = useState(['#667eea', '#764ba2']);
  const [gradientAngle, setGradientAngle] = useState(45);

  const angleOptions = [
    { value: 0, label: '0° (derecha)' },
    { value: 45, label: '45°' },
    { value: 90, label: '90° (abajo)' },
    { value: 135, label: '135°' },
    { value: 180, label: '180° (izquierda)' },
    { value: 225, label: '225°' },
    { value: 270, label: '270° (arriba)' },
    { value: 315, label: '315°' }
  ];

  // Sincronizar gradiente desde editContent
  useEffect(() => {
    if (editContent.backgroundType === 'gradient' && editContent.gradientColors) {
      try {
        const match = editContent.gradientColors.match(/#[0-9a-fA-F]{6}/g);
        if (match && match.length >= 2) {
          setGradientColors(match);
        }
        const angleMatch = editContent.gradientColors.match(/(\d+)deg/);
        if (angleMatch && angleMatch[1]) {
          setGradientAngle(parseInt(angleMatch[1]));
        }
      } catch (error) {
        console.error('Error parsing gradient:', error);
      }
    }
  }, [editContent.backgroundType]);

  // Actualizar editContent cuando cambian colores o ángulo
  useEffect(() => {
    if (editContent.backgroundType === 'gradient') {
      const validColors = gradientColors.filter(color =>
        color && /^#[0-9a-fA-F]{6}$/.test(color)
      );

      if (validColors.length >= 2) {
        const colorsString = validColors.join(', ');
        const gradientString = `linear-gradient(${gradientAngle}deg, ${colorsString})`;

        if (editContent.gradientColors !== gradientString) {
          updateBannerConfig('gradientColors', gradientString);
        }
      }
    }
  }, [gradientColors, gradientAngle]);

  const handleBackgroundToggle = useCallback((checked) => {
    updateBannerConfig('innerContainerHasBackground', checked);
    if (!checked) {
      updateBannerConfig('innerContainerBackgroundColor', 'transparent');
      updateBannerConfig('innerContainerBackgroundOpacity', 1);
    } else {
      // Si se activa el fondo y actualmente es transparente, asignar un color por defecto
      const currentColor = resolveValue(editContent.innerContainerBackgroundColor);
      if (currentColor === 'transparent' || !currentColor) {
        updateBannerConfig('innerContainerBackgroundColor', '#ffffff');
      }
    }
  }, [updateBannerConfig, resolveValue, editContent.innerContainerBackgroundColor]);

  // Funciones para manejar gradientes
  const addColor = useCallback(() => {
    if (gradientColors.length < 5) {
      setGradientColors([...gradientColors, '#ffffff']);
    }
  }, [gradientColors]);

  const removeColor = useCallback((index) => {
    if (gradientColors.length > 2) {
      const newColors = [...gradientColors];
      newColors.splice(index, 1);
      setGradientColors(newColors);
    }
  }, [gradientColors]);

  const updateColor = useCallback((index, value) => {
    const newColors = [...gradientColors];
    newColors[index] = value;
    setGradientColors(newColors);
  }, [gradientColors]);

  return (
    <div className="space-y-4">

      <div>
        <Label htmlFor="backgroundType">Tipo de Fondo</Label>
        <Select
          value={editContent.backgroundType || 'color'}
          onValueChange={(value) => updateBannerConfig('backgroundType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="color">Color Sólido</SelectItem>
            <SelectItem value="image">Imagen</SelectItem>
            <SelectItem value="gradient">Gradiente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {editContent.backgroundType === 'color' && (
        <div>
          <Label htmlFor="backgroundColor">Color de Fondo</Label>
          <ColorPicker
            value={bgColor}
            onChange={(hex) => updateBannerConfig('backgroundColor', hex)}
            showOpacity={false}
          />
        </div>
      )}

      {editContent.backgroundType === 'image' && (
        <div className="space-y-2">
          <Label>Imagen de Fondo</Label>

          {editContent.backgroundImage ? (
            <div className="relative border rounded-md overflow-hidden">
              <img
                src={editContent.backgroundImage}
                alt="Fondo del banner"
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
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
                  onClick={handleClearBackgroundImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsImageSelectorOpen(true)}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Seleccionar imagen de fondo
              </Button>
            </div>
          )}

          <div className="mt-2">
            <Label htmlFor="backgroundImageUrl" className="text-xs text-gray-500">
              O ingresa una URL manualmente
            </Label>
            <span className="text-xs text-muted-foreground block mb-2">Solo URLs directas de imagen</span>
            <Input
              id="backgroundImageUrl"
              value={editContent.backgroundImage || ''}
              onChange={(e) => updateBannerConfig('backgroundImage', e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="mt-1"
            />
          </div>
        </div>
      )}

      {editContent.backgroundType === 'gradient' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="gradientAngle">Dirección del Gradiente</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {angleOptions.map((angle) => (
                <Button
                  key={angle.value}
                  type="button"
                  variant={gradientAngle === angle.value ? "default" : "outline"}
                  className="text-xs h-8 px-1"
                  onClick={() => setGradientAngle(angle.value)}
                >
                  {angle.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Colores del Gradiente</Label>
              <span className="text-xs text-gray-500">
                {gradientColors.length}/5 colores
              </span>
            </div>

            {gradientColors.map((color, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <ColorPicker
                    value={color}
                    onChange={(hex) => updateColor(index, hex)}
                    showOpacity={false}
                  />
                </div>

                {gradientColors.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColor(index)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}

            {gradientColors.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addColor}
                className="w-full mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Color
              </Button>
            )}
          </div>

          <div className="mt-4">
            <Label>Vista Previa</Label>
            <div
              className="h-20 w-full rounded-md border border-gray-300 mt-2"
              style={{
                background: gradientColors.length >= 2
                  ? `linear-gradient(${gradientAngle}deg, ${gradientColors.join(', ')})`
                  : 'linear-gradient(45deg, #667eea, #764ba2)'
              }}
            />
          </div>
        </div>
      )}
      <Separator />
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="containerHeight">Altura del Contenedor</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="containerHeight"
              type="number"
              value={parseInt(editContent.containerHeight) || 400}
              onChange={(e) => updateBannerConfig('containerHeight', e.target.value)}
            />
            <Select
              value={editContent.containerHeightUnit || 'px'}
              onValueChange={(value) => updateBannerConfig('containerHeightUnit', value)}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">px</SelectItem>
                <SelectItem value="vh">vh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="containerWidth">Ancho del Contenedor</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="containerWidth"
              type="number"
              value={parseInt(editContent.containerWidth) || 100}
              onChange={(e) => updateBannerConfig('containerWidth', e.target.value)}
            />
            <Select
              value={editContent.containerWidthUnit || '%'}
              onValueChange={(value) => updateBannerConfig('containerWidthUnit', value)}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">px</SelectItem>
                <SelectItem value="%">%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="">

        <Label htmlFor="containerVerticalPosition">Posición Vertical</Label>
        <Select
          value={editContent.containerVerticalPosition || 'center'}
          onValueChange={(value) => updateBannerConfig('containerVerticalPosition', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Arriba</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="bottom">Abajo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="">

        <Label htmlFor="containerHorizontalPosition">Posición Horizontal</Label>
        <Select
          value={editContent.containerHorizontalPosition || 'center'}
          onValueChange={(value) => updateBannerConfig('containerHorizontalPosition', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Izquierda</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="right">Derecha</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="">

        <Label htmlFor="contentDirection">Dirección del Contenido</Label>
        <Select
          value={editContent.contentDirection || 'vertical'}
          onValueChange={(value) => updateBannerConfig('contentDirection', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vertical">Vertical (Columna)</SelectItem>
            <SelectItem value="horizontal">Horizontal (Fila)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="">

        <Label>Márgenes</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="marginTop">Superior</Label>
            <Input
              id="marginTop"
              type="number"
              value={parseInt(editContent.marginTop) || 0}
              onChange={(e) => updateBannerConfig('marginTop', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="marginRight">Derecha</Label>
            <Input
              id="marginRight"
              type="number"
              value={parseInt(editContent.marginRight) || 0}
              onChange={(e) => updateBannerConfig('marginRight', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="marginBottom">Inferior</Label>
            <Input
              id="marginBottom"
              type="number"
              value={parseInt(editContent.marginBottom) || 0}
              onChange={(e) => updateBannerConfig('marginBottom', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="marginLeft">Izquierda</Label>
            <Input
              id="marginLeft"
              type="number"
              value={parseInt(editContent.marginLeft) || 0}
              onChange={(e) => updateBannerConfig('marginLeft', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="">

        <Label>Padding</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="paddingTop">Superior</Label>
            <Input
              id="paddingTop"
              type="number"
              value={parseInt(editContent.paddingTop) || 20}
              onChange={(e) => updateBannerConfig('paddingTop', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="paddingRight">Derecha</Label>
            <Input
              id="paddingRight"
              type="number"
              value={parseInt(editContent.paddingRight) || 20}
              onChange={(e) => updateBannerConfig('paddingRight', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="paddingBottom">Inferior</Label>
            <Input
              id="paddingBottom"
              type="number"
              value={parseInt(editContent.paddingBottom) || 20}
              onChange={(e) => updateBannerConfig('paddingBottom', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="paddingLeft">Izquierda</Label>
            <Input
              id="paddingLeft"
              type="number"
              value={parseInt(editContent.paddingLeft) || 20}
              onChange={(e) => updateBannerConfig('paddingLeft', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="">

        <Label htmlFor="backgroundSize">Tamaño de Fondo</Label>
        <Select
          value={editContent.backgroundSize || 'cover'}
          onValueChange={(value) => updateBannerConfig('backgroundSize', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
            <SelectItem value="auto">Auto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <Label htmlFor="innerContainerShow">Mostrar Contenedor Interno</Label>
        <Switch
          id="innerContainerShow"
          checked={editContent.innerContainerShow !== false}
          onCheckedChange={(checked) => updateBannerConfig('innerContainerShow', checked)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="innerContainerHasBackground">Mostrar Fondo</Label>
          <Switch
            id="innerContainerHasBackground"
            checked={hasInnerContainerBackground}
            onCheckedChange={handleBackgroundToggle}
          />
        </div>

        {hasInnerContainerBackground && (
          <>
            <div>
              <Label htmlFor="innerContainerBackgroundColor">Color de Fondo</Label>
              <ColorPicker
                value={defaultInnerColor}
                onChange={(hex) => updateBannerConfig('innerContainerBackgroundColor', hex)}
                showOpacity={false}
              />
            </div>

            <div>
              <Label htmlFor="innerContainerBackgroundOpacity">Opacidad (0-1)</Label>
              <Input
                id="innerContainerBackgroundOpacity"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={editContent.innerContainerBackgroundOpacity || 0.8}
                onChange={(e) => updateBannerConfig('innerContainerBackgroundOpacity', parseFloat(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">
                0 = transparente, 1 = opaco
              </p>
            </div>
          </>
        )}
      </div>



      <div>
        <Label htmlFor="innerContainerBorderRadius">Border Radius</Label>
        <Input
          id="innerContainerBorderRadius"
          type="number"
          value={parseInt(editContent.innerContainerBorderRadius) || 0}
          onChange={(e) => updateBannerConfig('innerContainerBorderRadius', e.target.value)}
        />
      </div>

      <Label>Padding del Contenedor Interno</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="innerContainerPaddingTop">Superior</Label>
          <Input
            id="innerContainerPaddingTop"
            type="number"
            value={parseInt(editContent.innerContainerPaddingTop) || 20}
            onChange={(e) => updateBannerConfig('innerContainerPaddingTop', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="innerContainerPaddingRight">Derecha</Label>
          <Input
            id="innerContainerPaddingRight"
            type="number"
            value={parseInt(editContent.innerContainerPaddingRight) || 20}
            onChange={(e) => updateBannerConfig('innerContainerPaddingRight', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="innerContainerPaddingBottom">Inferior</Label>
          <Input
            id="innerContainerPaddingBottom"
            type="number"
            value={parseInt(editContent.innerContainerPaddingBottom) || 20}
            onChange={(e) => updateBannerConfig('innerContainerPaddingBottom', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="innerContainerPaddingLeft">Izquierda</Label>
          <Input
            id="innerContainerPaddingLeft"
            type="number"
            value={parseInt(editContent.innerContainerPaddingLeft) || 20}
            onChange={(e) => updateBannerConfig('innerContainerPaddingLeft', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="innerContainerWidth">Ancho del Contenedor</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="innerContainerWidth"
            type="number"
            value={parseInt(editContent.innerContainerWidth) || ''}
            onChange={(e) => updateBannerConfig('innerContainerWidth', e.target.value)}
            placeholder="Auto"
          />
          <Select
            value={editContent.innerContainerWidthUnit || 'px'}
            onValueChange={(value) => updateBannerConfig('innerContainerWidthUnit', value)}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="px">px</SelectItem>
              <SelectItem value="%">%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="innerContainerMaxWidth">Ancho Máximo</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="innerContainerMaxWidth"
            type="number"
            value={parseInt(editContent.innerContainerMaxWidth) || 800}
            onChange={(e) => updateBannerConfig('innerContainerMaxWidth', e.target.value)}
            placeholder="800"
          />
          <Select
            value={editContent.innerContainerMaxWidthUnit || 'px'}
            onValueChange={(value) => updateBannerConfig('innerContainerMaxWidthUnit', value)}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="px">px</SelectItem>
              <SelectItem value="%">%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ImageSelector
        open={isImageSelectorOpen}
        onOpenChange={setIsImageSelectorOpen}
        onSelectImage={handleBackgroundImageSelect}
        allImages={allImages}
        page={page}
      />
    </div>
  );
};

export default React.memo(BannerEditDialog);