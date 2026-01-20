import React from 'react';

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
    const theme = themeSettings || {};
    
    // Función para obtener estilos del tema o valores por defecto
    const getThemeStyle = (key, defaultValue) => {
        return theme[key] || defaultValue;
    };

    // Obtener valores del tema para bordes y radios
    const defaultBorderColor = getThemeStyle('borders', '0 0% 86.1%');
    const defaultBorderRadius = getThemeStyle('image_border_radius', getThemeStyle('border_radius', '8px'));
    const defaultBorderThickness = getThemeStyle('image_border_thickness', '1px');
    const defaultBorderOpacity = getThemeStyle('image_border_opacity', '1');
    
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
    
    // Aplicar estilos del tema cuando no haya estilos específicos del componente
    const imageStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: styles.imageBorder === 'solid' 
            ? `${styles.imageBorderThickness || defaultBorderThickness} solid hsla(${defaultBorderColor}, ${styles.imageBorderOpacity || defaultBorderOpacity})` 
            : (styles.imageBorder === 'none' ? 'none' : 
               // Si no está definido, usar el tema
               theme.image_default_border === 'enabled' 
                ? `${defaultBorderThickness} solid hsla(${defaultBorderColor}, ${defaultBorderOpacity})`
                : 'none'),
        borderRadius: styles.imageBorderRadius || defaultBorderRadius,
        objectFit: 'cover',
        // Puedes agregar más estilos del tema aquí
        boxShadow: theme.image_shadow ? `0 2px 4px hsla(${theme.shadows}, 0.1)` : 'none',
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