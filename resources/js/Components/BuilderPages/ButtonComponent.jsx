// components/Builder/components/ButtonComponent.jsx
import React from 'react';
import { Button } from '@/Components/ui/button';

const ButtonComponent = ({ comp, getStyles, onEdit, isPreview }) => {
    // Función para calcular estilos específicos del botón
    const getButtonStyles = () => {
        const baseStyles = getStyles(comp); // Estilos base (color, backgroundColor, etc.)
        const customStyles = comp.styles || {};

        // Padding individual
        const paddingTop = customStyles.paddingTop || '5px'; // Por defecto 5px para botones
        const paddingRight = customStyles.paddingRight || '5px';
        const paddingBottom = customStyles.paddingBottom || '5px';
        const paddingLeft = customStyles.paddingLeft || '5px';

        // Layout: fit (ancho natural) o fill (ancho 100%)
        const layout = customStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';

        const borderRadius = customStyles.borderRadius || '4px'; // Por defecto 4px para botones

        return {
            ...baseStyles,
            width,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            borderRadius,
        };
    };

    return (
        <button
            style={getButtonStyles()}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
        >
            {comp.content}
        </button>
    );
};

export default ButtonComponent;