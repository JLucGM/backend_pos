// components/BuilderPages/components/HeadingComponent.jsx
import React from 'react';

const HeadingComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings }) => {
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
                return themeSettings?.heading_font || "'Inter', sans-serif";
            }
            
            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }
            
            switch(fontType) {
                case 'body_font':
                    return themeSettings?.body_font || "'Inter', sans-serif";
                case 'heading_font':
                    return themeSettings?.heading_font || "'Inter', sans-serif";
                case 'subheading_font':
                    return themeSettings?.subheading_font || "'Inter', sans-serif";
                case 'accent_font':
                    return themeSettings?.accent_font || "'Inter', sans-serif";
                default:
                    return themeSettings?.heading_font || "'Inter', sans-serif";
            }
        };

        // Obtener configuración según el nivel
        let fontSize, fontWeight, lineHeight, textTransform;
        
        if (textStyle === 'custom') {
            fontSize = customStyles.fontSize || '32px';
            fontWeight = customStyles.fontWeight || 'bold';
            lineHeight = customStyles.lineHeight || 'tight';
            textTransform = customStyles.textTransform || 'none';
        } else {
            fontSize = customStyles.fontSize || themeSettings?.[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`;
            fontWeight = customStyles.fontWeight || themeSettings?.[`heading${level}_fontWeight`] || 'bold';
            lineHeight = customStyles.lineHeight || themeSettings?.[`heading${level}_lineHeight`] || 'tight';
            textTransform = customStyles.textTransform || themeSettings?.[`heading${level}_textTransform`] || 'none';
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
            color: customStyles.color || '#000000',
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