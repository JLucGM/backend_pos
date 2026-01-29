import React, { useState } from 'react';
import { getThemeWithDefaults, hslToCss, getResolvedFont } from '@/utils/themeUtils';

const QuantitySelectorComponent = ({ 
    comp, 
    maxQuantity = 99, 
    onQuantityChange,
    themeSettings // Añadir themeSettings como prop
}) => {
    const [quantity, setQuantity] = useState(1);
    const themeWithDefaults = getThemeWithDefaults(themeSettings);

    // Función para obtener valores por defecto del tema
    const getThemeValue = (key, defaultValue) => {
        // Mapear las claves del componente a las claves del tema
        const themeMap = {
            'labelColor': themeSettings?.quantity_labelColor || themeSettings?.text_color || '#666666',
            'borderColor': themeSettings?.quantity_borderColor || themeSettings?.border_color || '#d1d5db',
            'buttonColor': themeSettings?.quantity_buttonColor || themeSettings?.primary_color || '#374151',
            'inputColor': hslToCss(themeWithDefaults.text),
            'borderRadius': themeSettings?.quantity_borderRadius || themeSettings?.border_radius || '6px',
            'buttonSize': themeSettings?.quantity_buttonSize || themeSettings?.button_font_size || '16px',
            'inputSize': themeSettings?.quantity_inputSize || themeSettings?.input_font_size || '16px',
        };
        
        return comp.styles?.[key] || themeMap[key] || defaultValue;
    };

    const handleIncrement = () => {
        if (quantity < maxQuantity) {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            if (onQuantityChange) onQuantityChange(newQuantity);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            if (onQuantityChange) onQuantityChange(newQuantity);
        }
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        const newQuantity = Math.min(Math.max(1, value), maxQuantity);
        setQuantity(newQuantity);
        if (onQuantityChange) onQuantityChange(newQuantity);
    };

    return (
        <div className="quantity-selector" style={{
            ...comp.styles,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        }}>
            <label className="quantity-label text-sm font-medium" style={{
                color: getThemeValue('labelColor', '#666666'),
                minWidth: '70px',
            }}>
                {comp.content?.label || 'Cantidad:'}
            </label>
            
            <div className="flex items-center border rounded-md" style={{
                borderColor: getThemeValue('borderColor', '#d1d5db'),
                borderRadius: getThemeValue('borderRadius', '6px'),
            }}>
                <button
                    type="button"
                    onClick={handleDecrement}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        borderRight: `1px solid ${getThemeValue('borderColor', '#d1d5db')}`,
                        color: getThemeValue('buttonColor', '#374151'),
                        fontSize: getThemeValue('buttonSize', '16px'),
                    }}
                    disabled={quantity <= 1}
                >
                    -
                </button>
                
                <input
                    type="number"
                    min="1"
                    max={maxQuantity}
                    value={quantity}
                    onChange={handleInputChange}
                    className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
                    style={{
                        fontSize: getThemeValue('inputSize', '16px'),
                        color: getThemeValue('inputColor', hslToCss(themeWithDefaults.text)),
                        backgroundColor: 'transparent',
                    }}
                />
                
                <button
                    type="button"
                    onClick={handleIncrement}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        borderLeft: `1px solid ${getThemeValue('borderColor', '#d1d5db')}`,
                        color: getThemeValue('buttonColor', '#374151'),
                        fontSize: getThemeValue('buttonSize', '16px'),
                    }}
                    disabled={quantity >= maxQuantity}
                >
                    +
                </button>
            </div>
            
            {comp.content?.showMax && maxQuantity < 20 && (
                <span className="text-xs text-gray-500">
                    Máx: {maxQuantity}
                </span>
            )}
        </div>
    );
};

export default QuantitySelectorComponent;