import React from 'react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getTextStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

const ProductPriceComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme
}) => {
    const { settings } = usePage().props;
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados
    const rawStyles = comp.styles || {};
    const customStyles = {};
    Object.keys(rawStyles).forEach(key => {
        customStyles[key] = resolveValue(rawStyles[key]);
    });

    const getComponentStyles = () => {
        const baseStyles = getStyles(comp);

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'paragraph'; // Por defecto paragraph para precios

        // Función para obtener la fuente usando utilidades del tema
        const getFontFamily = () => {
            const fontType = customStyles.fontType;

            // Si el usuario seleccionó "default" o no especificó nada
            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    return getResolvedFont(themeWithDefaults, `${textStyle}_font`, appliedTheme);
                } else {
                    return getResolvedFont(themeWithDefaults, 'paragraph_font', appliedTheme);
                }
            }

            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }

            return getResolvedFont(themeWithDefaults, fontType, appliedTheme);
        };

        // Helper para añadir unidad (px) si es solo número
        const withUnit = (value, unit = 'px') => {
            if (value === undefined || value === null || value === '') return undefined;
            if (typeof value === 'string' && isNaN(Number(value))) return value;
            return `${value}${unit}`;
        };

        // Obtener configuración según el estilo seleccionado usando utilidades del tema
        let fontSize, fontSizeUnit, fontWeight, lineHeight, textTransform, color;

        if (textStyle === 'custom') {
            fontSize = customStyles.fontSize || themeWithDefaults.paragraph_fontSize;
            fontSizeUnit = customStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px');
            fontWeight = customStyles.fontWeight || themeWithDefaults.paragraph_fontWeight;
            lineHeight = customStyles.lineHeight || themeWithDefaults.paragraph_lineHeight;
            textTransform = customStyles.textTransform || themeWithDefaults.paragraph_textTransform;
            color = customStyles.color || themeWithDefaults.text;
        } else {
            // Usar utilidades del tema para obtener estilos consistentes
            const themeTextStyles = getTextStyles(themeWithDefaults, textStyle, appliedTheme);
            fontSize = customStyles.fontSize || themeTextStyles.fontSize;
            fontSizeUnit = customStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px');
            fontWeight = customStyles.fontWeight || themeTextStyles.fontWeight;
            lineHeight = customStyles.lineHeight || themeTextStyles.lineHeight;
            textTransform = customStyles.textTransform || themeTextStyles.textTransform;
            color = customStyles.color || themeTextStyles.color;
        }

        // Calcular line-height si es personalizado
        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (customStyles.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = customStyles.customLineHeight;
        }

        // Layout
        const layout = customStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = customStyles.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

        // Color final resuelto
        const finalColor = resolveValue(color);

        return {
            ...baseStyles,
            width,
            textAlign,
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize: withUnit(fontSize, fontSizeUnit),
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color: finalColor,
            margin: '5px 0',
        };
    };

    // Manejo de eventos de mouse para edición (solo estilos)
    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Mostrar precio con moneda si hay configuración disponible
    const renderPrice = () => {
        if (settings?.currency && comp.content && typeof comp.content === 'number') {
            return <CurrencyDisplay currency={settings.currency} amount={comp.content} />;
        }

        return comp.content || (
            <span className="text-gray-400 italic">
                Precio del producto (se obtiene de la base de datos)
            </span>
        );
    };

    return (
        <div
            style={getComponentStyles()}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {renderPrice()}
        </div>
    );
};

export default ProductPriceComponent;