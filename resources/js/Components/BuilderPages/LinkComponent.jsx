import React from 'react';
import { getTextStyles as getThemeTextStyles, getResolvedFont, getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

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

    // Función para resolver referencias
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    const getLinkStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Resolver todas las propiedades de customStyles que puedan contener referencias
        const resolvedCustomStyles = {};
        Object.keys(customStyles).forEach(key => {
            resolvedCustomStyles[key] = resolveValue(customStyles[key]);
        });

        // Determinar el estilo de texto seleccionado
        const textStyle = resolvedCustomStyles.textStyle || 'paragraph';

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = resolvedCustomStyles.fontType;

            // Si el usuario seleccionó "default" o no especificó nada
            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    return getResolvedFont(themeWithDefaults, `${textStyle}_font`, appliedTheme);
                } else {
                    return getResolvedFont(themeWithDefaults, 'paragraph_font', appliedTheme);
                }
            }

            if (fontType === 'custom' && resolvedCustomStyles.customFont) {
                return resolvedCustomStyles.customFont;
            }

            return getResolvedFont(themeWithDefaults, fontType, appliedTheme);
        };

        // Obtener configuración según el estilo seleccionado usando utilidades del tema
        let fontSize, fontWeight, lineHeight, textTransform, color;

        if (textStyle === 'custom') {
            fontSize = resolvedCustomStyles.fontSize || themeWithDefaults.paragraph_fontSize;
            fontWeight = resolvedCustomStyles.fontWeight || themeWithDefaults.paragraph_fontWeight;
            lineHeight = resolvedCustomStyles.lineHeight || themeWithDefaults.paragraph_lineHeight;
            textTransform = resolvedCustomStyles.textTransform || themeWithDefaults.paragraph_textTransform;
            color = resolvedCustomStyles.color || themeWithDefaults.links;
        } else {
            // Usar utilidades del tema para obtener estilos consistentes
            const themeTextStyles = getThemeTextStyles(themeWithDefaults, textStyle, appliedTheme);
            fontSize = resolvedCustomStyles.fontSize || themeTextStyles.fontSize;
            fontWeight = resolvedCustomStyles.fontWeight || themeTextStyles.fontWeight;
            lineHeight = resolvedCustomStyles.lineHeight || themeTextStyles.lineHeight;
            textTransform = resolvedCustomStyles.textTransform || themeTextStyles.textTransform;
            color = resolvedCustomStyles.color || themeWithDefaults.links;
        }

        const fontSizeUnit = resolvedCustomStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px');

        // Calcular line-height si es personalizado
        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (resolvedCustomStyles.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = resolvedCustomStyles.customLineHeight;
        }

        // Resolver hoverColor por separado (puede ser referencia)
        const hoverColor = resolveValue(themeWithDefaults.hover_links || customStyles.hoverColor);

        // Estilos del enlace usando valores del tema
        const linkStyle = {
            ...baseStyles,
            fontFamily: getFontFamily(),
            fontSize: withUnit(fontSize, fontSizeUnit),
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color,
            textDecoration: resolvedCustomStyles.textDecoration || 'underline',
            cursor: 'pointer',
            display: 'inline-block',
            transition: 'color 0.2s, text-decoration 0.2s',
            '--hover-color': hoverColor, // Para usar en hover si se desea
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
    const linkStyles = getLinkStyles();
    const hoverColor = linkStyles['--hover-color'] || themeWithDefaults.hover_links;

    // Clases para hover usando colores del tema
    const hoverClasses = isPreview ? '' : 'hover:opacity-80';

    return (
        <a
            href={linkContent.url}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyles}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            className={`${hoverClasses} transition-colors`}
            onMouseEnter={(e) => {
                if (!isPreview) {
                    e.target.style.color = hoverColor;
                }
            }}
            onMouseLeave={(e) => {
                if (!isPreview) {
                    e.target.style.color = linkStyles.color;
                }
            }}
        >
            {linkContent.text}
        </a>
    );
};

export default LinkComponent;