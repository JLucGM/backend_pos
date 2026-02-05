import React from 'react';
import { getThemeWithDefaults, getComponentStyles } from '@/utils/themeUtils';

const CarouselImageComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme
}) => {
    const styles = comp.styles || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const themeImageStyles = getComponentStyles(themeWithDefaults, 'image');

    const getAspectRatioStyles = () => {
        switch (styles.aspectRatio) {
            case 'landscape':
                return {
                    width: '100%',
                    height: '0',
                    paddingBottom: '56.25%',
                    position: 'relative'
                };
            case 'portrait':
                return {
                    width: '100%',
                    height: '0',
                    paddingBottom: '125%',
                    position: 'relative'
                };
            case 'square':
            default:
                return {
                    width: '100%',
                    height: '0',
                    paddingBottom: '100%',
                    position: 'relative'
                };
        }
    };

    const containerStyles = getAspectRatioStyles();

    // Estilos de imagen con valores del tema
    const imageStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: styles.imageBorder === 'solid'
            ? `${styles.imageBorderThickness || themeImageStyles.borderWidth} solid ${styles.imageBorderColor || themeImageStyles.borderColor}`
            : 'none',
        borderRadius: styles.imageBorderRadius || themeImageStyles.borderRadius,
        objectFit: styles.objectFit || themeImageStyles.objectFit,
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
                onError={(e) => {
                    e.target.src = 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png';
                }}
            />
        </div>
    );
};

export default CarouselImageComponent;
