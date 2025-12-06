// components/Builder/components/HeadingComponent.jsx
import React from 'react';

const HeadingComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings }) => {
    const getHeadingStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Determinar el nivel del heading (default: h1)
        const level = comp.level || 1;

        // Obtener configuración de fuente
        const getFontFamily = () => {
            if (customStyles.fontFamily) {
                return customStyles.fontFamily;
            }
            
            const fontType = customStyles.fontType || `heading${level}_font`;
            switch(fontType) {
                case 'body_font':
                    return themeSettings?.body_font || "'Inter', sans-serif";
                case 'heading_font':
                    return themeSettings?.heading_font || "'Inter', sans-serif";
                case 'subheading_font':
                    return themeSettings?.subheading_font || "'Inter', sans-serif";
                case 'accent_font':
                    return themeSettings?.accent_font || "'Inter', sans-serif";
                case 'custom':
                    return customStyles.customFont || themeSettings?.heading_font || "'Inter', sans-serif";
                default:
                    return themeSettings?.heading_font || "'Inter', sans-serif";
            }
        };

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

        // Estilos del tema según el nivel
        const fontSize = customStyles.fontSize || 
            themeSettings?.[`heading${level}_fontSize`] || 
            `${3.5 - (level * 0.25)}rem`;
        
        const fontWeight = customStyles.fontWeight || 
            themeSettings?.[`heading${level}_fontWeight`] || 
            'bold';

        // Calcular line-height
        let lineHeight = customStyles.lineHeight || 
            themeSettings?.[`heading${level}_lineHeight`] || 
            'tight';
        if (lineHeight === 'tight') lineHeight = '1.2';
        if (lineHeight === 'normal') lineHeight = '1.4';
        if (lineHeight === 'loose') lineHeight = '1.6';
        if (themeSettings?.[`heading${level}_lineHeight_custom`] && lineHeight === 'custom') {
            lineHeight = themeSettings[`heading${level}_lineHeight_custom`];
        }

        const textTransform = customStyles.textTransform || 
            themeSettings?.[`heading${level}_textTransform`] || 
            'default';

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
            lineHeight,
            textTransform: textTransform === 'default' ? 'none' : textTransform,
            color: customStyles.color || '#000000',
        };
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        onEdit && onEdit();
    };

    // Renderizar el heading con el nivel correcto
    const HeadingTag = `h${comp.level || 1}`;
    
    return (
        <HeadingTag style={getHeadingStyles()} onDoubleClick={isPreview ? undefined : handleDoubleClick}>
            {comp.content}
        </HeadingTag>
    );
};

export default HeadingComponent;