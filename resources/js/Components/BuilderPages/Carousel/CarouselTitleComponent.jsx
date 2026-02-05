import React from 'react';
import { getThemeWithDefaults, getTextStyles, getResolvedFont } from '@/utils/themeUtils';

const CarouselTitleComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme
}) => {
    const styles = comp.styles || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Obtener configuración de fuente del tema usando utilidades
    const getFontFamily = () => {
        const fontType = styles.fontType;

        if (fontType === 'default' || !fontType) {
            return getResolvedFont(themeWithDefaults, 'heading_font');
        }

        if (fontType === 'custom' && styles.customFont) {
            return styles.customFont;
        }

        return getResolvedFont(themeWithDefaults, fontType);
    };

    // Determinar qué heading level usar (por defecto heading2) con utilidades del tema
    const textStyle = styles.textStyle || 'heading2';
    let fontSize, fontWeight, lineHeight, textTransform, color;

    if (textStyle === 'custom') {
        fontSize = styles.fontSize || themeWithDefaults.heading2_fontSize;
        fontWeight = styles.fontWeight || themeWithDefaults.heading2_fontWeight;
        lineHeight = styles.lineHeight || themeWithDefaults.heading2_lineHeight;
        textTransform = styles.textTransform || themeWithDefaults.heading2_textTransform;
        color = styles.color || themeWithDefaults.heading;
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
        ...getStyles(comp),
        color,
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
