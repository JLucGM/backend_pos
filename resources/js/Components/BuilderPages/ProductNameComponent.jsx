// components/BuilderPages/components/ProductNameComponent.jsx
import React from 'react';

const ProductNameComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete
}) => {
    const styles = comp.styles || {};
    
    const componentStyles = {
        color: styles.color || '#000000',
        fontSize: styles.fontSize || '16px',
        fontWeight: styles.fontWeight || '600',
        textAlign: styles.alignment || 'left',
        margin: '10px 0 5px 0',
        width: styles.layout === 'fill' ? '100%' : 'auto',
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

export default ProductNameComponent;