import React, { useState, useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { resolveStyleValue } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';
import { Button } from '@/Components/ui/button';

const SearchButtonEditor = ({
  buttonConfig,
  showSearch,
  onUpdate,
  onUpdateShowSearch,
  themeSettings,
  appliedTheme
}) => {
  const [localStyles, setLocalStyles] = useState(buttonConfig?.styles || {});
  const [localShowSearch, setLocalShowSearch] = useState(showSearch !== false);

  const resolveValue = useCallback((value) => {
    return resolveStyleValue(value, themeSettings, appliedTheme);
  }, [themeSettings, appliedTheme]);

  const updateStyle = useCallback((key, value) => {
    setLocalStyles(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleIconColorChange = useCallback((hex) => updateStyle('iconColor', hex), [updateStyle]);
  const handleBackgroundColorChange = useCallback((hex) => updateStyle('backgroundColor', hex), [updateStyle]);
  const handleBorderColorChange = useCallback((hex) => updateStyle('borderColor', hex), [updateStyle]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate({
        ...buttonConfig,
        styles: localStyles
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [localStyles, onUpdate, buttonConfig]);

  useEffect(() => {
    if (onUpdateShowSearch) {
      const timer = setTimeout(() => {
        onUpdateShowSearch(localShowSearch);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [localShowSearch, onUpdateShowSearch]);

  const iconColor = resolveValue(localStyles.iconColor) || '#000000';
  const borderColor = resolveValue(localStyles.borderColor) || '#000000';
  const backgroundColorValue = resolveValue(localStyles.backgroundColor);
  const bgColor = (backgroundColorValue && backgroundColorValue !== 'transparent') ? backgroundColorValue : '#ffffff';

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
          <div>
            <Label className="text-xs">Color del icono</Label>
            <ColorPicker
              value={iconColor}
              onChange={handleIconColorChange}
              showOpacity={false}
            />
          </div>

          <div>
            <Label className="text-xs">Color de fondo</Label>
            <div className="flex items-center gap-2">
              <ColorPicker
                value={bgColor}
                onChange={handleBackgroundColorChange}
                showOpacity={false}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateStyle('backgroundColor', 'transparent')}
              >
                Sin fondo
              </Button>
            </div>
          </div>

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
              <Label className="text-xs">Color borde</Label>
              <ColorPicker
                value={borderColor}
                onChange={handleBorderColorChange}
                showOpacity={false}
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