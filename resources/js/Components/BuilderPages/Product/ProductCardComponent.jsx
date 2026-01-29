import React from 'react';
import ProductImageComponent from './ProductImageComponent';
import ProductNameComponent from './ProductNameComponent';
import ProductPriceComponent from './ProductPriceComponent';
import ComponentWithHover from '../ComponentWithHover';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, hslToCss, getResolvedFont } from '@/utils/themeUtils';

const ProductCardComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    isPreview,
    products,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId,
    mode = 'builder',
    companyId,
}) => {
    const { settings } = usePage().props;
    const cardConfig = comp.content || {};
    const children = cardConfig.children || [];
    const productData = cardConfig.productData;
    const themeWithDefaults = getThemeWithDefaults(themeSettings);

    // ==================== MANEJO DE NAVEGACIÓN ====================
    const handleProductClick = (e) => {
        // Solo navegar en modo frontend
        if (mode === 'frontend' && productData?.slug) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `/detalles-del-producto?product=${productData.slug}`;
            return;
        }
        
        // Modo builder: editar (si no está en preview)
        if (mode === 'builder' && !isPreview && onEdit && e.target === e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
            onEdit(comp);
        }
    };

    // ==================== RENDERIZADO FRONTEND ====================
    if (mode === 'frontend') {
        // Extraer los componentes hijos específicos
        const imageChild = children.find(child => child.type === 'productImage');
        const nameChild = children.find(child => child.type === 'productName');
        const priceChild = children.find(child => child.type === 'productPrice');

        // Estilos para cada parte con valores del tema
        const imageStyles = imageChild?.styles || {};
        const nameStyles = nameChild?.styles || {};
        const priceStyles = priceChild?.styles || {};

        // Configuración de la tarjeta con valores del tema
        const cardStyle = {
            // Estilos del contenedor de la tarjeta
            paddingTop: cardConfig.cardPaddingTop || '0px',
            paddingRight: cardConfig.cardPaddingRight || '0px',
            paddingBottom: cardConfig.cardPaddingBottom || '0px',
            paddingLeft: cardConfig.cardPaddingLeft || '0px',
            border: cardConfig.cardBorder === 'solid' 
                ? `${cardConfig.cardBorderThickness || '1px'} solid rgba(0, 0, 0, ${cardConfig.cardBorderOpacity || 1})` 
                : 'none',
            borderRadius: cardConfig.cardBorderRadius || '0px',
            backgroundColor: cardConfig.cardBackgroundColor || hslToCss(themeWithDefaults.background),
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: `0 2px 8px ${themeWithDefaults.shadows ? `hsl(${themeWithDefaults.shadows})` : 'rgba(0,0,0,0.1)'}`,
            textDecoration: 'none',
            color: 'inherit',
        };

        // Estilos del contenedor de imagen
        const imageContainerStyle = {
            aspectRatio: imageStyles.aspectRatio === 'portrait' ? '3/4' : 
                        imageStyles.aspectRatio === 'landscape' ? '4/3' : '1/1',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: imageStyles.imageBorderRadius || '0px',
            marginBottom: '12px',
            width: '100%',
        };

        // Estilos de la imagen
        const imageStyle = {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            border: imageStyles.imageBorder === 'solid' 
                ? `${imageStyles.imageBorderThickness || '1px'} solid rgba(0, 0, 0, ${imageStyles.imageBorderOpacity || 1})` 
                : imageStyles.imageBorder === 'none' ? 'none' : undefined,
            borderRadius: imageStyles.imageBorderRadius || '0px',
            display: 'block',
            transition: 'transform 0.3s ease',
        };

        // Estilos del nombre del producto con valores del tema
        const nameStyle = {
            fontSize: nameStyles.fontSize || '16px',
            fontWeight: nameStyles.fontWeight || '600',
            color: nameStyles.color || hslToCss(themeWithDefaults.text),
            textAlign: nameStyles.alignment || 'left',
            marginBottom: '8px',
            lineHeight: nameStyles.lineHeight || '1.4',
            fontFamily: nameStyles.fontFamily || getResolvedFont(themeWithDefaults, 'body_font'),
            textTransform: nameStyles.textTransform || 'none',
            flexGrow: 1,
        };

        // Estilos del precio con valores del tema
        const priceStyle = {
            fontSize: priceStyles.fontSize || '14px',
            fontWeight: priceStyles.fontWeight || 'normal',
            color: priceStyles.color || hslToCss(themeWithDefaults.text),
            textAlign: priceStyles.alignment || 'left',
            lineHeight: priceStyles.lineHeight || '1.4',
            fontFamily: priceStyles.fontFamily || getResolvedFont(themeWithDefaults, 'body_font'),
            marginTop: 'auto',
        };

        // Efecto hover para frontend
        const handleMouseEnter = (e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
            if (imageStyle) {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.05)';
            }
        };

        const handleMouseLeave = (e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 2px 8px ${themeWithDefaults.shadows ? `hsl(${themeWithDefaults.shadows})` : 'rgba(0,0,0,0.1)'}`;
            if (imageStyle) {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
            }
        };

        return (
            <div 
                className="product-card"
                onClick={handleProductClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={cardStyle}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleProductClick(e);
                    }
                }}
            >
                {/* Imagen del producto */}
                <div className="product-image-container" style={imageContainerStyle}>
                    <img 
                        src={productData?.media?.[0]?.original_url || 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png'}
                        alt={productData?.product_name || 'Producto'}
                        style={imageStyle}
                        onError={(e) => {
                            e.target.src = 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png';
                        }}
                    />
                </div>
                
                {/* Nombre del producto */}
                <h3 className="product-name" style={nameStyle}>
                    {productData?.product_name || 'Nombre del producto'}
                </h3>
                
                {/* Precio */}
                <div className="product-price" style={priceStyle}>
                    {productData?.product_price_discount && settings?.currency ? (
                        <>
                            <span style={{ textDecoration: 'line-through', marginRight: '8px', opacity: 0.6 }}>
                                <CurrencyDisplay currency={settings.currency} amount={parseFloat(productData.product_price || 0)} />
                            </span>
                            <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
                                <CurrencyDisplay currency={settings.currency} amount={parseFloat(productData.product_price_discount)} />
                            </span>
                        </>
                    ) : settings?.currency ? (
                        <span><CurrencyDisplay currency={settings.currency} amount={parseFloat(productData?.product_price || 0)} /></span>
                    ) : (
                        <span>${parseFloat(productData?.product_price || 0).toFixed(2)}</span>
                    )}
                </div>
            </div>
        );
    }

    // ==================== RENDERIZADO BUILDER ====================
    // Estilos de la carta para builder con valores del tema
    const cardStyles = {
        paddingTop: cardConfig.cardPaddingTop || '0px',
        paddingRight: cardConfig.cardPaddingRight || '0px',
        paddingBottom: cardConfig.cardPaddingBottom || '0px',
        paddingLeft: cardConfig.cardPaddingLeft || '0px',
        border: cardConfig.cardBorder === 'solid' 
            ? `${cardConfig.cardBorderThickness} solid rgba(0, 0, 0, ${cardConfig.cardBorderOpacity})` 
            : 'none',
        borderRadius: cardConfig.cardBorderRadius || '0px',
        backgroundColor: cardConfig.cardBackgroundColor || hslToCss(themeWithDefaults.background),
        boxShadow: `0 2px 4px ${themeWithDefaults.shadows ? `hsl(${themeWithDefaults.shadows})` : 'rgba(0,0,0,0.1)'}`,
    };

    // Manejo de eventos de mouse para builder
    const handleMouseEnter = () => {
        if (setHoveredComponentId && !isPreview && mode === 'builder') {
            setHoveredComponentId(comp.id);
        }
    };

    const handleMouseLeave = () => {
        if (setHoveredComponentId && !isPreview && mode === 'builder') {
            setHoveredComponentId(null);
        }
    };

    // Manejo de clic para builder
    const handleClick = (e) => {
        if (!isPreview && onEdit && e.target === e.currentTarget && mode === 'builder') {
            onEdit(comp);
        }
    };

    return (
        <div
            style={cardStyles}
            className="product-card"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {children.map((child) => {
                const enhancedChild = {
                    ...child,
                    content: getChildContent(child.type, productData, child.content)
                };

                switch (child.type) {
                    case 'productImage':
                        return (
                            <ComponentWithHover
                                key={child.id}
                                component={child}
                                isPreview={isPreview}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                                getComponentTypeName={(type) => type}
                            >
                                <ProductImageComponent
                                    comp={enhancedChild}
                                    getStyles={getStyles}
                                    isPreview={isPreview}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    hoveredComponentId={hoveredComponentId}
                                    setHoveredComponentId={setHoveredComponentId}
                                    mode="builder"
                                />
                            </ComponentWithHover>
                        );
                    case 'productName':
                        return (
                            <ComponentWithHover
                                key={child.id}
                                component={child}
                                isPreview={isPreview}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                                getComponentTypeName={(type) => type}
                            >
                                <ProductNameComponent
                                    comp={enhancedChild}
                                    getStyles={getStyles}
                                    isPreview={isPreview}
                                    themeSettings={themeSettings}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    hoveredComponentId={hoveredComponentId}
                                    setHoveredComponentId={setHoveredComponentId}
                                    mode="builder"
                                />
                            </ComponentWithHover>
                        );
                    case 'productPrice':
                        return (
                            <ComponentWithHover
                                key={child.id}
                                component={child}
                                isPreview={isPreview}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                                getComponentTypeName={(type) => type}
                            >
                                <ProductPriceComponent
                                    comp={enhancedChild}
                                    getStyles={getStyles}
                                    themeSettings={themeSettings}
                                    isPreview={isPreview}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    hoveredComponentId={hoveredComponentId}
                                    setHoveredComponentId={setHoveredComponentId}
                                    mode="builder"
                                />
                            </ComponentWithHover>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
};

// Función auxiliar para obtener contenido basado en datos del producto
const getChildContent = (type, productData, fallback) => {
    if (!productData) return fallback;

    switch (type) {
        case 'productImage':
            return productData.media?.[0]?.original_url || fallback;
        case 'productName':
            return productData.product_name || fallback;
        case 'productPrice':
            return productData.product_price ? parseFloat(productData.product_price) : fallback;
        default:
            return fallback;
    }
};

export default ProductCardComponent;