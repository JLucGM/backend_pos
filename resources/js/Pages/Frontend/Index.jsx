import React from 'react';
import { Head } from '@inertiajs/react';

// IMPORTANTE: Importar ProductComponent unificado
import ProductComponent from '@/Components/BuilderPages/Product/ProductComponent';

// Importar otros componentes
import BannerComponent from '@/Components/BuilderPages/Banner/BannerComponent';
import BentoComponent from '@/Components/BuilderPages/BentoComponent/BentoComponent';
import ContainerComponent from '@/Components/BuilderPages/ContainerComponent';
import HeadingComponent from '@/Components/BuilderPages/HeadingComponent';
import TextComponent from '@/Components/BuilderPages/TextComponent';
import ImageComponent from '@/Components/BuilderPages/ImageComponent';
import VideoComponent from '@/Components/BuilderPages/VideoComponent';
import LinkComponent from '@/Components/BuilderPages/LinkComponent';
import ButtonComponent from '@/Components/BuilderPages/ButtonComponent'; // IMPORTANTE: Agregado
import DividerComponent from '@/Components/BuilderPages/DividerComponent/DividerComponent';
import HeaderComponent from '@/Components/BuilderPages/Header/HeaderComponent';
import FooterComponent from '@/Components/BuilderPages/Footer/FooterComponent';
import MarqueeTextComponent from '@/Components/BuilderPages/MarqueeComponent/MarqueeTextComponent';
import HeaderMenuComponent from '@/Components/BuilderPages/Header/HeaderMenuComponent';
import QuantitySelectorComponent from '@/Components/BuilderPages/ProductDetail/QuantitySelectorComponent';
import ProductDetailStockComponent from '@/Components/BuilderPages/ProductDetail/ProductDetailStockComponent';
import ProductDetailAttributesComponent from '@/Components/BuilderPages/ProductDetail/ProductDetailAttributesComponent';
import FrontendProductDetailComponent from '@/Components/Frontend/FrontendProductDetailComponent';
import CarouselComponent from '@/Components/BuilderPages/Carousel/CarouselComponent';

// Importar componentes de autenticación y checkout
import LoginComponent from '@/Components/BuilderPages/Auth/LoginComponent';
import RegisterComponent from '@/Components/BuilderPages/Auth/RegisterComponent';
import CheckoutComponent from '@/Components/BuilderPages/Checkout/CheckoutComponent';
import CheckoutSummaryComponent from '@/Components/BuilderPages/Checkout/CheckoutSummaryComponent';
import CheckoutPaymentComponent from '@/Components/BuilderPages/Checkout/CheckoutPaymentComponent';
import CustomerInfoComponent from '@/Components/BuilderPages/Checkout/CustomerInfoComponent';
import CartComponent from '@/Components/BuilderPages/Cart/CartComponent';
import ProfileComponent from '@/Components/BuilderPages/Profile/ProfileComponent';
import OrdersComponent from '@/Components/BuilderPages/Orders/OrdersComponent';
import SuccessComponent from '@/Components/BuilderPages/Success/SuccessComponent';
import AnnouncementBarComponent from '@/Components/BuilderPages/AnnouncementBar/AnnouncementBarComponent';
import ProductListComponent from '@/Components/BuilderPages/Product/ProductListComponent';

// ==============================================================
// MAPEO DE TIPOS A COMPONENTES
// ==============================================================
const componentMap = {
    'banner': BannerComponent,
    'bento': BentoComponent,
    'container': ContainerComponent,
    'heading': HeadingComponent,
    'text': TextComponent,
    'image': ImageComponent,
    'video': VideoComponent,
    'link': LinkComponent,
    'divider': DividerComponent,
    'header': HeaderComponent,
    'headerMenu': HeaderMenuComponent,
    'footer': FooterComponent,
    'marquee': MarqueeTextComponent,
    'product': ProductComponent, // ← Usando ProductComponent unificado
    'productList': ProductListComponent, // ← Usando ProductComponent unificado
    'carousel': CarouselComponent, // ← Agregado CarouselComponent
    'productDetail': FrontendProductDetailComponent,
    'productDetailAttributes': ProductDetailAttributesComponent,
    'productDetailStock': ProductDetailStockComponent,
    'quantitySelector': QuantitySelectorComponent,
    'cart': CartComponent,
    'login': LoginComponent,
    'register': RegisterComponent,
    'checkout': CheckoutComponent,
    'checkoutSummary': CheckoutSummaryComponent,
    'checkoutPayment': CheckoutPaymentComponent,
    'customerInfo': CustomerInfoComponent,
    'button': ButtonComponent, // IMPORTANTE: Agregado
    'profile': ProfileComponent, // ← Agregado ProfileComponent
    'orders': OrdersComponent, // ← Agregado OrdersComponent
    'success': SuccessComponent, // ← Agregado SuccessComponent
    'announcementBar': AnnouncementBarComponent,
};

