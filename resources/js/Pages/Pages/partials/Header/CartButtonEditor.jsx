import React, { useState, useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Separator } from '@/Components/ui/separator';

const CartButtonEditor = ({ buttonConfig, onUpdate }) => {
  const [localStyles, setLocalStyles] = useState(buttonConfig?.styles || {});
  const [localCount, setLocalCount] = useState(buttonConfig?.count || '0');

  // Sincronizar cambios locales con el estado global después de un delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate({
        ...buttonConfig,
        styles: localStyles,
        count: localCount
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [localStyles, localCount]);

  const updateStyle = (key, value) => {
    setLocalStyles(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Carrito</h4>

      {/* Contador del carrito */}
      <div>
        <Label htmlFor="cartCount" className="text-xs">Contador del carrito</Label>
        <Input
          id="cartCount"
          value={localCount}
          onChange={(e) => setLocalCount(e.target.value)}
          className="h-8 text-xs"
          placeholder="Dejar vacío para ocultar"
        />
      </div>

      {/* Color del icono */}
      <div>
        <Label htmlFor="cart-iconColor" className="text-xs">Color del icono</Label>
        <div className="flex gap-2">
          <Input
            id="cart-iconColor"
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
        <Label htmlFor="cart-backgroundColor" className="text-xs">Color de fondo</Label>
        <div className="flex gap-2">
          <Input
            id="cart-backgroundColor"
            value={localStyles.backgroundColor || '#000000'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="flex-1 h-8 text-xs"
          />
          <Input
            type="color"
            value={localStyles.backgroundColor || '#000000'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="w-8 h-8"
          />
        </div>
      </div>

      {/* Opacidad del fondo */}
      <div>
        <Label htmlFor="cart-backgroundOpacity" className="text-xs">Opacidad del fondo (0-1)</Label>
        <Input
          id="cart-backgroundOpacity"
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
          <Label htmlFor="cart-borderWidth" className="text-xs">Ancho borde</Label>
          <Input
            id="cart-borderWidth"
            type="number"
            value={parseInt(localStyles.borderWidth) || 0}
            onChange={(e) => updateStyle('borderWidth', `${e.target.value}px`)}
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="cart-borderColor" className="text-xs">Color borde</Label>
          <Input
            type="color"
            value={localStyles.borderColor || '#000000'}
            onChange={(e) => updateStyle('borderColor', e.target.value)}
            className="h-8 w-full"
          />
        </div>

        <div>
          <Label htmlFor="cart-borderOpacity" className="text-xs">Opac. borde</Label>
          <Input
            id="cart-borderOpacity"
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
        <Label htmlFor="cart-borderRadius" className="text-xs">Radio de borde (px)</Label>
        <Input
          id="cart-borderRadius"
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
          <Label htmlFor="cart-width" className="text-xs">Ancho (px)</Label>
          <Input
            id="cart-width"
            type="number"
            value={parseInt(localStyles.width) || 36}
            onChange={(e) => updateStyle('width', `${e.target.value}px`)}
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="cart-height" className="text-xs">Alto (px)</Label>
          <Input
            id="cart-height"
            type="number"
            value={parseInt(localStyles.height) || 36}
            onChange={(e) => updateStyle('height', `${e.target.value}px`)}
            className="h-8 text-xs"
          />
        </div>

        {/* <div>
          <Label htmlFor="cart-padding" className="text-xs">Padding (px)</Label>
          <Input
            id="cart-padding"
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

export default React.memo(CartButtonEditor);