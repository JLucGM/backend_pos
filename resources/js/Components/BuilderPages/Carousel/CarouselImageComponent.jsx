import React from 'react';
import { getThemeWithDefaults, getComponentStyles, resolveStyleValue } from '@/utils/themeUtils';

const CarouselImageComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme
}) => {
    const rawStyles = comp.styles || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const themeImageStyles = getComponentStyles(themeWithDefaults, 'image');

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

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

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    // Resolver valores de themeImageStyles por si acaso (aunque ya son concretos)
    const borderColor = resolveValue(styles.imageBorderColor || themeImageStyles.borderColor);
    const borderRadius = resolveValue(styles.imageBorderRadius || themeImageStyles.borderRadius);
    const objectFit = resolveValue(styles.objectFit || themeImageStyles.objectFit);
    const borderWidth = resolveValue(styles.imageBorderThickness || themeImageStyles.borderWidth);

    // Estilos de imagen con valores resueltos
    const imageStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: styles.imageBorder === 'solid'
            ? `${withUnit(borderWidth)} solid ${borderColor}`
            : 'none',
        borderRadius: withUnit(borderRadius),
        objectFit: objectFit,
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