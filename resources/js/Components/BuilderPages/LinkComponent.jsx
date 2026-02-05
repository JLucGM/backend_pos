import React from 'react';
import { getTextStyles as getThemeTextStyles, getResolvedFont, getThemeWithDefaults } from '@/utils/themeUtils';

const LinkComponent = ({
    comp,
    getStyles,
    onEdit,
    isPreview,
    themeSettings,
    appliedTheme
}) => {
    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

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
            fontSize = customStyles.fontSize || themeWithDefaults.paragraph_fontSize;
            fontWeight = customStyles.fontWeight || themeWithDefaults.paragraph_fontWeight;
            lineHeight = customStyles.lineHeight || themeWithDefaults.paragraph_lineHeight;
            textTransform = customStyles.textTransform || themeWithDefaults.paragraph_textTransform;
            color = customStyles.color || themeWithDefaults.links;
        } else {
            // Usar utilidades del tema para obtener estilos consistentes
            const themeTextStyles = getThemeTextStyles(themeWithDefaults, textStyle);
            fontSize = customStyles.fontSize || themeTextStyles.fontSize;
            fontWeight = customStyles.fontWeight || themeTextStyles.fontWeight;
            lineHeight = customStyles.lineHeight || themeTextStyles.lineHeight;
            textTransform = customStyles.textTransform || themeTextStyles.textTransform;
            color = customStyles.color || themeWithDefaults.links;
        }

        // Calcular line-height si es personalizado
        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (customStyles.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = customStyles.customLineHeight;
        }

        // Estilos del enlace usando valores del tema
        const linkStyle = {
            ...baseStyles,
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color,
            textDecoration: customStyles.textDecoration || 'underline',
            cursor: 'pointer',
            display: 'inline-block',
            transition: 'color 0.2s, text-decoration 0.2s',
        };

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

    // Clases para hover usando colores del tema
    const hoverClasses = isPreview ? '' : 'hover:opacity-80';
    const hoverColor = themeWithDefaults.hover_links;

    return (
        <a
            href={linkContent.url}
            target="_blank"
            rel="noopener noreferrer"
            style={getLinkStyles()}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            className={`${hoverClasses} transition-colors`}
            onMouseEnter={(e) => {
                if (!isPreview) {
                    e.target.style.color = hoverColor;
                }
            }}
            onMouseLeave={(e) => {
                if (!isPreview) {
                    e.target.style.color = getLinkStyles().color;
                }
            }}
        >
            {linkContent.text}
        </a>
    );
};

export default LinkComponent;
