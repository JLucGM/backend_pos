import React from 'react';

const ProductNameComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings // Añadimos themeSettings
}) => {
    const getTextStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'paragraph'; // Por defecto paragraph para nombres

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

        // Layout
        const layout = customStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = customStyles.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

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
            color: customStyles.color || '#000000',
            margin: '10px 0 5px 0',
        };
    };

    // Manejo de eventos de mouse para edición (solo estilos)
    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    return (
        <div 
            style={getTextStyles()}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {comp.content || (
                <span className="text-gray-400 italic">
                    Nombre del producto (se obtiene de la base de datos)
                </span>
            )}
        </div>
    );
};

export default ProductNameComponent;