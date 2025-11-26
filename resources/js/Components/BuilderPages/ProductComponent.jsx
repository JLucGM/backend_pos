// components/BuilderPages/components/ProductComponent.jsx
import React from 'react';
import TextComponent from './TextComponent';

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
    const customStyles = comp.styles || {};
    const productConfig = comp.content || {};

    // Configuración del grid
    const columns = productConfig.columns || 3;
    const gapX = productConfig.gapX || '10px';
    const gapY = productConfig.gapY || '10px';
    const limit = productConfig.limit || 8;

    // Estilos de la carta
    const cardBorder = productConfig.cardBorder || 'none';
    const cardBorderThickness = productConfig.cardBorderThickness || '1px';
    const cardBorderOpacity = productConfig.cardBorderOpacity || '1';
    const cardBorderRadius = productConfig.cardBorderRadius || '0px';
    const cardPaddingTop = productConfig.cardPaddingTop || '0px';
    const cardPaddingRight = productConfig.cardPaddingRight || '0px';
    const cardPaddingBottom = productConfig.cardPaddingBottom || '0px';
    const cardPaddingLeft = productConfig.cardPaddingLeft || '0px';

    // Estilos de la imagen
    const imageBorder = productConfig.imageBorder || 'none';
    const imageBorderThickness = productConfig.imageBorderThickness || '1px';
    const imageBorderOpacity = productConfig.imageBorderOpacity || '1';
    const imageBorderRadius = productConfig.imageBorderRadius || '0px';

    // Estilos SEPARADOS para título de sección y nombres de productos
    const sectionTitleStyles = productConfig.sectionTitleStyles || {};
    const productTitleStyles = productConfig.productTitleStyles || {};
    const priceStyles = productConfig.priceStyles || {};

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
    };

    // Grid styles
    const gridStyles = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gapY} ${gapX}`,
        width: '100%',
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
    });

    // Image styles
    const getImageStyles = () => ({
        width: '100%',
        height: 'auto',
        border: imageBorder === 'solid' 
            ? `${imageBorderThickness} solid rgba(0, 0, 0, ${imageBorderOpacity})` 
            : 'none',
        borderRadius: imageBorderRadius,
        objectFit: 'cover',
    });

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

    const productsToShow = products ? products.slice(0, limit) : [];

    return (
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Título de la sección - usa sectionTitleStyles */}
            <TextComponent
                comp={{
                    id: comp.id + '-title',
                    type: 'text',
                    content: productConfig.sectionTitle || 'Productos Destacados',
                    styles: {
                        layout: 'fill',
                        alignment: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        ...sectionTitleStyles // Solo sectionTitleStyles aquí
                    }
                }}
                getStyles={() => ({})}
                isPreview={isPreview}
            />

            {/* Grid de productos */}
            <div style={gridStyles}>
                {productsToShow.map((product, index) => (
                    <div key={product.id} style={getCardStyles()}>
                        {/* Imagen del producto */}
                        {product.media && product.media.length > 0 && (
                            <img 
                                src={product.media[0].original_url} 
                                alt={product.product_name}
                                style={getImageStyles()}
                            />
                        )}
                        
                        {/* Nombre del producto - usa productTitleStyles */}
                        <TextComponent
                            comp={{
                                id: `${comp.id}-product-${product.id}-name`,
                                type: 'text',
                                content: product.product_name,
                                styles: {
                                    layout: 'fill',
                                    alignment: 'left',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    marginTop: '10px',
                                    ...productTitleStyles // Solo productTitleStyles aquí
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
                                    layout: 'fill',
                                    alignment: 'left',
                                    fontSize: '14px',
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