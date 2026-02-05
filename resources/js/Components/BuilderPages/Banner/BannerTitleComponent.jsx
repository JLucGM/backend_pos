import React from 'react';
import { getThemeWithDefaults, getTextStyles, getResolvedFont } from '@/utils/themeUtils';

const BannerTitleComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme
}) => {
    const getComponentStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};
        const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'heading1'; // Por defecto heading1 para títulos

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = customStyles.fontType;

            // Si el usuario seleccionó "default" o no especificó nada
            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    return getResolvedFont(themeWithDefaults, 'heading_font');
                } else {
                    return getResolvedFont(themeWithDefaults, 'body_font');
                }
            }

            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }

            switch (fontType) {
                case 'body_font':
                    return getResolvedFont(themeWithDefaults, 'body_font');
                case 'heading_font':
                    return getResolvedFont(themeWithDefaults, 'heading_font');
                case 'subheading_font':
                    return getResolvedFont(themeWithDefaults, 'subheading_font');
                case 'accent_font':
                    return getResolvedFont(themeWithDefaults, 'accent_font');
                default:
                    return getResolvedFont(themeWithDefaults, 'body_font');
            }
        };

        // Obtener configuración según el estilo seleccionado usando theme utils
        let fontSize, fontWeight, lineHeight, textTransform, color;

        if (textStyle.startsWith('heading')) {
            const themeTextStyles = getTextStyles(themeWithDefaults, textStyle);
            fontSize = customStyles.fontSize || themeTextStyles.fontSize;
            fontWeight = customStyles.fontWeight || themeTextStyles.fontWeight;
            lineHeight = customStyles.lineHeight || themeTextStyles.lineHeight;
            textTransform = customStyles.textTransform || themeTextStyles.textTransform;
            color = customStyles.color || themeTextStyles.color;
        } else {
            // Si no es heading, asumimos paragraph
            const themeTextStyles = getTextStyles(themeWithDefaults, 'paragraph');
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

        // Padding individual con valores por defecto del tema
        const paddingTop = customStyles.paddingTop || '10px';
        const paddingRight = customStyles.paddingRight || '10px';
        const paddingBottom = customStyles.paddingBottom || '10px';
        const paddingLeft = customStyles.paddingLeft || '10px';

        // Layout
        const layout = customStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = customStyles.alignment || 'center';
        const textAlign = layout === 'fill' ? alignment : 'center';

        // Background y opacity
        const background = customStyles.background || 'transparent';
        const backgroundOpacity = customStyles.backgroundOpacity || '1';
        let backgroundColor = 'transparent';
        if (background !== 'transparent') {
            // Convertir hex a rgb y aplicar opacidad
            const rgb = hexToRgb(background);
            backgroundColor = `rgba(${rgb}, ${backgroundOpacity})`;
        }

        // Helper para añadir unidad (px) si es solo número
        const withUnit = (value, unit = 'px') => {
            if (value === undefined || value === null || value === '') return undefined;
            // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
            if (typeof value === 'string' && isNaN(Number(value))) return value;
            return `${value}${unit}`;
        };

        return {
            ...baseStyles,
            width,
            textAlign,
            paddingTop: withUnit(paddingTop),
            paddingRight: withUnit(paddingRight),
            paddingBottom: withUnit(paddingBottom),
            paddingLeft: withUnit(paddingLeft),
            backgroundColor,
            borderRadius: withUnit(customStyles.borderRadius) || '0px',
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize: withUnit(fontSize, customStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px')),
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color,
        };
    };

    function hexToRgb(hex) {
        const longHex = hex.length === 4 ?
            `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(longHex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : '0, 0, 0';
    }

    return (
        <div style={getComponentStyles()}>
            {comp.content}
        </div>
    );
};

export default BannerTitleComponent;
