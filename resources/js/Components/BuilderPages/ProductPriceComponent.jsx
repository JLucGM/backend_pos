// components/BuilderPages/components/ProductPriceComponent.jsx
import React from 'react';

const ProductPriceComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete
}) => {
    const styles = comp.styles || {};
    
    const componentStyles = {
        color: styles.color || '#666666',
        fontSize: styles.fontSize || '14px',
        fontWeight: styles.fontWeight || 'normal',
        textAlign: styles.alignment || 'left',
        margin: '5px 0',
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

export default ProductPriceComponent;