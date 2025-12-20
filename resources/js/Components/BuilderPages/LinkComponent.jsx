import React from 'react';

const LinkComponent = ({ 
    comp, 
    getStyles, 
    onEdit, 
    isPreview, 
    themeSettings 
}) => {
    const getLinkStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'paragraph';

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = customStyles.fontType;
            
            // Si el usuario seleccionó "default" o no especificó nada
            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    return themeSettings?.heading_font || "'Inter', sans-serif";
                } else {
                    return themeSettings?.body_font || "'Inter', sans-serif";
                }
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
                    return themeSettings?.body_font || "'Inter', sans-serif";
            }
        };

        // Obtener configuración según el estilo seleccionado
        let fontSize, fontWeight, lineHeight, textTransform;
        
        if (textStyle.startsWith('heading')) {
            const level = textStyle.replace('heading', '');
            fontSize = customStyles.fontSize || themeSettings?.[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`;
            fontWeight = customStyles.fontWeight || themeSettings?.[`heading${level}_fontWeight`] || 'bold';
            lineHeight = customStyles.lineHeight || themeSettings?.[`heading${level}_lineHeight`] || '1.2';
            textTransform = customStyles.textTransform || themeSettings?.[`heading${level}_textTransform`] || 'none';
        } else {
            // Paragraph o custom
            fontSize = customStyles.fontSize || themeSettings?.paragraph_fontSize || '16px';
            fontWeight = customStyles.fontWeight || themeSettings?.paragraph_fontWeight || 'normal';
            lineHeight = customStyles.lineHeight || themeSettings?.paragraph_lineHeight || '1.6';
            textTransform = customStyles.textTransform || themeSettings?.paragraph_textTransform || 'none';
        }

        // Calcular line-height si es personalizado
        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (customStyles.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = customStyles.customLineHeight;
        }

        // Estilos del enlace
        const linkStyle = {
            ...baseStyles,
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color: customStyles.color || (themeSettings?.links ? `hsl(${themeSettings.links})` : '#0000EE'),
            textDecoration: customStyles.textDecoration || 'underline',
            cursor: 'pointer',
            display: 'inline-block',
            transition: 'color 0.2s, text-decoration 0.2s',
        };

        // Manejar hover (esto no funcionará en React inline styles, necesita CSS)
        // Moveremos el hover a className
        return linkStyle;
    };

    // EXTRAER EL CONTENIDO DEL ENLACE
    const getLinkContent = () => {
        if (!comp.content) return { url: '#', text: 'Enlace' };
        
        // Si content es una cadena, asumimos que es la URL
        if (typeof comp.content === 'string') {
            return { url: comp.content, text: comp.content };
        }
        
        // Si content es un objeto, extraer url y text
        if (typeof comp.content === 'object' && comp.content !== null) {
            return {
                url: comp.content.url || comp.content.href || '#',
                text: comp.content.text || comp.content.label || 'Enlace'
            };
        }
        
        return { url: '#', text: 'Enlace' };
    };

    const linkContent = getLinkContent();

    // Clases para hover
    const hoverClasses = isPreview ? '' : 'hover:opacity-80';

    return (
        <a
            href={linkContent.url}
            target="_blank"
            rel="noopener noreferrer"
            style={getLinkStyles()}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            className={`${hoverClasses} hover:text-blue-700 hover:underline`}
        >
            {linkContent.text}
        </a>
    );
};

export default LinkComponent;