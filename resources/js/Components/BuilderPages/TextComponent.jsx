// components/BuilderPages/components/TextComponent.jsx
import React from 'react';
import { getTextStyles as getThemeTextStyles, getResolvedFont, getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const TextComponent = ({ comp, getStyles, themeSettings, appliedTheme, isPreview }) => {
    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Función para resolver referencias
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    const getTextComponentStyles = () => {
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
            color = resolvedCustomStyles.color || themeWithDefaults.text;
        } else {
            // Usar utilidades del tema para obtener estilos consistentes
            const themeTextStyles = getThemeTextStyles(themeWithDefaults, textStyle, appliedTheme);
            fontSize = resolvedCustomStyles.fontSize || themeTextStyles.fontSize;
            fontWeight = resolvedCustomStyles.fontWeight || themeTextStyles.fontWeight;
            lineHeight = resolvedCustomStyles.lineHeight || themeTextStyles.lineHeight;
            textTransform = resolvedCustomStyles.textTransform || themeTextStyles.textTransform;
            color = resolvedCustomStyles.color || themeTextStyles.color;
        }

        // Calcular line-height si es personalizado
        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (resolvedCustomStyles.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = resolvedCustomStyles.customLineHeight;
        }

        // Padding individual
        const paddingTop = resolvedCustomStyles.paddingTop || '0px';
        const paddingRight = resolvedCustomStyles.paddingRight || '0px';
        const paddingBottom = resolvedCustomStyles.paddingBottom || '0px';
        const paddingLeft = resolvedCustomStyles.paddingLeft || '0px';

        // Layout
        const layout = resolvedCustomStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = resolvedCustomStyles.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

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
            backgroundColor: resolvedCustomStyles.backgroundColor || 'transparent',
            borderRadius: withUnit(resolvedCustomStyles.borderRadius) || '0px',
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize: withUnit(fontSize, resolvedCustomStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px')),
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color,
        };
    };

    // Determinar la etiqueta HTML según el estilo
    const getTagName = () => {
        const textStyle = comp.styles?.textStyle || 'paragraph';
        if (textStyle.startsWith('heading')) {
            return `h${textStyle.replace('heading', '')}`;
        }
        return 'p';
    };

    // Extraer el texto del contenido
    const getTextContent = () => {
        if (!comp.content) return '';

        // Si content es una cadena, devolverla directamente
        if (typeof comp.content === 'string') {
            return comp.content;
        }

        // Si content es un objeto, extraer la propiedad 'text'
        if (typeof comp.content === 'object' && comp.content !== null) {
            return comp.content.text || '';
        }

        // Si es otra cosa, convertir a cadena
        return String(comp.content);
    };

    const Tag = getTagName();
    const textContent = getTextContent();

    return (
        <Tag style={getTextComponentStyles()}>
            {textContent}
        </Tag>
    );
};

export default TextComponent;