// components/Builder/components/LinkComponent.jsx
import React from 'react';

const LinkComponent = ({ comp, getStyles, onEdit, isPreview }) => (
    <a
        href={comp.content}
        target="_blank"
        rel="noopener noreferrer"
        style={getStyles(comp)}
        onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
    >
        {comp.content || 'Enlace'}
    </a>
);

export default LinkComponent;
