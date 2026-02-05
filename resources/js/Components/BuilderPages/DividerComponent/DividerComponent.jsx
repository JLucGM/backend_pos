import React from 'react';
import { getThemeWithDefaults, getComponentStyles } from '@/utils/themeUtils';

const DividerComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings, appliedTheme }) => {
    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Obtener estilos específicos del componente divider del tema
    const themeDividerStyles = getComponentStyles(themeWithDefaults, 'divider', appliedTheme);

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    const getDividerStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Padding individual usando valores del tema como fallback
        const paddingTop = customStyles.paddingTop || themeWithDefaults.divider_paddingTop || '20px';
        const paddingBottom = customStyles.paddingBottom || themeWithDefaults.divider_paddingBottom || '20px';

        // Propiedades específicas del divider usando valores del tema
        const lineLength = customStyles.lineLength || themeWithDefaults.divider_lineLength || '100%';
        const lineLengthUnit = customStyles.lineLengthUnit || (lineLength.toString().includes('px') ? 'px' : '%');

        // Layout: fit (ancho natural) o fill (ancho 100%)
        const layout = customStyles.layout || 'fill';
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
        const customStyles = comp.styles || {};

        // Usar valores del tema como fallback
        const lineWidth = customStyles.lineWidth || themeWithDefaults.divider_lineWidth || '1px';
        const lineLength = customStyles.lineLength || themeWithDefaults.divider_lineLength || '100%';
        const lineLengthUnit = customStyles.lineLengthUnit || (lineLength.toString().includes('px') ? 'px' : '%');
        const lineColor = customStyles.lineColor || themeWithDefaults.divider_lineColor || '#000000';
        const opacity = customStyles.opacity || themeWithDefaults.divider_opacity || '1';
        const lineStyle = customStyles.lineStyle || 'solid';

        const finalLineWidth = withUnit(lineWidth);
        const finalLineLength = withUnit(lineLength, lineLengthUnit);

        return {
            width: finalLineLength,
            height: finalLineWidth,
            backgroundColor: lineColor,
            opacity: opacity,
            border: 'none',
            borderTop: `${finalLineWidth} ${lineStyle} ${lineColor}`,
        };
    };

    return (
        <div
            style={getDividerStyles()}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
        >
            <hr style={getLineStyles()} />
        </div>
    );
};

export default DividerComponent;
