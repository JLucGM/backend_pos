import React from 'react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const ProductDetailImageComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings,
    appliedTheme,
    product,
    currentImage,
    imageGallery = [],
    onImageChange,
    selectedCombination
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Resolver valores
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados del componente
    const rawStyles = comp.styles || {};
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    const getAspectRatio = () => {
        const ratio = styles.aspectRatio || 'square';
        if (ratio === 'theme') {
            const themeAspect = resolveValue(themeWithDefaults.image_aspect_ratio || '1/1');
            return themeAspect;
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
        maxWidth: styles.maxWidth || '500px',
        aspectRatio: getAspectRatio(),
        position: 'relative',
        margin: '0 auto',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    // Resolver valores de borde y radio
    const borderThickness = resolveValue(styles.imageBorderThickness || '1px');
    const borderColor = resolveValue(styles.imageBorderColor || '#000000');
    const borderRadius = resolveValue(styles.imageBorderRadius || '0px');

    const imageStyles = {
        width: '100%',
        height: '100%',
        border: (styles.imageBorder === 'solid' || styles.imageBorder === 'dashed')
            ? `${withUnit(borderThickness)} ${styles.imageBorder} ${borderColor}`
            : 'none',
        borderRadius: withUnit(borderRadius),
        objectFit: styles.objectFit || 'cover',
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Determinar la imagen a mostrar
    const displayImage = currentImage || product?.media?.[0]?.original_url || comp.content || 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png';

    // Galería de miniaturas (solo si hay más de una imagen)
    const showGallery = styles.showGallery !== false && imageGallery.length > 1;

    return (
        <div className="product-image-gallery">
            {/* Imagen principal */}
            <div
                style={containerStyles}
                onClick={handleClick}
                className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
            >
                <img
                    src={displayImage}
                    alt={product?.product_name || 'Producto'}
                    style={imageStyles}
                    onError={(e) => {
                        e.target.src = 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png';
                    }}
                />
            </div>

            {/* Miniaturas */}
            {showGallery && (
                <div className="thumbnail-grid" style={{
                    display: 'flex',
                    gap: themeWithDefaults?.spacing_small || '10px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginTop: themeWithDefaults?.spacing_small || '10px'
                }}>
                    {imageGallery.map((img, index) => {
                        const imgUrl = img.original_url || img.url;
                        const isSelected = currentImage === imgUrl;

                        return (
                            <button
                                key={index}
                                onClick={() => onImageChange && onImageChange(imgUrl)}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    border: isSelected
                                        ? `2px solid ${styles.thumbnailBorderColor || (themeWithDefaults?.primary ? `hsl(${themeWithDefaults.primary})` : '#007bff')}`
                                        : `1px solid ${themeWithDefaults?.borders ? `hsl(${themeWithDefaults.borders})` : '#ddd'}`,
                                    borderRadius: styles.thumbnailBorderRadius || themeWithDefaults?.border_radius || '4px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    padding: 0,
                                    background: 'transparent',
                                    transition: 'border-color 0.2s',
                                }}
                                title={`Vista ${index + 1}`}
                            >
                                <img
                                    src={imgUrl}
                                    alt={`Vista ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.src = 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png';
                                    }}
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProductDetailImageComponent;