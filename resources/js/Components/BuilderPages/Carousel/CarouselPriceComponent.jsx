import React from 'react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getTextStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

const CarouselPriceComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme
}) => {
    const { settings } = usePage().props;
    const rawStyles = comp.styles || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    // Obtener configuración de fuente del tema usando utilidades
    const getFontFamily = () => {
        const fontType = styles.fontType;

        if (fontType === 'default' || !fontType) {
            return getResolvedFont(themeWithDefaults, 'body_font', appliedTheme);
        }

        if (fontType === 'custom' && styles.customFont) {
            return styles.customFont;
        }

        return getResolvedFont(themeWithDefaults, fontType, appliedTheme);
    };

    // Usar estilo de párrafo por defecto para precios con utilidades del tema
    const textStyle = styles.textStyle || 'paragraph';
    let fontSize, fontWeight, lineHeight, textTransform, color;

    if (textStyle === 'custom') {
        fontSize = styles.fontSize || themeWithDefaults.paragraph_fontSize;
        fontWeight = styles.fontWeight || themeWithDefaults.paragraph_fontWeight;
        lineHeight = styles.lineHeight || themeWithDefaults.paragraph_lineHeight;
        textTransform = styles.textTransform || themeWithDefaults.paragraph_textTransform;
        color = styles.color || themeWithDefaults.text;
    } else {
        // Usar utilidades del tema para obtener estilos consistentes
        const themeTextStyles = getTextStyles(themeWithDefaults, textStyle, appliedTheme);
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

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    const componentStyles = {
        color,
        fontSize: withUnit(fontSize, styles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px')),
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