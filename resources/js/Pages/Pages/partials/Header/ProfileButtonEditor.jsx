import React, { useState, useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Separator } from '@/Components/ui/separator';
import { resolveStyleValue } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const ProfileButtonEditor = ({
  buttonConfig,
  onUpdate,
  themeSettings,
  appliedTheme
}) => {
  const [localStyles, setLocalStyles] = useState(buttonConfig?.styles || {});

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

  const iconColor = resolveValue(localStyles.iconColor) || '#000000';
  const bgColor = resolveValue(localStyles.backgroundColor) || '#f0f0f0';
  const borderColor = resolveValue(localStyles.borderColor) || '#000000';

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Perfil</h4>

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
        <ColorPicker
          value={bgColor}
          onChange={handleBackgroundColorChange}
          showOpacity={false}
        />
      </div>

      <div>
        <Label htmlFor="profile-backgroundOpacity" className="text-xs">Opacidad del fondo (0-1)</Label>
        <Input
          id="profile-backgroundOpacity"
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
          <Label htmlFor="profile-borderWidth" className="text-xs">Ancho borde</Label>
          <Input
            id="profile-borderWidth"
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
          <Label htmlFor="profile-borderOpacity" className="text-xs">Opac. borde</Label>
          <Input
            id="profile-borderOpacity"
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
        <Label htmlFor="profile-borderRadius" className="text-xs">Radio de borde</Label>
        <Input
          id="profile-borderRadius"
          type="number"
          value={parseInt(localStyles.borderRadius) || 50}
          onChange={(e) => updateStyle('borderRadius', e.target.value)}
          className="h-8 text-xs"
          placeholder="50"
        />
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="profile-width" className="text-xs">Ancho</Label>
          <Input
            id="profile-width"
            type="number"
            value={parseInt(localStyles.width) || 36}
            onChange={(e) => updateStyle('width', e.target.value)}
            className="h-8 text-xs"
            placeholder="36"
          />
        </div>
        <div>
          <Label htmlFor="profile-height" className="text-xs">Alto</Label>
          <Input
            id="profile-height"
            type="number"
            value={parseInt(localStyles.height) || 36}
            onChange={(e) => updateStyle('height', e.target.value)}
            className="h-8 text-xs"
            placeholder="36"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileButtonEditor);