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
            border: hoveredComponentId === comp.id ? '2px solid blue' : 'none',
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
            'container': 'Contenedor'
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