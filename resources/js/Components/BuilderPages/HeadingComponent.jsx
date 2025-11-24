// components/Builder/components/HeadingComponent.jsx
import React from 'react';

const HeadingComponent = ({ comp, getStyles, onEdit, isPreview }) => {
    // Función para calcular estilos específicos del heading
    const getHeadingStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Padding individual
        const paddingTop = customStyles.paddingTop || '0px';
        const paddingRight = customStyles.paddingRight || '0px';
        const paddingBottom = customStyles.paddingBottom || '0px';
        const paddingLeft = customStyles.paddingLeft || '0px';

        // Layout: fit (ancho natural) o fill (ancho 100%)
        const layout = customStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';

        // Alignment: solo aplica en fill
        const alignment = customStyles.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

        // Background
        const backgroundColor = customStyles.backgroundColor || 'transparent';

        // Border-Radius
        const borderRadius = customStyles.borderRadius || '0px';

        // Estilos por defecto para heading: más grande y negrita
        const fontSize = customStyles.fontSize || '24px';
        const fontWeight = 'bold';

        return {
            ...baseStyles,
            width,
            textAlign,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            backgroundColor,
            borderRadius,
            fontSize,
            fontWeight,
            display: layout === 'fit' ? 'inline-block' : 'block',
        };
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation(); // Detener la propagación del evento
        onEdit(); // Llamar sin parámetros
    };

    return (
        <h1 style={getHeadingStyles()} onDoubleClick={isPreview ? undefined : handleDoubleClick}>
            {comp.content}
        </h1>
    );
};

export default HeadingComponent;