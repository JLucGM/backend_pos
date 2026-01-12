import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

// IMPORTANTE: Importar CartComponent en lugar de FrontendCartComponent
import CartComponent from '@/Components/BuilderPages/Cart/CartComponent';

// Importar otros componentes
import BannerComponent from '@/Components/BuilderPages/BannerComponent';
import BentoComponent from '@/Components/BuilderPages/BentoComponent/BentoComponent';
import ContainerComponent from '@/Components/BuilderPages/ContainerComponent';
import HeadingComponent from '@/Components/BuilderPages/HeadingComponent';
import TextComponent from '@/Components/BuilderPages/TextComponent';
import ImageComponent from '@/Components/BuilderPages/ImageComponent';
import VideoComponent from '@/Components/BuilderPages/VideoComponent';
import LinkComponent from '@/Components/BuilderPages/LinkComponent';
import DividerComponent from '@/Components/BuilderPages/DividerComponent/DividerComponent';
import HeaderComponent from '@/Components/BuilderPages/HeaderComponent';
import FooterComponent from '@/Components/BuilderPages/FooterComponent';
import MarqueeTextComponent from '@/Components/BuilderPages/MarqueeComponent/MarqueeTextComponent';
import HeaderMenuComponent from '@/Components/BuilderPages/HeaderMenuComponent';
import FrontendProductComponent from '@/Components/Frontend/ProductComponent';
import QuantitySelectorComponent from '@/Components/BuilderPages/QuantitySelectorComponent';
import ProductDetailStockComponent from '@/Components/BuilderPages/ProductDetailStockComponent';
import ProductDetailAttributesComponent from '@/Components/BuilderPages/ProductDetailAttributesComponent';
import FrontendProductDetailComponent from '@/Components/Frontend/FrontendProductDetailComponent';

// Importar los nuevos componentes de autenticación y checkout
import LoginComponent from '@/Components/BuilderPages/Auth/LoginComponent';
import RegisterComponent from '@/Components/BuilderPages/Auth/RegisterComponent';
import CheckoutComponent from '@/Components/BuilderPages/Checkout/CheckoutComponent';
// import CheckoutFormComponent from '@/Components/BuilderPages/Checkout/CheckoutFormComponent';
import CheckoutSummaryComponent from '@/Components/BuilderPages/Checkout/CheckoutSummaryComponent';
import CheckoutPaymentComponent from '@/Components/BuilderPages/Checkout/CheckoutPaymentComponent';
import CustomerInfoComponent from '@/Components/BuilderPages/Checkout/CustomerInfoComponent';

// ==============================================================
// 2. MAPEO DE TIPOS A COMPONENTES
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
    'product': FrontendProductComponent,
    'productDetail': FrontendProductDetailComponent,
    'productDetailAttributes': ProductDetailAttributesComponent,
    'productDetailStock': ProductDetailStockComponent,
    'quantitySelector': QuantitySelectorComponent,
    'cart': CartComponent,
    'login': LoginComponent,
    'register': RegisterComponent,
    'checkout': CheckoutComponent,
    // 'checkoutForm': CheckoutFormComponent,
    'checkoutSummary': CheckoutSummaryComponent,
    'checkoutPayment': CheckoutPaymentComponent,
    'customerInfo': CustomerInfoComponent,
};

// ==============================================================
// 3. FUNCIÓN DE RENDERIZADO PÚBLICO
// ==============================================================
function renderBlock(block, themeSettings, availableMenus, products, currentProduct = null, companyId, paymentMethods = [], shippingRates = [], userDeliveryLocations = [], userGiftCards = [], mode = 'frontend') {
    const Component = componentMap[block.type];

    if (!Component) {
        console.warn(`Componente de layout no reconocido: ${block.type}`);
        return (
            <div key={block.id} className="text-center text-red-500 p-4">
                Error: Componente de layout "{block.type}" no reconocido.
            </div>
        );
    }

    // Props base para todos los componentes
    const baseProps = {
        comp: block,
        themeSettings: themeSettings,
        isPreview: true, // En frontend siempre es preview (no modo edición)
        getStyles: (c) => c.styles || {},
        onEdit: () => { },
        onDelete: () => { },
        setComponents: () => { },
        hoveredComponentId: null,
        setHoveredComponentId: () => { },
        mode: mode,
    };

    // Props específicas por tipo de componente
    switch (block.type) {
        case 'product':
            return <Component key={block.id} {...baseProps} products={products} companyId={companyId} />;

        case 'productDetail':
            return <Component key={block.id} {...baseProps} product={currentProduct} companyId={companyId} />;

        case 'header':
    return (
        <HeaderComponent
            key={block.id}
            {...baseProps}
            appliedTheme={themeSettings}
            mode="frontend"
            availableMenus={availableMenus}  // <-- ¡ESTO ES CLAVE!
        />
    );
    case 'footer':
    return (
        <FooterComponent
            key={block.id}
            comp={block}
            getStyles={(c) => c.styles || {}}
            onEdit={() => {}}
            onDelete={() => {}}
            isPreview={true}
            themeSettings={themeSettings}
            appliedTheme={themeSettings}
            setComponents={() => {}}
            hoveredComponentId={null}
            setHoveredComponentId={() => {}}
            mode="frontend"
            availableMenus={availableMenus}  // <-- ¡ESTO ES CLAVE!
        />
    );
    
        case 'cart':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    mode="frontend"
                    companyId={companyId}
                    products={products}
                />
            );

        case 'login':
        case 'register':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    mode="frontend"
                />
            );

        case 'checkout':
            return (
                <Component
                    key={block.id}
                    {...baseProps}
                    mode="frontend"
                    companyId={companyId}
                    products={products}
                    paymentMethods={paymentMethods}
                    shippingRates={shippingRates}
                    userDeliveryLocations={userDeliveryLocations} // Asegúrate de que esto viene de las props
                    userGiftCards={userGiftCards}
                />
            );

        default:
            return <Component key={block.id} {...baseProps} />;
    }
}

// ==============================================================
// 4. LÓGICA DE CARGA DE FUENTES Y VISTA PRINCIPAL
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
                {fontUrl && (
                    <link
                        rel="stylesheet"
                        href={fontUrl}
                    />
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
                    'frontend',
                    paymentMethods,
                    shippingRates,
                    userDeliveryLocations,
                    userGiftCards,
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