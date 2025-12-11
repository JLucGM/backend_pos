import React from 'react';

const CarouselTitleComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings
}) => {
    const styles = comp.styles || {};
    
    // Obtener configuración de fuente del tema
    const getFontFamily = () => {
        const fontType = styles.fontType;
        
        if (fontType === 'default' || !fontType) {
            return themeSettings?.heading_font || "'Inter', sans-serif";
        }
        
        if (fontType === 'custom' && styles.customFont) {
            return styles.customFont;
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

    // Determinar qué heading level usar (por defecto heading2)
    const textStyle = styles.textStyle || 'heading2';
    let fontSize, fontWeight, lineHeight, textTransform;
    
    if (textStyle.startsWith('heading')) {
        const level = textStyle.replace('heading', '');
        fontSize = styles.fontSize || themeSettings?.[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`;
        fontWeight = styles.fontWeight || themeSettings?.[`heading${level}_fontWeight`] || 'bold';
        lineHeight = styles.lineHeight || themeSettings?.[`heading${level}_lineHeight`] || '1.2';
        textTransform = styles.textTransform || themeSettings?.[`heading${level}_textTransform`] || 'none';
    } else {
        fontSize = styles.fontSize || themeSettings?.paragraph_fontSize || '16px';
        fontWeight = styles.fontWeight || themeSettings?.paragraph_fontWeight || 'normal';
        lineHeight = styles.lineHeight || themeSettings?.paragraph_lineHeight || '1.6';
        textTransform = styles.textTransform || themeSettings?.paragraph_textTransform || 'none';
    }

    // Calcular line-height si es personalizado
    let finalLineHeight = lineHeight;
    if (lineHeight === 'tight') finalLineHeight = '1.2';
    if (lineHeight === 'normal') finalLineHeight = '1.4';
    if (lineHeight === 'loose') finalLineHeight = '1.6';
    if (styles.customLineHeight && lineHeight === 'custom') {
        finalLineHeight = styles.customLineHeight;
    }

    const componentStyles = {
        ...getStyles(comp),
        color: styles.color || '#000000',
        fontSize,
        fontWeight,
        lineHeight: finalLineHeight,
        textAlign: styles.alignment || 'center',
        margin: 0,
        width: styles.layout === 'fill' ? '100%' : 'auto',
        fontFamily: getFontFamily(),
        textTransform,
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    return (
        <div 
            style={componentStyles}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {comp.content}
        </div>
    );
};

export default CarouselTitleComponent;