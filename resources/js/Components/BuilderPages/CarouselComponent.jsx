// components/BuilderPages/components/CarouselComponent.jsx
import React, { useState, useRef, useEffect } from 'react';
import TextComponent from './TextComponent';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

const CarouselComponent = ({ 
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
    const customStyles = comp.styles || {};
    const carouselConfig = comp.content || {};
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Configuración del carrusel
    const limit = carouselConfig.limit || 5;
    const slidesToShow = carouselConfig.slidesToShow || 3;
    const gapX = carouselConfig.gapX || '10px';
    const gapY = carouselConfig.gapY || '10px';

    // Estilos de la carta
    const cardBorder = carouselConfig.cardBorder || 'none';
    const cardBorderThickness = carouselConfig.cardBorderThickness || '1px';
    const cardBorderOpacity = carouselConfig.cardBorderOpacity || '1';
    const cardBorderRadius = carouselConfig.cardBorderRadius || '0px';
    const cardPaddingTop = carouselConfig.cardPaddingTop || '10px';
    const cardPaddingRight = carouselConfig.cardPaddingRight || '10px';
    const cardPaddingBottom = carouselConfig.cardPaddingBottom || '10px';
    const cardPaddingLeft = carouselConfig.cardPaddingLeft || '10px';

    // Estilos de la imagen
    const imageBorder = carouselConfig.imageBorder || 'none';
    const imageBorderThickness = carouselConfig.imageBorderThickness || '1px';
    const imageBorderOpacity = carouselConfig.imageBorderOpacity || '1';
    const imageBorderRadius = carouselConfig.imageBorderRadius || '0px';

    // Estilos para textos
    const sectionTitleStyles = carouselConfig.sectionTitleStyles || {};
    const productTitleStyles = carouselConfig.productTitleStyles || {};
    const priceStyles = carouselConfig.priceStyles || {};

    // Container styles para el wrapper
    const containerStyles = {
        ...getStyles(comp),
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: isPreview ? 'none' : '1px none #ccc',
        minHeight: '50px',
        position: 'relative',
        boxSizing: 'border-box',
                backgroundColor: carouselConfig.backgroundColor || '#ffffff', // Agregar esta línea
    };

    // Card styles
    const getCardStyles = () => ({
        paddingTop: cardPaddingTop,
        paddingRight: cardPaddingRight,
        paddingBottom: cardPaddingBottom,
        paddingLeft: cardPaddingLeft,
        border: cardBorder === 'solid' 
            ? `${cardBorderThickness} solid rgba(0, 0, 0, ${cardBorderOpacity})` 
            : 'none',
        borderRadius: cardBorderRadius,
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flex: `0 0 calc(${100 / slidesToShow}% - ${parseInt(gapX) * (slidesToShow - 1) / slidesToShow}px)`,
        minWidth: 0, // Important for flexbox sizing
    });

    // Image styles
    const getImageStyles = () => ({
        width: '100%',
        height: '200px',
        border: imageBorder === 'solid' 
            ? `${imageBorderThickness} solid rgba(0, 0, 0, ${imageBorderOpacity})` 
            : 'none',
        borderRadius: imageBorderRadius,
        objectFit: 'cover',
    });

    // Funciones para eventos de mouse
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

    const productsToShow = products ? products.slice(0, limit) : [];

    // Carrusel navigation
    const nextSlide = () => {
        if (currentIndex < productsToShow.length - slidesToShow) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Calculate visible products based on current index
    const visibleProducts = productsToShow.slice(currentIndex, currentIndex + slidesToShow);

    return (
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Título de la sección */}
            <TextComponent
                comp={{
                    id: comp.id + '-title',
                    type: 'text',
                    content: carouselConfig.sectionTitle || 'Productos en Carrusel',
                    styles: {
                        layout: sectionTitleStyles.layout || 'fit',
                        alignment: sectionTitleStyles.alignment || 'center',
                        fontSize: sectionTitleStyles.fontSize || '24px',
                        fontWeight: sectionTitleStyles.fontWeight || 'bold',
                        color: sectionTitleStyles.color || '#000000',
                        ...sectionTitleStyles
                    }
                }}
                getStyles={() => ({})}
                isPreview={isPreview}
            />

            {/* Contenedor del carrusel */}
            <div className="relative">
                {/* Botones de navegación */}
                {productsToShow.length > slidesToShow && (
                    <>
                        <Button
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                                currentIndex === 0 ? 'opacity-50' : 'opacity-100'
                            }`}
                            size="icon"
                            // style={{ left: '-20px' }}
                            >
                            <ChevronLeft size={20} className='text-black' />
                        </Button>
                        
                        <Button
                            onClick={nextSlide}
                            disabled={currentIndex >= productsToShow.length - slidesToShow}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                                currentIndex >= productsToShow.length - slidesToShow ? 'opacity-50' : 'opacity-100'
                            }`}
                            size="icon"
                            // style={{ right: '-20px' }}
                        >
                            <ChevronRight size={20} className='text-black' />
                        </Button>
                    </>
                )}

                {/* Carrusel de productos */}
                <div 
                    ref={carouselRef}
                    className="flex transition-all duration-300 ease-in-out"
                    style={{ 
                        gap: gapX,
                        padding: `${gapY} 0`,
                    }}
                >
                    {visibleProducts.map((product, index) => (
                        <div key={product.id} style={getCardStyles()}>
                            {/* Imagen del producto */}
                            {product.media && product.media.length > 0 && (
                                <img 
                                    src={product.media[0].original_url} 
                                    alt={product.product_name}
                                    style={getImageStyles()}
                                />
                            )}
                            
                            {/* Nombre del producto */}
                            <TextComponent
                                comp={{
                                    id: `${comp.id}-product-${product.id}-name`,
                                    type: 'text',
                                    content: product.product_name,
                                    styles: {
                                        layout: productTitleStyles.layout || 'fit',
                                        alignment: productTitleStyles.alignment || 'left',
                                        fontSize: productTitleStyles.fontSize || '16px',
                                        fontWeight: productTitleStyles.fontWeight || '600',
                                        color: productTitleStyles.color || '#000000',
                                        marginTop: '10px',
                                        ...productTitleStyles
                                    }
                                }}
                                getStyles={() => ({})}
                                isPreview={isPreview}
                            />
                            
                            {/* Precio del producto */}
                            <TextComponent
                                comp={{
                                    id: `${comp.id}-product-${product.id}-price`,
                                    type: 'text',
                                    content: `$${parseFloat(product.product_price).toFixed(2)}`,
                                    styles: {
                                        layout: priceStyles.layout || 'fit',
                                        alignment: priceStyles.alignment || 'left',
                                        fontSize: priceStyles.fontSize || '14px',
                                        fontWeight: priceStyles.fontWeight || 'normal',
                                        color: priceStyles.color || '#666666',
                                        marginTop: '5px',
                                        ...priceStyles
                                    }
                                }}
                                getStyles={() => ({})}
                                isPreview={isPreview}
                            />
                        </div>
                    ))}
                </div>

                {/* Indicadores de posición (dots) */}
                {productsToShow.length > slidesToShow && (
                    <div className="flex justify-center mt-4 space-x-2">
                        {Array.from({ length: productsToShow.length - slidesToShow + 1 }).map((_, index) => (
                            <Button
                            size="icon"
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                    index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {(!products || products.length === 0) && !isPreview && (
                <div className="text-center text-gray-400 py-8">
                    <p>No hay productos disponibles</p>
                    <p className="text-sm">Agrega productos desde el panel de administración</p>
                </div>
            )}
        </div>
    );
};

export default CarouselComponent;