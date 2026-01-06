// components/BuilderPages/Checkout/CheckoutComponent.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import CheckoutSummaryComponent from './CheckoutSummaryComponent';
import CheckoutPaymentComponent from './CheckoutPaymentComponent';
import CheckoutDiscountGiftCardComponent from './CheckoutDiscountGiftCardComponent';
import CustomerInfoComponent from './CustomerInfoComponent';
import AuthModalComponent from './CheckoutAuthModalComponent';
import ComponentWithHover from '../ComponentWithHover';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import cartHelper from '@/Helper/cartHelper';

const CheckoutComponent = ({
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
    companyId,
    mode = 'builder',
    paymentMethods = [],
    shippingRates = [],
    discounts = [],
    userDeliveryLocations = [],
    userGiftCards = [],
}) => {
    const { props } = usePage();
    const customStyles = comp.styles || {};
    const checkoutConfig = comp.content || {};
    const children = checkoutConfig.children || [];

    // Estados
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedShippingRate, setSelectedShippingRate] = useState(null);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [deliveryType, setDeliveryType] = useState('delivery');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(mode === 'frontend');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [appliedGiftCard, setAppliedGiftCard] = useState(null);
    const [discountCode, setDiscountCode] = useState('');
    const [giftCardCode, setGiftCardCode] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    // DATOS DE EJEMPLO PARA MODO BUILDER
    const exampleUser = useMemo(() => ({
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+52 55 1234 5678',
        avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=random'
    }), []);

    const exampleAddresses = useMemo(() => [
        {
            id: 1,
            address_line_1: 'Calle Ejemplo 123',
            address_line_2: 'Colonia Centro',
            city: 'Ciudad de México',
            state: 'CDMX',
            country: 'México',
            postal_code: '12345',
            phone_number: '+52 55 1234 5678',
            is_default: true,
            notes: 'Casa con portón negro'
        }
    ], []);

    const exampleShippingRates = useMemo(() => [
        {
            id: 1,
            name: 'Envío Estándar',
            price: 50.00,
            description: 'Entrega en 3-5 días hábiles',
            estimated_days: '3-5'
        }
    ], []);

    const examplePaymentMethods = useMemo(() => [
        {
            id: 'card',
            name: 'Tarjeta de Crédito/Débito',
            description: 'Paga con tu tarjeta Visa, Mastercard o American Express'
        }
    ], []);

    const exampleCartItems = useMemo(() => [
        {
            id: '1_simple',
            product_id: 1,
            name: 'Producto Ejemplo',
            price: 299.99,
            quantity: 2,
            image: 'https://picsum.photos/150',
            stock: 10
        }
    ], []);

    const exampleCartTotal = 599.98;

    // Obtener usuario actual
    const currentUser = props.auth?.user || null;

    // Usar datos de ejemplo en modo builder, datos reales en frontend
    const displayUser = mode === 'builder' ? exampleUser : currentUser;
    const displayAddresses = mode === 'builder' ? exampleAddresses : (userDeliveryLocations || []);
    const displayShippingRates = mode === 'builder' ? exampleShippingRates : (shippingRates || []);
    const displayPaymentMethods = mode === 'builder' ? examplePaymentMethods : (paymentMethods || []);
    const displayCartItems = mode === 'builder' ? exampleCartItems : cartItems;
    const displayCartTotal = mode === 'builder' ? exampleCartTotal : cartTotal;

    // Obtener la dirección seleccionada
    const selectedAddress = useMemo(() => {
        if (mode === 'builder') {
            return exampleAddresses[0];
        }
        return selectedAddressId
            ? displayAddresses.find(addr => addr.id === selectedAddressId)
            : null;
    }, [selectedAddressId, displayAddresses, mode]);

    // Cargar datos del carrito
    useEffect(() => {
        if (mode === 'frontend' && companyId) {
            setIsLoading(true);
            const cartSummary = cartHelper.getCartSummary(companyId);
            const cartItemsFromStorage = cartSummary.items;

            const enrichedItems = cartItemsFromStorage.map(item => {
                const product = products?.find(p => p.id === item.productId);
                if (!product) return null;

                let combination = null;
                if (item.combinationId) {
                    combination = product.combinations?.find(c => c.id === item.combinationId);
                }

                return {
                    id: item.productId + '_' + (item.combinationId || 'simple'),
                    product_id: item.productId,
                    name: item.productName,
                    price: combination ? combination.price : product.product_price,
                    quantity: item.quantity,
                    combination_id: item.combinationId,
                    combination_name: item.combinationName,
                    image: item.image || (product.media?.[0]?.original_url || ''),
                    stock: item.stock,
                };
            }).filter(Boolean);

            setCartItems(enrichedItems);
            setCartTotal(cartSummary.totalAmount);
            setIsLoading(false);
        }
    }, [companyId, mode, products]);

    // Seleccionar dirección por defecto
    useEffect(() => {
        if (displayAddresses.length > 0 && !selectedAddressId) {
            const defaultAddress = displayAddresses.find(addr => addr.is_default) || displayAddresses[0];
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            }
        }
    }, [displayAddresses, selectedAddressId]);

    // Detectar si es móvil
    useEffect(() => {
        if (mode === 'frontend' && typeof window !== 'undefined') {
            const checkMobile = () => {
                setIsMobile(window.innerWidth < 768);
            };
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }
    }, [mode]);

    // Calcular totales
    const totals = useMemo(() => {
        // Asegurarse de que displayCartTotal sea un número
        const subtotalNum = parseFloat(displayCartTotal) || 0;

        const shipping = deliveryType === 'delivery' ? (parseFloat(selectedShippingRate?.price) || 0) : 0;
        const taxRate = 0.16;
        const tax = subtotalNum * taxRate;

        let discountAmount = 0;
        if (appliedDiscount) {
            if (appliedDiscount.discount_type === 'percentage') {
                discountAmount = subtotalNum * (parseFloat(appliedDiscount.value) / 100);
            } else {
                discountAmount = parseFloat(appliedDiscount.value) || 0;
            }
            discountAmount = Math.min(discountAmount, subtotalNum);
        }

        const giftCardAmount = parseFloat(appliedGiftCard?.current_balance) || 0;
        const giftCardUsed = Math.min(giftCardAmount, subtotalNum - discountAmount + shipping + tax);

        const subtotalAfterDiscount = Math.max(0, subtotalNum - discountAmount);
        const orderTotal = Math.max(0, subtotalAfterDiscount + shipping + tax - giftCardUsed);

        return {
            shipping,
            tax,
            discountAmount,
            giftCardAmount: giftCardUsed,
            subtotalAfterDiscount,
            orderTotal,
            subtotal: subtotalNum,
        };
    }, [displayCartTotal, selectedShippingRate, appliedDiscount, appliedGiftCard, deliveryType]);

    // Manejadores
    const handleAddressSelect = useCallback((addressId) => {
        setSelectedAddressId(addressId);
    }, []);

    const handleDeliveryTypeChange = useCallback((type) => {
        setDeliveryType(type);
        if (type === 'pickup') {
            setSelectedShippingRate(null);
        } else if (type === 'delivery' && displayShippingRates.length > 0) {
            setSelectedShippingRate(displayShippingRates[0]);
        }
    }, [displayShippingRates]);

    const handleShippingRateChange = useCallback((rate) => {
        setSelectedShippingRate(rate);
    }, []);

    // Estilos del contenedor principal
    const containerStyles = {
        ...getStyles(comp),
        width: '100%',
        padding: customStyles.padding || '40px 20px',
        backgroundColor: customStyles.backgroundColor || '#ffffff',
        maxWidth: customStyles.maxWidth || '1200px',
        margin: '0 auto',
        border: isPreview ? 'none' : '1px none #ccc',
        minHeight: '50px',
        position: 'relative',
        boxSizing: 'border-box',
    };

    // Determinar layout type
    const layoutType = customStyles.layoutType || 'compact';

    // Configuración por defecto para modo frontend
    const displayChildren = useMemo(() => {
        if (mode === 'frontend' && children.length === 0) {
            return [
                {
                    id: 'discount-gift-card',
                    type: 'checkoutDiscountGiftCard',
                    content: { title: 'Descuentos y Gift Cards' },
                    styles: {
                        backgroundColor: '#f8f9fa',
                        padding: '16px',
                        borderRadius: '8px'
                    }
                },
                {
                    id: 'customer-info',
                    type: 'customerInfo',
                    content: {
                        title: 'Información del Cliente',
                        showAddressSelector: true,
                        showShippingMethods: true,
                        showPaymentMethodsPreview: true
                    },
                    styles: {
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '12px',
                        titleSize: '20px',
                        titleColor: '#000000',
                    }
                },
                {
                    id: 'default-summary',
                    type: 'checkoutSummary',
                    content: {
                        title: 'Resumen del Pedido',
                        showSubtotal: true,
                        showShipping: true,
                        showTax: true,
                        showDiscount: true,
                        showOrderTotal: true
                    },
                    styles: {
                        backgroundColor: '#f9fafb',
                        padding: '24px',
                        borderRadius: '12px',
                        borderColor: '#e5e7eb',
                        titleSize: '20px',
                        totalFontSize: '24px',
                    }
                },
                {
                    id: 'default-payment',
                    type: 'checkoutPayment',
                    content: {
                        title: 'Método de Pago',
                        paymentMethods: displayPaymentMethods,
                        showTerms: true,
                        buttonText: 'Realizar Pedido'
                    },
                    styles: {
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '12px',
                        titleSize: '20px',
                        buttonBackgroundColor: '#3b82f6',
                        buttonColor: '#ffffff',
                        buttonBorderRadius: '8px'
                    }
                }
            ];
        }
        return children;
    }, [mode, children, displayPaymentMethods]);

    // Función para renderizar hijos
    const renderChild = (child) => {
        const commonProps = {
            comp: child,
            getStyles,
            isPreview: mode === 'frontend' ? true : isPreview,
            onEdit: mode === 'frontend' ? () => { } : () => onEdit(child),
            onDelete: mode === 'frontend' ? () => { } : () => console.log('Delete:', child.id),
            hoveredComponentId,
            setHoveredComponentId,
            themeSettings,
            cartItems: displayCartItems,
            cartTotal: displayCartTotal,
            shipping: totals.shipping,
            tax: totals.tax,
            discounts: totals.discountAmount,
            giftCardAmount: totals.giftCardAmount,
            orderTotal: totals.orderTotal,
            mode
        };

        switch (child.type) {
            case 'checkoutDiscountGiftCard':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={() => 'Descuentos y Gift Cards'}
                    >
                        <CheckoutDiscountGiftCardComponent
                            key={child.id}
                            {...commonProps}
                            discountCode={discountCode}
                            setDiscountCode={setDiscountCode}
                            giftCardCode={giftCardCode}
                            setGiftCardCode={setGiftCardCode}
                            onApplyDiscount={() => { }}
                            onApplyGiftCard={() => { }}
                            appliedDiscount={appliedDiscount}
                            appliedGiftCard={appliedGiftCard}
                            userGiftCards={userGiftCards}
                        />
                    </ComponentWithHover>
                );

            case 'customerInfo':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={() => 'Información del Cliente'}
                    >
                        <CustomerInfoComponent
                            key={child.id}
                            {...commonProps}
                            currentUser={displayUser}
                            userDeliveryLocations={displayAddresses}
                            selectedAddressId={selectedAddressId}
                            selectedShippingRate={selectedShippingRate}
                            deliveryType={deliveryType}
                            onAddressSelect={handleAddressSelect}
                            onDeliveryTypeChange={handleDeliveryTypeChange}
                            onShippingRateChange={handleShippingRateChange}
                            shippingRates={displayShippingRates}
                            paymentMethods={displayPaymentMethods}
                            showAuthModal={() => setShowAuthModal(true)}
                            mode={mode}
                        />
                    </ComponentWithHover>
                );

            case 'checkoutSummary':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={() => 'Resumen de Checkout'}
                    >
                        <CheckoutSummaryComponent
                            key={child.id}
                            {...commonProps}
                            shippingRates={displayShippingRates}
                            selectedShippingRate={selectedShippingRate}
                            onShippingRateChange={handleShippingRateChange}
                            appliedDiscount={appliedDiscount}
                            appliedGiftCard={appliedGiftCard}
                            deliveryType={deliveryType}
                            selectedAddress={selectedAddress}
                            cartItems={displayCartItems}
                            cartTotal={displayCartTotal}
                            shipping={totals.shipping}
                            tax={totals.tax}
                            discounts={totals.discountAmount}
                            giftCardAmount={totals.giftCardAmount}
                            orderTotal={totals.orderTotal}
                        />
                    </ComponentWithHover>
                );

            case 'checkoutPayment':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={() => 'Métodos de Pago'}
                    >
                        <CheckoutPaymentComponent
                            key={child.id}
                            {...commonProps}
                            selectedPaymentMethod={selectedPaymentMethod}
                            setSelectedPaymentMethod={setSelectedPaymentMethod}
                            acceptTerms={acceptTerms}
                            setAcceptTerms={setAcceptTerms}
                            onSubmitOrder={() => { }}
                            paymentMethods={displayPaymentMethods}
                        />
                    </ComponentWithHover>
                );

            default:
                return null;
        }
    };

    // Separar componentes por tipo
    const discountGiftCardChildren = displayChildren.filter(child => child.type === 'checkoutDiscountGiftCard');
    const customerInfoChildren = displayChildren.filter(child => child.type === 'customerInfo');
    const summaryChildren = displayChildren.filter(child => child.type === 'checkoutSummary');
    const paymentChildren = displayChildren.filter(child => child.type === 'checkoutPayment');
    const otherChildren = displayChildren.filter(child =>
        !['checkoutDiscountGiftCard', 'customerInfo', 'checkoutSummary', 'checkoutPayment'].includes(child.type)
    );

    // Renderizar según el modo
    if (mode === 'frontend' && isLoading) {
        return (
            <div style={containerStyles}>
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Cargando checkout...</p>
                </div>
            </div>
        );
    }

    // Layouts personalizados sin espacios en blanco
    const renderCompactLayout = () => {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna 1: Información del Cliente (ocupa 2 columnas) */}
                <div className="lg:col-span-2 space-y-6">
                    {customerInfoChildren.map(renderChild)}
                    {paymentChildren.map(renderChild)}
                </div>

                {/* Columna 2: Sidebar con descuento y resumen */}
                <div className="space-y-6">
                    {discountGiftCardChildren.map(renderChild)}
                    {summaryChildren.map(renderChild)}
                    {otherChildren.map(renderChild)}
                </div>
            </div>
        );
    };

    const renderGridLayout = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fila 1: DiscountGiftCard y CustomerInfo */}
                <div className="md:col-span-1">
                    {discountGiftCardChildren.map(renderChild)}
                </div>
                <div className="md:col-span-1">
                    {customerInfoChildren.map(renderChild)}
                </div>

                {/* Fila 2: Summary y Payment */}
                <div className="md:col-span-1">
                    {summaryChildren.map(renderChild)}
                </div>
                <div className="md:col-span-1">
                    {paymentChildren.map(renderChild)}
                    {otherChildren.map(renderChild)}
                </div>
            </div>
        );
    };

    const renderVerticalLayout = () => {
        const allChildren = [
            ...discountGiftCardChildren,
            ...customerInfoChildren,
            ...summaryChildren,
            ...paymentChildren,
            ...otherChildren
        ];

        return (
            <div className="space-y-6">
                {allChildren.map(renderChild)}
            </div>
        );
    };

    const renderTwoColumnLayout = () => {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna izquierda: CustomerInfo y Payment */}
                <div className="space-y-6">
                    {customerInfoChildren.map(renderChild)}
                    {paymentChildren.map(renderChild)}
                </div>

                {/* Columna derecha: DiscountGiftCard y Summary */}
                <div className="space-y-6">
                    {discountGiftCardChildren.map(renderChild)}
                    {summaryChildren.map(renderChild)}
                    {otherChildren.map(renderChild)}
                </div>
            </div>
        );
    };

    // Seleccionar layout basado en layoutType
    const renderLayout = () => {
        switch (layoutType) {
            case 'compact':
                return renderCompactLayout();
            case 'grid':
                return renderGridLayout();
            case 'vertical':
                return renderVerticalLayout();
            case 'two-column':
                return renderTwoColumnLayout();
            default:
                return renderCompactLayout();
        }
    };

    return (
        <div style={containerStyles}>
            {/* Modal de autenticación */}
            {showAuthModal && mode === 'frontend' && (
                <AuthModalComponent
                    onClose={() => setShowAuthModal(false)}
                    companyId={companyId}
                    onSuccess={() => {
                        setShowAuthModal(false);
                        window.location.reload();
                    }}
                />
            )}

            {/* Indicador de datos de ejemplo en modo builder */}
            {mode === 'builder' && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-blue-700">
                            <strong>Modo Builder:</strong> Mostrando datos de ejemplo para personalización
                        </span>
                    </div>
                </div>
            )}

            {renderLayout()}
        </div>
    );
};

export default CheckoutComponent;