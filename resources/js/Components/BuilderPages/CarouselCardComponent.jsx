import React from 'react';
import CarouselImageComponent from './CarouselImageComponent';
import CarouselNameComponent from './CarouselNameComponent';
import CarouselPriceComponent from './CarouselPriceComponent';

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

    // Estilos de la carta con valores por defecto - USAR getStyles
    const cardStyles = {
        ...getStyles(comp), // Aplicar estilos del componente
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

    // Encontrar los componentes hijos con manejo de errores
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
            {/* Imagen */}
            {imageComponent && productData && (
                <CarouselImageComponent
                    comp={{
                        ...imageComponent,
                        content: productData.media && productData.media.length > 0 
                            ? productData.media[0].original_url 
                            : imageComponent.content
                    }}
                    getStyles={getStyles} // Pasar getStyles
                    isPreview={isPreview}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}

            {/* Mostrar placeholder si no hay imagen */}
            {(!imageComponent || !productData) && !isPreview && (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Imagen del producto</span>
                </div>
            )}

            {/* Nombre */}
            {nameComponent && productData && (
                <CarouselNameComponent
                    comp={{
                        ...nameComponent,
                        content: productData.product_name || nameComponent.content
                    }}
                    getStyles={getStyles} // Pasar getStyles
                    isPreview={isPreview}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}

            {/* Precio */}
            {priceComponent && productData && (
                <CarouselPriceComponent
                    comp={{
                        ...priceComponent,
                        content: productData.product_price 
                            ? `$${parseFloat(productData.product_price).toFixed(2)}`
                            : priceComponent.content
                    }}
                    getStyles={getStyles} // Pasar getStyles
                    isPreview={isPreview}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
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