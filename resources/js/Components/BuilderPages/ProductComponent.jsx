import React from 'react';
import ProductTitleComponent from './ProductTitleComponent';
import ProductCardComponent from './ProductCardComponent';
import TextComponent from './TextComponent';
import HeadingComponent from './HeadingComponent';
import ButtonComponent from './ButtonComponent';
import ImageComponent from './ImageComponent';
import LinkComponent from './LinkComponent';
import VideoComponent from './VideoComponent';
import ComponentWithHover from './ComponentWithHover';

const ProductComponent = ({
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
    const productConfig = comp.content || {};
    const children = productConfig.children || [];

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

    // Configuración del grid
    const columns = productConfig.columns || 3;
    const gapX = productConfig.gapX || '10px';
    const gapY = productConfig.gapY || '10px';
    const limit = productConfig.limit || 8;

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
        backgroundColor: productConfig.backgroundColor || '#ffffff',
    };

    // Grid styles
    const gridStyles = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gapY} ${gapX}`,
        width: '100%',
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

    // Encontrar los componentes hijos
    const titleComponent = children.find(child => child.type === 'productTitle');
    const cardComponent = children.find(child => child.type === 'productCard');
    
    // Filtrar otros componentes (text, heading, button, etc.)
    const otherComponents = children.filter(child => 
        child.type !== 'productTitle' && 
        child.type !== 'productCard' &&
        // Solo incluir componentes que sabemos cómo renderizar
        ['text', 'heading', 'button', 'image', 'link', 'video'].includes(child.type)
    );

    // Obtener productos para mostrar
    const productsToShow = products ? products.slice(0, limit) : [];

    // Función para renderizar componentes básicos
    const renderBasicComponent = (child) => {
        const commonProps = {
            comp: child,
            getStyles,
            isPreview,
            themeSettings,
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
                return <LinkComponent {...commonProps} themeSettings={themeSettings} onEdit={onEdit} />;
            case 'video':
                return <VideoComponent {...commonProps} />;
            default:
                return null;
        }
    };

    return (
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Renderizar título con ComponentWithHover */}
            {titleComponent && (
                <ComponentWithHover
                    component={titleComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <ProductTitleComponent
                        comp={titleComponent}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        themeSettings={themeSettings}
                        onEdit={onEdit}
                        onDelete={onDelete}
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

            {/* Grid de productos */}
            {cardComponent && (
                <div style={gridStyles}>
                    {productsToShow.map((product, index) => (
                        <ComponentWithHover
                            key={product.id}
                            component={cardComponent}
                            isPreview={isPreview}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                            getComponentTypeName={getComponentTypeName}
                        >
                            <ProductCardComponent
                                comp={{
                                    ...cardComponent,
                                    content: {
                                        ...cardComponent.content,
                                        productData: product // Pasar datos del producto específico
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
                    ))}
                </div>
            )}

            {(!products || products.length === 0) && !isPreview && (
                <div className="text-center text-gray-400 py-8">
                    <p>No hay productos disponibles</p>
                    <p className="text-sm">Agrega productos desde el panel de administración</p>
                </div>
            )}
        </div>
    );
};

export default ProductComponent;