// components/BuilderPages/CanvasItem.jsx
import React, { useCallback } from 'react';
import HeadingComponent from './HeadingComponent';
import ButtonComponent from './ButtonComponent';
import ImageComponent from './ImageComponent';
import VideoComponent from './VideoComponent';
import LinkComponent from './LinkComponent';
import CarouselComponent from './Carousel/CarouselComponent';
import ContainerComponent from './ContainerComponent';
import BannerComponent from './Banner/BannerComponent';
import BannerTitleComponent from './Banner/BannerTitleComponent';
import BannerTextComponent from './Banner/BannerTextComponent';
import ProductTitleComponent from './Product/ProductTitleComponent';
import ProductCardComponent from './Product/ProductCardComponent';
import ProductImageComponent from './Product/ProductImageComponent';
import ProductNameComponent from './Product/ProductNameComponent';
import ProductPriceComponent from './Product/ProductPriceComponent';
import CarouselNameComponent from './Carousel/CarouselNameComponent';
import CarouselImageComponent from './Carousel/CarouselImageComponent';
import CarouselCardComponent from './Carousel/CarouselCardComponent';
import CarouselTitleComponent from './Carousel/CarouselTitleComponent';
import BentoTitleComponent from './BentoComponent/BentoTitleComponent';
import BentoFeatureComponent from './BentoComponent/BentoFeatureComponent';
import BentoFeatureTitleComponent from './BentoComponent/BentoFeatureTitleComponent';
import BentoFeatureTextComponent from './BentoComponent/BentoFeatureTextComponent';
import PageContentComponent from './PageContentComponent';
import TextComponent from './TextComponent';
import BentoComponent from './BentoComponent/BentoComponent';
import DividerComponent from './DividerComponent/DividerComponent';
import CarouselPriceComponent from './Carousel/CarouselPriceComponent';
import HeaderMenuComponent from './Header/HeaderMenuComponent';
import HeaderComponent from './Header/HeaderComponent';
import FooterComponent from './Footer/FooterComponent';
import HeaderLogoComponent from './Header/HeaderLogoComponent';
import FooterMenuComponent from './Footer/FooterMenuComponent';
import MarqueeTextComponent from './MarqueeComponent/MarqueeTextComponent';
import ProductDetailComponent from './ProductDetail/ProductDetailComponent';
import ProductDetailAttributesComponent from './ProductDetail/ProductDetailAttributesComponent';
import ProductDetailStockComponent from './ProductDetail/ProductDetailStockComponent';
import QuantitySelectorComponent from './ProductDetail/QuantitySelectorComponent';
import CartComponent from './Cart/CartComponent';
import CartItemsComponent from './Cart/CartItemsComponent';
import CartSummaryComponent from './Cart/CartSummaryComponent';
import CheckoutComponent from './Checkout/CheckoutComponent';
import LoginComponent from './Auth/LoginComponent';
import RegisterComponent from './Auth/RegisterComponent';
import CheckoutPaymentComponent from './Checkout/CheckoutPaymentComponent';
import CheckoutSummaryComponent from './Checkout/CheckoutSummaryComponent';
import CustomerInfoComponent from './Checkout/CustomerInfoComponent';
import CheckoutDiscountGiftCardComponent from './Checkout/CheckoutDiscountGiftCardComponent';
import ProductComponent from './Product/ProductComponent';
import ProfileComponent from './Profile/ProfileComponent';
import OrdersComponent from './Orders/OrdersComponent';

