import React from 'react';

const ProductDetailImageComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
}) => {
    const styles = comp.styles || {};
    
    const containerStyles = {
        width: '100%',
        maxWidth: '500px',
        height: '0',
        paddingBottom: '100%',
        position: 'relative',
        margin: '0 auto'
    };
    
    const imageStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: styles.imageBorder === 'solid' 
            ? `${styles.imageBorderThickness} solid rgba(0, 0, 0, ${styles.imageBorderOpacity})` 
            : 'none',
        borderRadius: styles.imageBorderRadius || '0px',
        objectFit: 'cover',
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    return (
        <div 
            style={containerStyles}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            <img 
                src={comp.content || 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png'} 
                alt="Producto"
                style={imageStyles}
            />
        </div>
    );
};

export default ProductDetailImageComponent;