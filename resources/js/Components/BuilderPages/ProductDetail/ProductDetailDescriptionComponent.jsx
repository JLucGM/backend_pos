import React from 'react';
import {
    getThemeWithDefaults,
    getTextStyles,
    getResolvedFont,
    getComponentStyles,
    resolveStyleValue
} from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const ProductDetailDescriptionComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings,
    product,
    appliedTheme
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados del componente
    const rawStyles = comp.styles || {};
    const customStyles = {};
    Object.keys(rawStyles).forEach(key => {
        customStyles[key] = resolveValue(rawStyles[key]);
    });

    // Resolver contenido (por si contiene referencias)
    const resolvedContent = resolveValue(comp.content);

    const getDescriptionStyles = () => {
        const baseStyles = getStyles(comp);

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'paragraph';

        // Obtener estilos del tema para el tipo de texto
        const themeTextStyles = getTextStyles(themeWithDefaults, textStyle, appliedTheme);

        // Obtener estilos específicos del componente product-description
        const themeComponentStyles = getComponentStyles(themeWithDefaults, 'product-description', appliedTheme);

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = customStyles.fontType;

            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    return getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme);
                } else {
                    return getResolvedFont(themeWithDefaults, 'body_font', appliedTheme);
                }
            }

            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }

            return getResolvedFont(themeWithDefaults, fontType, appliedTheme) || themeTextStyles.fontFamily;
        };

        // Obtener configuración según el estilo seleccionado
        let fontSize, fontWeight, lineHeight, textTransform;

        switch (textStyle) {
            case 'paragraph':
                fontSize = customStyles.fontSize || themeWithDefaults?.paragraph_fontSize || '16px';
                fontWeight = customStyles.fontWeight || themeWithDefaults?.paragraph_fontWeight || 'normal';
                lineHeight = customStyles.lineHeight || themeWithDefaults?.paragraph_lineHeight || '1.6';
                textTransform = customStyles.textTransform || themeWithDefaults?.paragraph_textTransform || 'none';
                break;

            case 'heading1':
                fontSize = customStyles.fontSize || themeWithDefaults?.heading1_fontSize || '2.5rem';
                fontWeight = customStyles.fontWeight || themeWithDefaults?.heading1_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeWithDefaults?.heading1_lineHeight || '1.2';
                textTransform = customStyles.textTransform || themeWithDefaults?.heading1_textTransform || 'none';
                break;

            case 'heading2':
                fontSize = customStyles.fontSize || themeWithDefaults?.heading2_fontSize || '2rem';
                fontWeight = customStyles.fontWeight || themeWithDefaults?.heading2_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeWithDefaults?.heading2_lineHeight || '1.3';
                textTransform = customStyles.textTransform || themeWithDefaults?.heading2_textTransform || 'none';
                break;

            case 'heading3':
                fontSize = customStyles.fontSize || themeWithDefaults?.heading3_fontSize || '1.75rem';
                fontWeight = customStyles.fontWeight || themeWithDefaults?.heading3_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeWithDefaults?.heading3_lineHeight || '1.3';
                textTransform = customStyles.textTransform || themeWithDefaults?.heading3_textTransform || 'none';
                break;

            case 'heading4':
                fontSize = customStyles.fontSize || themeWithDefaults?.heading4_fontSize || '1.5rem';
                fontWeight = customStyles.fontWeight || themeWithDefaults?.heading4_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeWithDefaults?.heading4_lineHeight || '1.4';
                textTransform = customStyles.textTransform || themeWithDefaults?.heading4_textTransform || 'none';
                break;

            case 'heading5':
                fontSize = customStyles.fontSize || themeWithDefaults?.heading5_fontSize || '1.25rem';
                fontWeight = customStyles.fontWeight || themeWithDefaults?.heading5_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeWithDefaults?.heading5_lineHeight || '1.4';
                textTransform = customStyles.textTransform || themeWithDefaults?.heading5_textTransform || 'none';
                break;

            case 'heading6':
                fontSize = customStyles.fontSize || themeWithDefaults?.heading6_fontSize || '1rem';
                fontWeight = customStyles.fontWeight || themeWithDefaults?.heading6_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeWithDefaults?.heading6_lineHeight || '1.5';
                textTransform = customStyles.textTransform || themeWithDefaults?.heading6_textTransform || 'none';
                break;

            case 'custom':
            default:
                fontSize = withUnit(customStyles.fontSize || '16px', customStyles.fontSizeUnit || 'px');
                fontWeight = customStyles.fontWeight || 'normal';
                lineHeight = customStyles.lineHeight || '1.6';
                textTransform = customStyles.textTransform || 'none';
                break;
        }

        // Calcular line-height si es personalizado
        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (customStyles.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = customStyles.customLineHeight;
        }

        // Padding individual
        const paddingTop = withUnit(customStyles.paddingTop || themeWithDefaults?.spacing_small || '0px');
        const paddingRight = withUnit(customStyles.paddingRight || themeWithDefaults?.spacing_small || '0px');
        const paddingBottom = withUnit(customStyles.paddingBottom || themeWithDefaults?.spacing_small || '0px');
        const paddingLeft = withUnit(customStyles.paddingLeft || themeWithDefaults?.spacing_small || '0px');

        // Layout
        const layout = customStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = customStyles.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

        // Color del texto - usar color del tema como valor por defecto
        const textColor = customStyles.color || themeComponentStyles.color || themeWithDefaults.text;

        // Background color
        const backgroundColor = customStyles.backgroundColor || 'transparent';

        // Border radius - usar valores del tema
        const borderRadius = withUnit(customStyles.borderRadius || themeWithDefaults?.border_radius || '0px');

        // Margen
        const margin = customStyles.margin || `${themeWithDefaults?.spacing_medium || '1rem'} 0`;

        return {
            ...baseStyles,
            width,
            textAlign,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            margin,
            backgroundColor,
            borderRadius,
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color: textColor,
        };
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Obtener la descripción del producto o mostrar placeholder
    const displayDescription = product?.product_description || resolvedContent || (
        <span className="text-gray-400 italic">
            Descripción del producto (se obtiene dinámicamente)
        </span>
    );

    return (
        <div
            style={getDescriptionStyles()}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {displayDescription}
        </div>
    );
};

export default ProductDetailDescriptionComponent;