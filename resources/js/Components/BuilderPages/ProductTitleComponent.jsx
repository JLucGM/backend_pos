// components/BuilderPages/components/ProductTitleComponent.jsx
import React from 'react';

const ProductTitleComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete
}) => {
    const styles = comp.styles || {};
    
    const componentStyles = {
        color: styles.color || '#000000',
        fontSize: styles.fontSize || '24px',
        fontWeight: styles.fontWeight || 'bold',
        textAlign: styles.alignment || 'center',
        margin: 0,
        width: styles.layout === 'fill' ? '100%' : 'auto',
        padding: '10px 0'
    };

    // Manejo de eventos de mouse para edición
    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    return (
        <div 
            style={componentStyles}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {comp.content}
        </div>
    );
};

export default ProductTitleComponent;