// ==============================================================
// FUNCIÓN DE RENDERIZADO PÚBLICO - CORREGIDA
// ==============================================================
function renderBlock(
    block,
    themeSettings,
    availableMenus,
    products,
    currentProduct = null,
    companyId,
    paymentMethods = [],
    shippingRates = [],
    userDeliveryLocations = [],
    userGiftCards = [],
    userOrders = [],
    mode = 'frontend',
    companyLogo,
    companyFavicon,
    currentUser = null,
    countries = [],
    states = [],
    cities = []
) {
    const Component = componentMap[block.type];

    if (!Component) {
        console.warn(`Componente de layout no reconocido: ${block.type}`);
        return (
            <div key={block.id} className="text-center text-red-500 p-4">
                Error: Componente de layout "{block.type}" no reconocido.
            </div>
        );
    }

    // Props base para todos los componentes - SIMPLIFICADO
    const baseProps = {
        comp: block,
        themeSettings: themeSettings,
        isPreview: mode === 'frontend', // En frontend es preview
        getStyles: (c) => c.styles || {},
        onEdit: () => { },
        onDelete: () => { },
        setComponents: () => { },
        hoveredComponentId: null,
        setHoveredComponentId: () => { },
        mode: mode,
        companyLogo: companyLogo,
        companyFavicon: companyFavicon,
    };

    // Props específicas por tipo de componente - CORREGIDO
    switch (block.type) {
        case 'product':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    products={products}
                    companyId={companyId}
                />
            );
        case 'productList':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    products={products}
                    companyId={companyId}
                />
            );

        case 'carousel':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    products={products}
                    companyId={companyId}
                />
            );

        case 'productDetail':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    product={currentProduct}
                    companyId={companyId}
                />
            );

        case 'header':
            return (
                <HeaderComponent
                    key={block.id}
                    {...baseProps}
                    appliedTheme={themeSettings}
                    availableMenus={availableMenus}
                />
            );

        case 'footer':
            return (
                <FooterComponent
                    key={block.id}
                    {...baseProps}
                    appliedTheme={themeSettings}
                    availableMenus={availableMenus}
                />
            );

        case 'cart':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    companyId={companyId}
                    products={products}
                />
            );

        case 'orders':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    currentUser={currentUser}
                    userOrders={userOrders}
                    companyId={companyId}
                    currency={{
                        symbol: '$',
                        code: 'USD'
                    }}
                />
            );

        case 'checkout':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    companyId={companyId}
                    products={products}
                    paymentMethods={paymentMethods}
                    shippingRates={shippingRates}
                    userDeliveryLocations={userDeliveryLocations}
                    userGiftCards={userGiftCards}
                />
            );

        case 'button':
            return <ButtonComponent key={block.id} {...baseProps} />;

        case 'success':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    order={currentProduct} // En el contexto de success, currentProduct será la orden
                    companyId={companyId}
                />
            );

        case 'profile':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    currentUser={currentUser}
                    userDeliveryLocations={userDeliveryLocations}
                    userGiftCards={userGiftCards}
                    countries={countries}
                    states={states}
                    cities={cities}
                />
            );

        default:
            return <Component key={block.id} {...baseProps} />;
    }
}

// ==============================================================
// LÓGICA DE CARGA DE FUENTES Y VISTA PRINCIPAL
// ==============================================================
export default function Index({
    page,
    themeSettings,
    availableMenus = [],
    products = [],
    currentProduct = null,
    isProductDetailPage = false,
    companyId,
    paymentMethods = [],
    shippingRates = [],
    userDeliveryLocations = [],
    userGiftCards = [],
    userOrders = [],
    companyLogo,
    companyFavicon,
    currentUser = null,
    countries = [],
    states = [],
    cities = [],
}) {
    // --- Lógica de Decodificación del Layout ---
    let layoutBlocks = [];
    if (typeof page.layout === 'string' && page.layout.trim() !== '') {
        try {
            layoutBlocks = JSON.parse(page.layout);
        } catch (e) {
            console.error("Error al decodificar el layout JSON.", e);
        }
    } else if (Array.isArray(page.layout)) {
        layoutBlocks = page.layout;
    }
    layoutBlocks = Array.isArray(layoutBlocks) ? layoutBlocks : [];

    // --- LÓGICA CLAVE: CARGA DINÁMICA DE FUENTES ---
    const getGoogleFontUrl = (settings) => {
        const themeSettings = settings || {};

        const rawFonts = [
            themeSettings.heading_font,
            themeSettings.body_font,
            themeSettings.subheading_font,
            themeSettings.accent_font,
        ]
            .filter(font => font && typeof font === 'string' && font.trim() !== '');

        const uniqueFontNames = new Set();

        rawFonts.forEach(fullFontString => {
            const cleaned = fullFontString.replace(/['"]/g, '');
            const name = cleaned.split(',')[0].trim();

            if (name) {
                const systemFonts = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'sans-serif', 'serif', 'monospace'];
                if (!systemFonts.includes(name)) {
                    uniqueFontNames.add(name);
                }
            }
        });

        const fontsToLoad = [...uniqueFontNames];

        if (fontsToLoad.length === 0) {
            return null;
        }

        const families = fontsToLoad.map(fontName =>
            `family=${encodeURIComponent(fontName)}:wght@300;400;600;700`
        ).join('&');

        return `https://fonts.googleapis.com/css2?${families}&display=swap`;
    };

    const fontUrl = getGoogleFontUrl(themeSettings);

    return (
        <>
            <Head>
                <title>{page.title}</title>
                {companyFavicon && (
                    <link rel="icon" href={companyFavicon} type="image/x-icon" />
                )}
                {fontUrl && (
                    <link rel="stylesheet" href={fontUrl} />
                )}
            </Head>

                {/* Renderizar cada bloque del layout */}
                {layoutBlocks.map(block =>
                    renderBlock(
                        block,
                        themeSettings,
                        availableMenus,
                        products,
                        currentProduct,
                        companyId,
                        paymentMethods,
                        shippingRates,
                        userDeliveryLocations,
                        userGiftCards,
                        userOrders,
                        'frontend', // Modo frontend siempre
                        companyLogo,
                        companyFavicon,
                        currentUser,
                        countries,
                        states,
                        cities
                    )
                )}

                {isProductDetailPage && !currentProduct && (
                    <div className="text-center py-12 bg-gray-50">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            Producto no encontrado
                        </h2>
                        <p className="text-gray-600 mb-6">
                            El producto que buscas no está disponible o no existe.
                        </p>
                        <a
                            href="/"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Volver al inicio
                        </a>
                    </div>
                )}
        </>
    );
}