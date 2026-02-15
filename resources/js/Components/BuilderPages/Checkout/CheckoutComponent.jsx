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
import { getThemeWithDefaults, getComponentStyles, resolveStyleValue } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const CheckoutComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme,
    isPreview,
    products = [],
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
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados
    const rawStyles = comp.styles || {};
    const customStyles = {};
    Object.keys(rawStyles).forEach(key => {
        customStyles[key] = resolveValue(rawStyles[key]);
    });

    // Resolver configuración del contenido
    const rawContent = comp.content || {};
    const checkoutConfig = {};
    Object.keys(rawContent).forEach(key => {
        checkoutConfig[key] = resolveValue(rawContent[key]);
    });

    const children = checkoutConfig.children || [];

    // Obtener estilos del tema para checkout
    const themeCheckoutStyles = getComponentStyles(themeWithDefaults, 'checkout', appliedTheme);

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
    const [appliedDiscounts, setAppliedDiscounts] = useState([]);
    const [appliedGiftCard, setAppliedGiftCard] = useState(null);
    const [discountCode, setDiscountCode] = useState('');
    const [giftCardCode, setGiftCardCode] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [giftCardAmountUsed, setGiftCardAmountUsed] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState(null);

    // Referencias para evitar loops
    const hasLoaded = useRef(false);
    const isUpdating = useRef(false);

    // DATOS DE EJEMPLO PARA MODO BUILDER
    const exampleUser = useMemo(() => ({
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+52 55 1234 5678',
        avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=random'
    }), []);

    const exampleAddresses = useMemo(() => [{
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
    }], []);

    const exampleShippingRates = useMemo(() => [{
        id: 1,
        name: 'Envío Estándar',
        price: 50.00,
        description: 'Entrega en 3-5 días hábiles',
        estimated_days: '3-5'
    }], []);

    const examplePaymentMethods = useMemo(() => [{
        id: 'card',
        name: 'Tarjeta de Crédito/Débito',
        description: 'Paga con tu tarjeta Visa, Mastercard o American Express'
    }], []);

    const exampleCartItems = useMemo(() => [{
        id: '1_simple',
        product_id: 1,
        name: 'Producto Ejemplo',
        price: 299.99,
        originalPrice: 299.99,
        quantity: 2,
        image: 'https://picsum.photos/150',
        stock: 10,
        hasDirectDiscount: false,
        discountAmount: 0,
        taxRate: 16.00,
        taxName: 'IVA'
    }], []);

    const exampleCartTotal = 599.98;

    // Obtener usuario actual
    const currentUser = props.auth?.user || null;

    // Memoizar datos de display
    const displayUser = useMemo(() =>
        mode === 'builder' ? exampleUser : currentUser,
        [mode, currentUser, exampleUser]
    );

    const displayAddresses = useMemo(() =>
        mode === 'builder' ? exampleAddresses : (userDeliveryLocations || []),
        [mode, userDeliveryLocations, exampleAddresses]
    );

    const displayShippingRates = useMemo(() =>
        mode === 'builder' ? exampleShippingRates : (shippingRates || []),
        [mode, shippingRates, exampleShippingRates]
    );

    const displayPaymentMethods = useMemo(() =>
        mode === 'builder' ? examplePaymentMethods : (paymentMethods || []),
        [mode, paymentMethods, examplePaymentMethods]
    );

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
    }, [selectedAddressId, displayAddresses, mode, exampleAddresses]);

    // FUNCIÓN PARA CARGAR DATOS DEL CARRITO - ESTABLE
    const loadCartData = useCallback(async () => {
        if (isUpdating.current) return;

        isUpdating.current = true;

        try {
            if (mode === 'frontend' && companyId) {
                setIsLoading(true);
                const cartSummary = cartHelper.getCartSummary(companyId, discounts);
                const cartItemsFromStorage = cartSummary.items;

                const enrichedItems = cartItemsFromStorage.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;

                    let combination = null;
                    if (item.combinationId) {
                        combination = product.combinations?.find(c => c.id === item.combinationId);
                    }

                    return {
                        id: item.id || `${item.productId}_${item.combinationId || 'simple'}`,
                        product_id: item.productId,
                        name: item.productName,
                        price: item.price,
                        originalPrice: item.originalPrice,
                        hasDirectDiscount: item.hasDirectDiscount,
                        automaticDiscount: item.automaticDiscount,
                        manualDiscount: item.manualDiscount,
                        discountAmount: item.discountAmount,
                        discountType: item.discountType,
                        quantity: item.quantity,
                        combination_id: item.combinationId,
                        combination_name: item.combinationName,
                        image: item.image || (product.media?.[0]?.original_url || ''),
                        stock: item.stock,
                        taxRate: item.taxRate,
                        taxName: item.taxName,
                        taxAmount: item.taxAmount
                    };
                }).filter(Boolean);

                setCartItems(enrichedItems);
                setCartTotal(cartSummary.subtotal);
                setAppliedDiscounts(cartSummary.appliedManualDiscounts || []);
                setIsLoading(false);
                hasLoaded.current = true;

            } else if (mode === 'builder') {
                // Datos de ejemplo estáticos
                setCartItems(exampleCartItems);
                setCartTotal(exampleCartTotal);
                setAppliedDiscounts([]);
                setIsLoading(false);
                hasLoaded.current = true;
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            setIsLoading(false);
        } finally {
            isUpdating.current = false;
        }
    }, [companyId, mode, products, discounts, exampleCartItems, exampleCartTotal]);

    // EFECTO PRINCIPAL - Cargar datos iniciales
    useEffect(() => {
        if (!hasLoaded.current) {
            loadCartData();
        }
    }, [loadCartData]);

    // EFECTO para manejar actualizaciones del carrito
    useEffect(() => {
        if (mode === 'frontend') {
            const handleCartUpdate = () => {
                hasLoaded.current = false;
                loadCartData();
            };

            window.addEventListener('cartUpdated', handleCartUpdate);

            return () => {
                window.removeEventListener('cartUpdated', handleCartUpdate);
            };
        }
    }, [mode, loadCartData]);

    // Seleccionar dirección por defecto
    useEffect(() => {
        if (displayAddresses.length > 0 && !selectedAddressId) {
            const defaultAddress = displayAddresses.find(addr => addr.is_default) || displayAddresses[0];
            if (defaultAddress && defaultAddress.id !== selectedAddressId) {
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

    // Calcular totales - INCLUYENDO IMPUESTOS DINÁMICOS
    const totals = useMemo(() => {
        // Calcular desde los items directamente para mayor precisión
        const subtotalCalculated = displayCartItems.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0);

        const originalSubtotal = displayCartItems.reduce((sum, item) =>
            sum + (item.originalPrice * item.quantity), 0);

        const automaticDiscountsTotal = displayCartItems.reduce((sum, item) =>
            sum + (item.discountType === 'direct_discount' ||
                item.discountType === 'product_automatic' ||
                item.discountType === 'store_automatic' ?
                item.discountAmount : 0), 0);

        const manualDiscountsTotal = appliedDiscounts.reduce((sum, discount) =>
            sum + (discount.amount || 0), 0);

        const shipping = deliveryType === 'delivery' ? (parseFloat(selectedShippingRate?.price) || 0) : 0;

        // Calcular impuestos por tipo de producto
        const taxDetails = {};
        let totalTax = 0;

        displayCartItems.forEach(item => {
            if (item.taxRate && item.taxRate > 0) {
                const taxKey = item.taxName ? `${item.taxName}_${item.taxRate}` : `tax_${item.taxRate}`;

                if (!taxDetails[taxKey]) {
                    taxDetails[taxKey] = {
                        name: item.taxName || `Impuesto (${item.taxRate}%)`,
                        rate: `${item.taxRate}%`,
                        amount: 0
                    };
                }

                // Calcular impuesto sobre el precio final del item (después de descuentos)
                const itemTax = (item.price * item.quantity) * (item.taxRate / 100);
                taxDetails[taxKey].amount += itemTax;
                totalTax += itemTax;
            }
        });

        const taxDetailsArray = Object.values(taxDetails);

        // Calcular total antes de gift card
        const totalBeforeGiftCard = subtotalCalculated + shipping + totalTax;

        // Usar el monto de gift card calculado
        const giftCardUsed = giftCardAmountUsed > 0 ?
            Math.min(giftCardAmountUsed, totalBeforeGiftCard) : 0;

        const orderTotal = Math.max(0, totalBeforeGiftCard - giftCardUsed);

        return {
            shipping,
            tax: totalTax,
            taxDetails: taxDetailsArray,
            originalSubtotal,
            subtotal: subtotalCalculated,
            automaticDiscountsTotal,
            manualDiscountsTotal,
            giftCardAmount: giftCardUsed,
            orderTotal,
            totalBeforeGiftCard,
        };
    }, [displayCartItems, appliedDiscounts, selectedShippingRate?.price, deliveryType, giftCardAmountUsed]);

    const handleApplyGiftCard = useCallback(() => {
        if (!giftCardCode.trim()) {
            alert('Por favor ingresa un código de gift card');
            return;
        }

        if (mode === 'frontend' && companyId) {
            setIsLoading(true);

            try {
                // Buscar la gift card en la lista del usuario
                const giftCardToApply = userGiftCards.find(gc =>
                    gc.code && gc.code.toLowerCase() === giftCardCode.toLowerCase().trim()
                );

                if (!giftCardToApply) {
                    alert('Gift Card no encontrada o no válida');
                    setIsLoading(false);
                    return;
                }

                // Verificar que tenga saldo disponible
                const availableBalance = parseFloat(giftCardToApply.current_balance);
                if (availableBalance <= 0) {
                    alert('Esta Gift Card no tiene saldo disponible');
                    setIsLoading(false);
                    return;
                }

                // Verificar fecha de expiración
                if (giftCardToApply.expiration_date) {
                    const expirationDate = new Date(giftCardToApply.expiration_date);
                    const today = new Date();
                    if (expirationDate < today) {
                        alert('Esta Gift Card ha expirado');
                        setIsLoading(false);
                        return;
                    }
                }

                // Calcular el monto que se puede usar
                const orderTotalBeforeGiftCard = totals.orderTotal + totals.giftCardAmount; // Sumar el gift card actual si hay

                // El monto a usar es el mínimo entre el saldo disponible y el total de la orden
                const amountToUse = Math.min(availableBalance, orderTotalBeforeGiftCard);

                // Si ya hay una gift card aplicada, removerla primero
                if (appliedGiftCard) {
                    setAppliedGiftCard(null);
                    setGiftCardAmountUsed(0);
                }

                // Aplicar la nueva gift card
                setAppliedGiftCard(giftCardToApply);
                setGiftCardAmountUsed(amountToUse);
                setGiftCardCode('');

                const { settings } = props;
                const currencySymbol = settings?.currency?.symbol || '$';

                alert(`¡Gift Card "${giftCardToApply.code}" aplicada! Se usarán ${currencySymbol}${amountToUse.toFixed(2)} de los ${currencySymbol}${availableBalance.toFixed(2)} disponibles`);

            } catch (error) {
                console.error('Error applying gift card:', error);
                alert('Error al aplicar la Gift Card. Por favor intenta nuevamente.');
            } finally {
                setIsLoading(false);
            }
        } else if (mode === 'builder') {
            // Modo builder: simular aplicación
            const exampleGiftCard = {
                id: 999,
                code: giftCardCode || '407279',
                initial_balance: '10.00',
                current_balance: '10.00',
                expiration_date: '2026-01-15T00:00:00.000000Z'
            };
            setAppliedGiftCard(exampleGiftCard);
            setGiftCardAmountUsed(5.00); // Ejemplo: usar $5 de $10
            setGiftCardCode('');
            alert('En modo builder: Gift Card simulado aplicada');
        }
    }, [giftCardCode, userGiftCards, mode, companyId, totals.orderTotal, appliedGiftCard]);

    // Función para remover gift card
    const handleRemoveGiftCard = useCallback(() => {
        if (mode === 'frontend') {
            setAppliedGiftCard(null);
            setGiftCardAmountUsed(0);
            setGiftCardCode('');
            alert('Gift Card removida');
        } else if (mode === 'builder') {
            setAppliedGiftCard(null);
            setGiftCardAmountUsed(0);
            setGiftCardCode('');
            alert('En modo builder: Gift Card removida');
        }
    }, [mode]);


    // Manejadores - USAR useCallback para estabilizar
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

    // Manejador para aplicar descuento
    const handleApplyDiscount = useCallback(async () => {
        if (!discountCode.trim()) {
            alert('Por favor ingresa un código de descuento');
            return;
        }

        if (mode === 'frontend' && companyId) {
            setIsLoading(true);

            try {
                const cart = cartHelper.getCart(companyId);

                if (cart.length === 0) {
                    alert('Tu carrito está vacío');
                    setIsLoading(false);
                    return;
                }

                // Buscar descuento en productos del carrito
                let discountToApply = null;

                for (const item of cart) {
                    const product = products.find(p => p.id === item.productId);
                    if (product?.discounts) {
                        const productDiscount = product.discounts.find(d =>
                            d.code && d.code.toLowerCase() === discountCode.toLowerCase().trim()
                        );

                        if (productDiscount) {
                            discountToApply = {
                                ...productDiscount,
                                product_id: product.id,
                                product_name: product.product_name
                            };
                            break;
                        }
                    }
                }

                if (!discountToApply && discounts.length > 0) {
                    discountToApply = discounts.find(d =>
                        d.code && d.code.toLowerCase() === discountCode.toLowerCase().trim()
                    );
                }

                if (!discountToApply) {
                    alert('Código de descuento no válido o expirado');
                    setIsLoading(false);
                    return;
                }

                // Aplicar descuento
                cartHelper.applyManualDiscount(companyId, discountCode, discountToApply);
                window.dispatchEvent(new Event('cartUpdated'));

                alert(`¡Descuento "${discountToApply.name || discountToApply.code}" aplicado!`);
                setDiscountCode('');

            } catch (error) {
                console.error('Error applying discount:', error);
                alert('Error al aplicar el descuento');
            } finally {
                setIsLoading(false);
            }
        } else if (mode === 'builder') {
            const exampleDiscount = {
                id: 999,
                name: 'Año nuevo 2026',
                code: discountCode || 'AA11',
                discount_type: 'percentage',
                value: '15',
                amount: 1.50,
                product_name: 'Camisa'
            };
            setAppliedDiscounts(prev => [...prev, exampleDiscount]);
            alert('En modo builder: Descuento simulado aplicado');
            setDiscountCode('');
        }
    }, [discountCode, companyId, mode, products, discounts]);

    // Manejador para remover descuento
    const handleRemoveDiscount = useCallback((discountCodeToRemove) => {
        if (mode === 'frontend' && companyId) {
            setIsLoading(true);

            try {
                cartHelper.applyManualDiscount(companyId, discountCodeToRemove, null);
                window.dispatchEvent(new Event('cartUpdated'));
                alert(`Descuento ${discountCodeToRemove} removido`);
            } catch (error) {
                console.error('Error removing discount:', error);
                alert('Error al remover el descuento');
            } finally {
                setIsLoading(false);
            }
        } else if (mode === 'builder') {
            setAppliedDiscounts(prev => prev.filter(d => d.code !== discountCodeToRemove));
            alert('En modo builder: Descuento removido');
        }
    }, [companyId, mode]);

    // Estilos del contenedor principal (usando customStyles resueltos)
    const containerStyles = {
        ...getStyles(comp),
        width: '100%',
        paddingTop: withUnit(customStyles.paddingTop || '40px'),
        paddingRight: withUnit(customStyles.paddingRight || '20px'),
        paddingBottom: withUnit(customStyles.paddingBottom || '40px'),
        paddingLeft: withUnit(customStyles.paddingLeft || '20px'),
        backgroundColor: customStyles.backgroundColor || themeCheckoutStyles.backgroundColor || themeWithDefaults.background,
        maxWidth: withUnit(customStyles.maxWidth || '1200px', customStyles.maxWidthUnit || (customStyles.maxWidth?.toString().includes('%') ? '%' : 'px')),
        margin: '0 auto',
        border: isPreview ? 'none' : '1px none #ccc',
        minHeight: '50px',
        position: 'relative',
        boxSizing: 'border-box',
        borderRadius: withUnit(customStyles.borderRadius || themeCheckoutStyles.borderRadius || '0px'),
    };

    const innerContainerStyles = {
                backgroundColor: customStyles.backgroundColor || themeCheckoutStyles.backgroundColor || themeWithDefaults.background,

    };

    // Determinar layout type (resuelto)
    const layoutType = customStyles.layoutType || 'compact';

    const submitOrder = async () => {
        if (!selectedPaymentMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }

        if (!acceptTerms) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        if (!displayUser || !displayUser.id) {
            alert('Debes iniciar sesión para completar la orden');
            return;
        }

        setIsSubmitting(true);
        setOrderError(null);

        // Preparar datos del carrito
        const cartItemsData = displayCartItems.map(item => ({
            product_id: item.product_id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            original_price: item.originalPrice || item.price,
            combination_id: item.combination_id || null,
            combination_name: item.combination_name || null,
            discount_amount: item.discountAmount || 0,
            discount_type: item.discountType || 'none',
            automatic_discount: item.automaticDiscount || null,
            manual_discount: item.manualDiscount || null,
            tax_rate: item.taxRate || 0,
            tax_amount: item.taxAmount || 0,
            tax_name: item.taxName || null,
        }));

        // Preparar información de usuario
        const userInfo = {
            user_id: displayUser.id,
            delivery_location_id: selectedAddressId,
        };

        // Preparar información de envío
        const shippingInfo = {
            delivery_type: deliveryType,
            shipping_rate_id: selectedShippingRate?.id || null,
        };

        // Preparar información de pago
        const paymentInfo = {
            payment_method_id: selectedPaymentMethod,
        };

        // Preparar descuentos aplicados
        const discountsData = appliedDiscounts.map(discount => ({
            code: discount.code,
            name: discount.name,
            amount: discount.amount || 0,
            discount_type: discount.discount_type,
        }));

        // Preparar información de gift card
        const giftCardData = appliedGiftCard ? {
            id: appliedGiftCard.id,
            code: appliedGiftCard.code,
            amount_used: giftCardAmountUsed,
        } : null;

        // Preparar totales
        const totalsData = {
            subtotal: totals.subtotal,
            shipping: totals.shipping,
            tax: totals.tax,
            total: totals.orderTotal,
            automatic_discounts: totals.automaticDiscountsTotal,
            manual_discounts: totals.manualDiscountsTotal,
            gift_card_amount: totals.giftCardAmount,
        };

        console.log({ cartItemsData, userInfo, shippingInfo, paymentInfo, discountsData, giftCardData, totalsData });

        // Enviar datos al backend usando Inertia.js
        router.post('/checkout/process', {
            cart_items: cartItemsData,
            user_info: userInfo,
            shipping_info: shippingInfo,
            payment_info: paymentInfo,
            discounts: discountsData,
            gift_card: giftCardData,
            totals: totalsData,
            company_id: companyId,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                // Limpiar carrito cuando la redirección sea exitosa
                cartHelper.clearCart(companyId);
                window.dispatchEvent(new Event('cartUpdated'));

                console.log('Orden creada exitosamente, redirigiendo...');
                // Inertia.js manejará automáticamente la redirección
            },
            onError: (errors) => {
                console.error('Error al crear la orden:', errors);
                if (errors.message) {
                    setOrderError(errors.message);
                } else if (typeof errors === 'object') {
                    const errorMsg = Object.values(errors).flat().join(', ');
                    setOrderError(errorMsg);
                } else {
                    setOrderError('Error al procesar la orden. Por favor intenta de nuevo.');
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    // Configuración por defecto para modo frontend (usando checkoutConfig resuelto)
    const displayChildren = useMemo(() => {
        if (mode === 'frontend' && children.length === 0) {
            return [
                {
                    id: 'discount-gift-card',
                    type: 'checkoutDiscountGiftCard',
                    content: { title: 'Descuentos y Gift Cards' },
                    styles: {
                        backgroundColor: themeWithDefaults.background,
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
                        backgroundColor: themeWithDefaults.background,
                        padding: '24px',
                        borderRadius: '12px',
                        titleSize: themeWithDefaults.heading3_fontSize || '20px',
                        titleColor: themeWithDefaults.heading,
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
                        showOrderTotal: true,
                        backgroundColor: themeWithDefaults.danger_color,
                    },
                    styles: {
                        backgroundColor: themeWithDefaults.background,
                        padding: '24px',
                        borderRadius: '12px',
                        borderColor: themeWithDefaults.borders,
                        titleSize: themeWithDefaults.heading3_fontSize || '20px',
                        totalFontSize: themeWithDefaults.heading2_fontSize || '24px',
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
                        backgroundColor: themeWithDefaults.background,
                        padding: '24px',
                        borderRadius: '12px',
                        titleSize: themeWithDefaults.heading3_fontSize || '20px',
                        buttonBackgroundColor: themeWithDefaults.primary_button_background,
                        buttonColor: themeWithDefaults.primary_button_text,
                        buttonBorderRadius: themeWithDefaults.primary_button_corner_radius || '8px'
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
            appliedTheme,
            cartItems: displayCartItems,
            cartTotal: displayCartTotal,
            shipping: totals.shipping,
            tax: totals.tax,
            taxDetails: totals.taxDetails,
            discounts: totals.manualDiscountsTotal,
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
                            onApplyDiscount={handleApplyDiscount}
                            onRemoveDiscount={handleRemoveDiscount}
                            onApplyGiftCard={handleApplyGiftCard}
                            onRemoveGiftCard={handleRemoveGiftCard}
                            appliedDiscounts={appliedDiscounts}
                            appliedGiftCard={appliedGiftCard}
                            giftCardAmountUsed={giftCardAmountUsed}
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
                            appliedDiscounts={appliedDiscounts}
                            appliedGiftCard={appliedGiftCard}
                            deliveryType={deliveryType}
                            selectedAddress={selectedAddress}
                            cartItems={displayCartItems}
                            cartTotal={displayCartTotal}
                            shipping={totals.shipping}
                            tax={totals.tax}
                            taxDetails={totals.taxDetails}
                            discounts={totals.manualDiscountsTotal}
                            automaticDiscountsTotal={totals.automaticDiscountsTotal}
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
                            onSubmitOrder={submitOrder}
                            paymentMethods={displayPaymentMethods}
                            isSubmitting={isSubmitting}
                            orderError={orderError}
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

    // Layouts personalizados
    const renderCompactLayout = () => {
        return (
            <div
                className="grid grid-cols-1 lg:grid-cols-3"
                style={{ gap: withUnit(customStyles.gap || '24px', customStyles.gapUnit || 'px') }}
            >
                <div className="lg:col-span-2 space-y-6" style={{ gap: withUnit(customStyles.gap || '24px', customStyles.gapUnit || 'px') }}>
                    {customerInfoChildren.map(renderChild)}
                    {paymentChildren.map(renderChild)}
                </div>
                <div className="space-y-6" style={{ gap: withUnit(customStyles.gap || '24px', customStyles.gapUnit || 'px') }}>
                    {discountGiftCardChildren.map(renderChild)}
                    {summaryChildren.map(renderChild)}
                    {otherChildren.map(renderChild)}
                </div>
            </div>
        );
    };

    const renderGridLayout = () => {
        return (
            <div
                className="grid grid-cols-1 md:grid-cols-2"
                style={{ gap: withUnit(customStyles.gap || '24px', customStyles.gapUnit || 'px') }}
            >
                <div className="md:col-span-1">
                    {discountGiftCardChildren.map(renderChild)}
                </div>
                <div className="md:col-span-1">
                    {customerInfoChildren.map(renderChild)}
                </div>
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
            <div className="flex flex-col" style={{ gap: withUnit(customStyles.gap || '24px', customStyles.gapUnit || 'px') }}>
                {allChildren.map(renderChild)}
            </div>
        );
    };

    const renderTwoColumnLayout = () => {
        return (
            <div
                className="grid grid-cols-1 lg:grid-cols-2"
                style={{ gap: withUnit(customStyles.gap || '32px', customStyles.gapUnit || 'px') }}
            >
                <div className="space-y-6" style={{ gap: withUnit(customStyles.gap || '24px', customStyles.gapUnit || 'px') }}>
                    {customerInfoChildren.map(renderChild)}
                    {paymentChildren.map(renderChild)}
                </div>
                <div className="space-y-6" style={{ gap: withUnit(customStyles.gap || '24px', customStyles.gapUnit || 'px') }}>
                    {discountGiftCardChildren.map(renderChild)}
                    {summaryChildren.map(renderChild)}
                    {otherChildren.map(renderChild)}
                </div>
            </div>
        );
    };

    // Seleccionar layout
    const renderLayout = () => {
        switch (layoutType) {
            case 'compact': return renderCompactLayout();
            case 'grid': return renderGridLayout();
            case 'vertical': return renderVerticalLayout();
            case 'two-column': return renderTwoColumnLayout();
            default: return renderCompactLayout();
        }
    };

    return (
        <div className="checkout-container" style={innerContainerStyles}>
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

            {/* Indicador de datos de ejemplo en modo builder (opcional) */}
            {/* {mode === 'builder' && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-blue-700">
                            <strong>Modo Builder:</strong> Mostrando datos de ejemplo para personalización
                        </span>
                    </div>
                </div>
            )} */}

            {renderLayout()}
        </div>
        </div>
    );
};

export default CheckoutComponent;