// components/BuilderPages/CanvasItem.jsx
import React from 'react';
import TextComponent from './TextComponent';
import HeadingComponent from './HeadingComponent';
import ButtonComponent from './ButtonComponent';
import ImageComponent from './ImageComponent';
import VideoComponent from './VideoComponent';
import LinkComponent from './LinkComponent';
import ProductComponent from './ProductComponent';
import CarouselComponent from './CarouselComponent';
import ContainerComponent from './ContainerComponent';
import BannerComponent from './BannerComponent';
import BannerTitleComponent from './BannerTitleComponent';
import BannerTextComponent from './BannerTextComponent';
import ProductTitleComponent from './ProductTitleComponent';
import ProductCardComponent from './ProductCardComponent';
import ProductImageComponent from './ProductImageComponent';
import ProductNameComponent from './ProductNameComponent';
import ProductPriceComponent from './ProductPriceComponent';
import CarouselPriceComponent from './CarouselPriceComponent';
import CarouselNameComponent from './CarouselNameComponent';
import CarouselImageComponent from './CarouselImageComponent';
import CarouselCardComponent from './CarouselCardComponent';
import CarouselTitleComponent from './CarouselTitleComponent';

const CanvasItem = ({
    comp,
    onEditComponent,
    onDeleteComponent,
    themeSettings,
    isPreview,
    products,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const getStyles = (comp) => {
        const styles = comp.styles || {};
        const baseStyles = {
            color: styles.color || (themeSettings?.primary ? `hsl(${themeSettings.primary})` : 'inherit'),
            fontSize: styles.fontSize || 'inherit',
            backgroundColor: styles.backgroundColor || (themeSettings?.primary ? `hsl(${themeSettings.primary})` : 'inherit'),
            padding: styles.padding || 'inherit',
            fontFamily: themeSettings?.fontFamily || 'inherit',
        };
        return baseStyles;
    };

    const isHovered = hoveredComponentId === comp.id;

    // Funciones seguras para eventos de mouse
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

    const renderComponent = () => {
        switch (comp.type) {
            case 'text':
                return (
                    <TextComponent
                        comp={comp}
                        getStyles={getStyles}
                        isPreview={isPreview}
                    />
                );
            case 'heading':
                return (
                    <HeadingComponent
                        comp={comp}
                        getStyles={getStyles}
                        isPreview={isPreview}
                    />
                );
            case 'button':
                return (
                    <ButtonComponent
                        comp={comp}
                        getStyles={getStyles}
                        isPreview={isPreview}
                    />
                );
            case 'image':
                return (
                    <ImageComponent
                        comp={comp}
                        getStyles={getStyles}
                        isPreview={isPreview}
                    />
                );
            case 'video':
                return (
                    <VideoComponent
                        comp={comp}
                        getStyles={getStyles}
                        isPreview={isPreview}
                    />
                );
            case 'link':
                return (
                    <LinkComponent
                        comp={comp}
                        getStyles={getStyles}
                        isPreview={isPreview}
                    />
                );
            case 'product':
                return (
                    <ProductComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'carousel':
                return (
                    <CarouselComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );

            // En el switch de CanvasItem.jsx, agrega:
            case 'carouselTitle':
                return (
                    <CarouselTitleComponent
                        comp={comp}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'carouselCard':
                return (
                    <CarouselCardComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'carouselImage':
                return (
                    <CarouselImageComponent
                        comp={comp}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'carouselName':
                return (
                    <CarouselNameComponent
                        comp={comp}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'carouselPrice':
                return (
                    <CarouselPriceComponent
                        comp={comp}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'container':
                return (
                    <ContainerComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'banner':
                return (
                    <BannerComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'bannerTitle':
                return (
                    <BannerTitleComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'bannerText':
                return (
                    <BannerTextComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'productTitle':
                return (
                    <ProductTitleComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'productCard':
                return (
                    <ProductCardComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'productImage':
                return (
                    <ProductImageComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'productName':
                return (
                    <ProductNameComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'productPrice':
                return (
                    <ProductPriceComponent
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            default:
                return <div>Componente no reconocido: {comp.type}</div>;
        }
    };

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
            'productPrice': 'Precio de Producto'
        };
        return typeNames[type] || type;
    };

    return (
        <div
            id={`component-${comp.id}`}
            className={`relative group rounded-lg transition-all duration-200 ${isHovered && !isPreview
                ? 'border border-blue-400 bg-blue-50'
                : 'border border-transparent'
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Solo mostrar el tooltip en modo edición */}
            {!isPreview && (
                <div className={`rounded-t-lg bg-blue-500 text-white text-xs px-2 py-1 transition-opacity duration-300 absolute -top-6 left-0 z-50 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                    {getComponentTypeName(comp.type)}
                </div>
            )}

            <div className="">
                {renderComponent()}
            </div>
        </div>
    );
};

export default CanvasItem;