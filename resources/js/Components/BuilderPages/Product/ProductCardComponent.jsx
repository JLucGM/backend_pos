import React from 'react';
import ProductImageComponent from './ProductImageComponent';
import ProductNameComponent from './ProductNameComponent';
import ProductPriceComponent from './ProductPriceComponent';
import ComponentWithHover from '../ComponentWithHover';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, resolveStyleValue, getResolvedFont } from '@/utils/themeUtils';

const ProductCardComponent = ({
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
    mode = 'builder',
    companyId,
}) => {
    const { settings } = usePage().props;
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver contenido del componente
    const rawCardConfig = comp.content || {};
    const cardConfig = {};
    Object.keys(rawCardConfig).forEach(key => {
        cardConfig[key] = resolveValue(rawCardConfig[key]);
    });

    const children = cardConfig.children || [];
    const productData = cardConfig.productData;

    // Resolver estilos del componente (por si acaso)
    const rawStyles = comp.styles || {};
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    // ==================== MANEJO DE NAVEGACIÓN ====================
    const handleProductClick = (e) => {
        if (mode === 'frontend' && productData?.slug) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `/detalles-del-producto?product=${productData.slug}`;
            return;
        }

        if (mode === 'builder' && !isPreview && onEdit && e.target === e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
            onEdit(comp);
        }
    };

    // ==================== RENDERIZADO FRONTEND ====================
    if (mode === 'frontend') {
        const imageChild = children.find(child => child.type === 'productImage');
        const nameChild = children.find(child => child.type === 'productName');
        const priceChild = children.find(child => child.type === 'productPrice');

        // Resolver estilos de cada hijo
        const resolveChildStyles = (child) => {
            const result = {};
            if (child?.styles) {
                Object.keys(child.styles).forEach(key => {
                    result[key] = resolveValue(child.styles[key]);
                });
            }
            return result;
        };

        const imageStyles = resolveChildStyles(imageChild);
        const nameStyles = resolveChildStyles(nameChild);
        const priceStyles = resolveChildStyles(priceChild);

        // Helper para añadir unidad
        const withUnit = (value, unit = 'px') => {
            if (value === undefined || value === null || value === '') return undefined;
            if (typeof value === 'string' && isNaN(Number(value))) return value;
            return `${value}${unit}`;
        };

        // Estilos de la tarjeta
        const cardStyle = {
            paddingTop: withUnit(cardConfig.cardPaddingTop || '0px'),
            paddingRight: withUnit(cardConfig.cardPaddingRight || '0px'),
            paddingBottom: withUnit(cardConfig.cardPaddingBottom || '0px'),
            paddingLeft: withUnit(cardConfig.cardPaddingLeft || '0px'),
            border: cardConfig.cardBorder === 'solid'
                ? `${withUnit(cardConfig.cardBorderThickness || '1px')} solid rgba(0, 0, 0, ${cardConfig.cardBorderOpacity || 1})`
                : 'none',
            borderRadius: withUnit(cardConfig.cardBorderRadius || '0px'),
            backgroundColor: resolveValue(cardConfig.cardBackgroundColor || themeWithDefaults.background),
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: `0 2px 8px ${resolveValue(themeWithDefaults.shadows || 'rgba(0,0,0,0.1)')}`,
            textDecoration: 'none',
            color: 'inherit',
        };

        // Contenedor de imagen
        const imageContainerStyle = {
            aspectRatio: imageStyles.aspectRatio === 'portrait' ? '3/4' :
                imageStyles.aspectRatio === 'landscape' ? '4/3' : '1/1',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: withUnit(imageStyles.imageBorderRadius || '0px'),
            marginBottom: '12px',
            width: '100%',
        };

        // Estilos de la imagen
        const imageStyle = {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            border: imageStyles.imageBorder === 'solid'
                ? `${withUnit(imageStyles.imageBorderThickness || '1px')} solid rgba(0, 0, 0, ${imageStyles.imageBorderOpacity || 1})`
                : imageStyles.imageBorder === 'none' ? 'none' : undefined,
            borderRadius: withUnit(imageStyles.imageBorderRadius || '0px'),
            display: 'block',
            transition: 'transform 0.3s ease',
        };

        // Estilos del nombre
        const nameStyle = {
            fontSize: withUnit(nameStyles.fontSize || '16px', nameStyles.fontSizeUnit || (nameStyles.fontSize?.toString().includes('rem') ? 'rem' : 'px')),
            fontWeight: nameStyles.fontWeight || '600',
            color: resolveValue(nameStyles.color || themeWithDefaults.text),
            textAlign: nameStyles.alignment || 'left',
            marginBottom: '8px',
            lineHeight: nameStyles.lineHeight || '1.4',
            fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
            textTransform: nameStyles.textTransform || 'none',
            flexGrow: 1,
        };

        // Estilos del precio
        const priceStyle = {
            fontSize: withUnit(priceStyles.fontSize || '14px', priceStyles.fontSizeUnit || (priceStyles.fontSize?.toString().includes('rem') ? 'rem' : 'px')),
            fontWeight: priceStyles.fontWeight || 'normal',
            color: resolveValue(priceStyles.color || themeWithDefaults.text),
            textAlign: priceStyles.alignment || 'left',
            lineHeight: priceStyles.lineHeight || '1.4',
            fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
            marginTop: 'auto',
        };

        // Hover effects
        const handleMouseEnter = (e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 6px 16px ${resolveValue(themeWithDefaults.shadows || 'rgba(0,0,0,0.15)')}`;
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1.05)';
        };

        const handleMouseLeave = (e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 2px 8px ${resolveValue(themeWithDefaults.shadows || 'rgba(0,0,0,0.1)')}`;
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
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

                <h3 className="product-name" style={nameStyle}>
                    {productData?.product_name || 'Nombre del producto'}
                </h3>

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
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    const cardStyles = {
        paddingTop: withUnit(cardConfig.cardPaddingTop || '0px'),
        paddingRight: withUnit(cardConfig.cardPaddingRight || '0px'),
        paddingBottom: withUnit(cardConfig.cardPaddingBottom || '0px'),
        paddingLeft: withUnit(cardConfig.cardPaddingLeft || '0px'),
        border: cardConfig.cardBorder === 'solid'
            ? `${withUnit(cardConfig.cardBorderThickness || '1px')} solid rgba(0, 0, 0, ${cardConfig.cardBorderOpacity || '1'})`
            : 'none',
        borderRadius: withUnit(cardConfig.cardBorderRadius || '0px'),
        backgroundColor: resolveValue(cardConfig.cardBackgroundColor || themeWithDefaults.background),
        boxShadow: `0 2px 4px ${resolveValue(themeWithDefaults.shadows || 'rgba(0,0,0,0.1)')}`,
    };

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
                                    themeSettings={themeSettings}
                                    appliedTheme={appliedTheme}
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
                                    appliedTheme={appliedTheme}
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
                                    appliedTheme={appliedTheme}
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