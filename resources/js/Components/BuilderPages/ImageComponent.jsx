// components/Builder/components/ImageComponent.jsx
import React from 'react';

const ImageComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings }) => {
    // ... código existente ...

    // EXTRAER LA URL DE LA IMAGEN DEL CONTENIDO
    const getImageUrl = () => {
        if (!comp.content) return '';
        
        // Si content es una cadena (URL), devolverla
        if (typeof comp.content === 'string') {
            return comp.content;
        }
        
        // Si content es un objeto, extraer la propiedad 'src'
        if (typeof comp.content === 'object' && comp.content !== null) {
            return comp.content.src || comp.content.url || '';
        }
        
        return String(comp.content);
    };

    const imageUrl = getImageUrl();

    return (
        <img
            src={imageUrl}
            alt={comp.content?.alt || ''}
            style={getStyles(comp)}
            onClick={isPreview ? undefined : () => onEdit(comp)}
        />
    );
};

export default ImageComponent;