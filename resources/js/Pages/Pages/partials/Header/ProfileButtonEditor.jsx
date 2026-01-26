import React, { useState, useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Separator } from '@/Components/ui/separator';

const ProfileButtonEditor = ({ buttonConfig, onUpdate }) => {
  const [localStyles, setLocalStyles] = useState(buttonConfig?.styles || {});

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

  const updateStyle = (key, value) => {
    setLocalStyles(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Perfil</h4>

      {/* Color del icono */}
      <div>
        <Label htmlFor="profile-iconColor" className="text-xs">Color del icono</Label>
        <div className="flex gap-2">
          <Input
            id="profile-iconColor"
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
        <Label htmlFor="profile-backgroundColor" className="text-xs">Color de fondo</Label>
        <div className="flex gap-2">
          <Input
            id="profile-backgroundColor"
            value={localStyles.backgroundColor || '#f0f0f0'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="flex-1 h-8 text-xs"
          />
          <Input
            type="color"
            value={localStyles.backgroundColor || '#f0f0f0'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="w-8 h-8"
          />
        </div>
      </div>

      {/* Opacidad del fondo */}
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

      {/* Configuración del borde */}
      <div className="grid grid-cols-1 gap-2">
        <div>
          <Label htmlFor="profile-borderWidth" className="text-xs">Ancho borde</Label>
          <Input
            id="profile-borderWidth"
            type="number"
            value={parseInt(localStyles.borderWidth) || 0}
            onChange={(e) => updateStyle('borderWidth', `${e.target.value}px`)}
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="profile-borderColor" className="text-xs">Color borde</Label>
          <Input
            type="color"
            value={localStyles.borderColor || '#000000'}
            onChange={(e) => updateStyle('borderColor', e.target.value)}
            className="h-8 w-full"
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

      {/* Radio de borde */}
      <div>
        <Label htmlFor="profile-borderRadius" className="text-xs">Radio de borde (px)</Label>
        <Input
          id="profile-borderRadius"
          type="number"
          value={parseInt(localStyles.borderRadius) || 50}
          onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
          className="h-8 text-xs"
        />
      </div>

      <Separator />

      {/* Tamaño */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="profile-width" className="text-xs">Ancho (px)</Label>
          <Input
            id="profile-width"
            type="number"
            value={parseInt(localStyles.width) || 36}
            onChange={(e) => updateStyle('width', `${e.target.value}px`)}
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="profile-height" className="text-xs">Alto (px)</Label>
          <Input
            id="profile-height"
            type="number"
            value={parseInt(localStyles.height) || 36}
            onChange={(e) => updateStyle('height', `${e.target.value}px`)}
            className="h-8 text-xs"
          />
        </div>

        {/* <div>
          <Label htmlFor="profile-padding" className="text-xs">Padding (px)</Label>
          <Input
            id="profile-padding"
            type="number"
            value={parseInt(localStyles.padding) || 8}
            onChange={(e) => updateStyle('padding', `${e.target.value}px`)}
            className="h-8 text-xs"
          />
        </div> */}
      </div>
    </div>
  );
};

export default React.memo(ProfileButtonEditor);