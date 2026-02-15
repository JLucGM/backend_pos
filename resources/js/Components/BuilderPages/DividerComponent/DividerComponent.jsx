import React from 'react';
import { getThemeWithDefaults, getComponentStyles, resolveStyleValue } from '@/utils/themeUtils';

const DividerComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings, appliedTheme }) => {
    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Obtener estilos específicos del componente divider del tema
    const themeDividerStyles = getComponentStyles(themeWithDefaults, 'divider', appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados
    const customStyles = comp.styles || {};
    const resolvedCustomStyles = {};
    Object.keys(customStyles).forEach(key => {
        resolvedCustomStyles[key] = resolveValue(customStyles[key]);
    });

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    const getDividerStyles = () => {
        const baseStyles = getStyles(comp);

        // Padding individual usando valores del tema como fallback (resueltos)
        const paddingTop = resolvedCustomStyles.paddingTop || themeWithDefaults.divider_paddingTop || '20px';
        const paddingBottom = resolvedCustomStyles.paddingBottom || themeWithDefaults.divider_paddingBottom || '20px';

        // Propiedades específicas del divider usando valores del tema
        const lineLength = resolvedCustomStyles.lineLength || themeWithDefaults.divider_lineLength || '100%';
        const lineLengthUnit = resolvedCustomStyles.lineLengthUnit || (lineLength.toString().includes('px') ? 'px' : '%');

        // Layout: fit (ancho natural) o fill (ancho 100%)
        const layout = resolvedCustomStyles.layout || 'fill';
        const width = layout === 'fill' ? '100%' : withUnit(lineLength, lineLengthUnit);

        return {
            ...baseStyles,
            width,
            paddingTop: withUnit(paddingTop),
            paddingBottom: withUnit(paddingBottom),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };
    };

    const getLineStyles = () => {
        // Usar valores del tema como fallback (resueltos)
        const lineWidth = resolvedCustomStyles.lineWidth || themeWithDefaults.divider_lineWidth || '1px';
        const lineLength = resolvedCustomStyles.lineLength || themeWithDefaults.divider_lineLength || '100%';
        const lineLengthUnit = resolvedCustomStyles.lineLengthUnit || (lineLength.toString().includes('px') ? 'px' : '%');
        const lineColor = resolvedCustomStyles.lineColor || themeWithDefaults.divider_lineColor || '#000000';
        const opacity = resolvedCustomStyles.opacity || themeWithDefaults.divider_opacity || '1';
        const lineStyle = resolvedCustomStyles.lineStyle || 'solid';
        const background = resolvedCustomStyles.background || themeWithDefaults.background || 'none';

        const finalLineWidth = withUnit(lineWidth);
        const finalLineLength = withUnit(lineLength, lineLengthUnit);

        return {
            width: finalLineLength,
            height: finalLineWidth,
            backgroundColor: background,
            opacity: opacity,
            border: 'none',
            borderTop: `${finalLineWidth} ${lineStyle} ${lineColor}`,
        };
    };

    const innerContent = resolvedCustomStyles.background || themeWithDefaults.background || 'none';

    return (
        <div style={{ background: innerContent }}>

        <div
            style={getDividerStyles()}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            >
            <hr style={getLineStyles()} />
            </div>
        </div>
    );
};

export default DividerComponent;