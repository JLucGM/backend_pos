// components/BuilderPages/components/ProductComponent.jsx
import React from 'react';
import ProductTitleComponent from './ProductTitleComponent';
import ProductCardComponent from './ProductCardComponent';

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

    // Obtener productos para mostrar
    const productsToShow = products ? products.slice(0, limit) : [];

    return (
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Renderizar título si existe */}
            {titleComponent && (
                <ProductTitleComponent
                    comp={titleComponent}
                    getStyles={() => ({})}
                    isPreview={isPreview}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}

            {/* Grid de productos */}
            {cardComponent && (
                <div style={gridStyles}>
                    {productsToShow.map((product, index) => (
                        <ProductCardComponent
                            key={product.id}
                            comp={{
                                ...cardComponent,
                                content: {
                                    ...cardComponent.content,
                                    productData: product // Pasar datos del producto específico
                                }
                            }}
                            getStyles={() => ({})}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            themeSettings={themeSettings}
                            isPreview={isPreview}
                            products={products}
                            setComponents={setComponents}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                        />
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