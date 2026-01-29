import React from 'react';
import { getThemeWithDefaults, getComponentStyles, hslToCss } from '@/utils/themeUtils';

const ProductImageComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme,
    mode = 'builder' // 'builder' o 'frontend'
}) => {
    const styles = comp.styles || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings);
    const themeImageStyles = getComponentStyles(themeWithDefaults, 'image');
    
    // Función para obtener estilos del contenedor según aspectRatio
    const getAspectRatioStyles = () => {
        switch (styles.aspectRatio) {
            case 'landscape':
                return {
                    width: '100%',
                    height: '0',
                    paddingBottom: '56.25%', // 16:9 ratio
                    position: 'relative'
                };
            case 'portrait':
                return {
                    width: '100%',
                    height: '0',
                    paddingBottom: '125%', // 4:5 ratio
                    position: 'relative'
                };
            case 'square':
            default:
                return {
                    width: '100%',
                    height: '0',
                    paddingBottom: '100%', // 1:1 ratio
                    position: 'relative'
                };
        }
    };

    const containerStyles = {
        ...getAspectRatioStyles(),
        margin: '0 auto',
        maxWidth: styles.maxWidth || '500px',
    };
    
    // Aplicar estilos del tema con valores por defecto
    const imageStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: styles.imageBorder === 'solid' 
            ? `${styles.imageBorderThickness || themeImageStyles.borderWidth} solid ${styles.imageBorderColor || themeImageStyles.borderColor}` 
            : (styles.imageBorder === 'none' ? 'none' : 
               // Si no está definido, usar el tema
               themeImageStyles.borderWidth !== '0px' 
                ? `${themeImageStyles.borderWidth} solid ${themeImageStyles.borderColor}`
                : 'none'),
        borderRadius: styles.imageBorderRadius || themeImageStyles.borderRadius,
        objectFit: styles.objectFit || themeImageStyles.objectFit,
        // Sombra del tema
        boxShadow: themeWithDefaults.shadows ? `0 2px 4px hsl(${themeWithDefaults.shadows})` : 'none',
        // Transición para efectos hover en frontend
        transition: mode === 'frontend' ? 'transform 0.3s ease' : 'none',
    };

    // Efecto hover para frontend
    const handleMouseEnter = (e) => {
        if (mode === 'frontend') {
            e.currentTarget.style.transform = 'scale(1.05)';
        }
    };

    const handleMouseLeave = (e) => {
        if (mode === 'frontend') {
            e.currentTarget.style.transform = 'scale(1)';
        }
    };

    const handleClick = () => {
        if (mode === 'builder' && !isPreview && onEdit) {
            onEdit(comp);
        }
        // En modo frontend, la navegación se maneja en ProductCardComponent
    };

    return (
        <div 
            style={containerStyles}
            onClick={handleClick}
            className={
                mode === 'builder' && !isPreview 
                    ? "cursor-pointer hover:opacity-80 transition-opacity" 
                    : ""
            }
        >
            <img 
                src={comp.content || 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png'} 
                alt="Producto"
                style={imageStyles}
                onError={(e) => {
                    e.target.src = 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png';
                }}
                onMouseEnter={mode === 'frontend' ? handleMouseEnter : undefined}
                onMouseLeave={mode === 'frontend' ? handleMouseLeave : undefined}
            />
        </div>
    );
};

export default ProductImageComponent;