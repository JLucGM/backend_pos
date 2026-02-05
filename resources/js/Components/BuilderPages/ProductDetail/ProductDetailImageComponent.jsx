import React from 'react';

const ProductDetailImageComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings
}) => {
    const styles = comp.styles || {};
    const theme = themeSettings || {};

    const getAspectRatio = () => {
        const ratio = styles.aspectRatio || 'square';
        if (ratio === 'theme') {
            return theme.image_aspect_ratio || '1/1';
        }
        switch (ratio) {
            case 'landscape': return '16/9';
            case 'portrait': return '4/5';
            case 'square': return '1/1';
            case 'auto': return 'auto';
            default: return '1/1';
        }
    };

    const containerStyles = {
        width: '100%',
        maxWidth: '500px',
        aspectRatio: getAspectRatio(),
        position: 'relative',
        margin: '0 auto',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const imageStyles = {
        width: '100%',
        height: '100%',
        border: (styles.imageBorder === 'solid' || styles.imageBorder === 'dashed')
            ? `${styles.imageBorderThickness || '1px'} ${styles.imageBorder} ${styles.imageBorderColor || '#000000'}`
            : 'none',
        borderRadius: styles.imageBorderRadius || '0px',
        objectFit: styles.objectFit || 'cover',
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
