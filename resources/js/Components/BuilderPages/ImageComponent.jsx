// components/Builder/components/ImageComponent.jsx
import React from 'react';

const ImageComponent = ({ comp, onEdit, isPreview }) => (
    <img
        src={comp.content}
        alt="Imagen"
        className="w-full"
        onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
    />
);

export default ImageComponent;