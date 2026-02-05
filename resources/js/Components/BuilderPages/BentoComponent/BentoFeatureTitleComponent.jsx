import React from 'react';
import { getThemeWithDefaults, getTextStyles, getResolvedFont } from '@/utils/themeUtils';

const BentoFeatureTitleComponent = ({
    comp,
    getStyles,
    themeSettings,
    appliedTheme,
    isPreview,
    onEdit,
    onDelete,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const getComponentStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};
        const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'heading4'; // Por defecto heading4 para títulos de características

        // Función para obtener la fuente usando utilidades del tema
        const getFontFamily = () => {
            const fontType = customStyles.fontType;

            // Si el usuario seleccionó "default" o no especificó nada
            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    return getResolvedFont(themeWithDefaults, `${textStyle}_font`);
                } else {
                    return getResolvedFont(themeWithDefaults, 'paragraph_font');
                }
            }

            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }

            return getResolvedFont(themeWithDefaults, fontType);
        };

        // Obtener configuración según el estilo seleccionado usando utilidades del tema
        let fontSize, fontWeight, lineHeight, textTransform, color;

        if (textStyle === 'custom') {
            fontSize = customStyles.fontSize || themeWithDefaults.heading4_fontSize;
            fontWeight = customStyles.fontWeight || themeWithDefaults.heading4_fontWeight;
            lineHeight = customStyles.lineHeight || themeWithDefaults.heading4_lineHeight;
            textTransform = customStyles.textTransform || themeWithDefaults.heading4_textTransform;
            color = customStyles.color || themeWithDefaults.heading;
        } else {
            // Usar utilidades del tema para obtener estilos consistentes
            const themeTextStyles = getTextStyles(themeWithDefaults, textStyle);
            fontSize = customStyles.fontSize || themeTextStyles.fontSize;
            fontWeight = customStyles.fontWeight || themeTextStyles.fontWeight;
            lineHeight = customStyles.lineHeight || themeTextStyles.lineHeight;
            textTransform = customStyles.textTransform || themeTextStyles.textTransform;
            color = customStyles.color || themeTextStyles.color;
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
            margin: '0 0 12px 0',
            backgroundColor: customStyles.backgroundColor || 'transparent',
            borderRadius: customStyles.borderRadius || '0px',
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color,
        };
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    const handleMouseEnter = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(comp.id);
        }
    };

    const handleMouseLeave = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(null);
        }
    };

    return (
        <h3
            style={getComponentStyles()}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {comp.content}
        </h3>
    );
};

export default BentoFeatureTitleComponent;
