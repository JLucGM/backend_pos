// components/BuilderPages/components/HeadingComponent.jsx
import React from 'react';
import { getTextStyles, getResolvedFont, getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const HeadingComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings, appliedTheme }) => {
    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Función para resolver referencias
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    const getHeadingStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Resolver todas las propiedades de customStyles que puedan contener referencias
        const resolvedCustomStyles = {};
        Object.keys(customStyles).forEach(key => {
            resolvedCustomStyles[key] = resolveValue(customStyles[key]);
        });

        // Determinar el nivel del heading a partir de textStyle (ya resuelto)
        const textStyle = resolvedCustomStyles.textStyle || 'heading2';
        const level = textStyle === 'custom' ? 2 : parseInt(textStyle.replace('heading', ''), 10) || 2;

        // Función para obtener la fuente
        const getFontFamily = () => {
            const fontType = resolvedCustomStyles.fontType;

            if (fontType === 'default' || !fontType) {
                return getResolvedFont(themeWithDefaults, `heading${level}_font`, appliedTheme);
            }

            if (fontType === 'custom' && resolvedCustomStyles.customFont) {
                return resolvedCustomStyles.customFont;
            }

            return getResolvedFont(themeWithDefaults, fontType, appliedTheme);
        };

        // Obtener configuración según el nivel usando utilidades del tema
        let fontSize, fontWeight, lineHeight, textTransform;

        if (textStyle === 'custom') {
            fontSize = resolvedCustomStyles.fontSize || themeWithDefaults[`heading${level}_fontSize`];
            fontWeight = resolvedCustomStyles.fontWeight || themeWithDefaults[`heading${level}_fontWeight`];
            lineHeight = resolvedCustomStyles.lineHeight || themeWithDefaults[`heading${level}_lineHeight`];
            textTransform = resolvedCustomStyles.textTransform || themeWithDefaults[`heading${level}_textTransform`];
        } else {
            // Usar utilidades del tema para obtener estilos consistentes
            const themeTextStyles = getTextStyles(themeWithDefaults, textStyle, appliedTheme);
            fontSize = resolvedCustomStyles.fontSize || themeTextStyles.fontSize;
            fontWeight = resolvedCustomStyles.fontWeight || themeTextStyles.fontWeight;
            lineHeight = resolvedCustomStyles.lineHeight || themeTextStyles.lineHeight;
            textTransform = resolvedCustomStyles.textTransform || themeTextStyles.textTransform;
        }

        // Calcular line-height
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
            textTransform: textTransform === 'default' ? 'none' : textTransform,
            color: resolvedCustomStyles.color || themeWithDefaults.heading,
        };
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        onEdit && onEdit();
    };

    // Extraer el texto del contenido (ahora es un string)
    const getTextContent = () => {
        if (!comp.content) return '';

        if (typeof comp.content === 'string') {
            return comp.content;
        }

        // Compatibilidad con formato antiguo
        if (typeof comp.content === 'object' && comp.content !== null) {
            return comp.content.text || comp.content.title || '';
        }

        return String(comp.content);
    };

    // Determinar la etiqueta HTML según textStyle
    const getTagName = () => {
        const textStyle = comp.styles?.textStyle || 'heading2';
        if (textStyle === 'custom') {
            return 'h2'; // Por defecto para custom
        }
        const level = parseInt(textStyle.replace('heading', ''), 10) || 2;
        return `h${Math.min(Math.max(level, 1), 6)}`;
    };

    const Tag = getTagName();
    const textContent = getTextContent();

    return (
        <Tag
            style={getHeadingStyles()}
            onDoubleClick={isPreview ? undefined : handleDoubleClick}
        >
            {textContent}
        </Tag>
    );
};

export default HeadingComponent;