import React from 'react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getTextStyles, getResolvedFont, hslToCss } from '@/utils/themeUtils';

const CarouselPriceComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings
}) => {
    const { settings } = usePage().props;
    const styles = comp.styles || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings);
    
    // Obtener configuración de fuente del tema usando utilidades
    const getFontFamily = () => {
        const fontType = styles.fontType;
        
        if (fontType === 'default' || !fontType) {
            return getResolvedFont(themeWithDefaults, 'body_font');
        }
        
        if (fontType === 'custom' && styles.customFont) {
            return styles.customFont;
        }
        
        return getResolvedFont(themeWithDefaults, fontType);
    };

    // Usar estilo de párrafo por defecto para precios con utilidades del tema
    const textStyle = styles.textStyle || 'paragraph';
    let fontSize, fontWeight, lineHeight, textTransform, color;
    
    if (textStyle === 'custom') {
        fontSize = styles.fontSize || themeWithDefaults.paragraph_fontSize;
        fontWeight = styles.fontWeight || themeWithDefaults.paragraph_fontWeight;
        lineHeight = styles.lineHeight || themeWithDefaults.paragraph_lineHeight;
        textTransform = styles.textTransform || themeWithDefaults.paragraph_textTransform;
        color = styles.color || hslToCss(themeWithDefaults.text);
    } else {
        // Usar utilidades del tema para obtener estilos consistentes
        const themeTextStyles = getTextStyles(themeWithDefaults, textStyle);
        fontSize = styles.fontSize || themeTextStyles.fontSize;
        fontWeight = styles.fontWeight || themeTextStyles.fontWeight;
        lineHeight = styles.lineHeight || themeTextStyles.lineHeight;
        textTransform = styles.textTransform || themeTextStyles.textTransform;
        color = styles.color || themeTextStyles.color;
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
        color,
        fontSize,
        fontWeight,
        textAlign: styles.alignment || 'left',
        margin: '5px 0',
        padding: '0 10px',
        width: styles.layout === 'fill' ? '100%' : 'auto',
        fontFamily: getFontFamily(),
        lineHeight: finalLineHeight,
        textTransform,
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Mostrar precio con moneda si hay configuración disponible
    const renderPrice = () => {
        if (settings?.currency && comp.content && typeof comp.content === 'number') {
            return <CurrencyDisplay currency={settings.currency} amount={comp.content} />;
        }
        
        return comp.content || (
            <span className="text-gray-400 italic">
                Precio del producto (se obtiene de la base de datos)
            </span>
        );
    };

    return (
        <div 
            style={componentStyles}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {renderPrice()}
        </div>
    );
};

export default CarouselPriceComponent;