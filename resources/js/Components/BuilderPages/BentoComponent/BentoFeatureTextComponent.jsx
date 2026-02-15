import React from 'react';
import { getThemeWithDefaults, getTextStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

const BentoFeatureTextComponent = ({
    comp,
    getStyles,
    themeSettings,
    isPreview,
    onEdit,
    onDelete,
    hoveredComponentId,
    setHoveredComponentId,
    appliedTheme
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados del componente
    const rawStyles = comp.styles || {};
    const customStyles = {};
    Object.keys(rawStyles).forEach(key => {
        customStyles[key] = resolveValue(rawStyles[key]);
    });

    const getComponentStyles = () => {
        const baseStyles = getStyles(comp);

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'paragraph'; // Por defecto paragraph para texto

        // Función para obtener la fuente usando utilidades del tema
        const getFontFamily = () => {
            const fontType = customStyles.fontType;

            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    return getResolvedFont(themeWithDefaults, `${textStyle}_font`, appliedTheme);
                } else {
                    return getResolvedFont(themeWithDefaults, 'paragraph_font', appliedTheme);
                }
            }

            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }

            return getResolvedFont(themeWithDefaults, fontType, appliedTheme);
        };

        // Obtener configuración según el estilo seleccionado usando utilidades del tema
        let fontSize, fontWeight, lineHeight, textTransform, color;

        if (textStyle === 'custom') {
            fontSize = customStyles.fontSize || themeWithDefaults.paragraph_fontSize;
            fontWeight = customStyles.fontWeight || themeWithDefaults.paragraph_fontWeight;
            lineHeight = customStyles.lineHeight || themeWithDefaults.paragraph_lineHeight;
            textTransform = customStyles.textTransform || themeWithDefaults.paragraph_textTransform;
            color = customStyles.color || themeWithDefaults.text;
        } else {
            // Usar utilidades del tema para obtener estilos consistentes
            const themeTextStyles = getTextStyles(themeWithDefaults, textStyle, appliedTheme);
            fontSize = customStyles.fontSize || themeTextStyles.fontSize;
            fontWeight = customStyles.fontWeight || themeTextStyles.fontWeight;
            lineHeight = customStyles.lineHeight || themeTextStyles.lineHeight;
            textTransform = customStyles.textTransform || themeTextStyles.textTransform;
            color = customStyles.color || themeTextStyles.color;
        }

        const fontSizeUnit = customStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px');

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

        // Helper para añadir unidad (px) si es solo número
        const withUnit = (value, unit = 'px') => {
            if (value === undefined || value === null || value === '') return undefined;
            if (typeof value === 'string' && isNaN(Number(value))) return value;
            return `${value}${unit}`;
        };

        // Color final resuelto
        const finalColor = resolveValue(color);

        return {
            ...baseStyles,
            width,
            textAlign,
            margin: '0',
            backgroundColor: customStyles.backgroundColor || 'transparent',
            borderRadius: withUnit(customStyles.borderRadius) || '0px',
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize: withUnit(fontSize, fontSizeUnit),
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color: finalColor,
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
        <p
            style={getComponentStyles()}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {comp.content}
        </p>
    );
};

export default BentoFeatureTextComponent;