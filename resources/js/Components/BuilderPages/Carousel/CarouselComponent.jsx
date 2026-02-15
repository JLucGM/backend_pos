import React, { useState, useRef } from 'react';
import CarouselTitleComponent from './CarouselTitleComponent';
import CarouselCardComponent from './CarouselCardComponent';
import TextComponent from '../TextComponent';
import HeadingComponent from '../HeadingComponent';
import ButtonComponent from '../ButtonComponent';
import ImageComponent from '../ImageComponent';
import LinkComponent from '../LinkComponent';
import VideoComponent from '../VideoComponent';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ComponentWithHover from '../ComponentWithHover';
import { Button } from '@/Components/ui/button';
import { getThemeWithDefaults, getComponentStyles, resolveStyleValue } from '@/utils/themeUtils';

const CarouselComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme,
    isPreview,
    products,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId,
    mode = 'builder' // Agregar mode prop
}) => {
    const rawContent = comp.content || {};
    const rawStyles = comp.styles || {};
    const children = rawContent.children || [];
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const themeCarouselStyles = getComponentStyles(themeWithDefaults, 'carousel', appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos base del componente
    const baseStyles = getStyles(comp);
    const resolvedBaseStyles = {};
    Object.keys(baseStyles).forEach(key => {
        resolvedBaseStyles[key] = resolveValue(baseStyles[key]);
    });

    // Resolver contenido (carouselConfig)
    const config = {};
    Object.keys(rawContent).forEach(key => {
        config[key] = resolveValue(rawContent[key]);
    });

    // Resolver estilos personalizados (rawStyles)
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    // Configuración del carrusel con valores resueltos y del tema
    const limit = config.limit || 5;
    const slidesToShow = config.slidesToShow || 3;
    const gapX = config.gapX || themeWithDefaults.carousel_gapX;
    const gapY = config.gapY || themeWithDefaults.carousel_gapY;

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

    // Container styles con valores resueltos y del tema
    const containerStyles = {
        ...resolvedBaseStyles,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: isPreview ? 'none' : '1px none #ccc',
        minHeight: '50px',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: config.backgroundColor || themeCarouselStyles.backgroundColor,
        padding: '20px 0',
    };

    // Encontrar los componentes hijos
    const titleComponent = children.find(child => child.type === 'carouselTitle');
    const cardComponent = children.find(child => child.type === 'carouselCard');

    // Filtrar otros componentes (text, heading, button, etc.)
    const otherComponents = children.filter(child =>
        child.type !== 'carouselTitle' &&
        child.type !== 'carouselCard' &&
        // Solo incluir componentes que sabemos cómo renderizar
        ['text', 'heading', 'button', 'image', 'link', 'video'].includes(child.type)
    );

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

    // Función para renderizar componentes básicos
    const renderBasicComponent = (child) => {
        const commonProps = {
            comp: child,
            getStyles,
            isPreview,
            themeSettings,
            appliedTheme,
            onEdit,
            onDelete,
            hoveredComponentId,
            setHoveredComponentId
        };

        switch (child.type) {
            case 'text':
                return <TextComponent {...commonProps} />;
            case 'heading':
                return <HeadingComponent {...commonProps} />;
            case 'button':
                return <ButtonComponent {...commonProps} onEdit={onEdit} />;
            case 'image':
                return <ImageComponent {...commonProps} />;
            case 'link':
                return <LinkComponent {...commonProps} onEdit={onEdit} />;
            case 'video':
                return <VideoComponent {...commonProps} />;
            default:
                return null;
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

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

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
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme} // Asegurar que se pase appliedTheme
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                </ComponentWithHover>
            )}

            {/* Renderizar otros componentes (text, heading, button, etc.) */}
            {otherComponents.map((child) => (
                <ComponentWithHover
                    key={child.id}
                    component={child}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    {renderBasicComponent(child)}
                </ComponentWithHover>
            ))}

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
                        gap: withUnit(gapX),
                        padding: `${withUnit(gapY)} 0`,
                    }}
                >
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            style={{
                                flex: `0 0 calc(${100 / slidesToShow}% - ${(parseInt(gapX) || 0) * (slidesToShow - 1) / slidesToShow}px)`,
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
                                    appliedTheme={appliedTheme} // Pasar appliedTheme
                                    isPreview={isPreview}
                                    products={products}
                                    setComponents={setComponents}
                                    hoveredComponentId={hoveredComponentId}
                                    setHoveredComponentId={setHoveredComponentId}
                                    mode={mode} // Pasar mode prop
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