const CanvasItem = ({
    comp,
    onEditComponent,
    onDeleteComponent,
    themeSettings,
    appliedTheme,
    isPreview,
    products,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId,
    pageContent,
    availableMenus,
    companyLogo,
    countries = [],
    states = [],
    cities = []
}) => {
    const getStyles = (comp) => {
        const styles = comp.styles || {};

        // Estilos base del tema aplicado
        const themeStyles = {
            color: themeSettings?.foreground ? `hsl(${themeSettings.foreground})` : '#000000',
            backgroundColor: themeSettings?.background ? `hsl(${themeSettings.background})` : 'transparent',
            fontFamily: themeSettings?.fontFamily || 'inherit',
            borderRadius: themeSettings?.borderRadius || '0',
            // Agregar más propiedades del tema si existen
            ...(themeSettings?.primary && {
                '--primary-color': `hsl(${themeSettings.primary})`
            }),
        };

        // Combinar estilos del tema con estilos específicos del componente
        // Los estilos del componente tienen prioridad sobre los del tema
        return {
            ...themeStyles,
            ...styles, // Los estilos del componente sobrescriben los del tema
        };
    };

    const isHovered = hoveredComponentId === comp.id;

    // Funciones seguras para eventos de mouse
    // const handleMouseEnter = () => {
    //     if (setHoveredComponentId && !isPreview) {
    //         setHoveredComponentId(comp.id);
    //     }
    // };
    const handleMouseEnter = useCallback(() => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(comp.id);
        }
    }, [setHoveredComponentId, isPreview, comp.id]);

    // const handleMouseLeave = () => {
    //     if (setHoveredComponentId && !isPreview) {
    //         setHoveredComponentId(null);
    //     }
    // };
    const handleMouseLeave = useCallback(() => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(null);
        }
    }, [setHoveredComponentId, isPreview]);

    const renderComponent = () => {
        // Propiedades comunes para todos los componentes

        const commonProps = {
            comp,
            getStyles,
            isPreview,
            themeSettings: themeSettings,
            appliedTheme,
            companyLogo,
        };

        switch (comp.type) {
            case 'text':
                return <TextComponent {...commonProps} />;
            case 'heading':
                return <HeadingComponent {...commonProps} />;
            case 'button':
                return <ButtonComponent {...commonProps} onEdit={onEditComponent} />;
            case 'image':
                return <ImageComponent {...commonProps} />;
            case 'video':
                return <VideoComponent {...commonProps} />;
            case 'header':
                return (
                    <HeaderComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        availableMenus={availableMenus}
                        companyLogo={companyLogo}
                    />
                );

            case 'footer':
                return (
                    <FooterComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        availableMenus={availableMenus}
                    />
                );
            case 'headerLogo':
                return (
                    <HeaderLogoComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        companyLogo={companyLogo}
                    />
                );
            case 'headerMenu':
                return (
                    <HeaderMenuComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        availableMenus={availableMenus || []}
                        mode={isPreview ? 'frontend' : 'builder'}
                    />
                );
            case 'footerMenu':
                return (
                    <FooterMenuComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        availableMenus={availableMenus || []}
                        mode={isPreview ? 'frontend' : 'builder'}
                    />
                );
            case 'link':
                return (
                    <LinkComponent
                        {...commonProps}
                        themeSettings={themeSettings}
                        onEdit={onEditComponent}
                    />
                );
            case 'product':
                return (
                    <ProductComponent
                        {...commonProps}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'carousel':
                return (
                    <CarouselComponent
                        {...commonProps}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'carouselTitle':
                return (
                    <CarouselTitleComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'carouselCard':
                return (
                    <CarouselCardComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'carouselImage':
                return (
                    <CarouselImageComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'carouselName':
                return (
                    <CarouselNameComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'carouselPrice':
                return (
                    <CarouselPriceComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'container':
                return (
                    <ContainerComponent
                        {...commonProps}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'banner':
                return (
                    <BannerComponent
                        {...commonProps}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'bannerTitle':
                return (
                    <BannerTitleComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    // themeSettings={themeSettings}
                    />
                );
            case 'bannerText':
                return (
                    <BannerTextComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    // themeSettings={themeSettings}
                    />
                );
            case 'productTitle':
                return (
                    <ProductTitleComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'productCard':
                return (
                    <ProductCardComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'productImage':
                return (
                    <ProductImageComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'productName':
                return (
                    <ProductNameComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'productPrice':
                return (
                    <ProductPriceComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'bento':
                return (
                    <BentoComponent
                        {...commonProps}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'bentoTitle':
                return (
                    <BentoTitleComponent
                        {...commonProps}
                        themeSettings={themeSettings}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'bentoFeature':
                return (
                    <BentoFeatureComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'bentoFeatureTitle':
                return (
                    <BentoFeatureTitleComponent
                        {...commonProps}
                        themeSettings={themeSettings}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'bentoFeatureText':
                return (
                    <BentoFeatureTextComponent
                        {...commonProps}
                        themeSettings={themeSettings}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'marquee':
                return (
                    <MarqueeTextComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'divider':
                return (
                    <DividerComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'productDetail':
                return (
                    <ProductDetailComponent
                        key={comp.id}
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
            case 'productDetailAttributes':
                return (
                    <ProductDetailAttributesComponent
                        key={comp.id}
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
                        product={null} // En builder, no hay producto específico
                    />
                );
            case 'productDetailStock':
                return (
                    <ProductDetailStockComponent
                        key={comp.id}
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
                        product={null}
                        currentCombination={null}
                    />
                );
            case 'quantitySelector':
                return (
                    <QuantitySelectorComponent
                        key={comp.id}
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
            case 'cart':
                return (
                    <CartComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        products={products}
                    />
                );
            case 'cartItems':
                return (
                    <CartItemsComponent
                        key={comp.id}
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        // En producción, estos vendrían del estado global del carrito
                        cartItems={[]}
                        onUpdateQuantity={() => { }}
                        onRemoveItem={() => { }}
                    />
                );
            case 'cartSummary':
                return (
                    <CartSummaryComponent
                        key={comp.id}
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        cartItems={[]}
                        cartTotal={0}
                    />
                );
            case 'checkout':
                return (
                    <CheckoutComponent
                        key={comp.id}
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        mode={isPreview ? 'frontend' : 'builder'}
                    />
                );

            case 'customerInfo':
                return (
                    <CustomerInfoComponent
                        key={comp.id}
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme}
                        isPreview={isPreview}
                        mode={isPreview ? 'frontend' : 'builder'}
                        // Estos son los datos de ejemplo que se mostrarán en builder
                        currentUser={isPreview ? null : {
                            id: 1,
                            name: 'Juan Pérez (Ejemplo)',
                            email: 'cliente@ejemplo.com',
                            phone: '+52 55 1234 5678'
                        }}
                        userDeliveryLocations={isPreview ? [] : [
                            {
                                id: 1,
                                address_line_1: 'Calle Ejemplo 123',
                                address_line_2: 'Colonia Centro',
                                city: 'Ciudad de México',
                                state: 'CDMX',
                                country: 'México',
                                postal_code: '12345',
                                phone_number: '+52 55 1234 5678',
                                is_default: true
                            }
                        ]}
                        selectedAddressId={1}
                        selectedShippingRate={null}
                        deliveryType={'delivery'}
                        onAddressSelect={() => { }}
                        onDeliveryTypeChange={() => { }}
                        onShippingRateChange={() => { }}
                        shippingRates={isPreview ? [] : [
                            {
                                id: 1,
                                name: 'Envío Estándar',
                                price: 50.00,
                                description: 'Entrega en 3-5 días hábiles',
                                estimated_days: '3-5'
                            }
                        ]}
                        paymentMethods={isPreview ? [] : [
                            {
                                id: 'card',
                                name: 'Tarjeta de Crédito/Débito',
                                description: 'Paga con tu tarjeta'
                            }
                        ]}
                        showAuthModal={() => { }}
                    />
                );
            case 'checkoutSummary':
                return (
                    <CheckoutSummaryComponent
                        key={comp.id}
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme}
                        isPreview={isPreview}
                        cartItems={[]}
                        cartTotal={0}
                        shipping={0}
                        tax={0}
                        discounts={0}
                        giftCardAmount={0}
                        orderTotal={0}
                        selectedShippingRate={null}
                        appliedDiscount={null}
                        appliedGiftCard={null}
                        deliveryType={'delivery'}
                        selectedAddress={null}
                        mode={isPreview ? 'frontend' : 'builder'}
                    />
                );
            case 'checkoutDiscountGiftCard':
                return (
                    <CheckoutDiscountGiftCardComponent
                        {...commonProps}
                        discountCode={''}
                        setDiscountCode={() => { }}
                        giftCardCode={''}
                        setGiftCardCode={() => { }}
                        onApplyDiscount={() => { }}
                        onApplyGiftCard={() => { }}
                        appliedDiscount={isPreview ? null : {
                            id: 1,
                            name: 'DESCUENTO10',
                            code: 'DESCUENTO10',
                            discount_type: 'percentage',
                            value: 10
                        }}
                        appliedGiftCard={isPreview ? null : {
                            id: 1,
                            code: 'GIFT-123456',
                            current_balance: 50.00,
                            amount_used: 25.00
                        }}
                        userGiftCards={[]}
                        mode={isPreview ? 'frontend' : 'builder'}
                    />
                );
            case 'checkoutPayment':
                return (
                    <CheckoutPaymentComponent
                        key={comp.id}
                        comp={comp}
                        getStyles={getStyles}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme}
                        isPreview={isPreview}
                        selectedPaymentMethod={''}
                        setSelectedPaymentMethod={() => { }}
                        acceptTerms={false}
                        setAcceptTerms={() => { }}
                        onSubmitOrder={() => { }}
                        paymentMethods={[]}
                        mode={isPreview ? 'frontend' : 'builder'}
                    />
                );
            case 'login':
                return (
                    <LoginComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        mode={isPreview ? 'frontend' : 'builder'}
                    />
                );

            case 'register':
                return (
                    <RegisterComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        mode={isPreview ? 'frontend' : 'builder'}
                    />
                );
            case 'orders':
                return (
                    <OrdersComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        mode={isPreview ? 'frontend' : 'builder'}
                        // En el builder, mostrar datos de ejemplo
                        currentUser={isPreview ? null : {
                            id: 1,
                            name: 'Usuario Ejemplo',
                            email: 'usuario@ejemplo.com'
                        }}
                        userOrders={isPreview ? [] : [
                            {
                                id: 1,
                                status: 'completed',
                                total: 150.00,
                                subtotal: 140.00,
                                created_at: '2024-01-15T10:30:00Z',
                                items: [
                                    {
                                        id: 1,
                                        name_product: 'Producto Ejemplo 1',
                                        quantity: 2,
                                        price_product: 50.00,
                                        subtotal: 100.00
                                    },
                                    {
                                        id: 2,
                                        name_product: 'Producto Ejemplo 2',
                                        quantity: 1,
                                        price_product: 40.00,
                                        subtotal: 40.00
                                    }
                                ],
                                paymentMethod: { name: 'Tarjeta de Crédito' },
                                shippingRate: { name: 'Envío Estándar', price: 10.00 }
                            },
                            {
                                id: 2,
                                status: 'pending',
                                total: 75.50,
                                subtotal: 75.50,
                                created_at: '2024-01-10T14:20:00Z',
                                items: [
                                    {
                                        id: 3,
                                        name_product: 'Producto Ejemplo 3',
                                        quantity: 1,
                                        price_product: 75.50,
                                        subtotal: 75.50
                                    }
                                ],
                                paymentMethod: { name: 'Efectivo' },
                                shippingRate: null
                            }
                        ]}
                        currency={{
                            symbol: '$',
                            code: 'USD'
                        }}
                    />
                );
            case 'profile':
                return (
                    <ProfileComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        mode={isPreview ? 'frontend' : 'builder'}
                        // En el builder, mostrar datos de ejemplo
                        currentUser={isPreview ? null : {
                            id: 1,
                            name: 'Usuario Ejemplo',
                            email: 'usuario@ejemplo.com',
                            phone: '+1 234 567 8900'
                        }}
                        userDeliveryLocations={isPreview ? [] : [
                            {
                                id: 1,
                                address_line_1: 'Calle Principal 123',
                                address_line_2: 'Apartamento 4B',
                                postal_code: '12345',
                                phone_number: '+1 234 567 8900',
                                notes: 'Notas de ejemplo',
                                is_default: true,
                                country: 'México',
                                state: 'Ciudad de México',
                                city: 'CDMX',
                                full_address: 'Calle Principal 123, Apartamento 4B, CDMX, Ciudad de México, México, 12345'
                            },
                            {
                                id: 2,
                                address_line_1: 'Avenida Secundaria 456',
                                address_line_2: '',
                                postal_code: '67890',
                                phone_number: '+1 234 567 8901',
                                notes: '',
                                is_default: false,
                                country: 'México',
                                state: 'Jalisco',
                                city: 'Guadalajara',
                                full_address: 'Avenida Secundaria 456, Guadalajara, Jalisco, México, 67890'
                            }
                        ]}
                        userGiftCards={isPreview ? [] : [
                            {
                                id: 1,
                                code: 'GIFT-123456',
                                initial_balance: 100.00,
                                current_balance: 75.00,
                                expiration_date: '2024-12-31'
                            },
                            {
                                id: 2,
                                code: 'GIFT-789012',
                                initial_balance: 50.00,
                                current_balance: 50.00,
                                expiration_date: '2024-06-30'
                            }
                        ]}
                        countries={countries}
                        states={states}
                        cities={cities}
                    />
                );
            case 'pageContent':
                return (
                    <PageContentComponent
                        {...commonProps}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        pageContent={pageContent}
                    />
                );
            default:
                return (
                    <div
                        className="p-4 border border-red-300 bg-red-50 rounded"
                        style={getStyles(comp)}
                    >
                        <div className="font-bold text-red-600">
                            Componente no reconocido: {comp.type}
                        </div>
                        <div className="text-sm text-gray-600">
                            ID: {comp.id}
                        </div>
                    </div>
                );
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
            'productPrice': 'Precio de Producto',
            'marquee': 'Texto en Movimiento',
            'divider': 'Divider',
            'pageContent': 'Contenido de Página',
            'bento': 'Bento',
            'bentoTitle': 'Título Bento',
            'bentoFeature': 'Característica Bento',
            'bentoFeatureTitle': 'Título Característica',
            'bentoFeatureText': 'Texto Característica',
            'carouselTitle': 'Título del Carrusel',
            'carouselCard': 'Carta del Carrusel',
            'carouselImage': 'Imagen del Carrusel',
            'carouselName': 'Nombre del Carrusel',
            'carouselPrice': 'Precio del Carrusel',
            'header': 'Header',
            'headerLogo': 'Logo',
            'headerMenu': 'Menú',
            'cart': 'Carrito de Compras',
            'cartItems': 'Lista de Productos',
            'cartSummary': 'Resumen del Pedido',
            'profile': 'Perfil de Usuario',
            'orders': 'Mis Pedidos',
        };
        return typeNames[type] || type;
    };

    return (
        <div
            id={`component-${comp.id}`}
            className={`relative group transition-all duration-200 ${isHovered && !isPreview
                ? 'border border-blue-400 bg-blue-50/30'
                : 'border border-transparent'
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Solo mostrar el tooltip en modo edición */}
            {!isPreview && (
                <div
                    className={`rounded-t-lg text-white text-xs px-3 py-1.5 transition-all duration-300 absolute -top-7 left-0 z-50 flex items-center gap-2 shadow-md ${isHovered ? 'bg-blue-400 opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                        }`}
                >
                    <span className="font-medium">{getComponentTypeName(comp.type)}</span>
                </div>
            )}

            <div className="relative z-10">
                {renderComponent()}
            </div>
        </div>
    );
};

export default CanvasItem;