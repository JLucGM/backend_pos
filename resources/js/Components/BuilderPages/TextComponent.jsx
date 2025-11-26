// components/BuilderPages/components/TextComponent.jsx
import React from 'react';

const TextComponent = ({ comp, getStyles, isPreview }) => {
    const getTextStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        const paddingTop = customStyles.paddingTop || '0px';
        const paddingRight = customStyles.paddingRight || '0px';
        const paddingBottom = customStyles.paddingBottom || '0px';
        const paddingLeft = customStyles.paddingLeft || '0px';

        const layout = customStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';

        const alignment = customStyles.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

        const backgroundColor = layout === 'fit' ? (customStyles.backgroundColor || 'transparent') : (customStyles.backgroundColor || 'transparent');
        const borderRadius = layout === 'fit' ? (customStyles.borderRadius || '0px') : '0px';

        const display = layout === 'fit' ? 'inline-block' : 'block';

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
            display,
            color: customStyles.color || '#000000',
            fontSize: customStyles.fontSize || '16px',
            fontWeight: customStyles.fontWeight || 'normal',
        };
    };

    return (
        <p style={getTextStyles()}>
            {comp.content}
        </p>
    );
};

export default TextComponent;