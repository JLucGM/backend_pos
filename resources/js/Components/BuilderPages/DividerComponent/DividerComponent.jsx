import React from 'react';

const DividerComponent = ({ comp, getStyles, onEdit, isPreview }) => {
    const getDividerStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Padding individual (solo top y bottom como solicitaste)
        const paddingTop = customStyles.paddingTop || '20px';
        const paddingBottom = customStyles.paddingBottom || '20px';

        // Propiedades específicas del divider
        const lineWidth = customStyles.lineWidth || '1px';
        const lineLength = customStyles.lineLength || '100%';
        const lineColor = customStyles.lineColor || '#000000';
        const opacity = customStyles.opacity || '1';

        // Layout: fit (ancho natural) o fill (ancho 100%)
        const layout = customStyles.layout || 'fill';
        const width = layout === 'fill' ? '100%' : lineLength;

        return {
            ...baseStyles,
            width,
            paddingTop,
            paddingBottom,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };
    };

    const getLineStyles = () => {
        const customStyles = comp.styles || {};

        const lineWidth = customStyles.lineWidth || '1px';
        const lineLength = customStyles.lineLength || '100%';
        const lineColor = customStyles.lineColor || '#000000';
        const opacity = customStyles.opacity || '1';
        const lineStyle = customStyles.lineStyle || 'solid';

        return {
            width: lineLength,
            height: lineWidth,
            backgroundColor: lineColor,
            opacity: opacity,
            border: 'none',
            borderTop: `${lineWidth} ${lineStyle} ${lineColor}`,
            opacity: opacity,
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