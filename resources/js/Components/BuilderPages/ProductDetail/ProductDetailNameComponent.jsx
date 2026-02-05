import React from 'react';
import { getThemeWithDefaults, getTextStyles, getResolvedFont, getComponentStyles } from '@/utils/themeUtils';

const ProductDetailNameComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings,
    product,
    appliedTheme
}) => {
    const getComponentStyles2 = () => {  // Nombre diferente
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};
        const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'paragraph';

        // Obtener estilos del tema para el tipo de texto
        const themeTextStyles = getTextStyles(themeWithDefaults, textStyle); // ✅ Usa la función importada

        // Obtener estilos específicos del componente product-title
        const themeComponentStyles = getComponentStyles(themeWithDefaults, 'product-title', appliedTheme);

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = customStyles.fontType;

            // Si el usuario seleccionó "default" o no especificó nada, usar el tema
            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    return getResolvedFont(themeWithDefaults, 'heading_font');
                } else {
                    return getResolvedFont(themeWithDefaults, 'body_font');
                }
            }

            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }

            // Usar getResolvedFont para resolver referencias de fuentes
            return getResolvedFont(themeWithDefaults, fontType) || themeTextStyles.fontFamily;
        };

        // Obtener configuración según el estilo seleccionado
        let fontSize, fontWeight, lineHeight, textTransform;

        switch (textStyle) {
            case 'paragraph':
                fontSize = customStyles.fontSize || themeSettings?.paragraph_fontSize || '16px';
                fontWeight = customStyles.fontWeight || themeSettings?.paragraph_fontWeight || 'normal';
                lineHeight = customStyles.lineHeight || themeSettings?.paragraph_lineHeight || '1.6';
                textTransform = customStyles.textTransform || themeSettings?.paragraph_textTransform || 'none';
                break;

            case 'heading1':
            case 'heading2':
            case 'heading3':
            case 'heading4':
            case 'heading5':
            case 'heading6':
                const level = textStyle.replace('heading', '');
                fontSize = customStyles.fontSize || themeSettings?.[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`;
                fontWeight = customStyles.fontWeight || themeSettings?.[`heading${level}_fontWeight`] || 'bold';
                lineHeight = customStyles.lineHeight || themeSettings?.[`heading${level}_lineHeight`] || '1.2';
                textTransform = customStyles.textTransform || themeSettings?.[`heading${level}_textTransform`] || 'none';
                break;

            case 'custom':
            default:
                fontSize = customStyles.fontSize || '16px';
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

        return {
            ...baseStyles,
            width,
            textAlign,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            backgroundColor: customStyles.backgroundColor || 'transparent',
            borderRadius: customStyles.borderRadius || themeWithDefaults.border_radius || '0px',
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            // Usar color del tema como fallback
            color: customStyles.color || themeComponentStyles.color || themeWithDefaults.heading,
        };
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Obtener el nombre del producto o mostrar placeholder
    const displayName = product?.product_name || comp.content || (
        <span className="text-gray-400 italic">
            Nombre del producto (se obtiene dinámicamente)
        </span>
    );

    return (
        <div
            style={getComponentStyles2()}  // ✅ Nombre diferente
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {displayName}
        </div>
    );
};

export default ProductDetailNameComponent;
