// components/BuilderPages/components/ProductImageComponent.jsx
import React from 'react';

const ProductImageComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete
}) => {
    const styles = comp.styles || {};
    
    const imageStyles = {
        width: '100%',
        height: 'auto',
        border: styles.imageBorder === 'solid' 
            ? `${styles.imageBorderThickness} solid rgba(0, 0, 0, ${styles.imageBorderOpacity})` 
            : 'none',
        borderRadius: styles.imageBorderRadius || '0px',
        objectFit: 'cover',
    };

    // Manejo de eventos de mouse para edición
    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    return (
        <img 
            src={comp.content || 'https://via.placeholder.com/150'} 
            alt="Producto"
            style={imageStyles}
            onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
            }}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        />
    );
};

export default ProductImageComponent;