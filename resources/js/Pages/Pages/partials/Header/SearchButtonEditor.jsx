import React, { useState, useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';

const SearchButtonEditor = ({ buttonConfig, showSearch, onUpdate, onUpdateShowSearch }) => {
  const [localStyles, setLocalStyles] = useState(buttonConfig?.styles || {});
  const [localShowSearch, setLocalShowSearch] = useState(showSearch !== false); // Por defecto true

  // Sincronizar cambios locales con el estado global después de un delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate({
        ...buttonConfig,
        styles: localStyles
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [localStyles]);

  // Sincronizar cambios de showSearch
  useEffect(() => {
    if (onUpdateShowSearch) {
      const timer = setTimeout(() => {
        onUpdateShowSearch(localShowSearch);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [localShowSearch]);

  const updateStyle = (key, value) => {
    setLocalStyles(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-sm">Buscador</h4>
        <div className="flex items-center space-x-2">
          <Label htmlFor="showSearch" className="text-xs">Mostrar botón</Label>
          <Switch
            id="showSearch"
            checked={localShowSearch}
            onCheckedChange={setLocalShowSearch}
          />
        </div>
      </div>

      {localShowSearch && (
        <>
          {/* Color del icono */}
          <div>
            <Label htmlFor="search-iconColor" className="text-xs">Color del icono</Label>
            <div className="flex gap-2">
              <Input
                id="search-iconColor"
                value={localStyles.iconColor || '#000000'}
                onChange={(e) => updateStyle('iconColor', e.target.value)}
                className="flex-1 h-8 text-xs"
              />
              <Input
                type="color"
                value={localStyles.iconColor || '#000000'}
                onChange={(e) => updateStyle('iconColor', e.target.value)}
                className="w-8 h-8"
              />
            </div>
          </div>

          {/* Color de fondo */}
          <div>
            <Label htmlFor="search-backgroundColor" className="text-xs">Color de fondo</Label>
            <div className="flex gap-2">
              <Input
                id="search-backgroundColor"
                value={localStyles.backgroundColor || 'transparent'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="flex-1 h-8 text-xs"
              />
              <Input
                type="color"
                value={localStyles.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="w-8 h-8"
              />
            </div>
          </div>

          {/* Opacidad del fondo */}
          <div>
            <Label htmlFor="search-backgroundOpacity" className="text-xs">Opacidad del fondo (0-1)</Label>
            <Input
              id="search-backgroundOpacity"
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={localStyles.backgroundOpacity || '1'}
              onChange={(e) => updateStyle('backgroundOpacity', e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <Separator />

          {/* Configuración del borde */}
          <div className="grid grid-cols-1 gap-2">
            <div>
              <Label htmlFor="search-borderWidth" className="text-xs">Ancho borde</Label>
              <Input
                id="search-borderWidth"
                type="number"
                value={parseInt(localStyles.borderWidth) || 0}
                onChange={(e) => updateStyle('borderWidth', e.target.value)}
                className="h-8 text-xs"
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="search-borderColor" className="text-xs">Color borde</Label>
              <Input
                type="color"
                value={localStyles.borderColor || '#000000'}
                onChange={(e) => updateStyle('borderColor', e.target.value)}
                className="h-8 w-full"
              />
            </div>

            <div>
              <Label htmlFor="search-borderOpacity" className="text-xs">Opac. borde</Label>
              <Input
                id="search-borderOpacity"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={localStyles.borderOpacity || '1'}
                onChange={(e) => updateStyle('borderOpacity', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Radio de borde */}
          <div>
            <Label htmlFor="search-borderRadius" className="text-xs">Radio de borde</Label>
            <Input
              id="search-borderRadius"
              type="number"
              value={parseInt(localStyles.borderRadius) || 50}
              onChange={(e) => updateStyle('borderRadius', e.target.value)}
              className="h-8 text-xs"
              placeholder="50"
            />
          </div>

          <Separator />

          {/* Tamaño */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="search-width" className="text-xs">Ancho</Label>
              <Input
                id="search-width"
                type="number"
                value={parseInt(localStyles.width) || 36}
                onChange={(e) => updateStyle('width', e.target.value)}
                className="h-8 text-xs"
                placeholder="36"
              />
            </div>

            <div>
              <Label htmlFor="search-height" className="text-xs">Alto</Label>
              <Input
                id="search-height"
                type="number"
                value={parseInt(localStyles.height) || 36}
                onChange={(e) => updateStyle('height', e.target.value)}
                className="h-8 text-xs"
                placeholder="36"
              />
            </div>

            <div>
              <Label htmlFor="search-padding" className="text-xs">Padding</Label>
              <Input
                id="search-padding"
                type="number"
                value={parseInt(localStyles.padding) || 8}
                onChange={(e) => updateStyle('padding', e.target.value)}
                className="h-8 text-xs"
                placeholder="8"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(SearchButtonEditor);