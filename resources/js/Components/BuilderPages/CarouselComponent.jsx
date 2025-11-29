import React, { useState, useRef } from 'react';
import CarouselTitleComponent from './CarouselTitleComponent';
import CarouselCardComponent from './CarouselCardComponent';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import ComponentWithHover from './ComponentWithHover';

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
    const carouselConfig = comp.content || {};
    const children = carouselConfig.children || [];
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Configuración del carrusel
    const limit = carouselConfig.limit || 5;
    const slidesToShow = carouselConfig.slidesToShow || 3;
    const gapX = carouselConfig.gapX || '10px';
    const gapY = carouselConfig.gapY || '10px';

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

    // Container styles
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
        backgroundColor: carouselConfig.backgroundColor || '#ffffff',
        padding: '20px 0',
    };

    // Encontrar los componentes hijos
    const titleComponent = children.find(child => child.type === 'carouselTitle');
    const cardComponent = children.find(child => child.type === 'carouselCard');

    // Si no hay cardComponent, mostrar mensaje de error
    if (!cardComponent) {
        return (
            <div style={containerStyles} className="p-4 border border-red-300 bg-red-50 rounded">
                <p className="text-red-600 text-center">
                    Error: No se encontró el componente de carta del carrusel.
                </p>
                {!isPreview && (
                    <p className="text-red-500 text-sm text-center mt-2">
                        Por favor, edita el carrusel y asegúrate de que tenga un componente de carta.
                    </p>
                )}
            </div>
        );
    }

    // Asegurarnos de que cardComponent.content existe
    const safeCardComponent = {
        ...cardComponent,
        content: cardComponent.content || {}
    };

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
            {/* Título del carrusel */}
            {titleComponent && (
                <ComponentWithHover
                    component={titleComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <CarouselTitleComponent
                        comp={titleComponent}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                </ComponentWithHover>
            )}

            {/* Contenedor del carrusel */}
            <div className="relative">
                {/* Botones de navegación */}
                {productsToShow.length > slidesToShow && (
                    <>
                        <Button
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            size="icon"
                        >
                            <ChevronLeft size={20} className='text-black' />
                        </Button>

                        <Button
                            onClick={nextSlide}
                            disabled={currentIndex >= productsToShow.length - slidesToShow}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            size="icon"
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
                        <div
                            key={product.id}
                            style={{
                                flex: `0 0 calc(${100 / slidesToShow}% - ${parseInt(gapX) * (slidesToShow - 1) / slidesToShow}px)`,
                                minWidth: 0,
                            }}
                        >
                            <ComponentWithHover
                                component={safeCardComponent}
                                isPreview={isPreview}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                                getComponentTypeName={getComponentTypeName}
                            >
                                <CarouselCardComponent
                                    comp={{
                                        ...safeCardComponent,
                                        content: {
                                            ...safeCardComponent.content,
                                            productData: product
                                        }
                                    }}
                                    getStyles={getStyles}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    themeSettings={themeSettings}
                                    isPreview={isPreview}
                                    products={products}
                                    setComponents={setComponents}
                                    hoveredComponentId={hoveredComponentId}
                                    setHoveredComponentId={setHoveredComponentId}
                                />
                            </ComponentWithHover>
                        </div>
                    ))}
                </div>

                {/* Indicadores de posición (dots) */}
                {productsToShow.length > slidesToShow && (
                    <div className="flex justify-center mt-4 space-x-2">
                        {Array.from({ length: productsToShow.length - slidesToShow + 1 }).map((_, index) => (
                            <Button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                                size="icon"
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