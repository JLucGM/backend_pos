import React from 'react';
import { getThemeWithDefaults, getTextStyles, getResolvedFont, hslToCss, getComponentStyles } from '@/utils/themeUtils';

const ProductTitleComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings
}) => {
    // console.log(comp.styles)
    const computeTextStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};
        const themeWithDefaults = getThemeWithDefaults(themeSettings);
    console.log('ProductTitleComponent computeTextStyles', { id: comp.id, customStyles });

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'heading2'; // Por defecto heading2 para títulos de producto

        // Obtener estilos del tema para el tipo de texto (usar la utilidad importada)
        const themeTextStyles = getTextStyles(themeWithDefaults, textStyle);
        
        // Obtener estilos específicos del componente product-title
        const themeComponentStyles = getComponentStyles(themeWithDefaults, 'product-title');

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = customStyles.fontType;

            // Si el usuario seleccionó "default" o no especificó nada, usar el tema
            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    const headingKey = `${textStyle}_font`;
                    return getResolvedFont(themeWithDefaults, headingKey) || themeTextStyles.fontFamily;
                } else {
                    return getResolvedFont(themeWithDefaults, 'body_font') || themeTextStyles.fontFamily;
                }
            }

            // Si el usuario eligió una referencia genérica a heading, mapearla al nivel actual
            if (fontType === 'heading_font') {
                const headingKey = `${textStyle}_font`;
                return getResolvedFont(themeWithDefaults, headingKey) || themeTextStyles.fontFamily;
            }

            // Soporte para otras referencias de tema (subheading, accent, body, etc.)
            if (fontType === 'subheading_font' || fontType === 'accent_font' || fontType === 'body_font' || fontType.endsWith('_font')) {
                return getResolvedFont(themeWithDefaults, fontType) || themeTextStyles.fontFamily;
            }

            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }

            // Fallback al fontFamily calculado por el tema
            return themeTextStyles.fontFamily;
        };

        // Obtener configuración según el estilo seleccionado, con fallback a tema
        const fontSize = customStyles.fontSize || themeTextStyles.fontSize;
        const fontWeight = customStyles.fontWeight || themeTextStyles.fontWeight;
        const lineHeight = customStyles.lineHeight || themeTextStyles.lineHeight;
        const textTransform = customStyles.textTransform || themeTextStyles.textTransform;

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
        const alignment = customStyles.alignment || 'center';
        const textAlign = layout === 'fill' ? alignment : 'center';

        return {
            ...baseStyles,
            width,
            textAlign,
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            // Usar color del tema como fallback
            color: customStyles.color || themeComponentStyles.color || hslToCss(themeWithDefaults.heading),
            margin: 0,
            padding: '10px 0'
        };
    };

    // Manejo de eventos de mouse para edición
    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    return (
        <div 
            style={computeTextStyles()}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {comp.content}
        </div>
    );
};

export default ProductTitleComponent;