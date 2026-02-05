import React from 'react';
import CarouselImageComponent from './CarouselImageComponent';
import CarouselNameComponent from './CarouselNameComponent';
import CarouselPriceComponent from './CarouselPriceComponent';
import ComponentWithHover from '../ComponentWithHover';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getButtonStyles, getResolvedFont } from '@/utils/themeUtils';

const CarouselCardComponent = ({
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
    const { settings } = usePage().props;
    // Asegurarnos de que comp.content existe
    const cardConfig = comp.content || {};
    const children = cardConfig.children || [];
    const productData = cardConfig.productData;
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

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
        const imageChild = children.find(child => child.type === 'carouselImage');
        const nameChild = children.find(child => child.type === 'carouselName');
        const priceChild = children.find(child => child.type === 'carouselPrice');

        // Estilos para cada parte con valores del tema
        const imageStyles = imageChild?.styles || {};
        const nameStyles = nameChild?.styles || {};
        const priceStyles = priceChild?.styles || {};

        // Configuración de la tarjeta para frontend con valores del tema
        const cardStyle = {
            paddingTop: cardConfig.cardPaddingTop || '10px',
            paddingRight: cardConfig.cardPaddingRight || '10px',
            paddingBottom: cardConfig.cardPaddingBottom || '10px',
            paddingLeft: cardConfig.cardPaddingLeft || '10px',
            border: cardConfig.cardBorder === 'solid'
                ? `${cardConfig.cardBorderThickness || '1px'} solid rgba(0, 0, 0, ${cardConfig.cardBorderOpacity || 1})`
                : 'none',
            borderRadius: cardConfig.cardBorderRadius || '0px',
            backgroundColor: cardConfig.cardBackgroundColor || themeWithDefaults.background,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: `0 2px 8px ${themeWithDefaults.shadows ? themeWithDefaults.shadows : 'rgba(0,0,0,0.1)'}`,
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
            fontSize: nameStyles.fontSize || '14px',
            fontWeight: nameStyles.fontWeight || '600',
            color: nameStyles.color || themeWithDefaults.text,
            textAlign: nameStyles.alignment || 'left',
            marginBottom: '8px',
            lineHeight: nameStyles.lineHeight || '1.4',
            fontFamily: nameStyles.fontFamily || getResolvedFont(themeWithDefaults, 'body_font'),
            textTransform: nameStyles.textTransform || 'none',
            flexGrow: 1,
        };

        // Estilos del precio con valores del tema
        const priceStyle = {
            fontSize: priceStyles.fontSize || '12px',
            fontWeight: priceStyles.fontWeight || 'normal',
            color: priceStyles.color || themeWithDefaults.text,
            textAlign: priceStyles.alignment || 'left',
            lineHeight: priceStyles.lineHeight || '1.4',
            fontFamily: priceStyles.fontFamily || getResolvedFont(themeWithDefaults, 'body_font'),
            marginTop: 'auto',
        };

        // Efecto hover para frontend
        const handleMouseEnter = (e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1.05)';
        };

        const handleMouseLeave = (e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 2px 8px ${themeWithDefaults.shadows ? themeWithDefaults.shadows : 'rgba(0,0,0,0.1)'}`;
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
        };

        return (
            <div
                className="carousel-card"
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
                <div className="carousel-image-container" style={imageContainerStyle}>
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
                <h4 className="carousel-name" style={nameStyle}>
                    {productData?.product_name || 'Nombre del producto'}
                </h4>

                {/* Precio del producto */}
                <div className="carousel-price" style={priceStyle}>
                    {productData?.product_price_discount && settings?.currency ? (
                        <>
                            <span style={{ textDecoration: 'line-through', marginRight: '6px', opacity: 0.6, fontSize: '0.9em' }}>
                                <CurrencyDisplay currency={settings.currency} amount={parseFloat(productData.product_price || 0)} />
                            </span>
                            <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
                                <CurrencyDisplay currency={settings.currency} amount={parseFloat(productData.product_price_discount)} />
                            </span>
                        </>
                    ) : settings?.currency ? (
                        <span><CurrencyDisplay currency={settings.currency} amount={parseFloat(productData?.product_price || 0)} /></span>
                    ) : (
                        <>
                            {productData?.product_price_discount ? (
                                <>
                                    <span style={{ textDecoration: 'line-through', marginRight: '6px', opacity: 0.6, fontSize: '0.9em' }}>
                                        ${parseFloat(productData.product_price || 0).toFixed(2)}
                                    </span>
                                    <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
                                        ${parseFloat(productData.product_price_discount).toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span>${parseFloat(productData?.product_price || 0).toFixed(2)}</span>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ==================== RENDERIZADO BUILDER ====================
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

    // Estilos de la carta para builder con valores del tema
    const cardStyles = {
        ...getStyles(comp),
        paddingTop: cardConfig.cardPaddingTop || '10px',
        paddingRight: cardConfig.cardPaddingRight || '10px',
        paddingBottom: cardConfig.cardPaddingBottom || '10px',
        paddingLeft: cardConfig.cardPaddingLeft || '10px',
        border: cardConfig.cardBorder === 'solid'
            ? `${cardConfig.cardBorderThickness || '1px'} solid rgba(0, 0, 0, ${cardConfig.cardBorderOpacity || '1'})`
            : 'none',
        borderRadius: cardConfig.cardBorderRadius || '0px',
        backgroundColor: cardConfig.cardBackgroundColor || themeWithDefaults.background,
        boxShadow: `0 2px 4px ${themeWithDefaults.shadows ? themeWithDefaults.shadows : 'rgba(0,0,0,0.1)'}`,
        height: '100%',
        cursor: !isPreview ? 'pointer' : 'default',
    };

    // Encontrar los componentes hijos
    const imageComponent = children.find(child => child.type === 'carouselImage');
    const nameComponent = children.find(child => child.type === 'carouselName');
    const priceComponent = children.find(child => child.type === 'carouselPrice');

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
            className="carousel-card flex flex-col h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {/* Imagen con ComponentWithHover */}
            {imageComponent && productData && (
                <ComponentWithHover
                    component={imageComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <CarouselImageComponent
                        comp={{
                            ...imageComponent,
                            content: productData.media && productData.media.length > 0
                                ? productData.media[0].original_url
                                : imageComponent.content
                        }}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                </ComponentWithHover>
            )}

            {/* Mostrar placeholder si no hay imagen */}
            {(!imageComponent || !productData) && !isPreview && (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Imagen del producto</span>
                </div>
            )}

            {/* Nombre con ComponentWithHover */}
            {nameComponent && productData && (
                <ComponentWithHover
                    component={nameComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <CarouselNameComponent
                        comp={{
                            ...nameComponent,
                            content: productData.product_name || nameComponent.content
                        }}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme}
                    />
                </ComponentWithHover>
            )}

            {/* Precio con ComponentWithHover */}
            {priceComponent && productData && (
                <ComponentWithHover
                    component={priceComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <CarouselPriceComponent
                        comp={{
                            ...priceComponent,
                            content: productData.product_price
                                ? parseFloat(productData.product_price)
                                : priceComponent.content
                        }}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme}
                    />
                </ComponentWithHover>
            )}

            {/* Mostrar placeholders si no hay componentes de nombre o precio */}
            {(!nameComponent || !productData) && !isPreview && (
                <div className="mt-2 text-gray-500 text-sm">Nombre del producto</div>
            )}
            {(!priceComponent || !productData) && !isPreview && (
                <div className="text-gray-500 text-sm">Precio del producto</div>
            )}
        </div>
    );
};

export default CarouselCardComponent;
