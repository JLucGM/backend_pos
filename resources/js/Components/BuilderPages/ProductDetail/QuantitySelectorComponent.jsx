import React, { useState } from 'react';
import { getThemeWithDefaults, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

const QuantitySelectorComponent = ({
    comp,
    maxQuantity = 99,
    onQuantityChange,
    themeSettings,
    appliedTheme
}) => {
    const [quantity, setQuantity] = useState(1);
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados del componente
    const rawStyles = comp.styles || {};
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    // Resolver contenido (por si contiene referencias)
    const rawContent = comp.content || {};
    const content = {};
    Object.keys(rawContent).forEach(key => {
        content[key] = resolveValue(rawContent[key]);
    });

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    // Función para obtener valores por defecto del tema (con resolución)
    const getThemeValue = (key, defaultValue) => {
        // Mapear las claves del componente a las claves del tema
        const themeMap = {
            'labelColor': themeSettings?.quantity_labelColor || themeSettings?.text_color,
            'borderColor': themeSettings?.quantity_borderColor || themeSettings?.border_color,
            'buttonColor': themeSettings?.quantity_buttonColor || themeSettings?.primary_color,
            'inputColor': themeWithDefaults.text,
            'borderRadius': themeSettings?.quantity_borderRadius || themeSettings?.border_radius,
            'buttonSize': themeSettings?.quantity_buttonSize || themeSettings?.button_font_size,
            'inputSize': themeSettings?.quantity_inputSize || themeSettings?.input_font_size,
        };

        // Prioridad 1: estilos personalizados del componente (ya resueltos)
        if (styles[key] !== undefined) {
            return styles[key];
        }

        // Prioridad 2: valor del tema (resolver por si acaso)
        const themeValue = themeMap[key];
        if (themeValue !== undefined) {
            return resolveValue(themeValue);
        }

        // Prioridad 3: valor por defecto (resolver por si acaso)
        return resolveValue(defaultValue);
    };

    const getThemeValueWithUnit = (key, unitKey, defaultValue) => {
        const value = getThemeValue(key, defaultValue);
        const unit = styles[unitKey] || (value.toString().includes('rem') ? 'rem' : (value.toString().includes('em') ? 'em' : 'px'));
        return withUnit(value, unit);
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
            ...styles,
            display: 'flex',
            alignItems: 'center',
            gap: withUnit(styles.gap || '8px'),
        }}>
            <label className="quantity-label text-sm font-medium" style={{
                color: getThemeValue('labelColor', '#666666'),
                minWidth: '70px',
            }}>
                {content.label || 'Cantidad:'}
            </label>

            <div className="flex items-center border rounded-md" style={{
                borderColor: getThemeValue('borderColor', '#d1d5db'),
                borderRadius: getThemeValueWithUnit('borderRadius', 'borderRadiusUnit', '6px'),
            }}>
                <button
                    type="button"
                    onClick={handleDecrement}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        borderRight: `1px solid ${getThemeValue('borderColor', '#d1d5db')}`,
                        color: getThemeValue('buttonColor', '#374151'),
                        fontSize: getThemeValueWithUnit('buttonSize', 'buttonSizeUnit', '16px'),
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
                        fontSize: getThemeValueWithUnit('inputSize', 'inputSizeUnit', '16px'),
                        color: getThemeValue('inputColor', themeWithDefaults.text),
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
                        fontSize: getThemeValueWithUnit('buttonSize', 'buttonSizeUnit', '16px'),
                    }}
                    disabled={quantity >= maxQuantity}
                >
                    +
                </button>
            </div>

            {content.showMax && maxQuantity < 20 && (
                <span className="text-xs text-gray-500">
                    Máx: {maxQuantity}
                </span>
            )}
        </div>
    );
};

export default QuantitySelectorComponent;