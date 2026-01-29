// components/BuilderPages/components/HeadingComponent.jsx
import React from 'react';
import { getTextStyles, getResolvedFont, getThemeWithDefaults, hslToCss } from '@/utils/themeUtils';

const HeadingComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings }) => {
    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings);
    
    const getHeadingStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Determinar el nivel del heading a partir de textStyle
        const textStyle = customStyles.textStyle || 'heading2';
        const level = textStyle === 'custom' ? 2 : parseInt(textStyle.replace('heading', ''), 10) || 2;

        // Función para obtener la fuente
        const getFontFamily = () => {
            const fontType = customStyles.fontType;
            
            if (fontType === 'default' || !fontType) {
                return getResolvedFont(themeWithDefaults, `heading${level}_font`);
            }
            
            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }
            
            return getResolvedFont(themeWithDefaults, fontType);
        };

        // Obtener configuración según el nivel usando utilidades del tema
        let fontSize, fontWeight, lineHeight, textTransform;
        
        if (textStyle === 'custom') {
            fontSize = customStyles.fontSize || themeWithDefaults[`heading${level}_fontSize`];
            fontWeight = customStyles.fontWeight || themeWithDefaults[`heading${level}_fontWeight`];
            lineHeight = customStyles.lineHeight || themeWithDefaults[`heading${level}_lineHeight`];
            textTransform = customStyles.textTransform || themeWithDefaults[`heading${level}_textTransform`];
        } else {
            // Usar utilidades del tema para obtener estilos consistentes
            const themeTextStyles = getTextStyles(themeWithDefaults, textStyle);
            fontSize = customStyles.fontSize || themeTextStyles.fontSize;
            fontWeight = customStyles.fontWeight || themeTextStyles.fontWeight;
            lineHeight = customStyles.lineHeight || themeTextStyles.lineHeight;
            textTransform = customStyles.textTransform || themeTextStyles.textTransform;
        }

        // Calcular line-height
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
            borderRadius: customStyles.borderRadius || '0px',
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform: textTransform === 'default' ? 'none' : textTransform,
            color: customStyles.color || hslToCss(themeWithDefaults.heading),
        };
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        onEdit && onEdit();
    };

    // Extraer el texto del contenido (ahora es un string)
    const getTextContent = () => {
        if (!comp.content) return '';
        
        if (typeof comp.content === 'string') {
            return comp.content;
        }
        
        // Compatibilidad con formato antiguo
        if (typeof comp.content === 'object' && comp.content !== null) {
            return comp.content.text || comp.content.title || '';
        }
        
        return String(comp.content);
    };

    // Determinar la etiqueta HTML según textStyle
    const getTagName = () => {
        const textStyle = comp.styles?.textStyle || 'heading2';
        if (textStyle === 'custom') {
            return 'h2'; // Por defecto para custom
        }
        const level = parseInt(textStyle.replace('heading', ''), 10) || 2;
        return `h${Math.min(Math.max(level, 1), 6)}`;
    };

    const Tag = getTagName();
    const textContent = getTextContent();

    return (
        <Tag 
            style={getHeadingStyles()} 
            onDoubleClick={isPreview ? undefined : handleDoubleClick}
        >
            {textContent}
        </Tag>
    );
};

export default HeadingComponent;