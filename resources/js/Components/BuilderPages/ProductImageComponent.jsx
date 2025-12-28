import React from 'react';

const ProductDetailImageComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings, // Recibir themeSettings como prop
    appliedTheme // Recibir appliedTheme como prop
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
    
    const containerStyles = {
        width: '100%',
        maxWidth: '500px',
        height: '0',
        paddingBottom: '100%',
        position: 'relative',
        margin: '0 auto'
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

export default ProductDetailImageComponent;