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

const ProductDetailNameComponent = ({
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

    const getComponentStyles2 = () => {
        const baseStyles = getStyles(comp);

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'paragraph';

        // Obtener estilos del tema para el tipo de texto
        const themeTextStyles = getTextStyles(themeWithDefaults, textStyle, appliedTheme);

        // Obtener estilos específicos del componente product-title
        const themeComponentStyles = getComponentStyles(themeWithDefaults, 'product-title', appliedTheme);

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
            case 'heading2':
            case 'heading3':
            case 'heading4':
            case 'heading5':
            case 'heading6':
                const level = textStyle.replace('heading', '');
                fontSize = customStyles.fontSize || themeWithDefaults?.[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`;
                fontWeight = customStyles.fontWeight || themeWithDefaults?.[`heading${level}_fontWeight`] || 'bold';
                lineHeight = customStyles.lineHeight || themeWithDefaults?.[`heading${level}_lineHeight`] || '1.2';
                textTransform = customStyles.textTransform || themeWithDefaults?.[`heading${level}_textTransform`] || 'none';
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
        const paddingTop = customStyles.paddingTop || '0px';
        const paddingRight = customStyles.paddingRight || '0px';
        const paddingBottom = customStyles.paddingBottom || '0px';
        const paddingLeft = customStyles.paddingLeft || '0px';

        // Layout
        const layout = customStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = customStyles.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

        // Color final resuelto
        const finalColor = customStyles.color || themeComponentStyles.color || themeWithDefaults.heading;

        return {
            ...baseStyles,
            width,
            textAlign,
            paddingTop: withUnit(paddingTop),
            paddingRight: withUnit(paddingRight),
            paddingBottom: withUnit(paddingBottom),
            paddingLeft: withUnit(paddingLeft),
            backgroundColor: customStyles.backgroundColor || 'transparent',
            borderRadius: withUnit(customStyles.borderRadius || themeWithDefaults.border_radius || '0px'),
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color: resolveValue(finalColor),
        };
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Obtener el nombre del producto o mostrar placeholder
    const displayName = product?.product_name || resolvedContent || (
        <span className="text-gray-400 italic">
            Nombre del producto (se obtiene dinámicamente)
        </span>
    );

    return (
        <div
            style={getComponentStyles2()}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {displayName}
        </div>
    );
};

export default ProductDetailNameComponent;