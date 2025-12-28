import React from 'react';

const ProductDetailDescriptionComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings,
    product
}) => {
    const getTextStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'paragraph';
        const theme = themeSettings || {};

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = customStyles.fontType;
            
            // Si el usuario seleccionó "default" o no especificó nada
            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    return theme?.heading_font || theme?.heading_font_family || "'Inter', sans-serif";
                } else {
                    return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
                }
            }
            
            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }
            
            switch(fontType) {
                case 'body_font':
                    return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
                case 'heading_font':
                    return theme?.heading_font || theme?.heading_font_family || "'Inter', sans-serif";
                case 'subheading_font':
                    return theme?.subheading_font || "'Inter', sans-serif";
                case 'accent_font':
                    return theme?.accent_font || "'Georgia', serif";
                default:
                    return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
            }
        };

        // Obtener configuración según el estilo seleccionado
        let fontSize, fontWeight, lineHeight, textTransform;
        
        switch(textStyle) {
            case 'paragraph':
                fontSize = customStyles.fontSize || theme?.paragraph_size || theme?.paragraph_fontSize || '16px';
                fontWeight = customStyles.fontWeight || theme?.paragraph_fontWeight || 'normal';
                lineHeight = customStyles.lineHeight || theme?.paragraph_line_height || '1.6';
                textTransform = customStyles.textTransform || theme?.paragraph_textTransform || 'none';
                break;
                
            case 'heading1':
                fontSize = customStyles.fontSize || theme?.heading1_size || theme?.heading1_fontSize || '2.5rem';
                fontWeight = customStyles.fontWeight || theme?.heading1_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || theme?.heading1_line_height || '1.2';
                textTransform = customStyles.textTransform || theme?.heading1_case || 'none';
                break;
                
            case 'heading2':
                fontSize = customStyles.fontSize || theme?.heading2_size || theme?.heading2_fontSize || '2rem';
                fontWeight = customStyles.fontWeight || theme?.heading2_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || theme?.heading2_line_height || '1.3';
                textTransform = customStyles.textTransform || theme?.heading2_case || 'none';
                break;
                
            case 'heading3':
                fontSize = customStyles.fontSize || theme?.heading3_size || theme?.heading3_fontSize || '1.75rem';
                fontWeight = customStyles.fontWeight || theme?.heading3_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || theme?.heading3_line_height || '1.3';
                textTransform = customStyles.textTransform || theme?.heading3_case || 'none';
                break;
                
            case 'heading4':
                fontSize = customStyles.fontSize || theme?.heading4_size || theme?.heading4_fontSize || '1.5rem';
                fontWeight = customStyles.fontWeight || theme?.heading4_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || theme?.heading4_line_height || '1.4';
                textTransform = customStyles.textTransform || theme?.heading4_case || 'none';
                break;
                
            case 'heading5':
                fontSize = customStyles.fontSize || theme?.heading5_size || theme?.heading5_fontSize || '1.25rem';
                fontWeight = customStyles.fontWeight || theme?.heading5_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || theme?.heading5_line_height || '1.4';
                textTransform = customStyles.textTransform || theme?.heading5_case || 'none';
                break;
                
            case 'heading6':
                fontSize = customStyles.fontSize || theme?.heading6_size || theme?.heading6_fontSize || '1rem';
                fontWeight = customStyles.fontWeight || theme?.heading6_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || theme?.heading6_line_height || '1.5';
                textTransform = customStyles.textTransform || theme?.heading6_case || 'none';
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

        // Padding individual (usar valores del tema si existen)
        const paddingTop = customStyles.paddingTop || theme?.spacing_small || '0px';
        const paddingRight = customStyles.paddingRight || theme?.spacing_small || '0px';
        const paddingBottom = customStyles.paddingBottom || theme?.spacing_small || '0px';
        const paddingLeft = customStyles.paddingLeft || theme?.spacing_small || '0px';

        // Layout
        const layout = customStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = customStyles.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

        // Color del texto - usar color del tema como valor por defecto
        const textColor = customStyles.color || (theme?.text ? `hsl(${theme.text})` : '#000000');
        
        // Background color
        const backgroundColor = customStyles.backgroundColor || 'transparent';
        
        // Border radius - usar valores del tema
        const borderRadius = customStyles.borderRadius || theme?.border_radius || '0px';
        
        // Margen - usar valores del tema (spacing_medium como valor por defecto)
        const margin = customStyles.margin || `${theme?.spacing_medium || '1rem'} 0`;

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
    const displayDescription = product?.product_description || comp.content || (
        <span className="text-gray-400 italic">
            Descripción del producto (se obtiene dinámicamente)
        </span>
    );

    return (
        <div 
            style={getTextStyles()}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {displayDescription}
        </div>
    );
};

export default ProductDetailDescriptionComponent;