import React from 'react';
import ProductImageComponent from './ProductImageComponent';
import ProductNameComponent from './ProductNameComponent';
import ProductPriceComponent from './ProductPriceComponent';
import ComponentWithHover from './ComponentWithHover';

const ProductCardComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    isPreview,
    products,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const cardConfig = comp.content || {};
    const children = cardConfig.children || [];
    const productData = cardConfig.productData;

    // Función para obtener el nombre del tipo de componente
    const getComponentTypeName = (type) => {
        const typeNames = {
            'text': 'Texto',
            'heading': 'Encabezado',
            'button': 'Botón',
            'image': 'Imagen',
            'video': 'Video',
            'link': 'Enlace',
            'product': 'Producto',
            'carousel': 'Carrusel',
            'container': 'Contenedor',
            'banner': 'Sección Banner',
            'bannerTitle': 'Título del Banner',
            'bannerText': 'Texto del Banner',
            'productTitle': 'Título de Productos',
            'productCard': 'Carta de Producto',
            'productImage': 'Imagen de Producto',
            'productName': 'Nombre de Producto',
            'productPrice': 'Precio de Producto',
            'carouselTitle': 'Título del Carrusel',
            'carouselCard': 'Carta del Carrusel',
            'carouselImage': 'Imagen del Carrusel',
            'carouselName': 'Nombre del Carrusel',
            'carouselPrice': 'Precio del Carrusel'
        };
        return typeNames[type] || type;
    };

    // Estilos de la carta
    const cardStyles = {
        paddingTop: cardConfig.cardPaddingTop || '0px',
        paddingRight: cardConfig.cardPaddingRight || '0px',
        paddingBottom: cardConfig.cardPaddingBottom || '0px',
        paddingLeft: cardConfig.cardPaddingLeft || '0px',
        border: cardConfig.cardBorder === 'solid' 
            ? `${cardConfig.cardBorderThickness} solid rgba(0, 0, 0, ${cardConfig.cardBorderOpacity})` 
            : 'none',
        borderRadius: cardConfig.cardBorderRadius || '0px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };

    // Manejo de eventos de mouse
    const handleMouseEnter = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(comp.id);
        }
    };

    const handleMouseLeave = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(null);
        }
    };

    // Manejo de clic para edición
    const handleClick = (e) => {
        if (!isPreview && onEdit && e.target === e.currentTarget) {
            onEdit(comp);
        }
    };

    return (
        <div
            style={cardStyles}
            className="product-card"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {children.map((child) => {
                const enhancedChild = {
                    ...child,
                    content: getChildContent(child.type, productData, child.content)
                };

                switch (child.type) {
                    case 'productImage':
                        return (
                            <ComponentWithHover
                                key={child.id}
                                component={child}
                                isPreview={isPreview}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                                getComponentTypeName={getComponentTypeName}
                            >
                                <ProductImageComponent
                                    comp={enhancedChild}
                                    getStyles={getStyles}
                                    isPreview={isPreview}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    hoveredComponentId={hoveredComponentId}
                                    setHoveredComponentId={setHoveredComponentId}
                                />
                            </ComponentWithHover>
                        );
                    case 'productName':
                        return (
                            <ComponentWithHover
                                key={child.id}
                                component={child}
                                isPreview={isPreview}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                                getComponentTypeName={getComponentTypeName}
                            >
                                <ProductNameComponent
                                    comp={enhancedChild}
                                    getStyles={getStyles}
                                    isPreview={isPreview}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    hoveredComponentId={hoveredComponentId}
                                    setHoveredComponentId={setHoveredComponentId}
                                />
                            </ComponentWithHover>
                        );
                    case 'productPrice':
                        return (
                            <ComponentWithHover
                                key={child.id}
                                component={child}
                                isPreview={isPreview}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                                getComponentTypeName={getComponentTypeName}
                            >
                                <ProductPriceComponent
                                    comp={enhancedChild}
                                    getStyles={getStyles}
                                    isPreview={isPreview}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    hoveredComponentId={hoveredComponentId}
                                    setHoveredComponentId={setHoveredComponentId}
                                />
                            </ComponentWithHover>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
};

// Función auxiliar para obtener contenido basado en datos del producto
const getChildContent = (type, productData, fallback) => {
    if (!productData) return fallback;

    switch (type) {
        case 'productImage':
            return productData.media?.[0]?.original_url || fallback;
        case 'productName':
            return productData.product_name || fallback;
        case 'productPrice':
            return productData.product_price ? `$${parseFloat(productData.product_price).toFixed(2)}` : fallback;
        default:
            return fallback;
    }
};

export default ProductCardComponent;