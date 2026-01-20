import React from 'react';
import CarouselImageComponent from './CarouselImageComponent';
import CarouselNameComponent from './CarouselNameComponent';
import CarouselPriceComponent from './CarouselPriceComponent';
import ComponentWithHover from '../ComponentWithHover';

const CarouselCardComponent = ({
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
    // Asegurarnos de que comp.content existe
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
        ...getStyles(comp),
        paddingTop: cardConfig.cardPaddingTop || '10px',
        paddingRight: cardConfig.cardPaddingRight || '10px',
        paddingBottom: cardConfig.cardPaddingBottom || '10px',
        paddingLeft: cardConfig.cardPaddingLeft || '10px',
        border: cardConfig.cardBorder === 'solid' 
            ? `${cardConfig.cardBorderThickness || '1px'} solid rgba(0, 0, 0, ${cardConfig.cardBorderOpacity || '1'})` 
            : 'none',
        borderRadius: cardConfig.cardBorderRadius || '0px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        height: '100%',
    };

    // Encontrar los componentes hijos
    const imageComponent = children.find(child => child.type === 'carouselImage');
    const nameComponent = children.find(child => child.type === 'carouselName');
    const priceComponent = children.find(child => child.type === 'carouselPrice');

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

    return (
        <div 
            style={cardStyles}
            className="flex flex-col h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Imagen con ComponentWithHover */}
            {imageComponent && productData && (
                <ComponentWithHover
                    component={imageComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <CarouselImageComponent
                        comp={{
                            ...imageComponent,
                            content: productData.media && productData.media.length > 0 
                                ? productData.media[0].original_url 
                                : imageComponent.content
                        }}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                </ComponentWithHover>
            )}

            {/* Mostrar placeholder si no hay imagen */}
            {(!imageComponent || !productData) && !isPreview && (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Imagen del producto</span>
                </div>
            )}

            {/* Nombre con ComponentWithHover */}
            {nameComponent && productData && (
                <ComponentWithHover
                    component={nameComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <CarouselNameComponent
                        comp={{
                            ...nameComponent,
                            content: productData.product_name || nameComponent.content
                        }}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        themeSettings={themeSettings}
                    />
                </ComponentWithHover>
            )}

            {/* Precio con ComponentWithHover */}
            {priceComponent && productData && (
                <ComponentWithHover
                    component={priceComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <CarouselPriceComponent
                        comp={{
                            ...priceComponent,
                            content: productData.product_price 
                                ? `$${parseFloat(productData.product_price).toFixed(2)}`
                                : priceComponent.content
                        }}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        themeSettings={themeSettings}
                    />
                </ComponentWithHover>
            )}

            {/* Mostrar placeholders si no hay componentes de nombre o precio */}
            {(!nameComponent || !productData) && !isPreview && (
                <div className="mt-2 text-gray-500 text-sm">Nombre del producto</div>
            )}
            {(!priceComponent || !productData) && !isPreview && (
                <div className="text-gray-500 text-sm">Precio del producto</div>
            )}
        </div>
    );
};

export default CarouselCardComponent;