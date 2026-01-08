// CartComponent.jsx - VERSIÓN COMPLETA CORREGIDA
import React, { useState, useEffect, useCallback, useRef } from 'react';
import CartItemsComponent from './CartItemsComponent';
import CartSummaryComponent from './CartSummaryComponent';
import ComponentWithHover from '../ComponentWithHover';
import cartHelper from '@/Helper/cartHelper';

const CartComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    isPreview,
    products = [],
    setComponents,
    hoveredComponentId,
    setHoveredComponentId,
    companyId,
    mode = 'builder',
    automaticDiscounts = []
}) => {
    const customStyles = comp.styles || {};
    const cartConfig = comp.content || {};
    const children = cartConfig.children || [];

    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(mode === 'frontend');
    const [isMobile, setIsMobile] = useState(false);

    // Referencias para prevenir bucles
    const productsRef = useRef(products);
    const automaticDiscountsRef = useRef(automaticDiscounts);
    const isMounted = useRef(false);
    const isLoadingRef = useRef(false);

    // Obtener estilos del layout
    const layoutType = customStyles.layoutType || 'grid';
    const paddingTop = customStyles.paddingTop || '20px';
    const paddingRight = customStyles.paddingRight || '20px';
    const paddingBottom = customStyles.paddingBottom || '20px';
    const paddingLeft = customStyles.paddingLeft || '20px';
    const backgroundColor = customStyles.backgroundColor || '#ffffff';
    const maxWidth = '100%';
    const gap = customStyles.gap || '40px';

    const containerStyles = {
        ...getStyles(comp),
        width: '100%',
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        backgroundColor,
        maxWidth,
        margin: '0 auto',
        border: isPreview ? 'none' : '1px none #ccc',
        minHeight: '50px',
        position: 'relative',
        boxSizing: 'border-box',
    };

    // Detectar móvil solo en frontend
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

    const getLayoutStyles = () => {
        if (mode === 'frontend' && isMobile) {
            return {
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
            };
        }

        switch (layoutType) {
            case 'grid':
                return {
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap,
                    alignItems: 'start',
                };
            case 'stack':
            default:
                return {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                };
        }
    };

    const layoutStyles = getLayoutStyles();

    // FUNCIÓN PRINCIPAL PARA CARGAR DATOS
    const loadCartData = useCallback(() => {
        // Si ya está cargando o no está montado, salir
        if (isLoadingRef.current || !isMounted.current) {
            return;
        }

        isLoadingRef.current = true;
        setIsLoading(true);

        try {
            if (mode === 'frontend' && companyId) {
                const cart = cartHelper.getCart(companyId);

                if (!cart || cart.length === 0) {
                    setCartItems([]);
                    setCartTotal(0);
                    return;
                }

                // Mapear los items del carrito
                const formattedItems = cart.map((item, index) => {
                    const product = productsRef.current?.find(p => p.id === item.productId);

                    let combination = null;
                    if (item.combinationId && product && product.combinations) {
                        const comb = product.combinations.find(c => c.id === item.combinationId);
                        if (comb) {
                            combination = {
                                id: comb.id,
                                price: parseFloat(comb.price),
                                attribute_values: comb.attribute_values.map(attr => ({
                                    attribute_name: attr.attribute_name,
                                    value_name: attr.value_name
                                }))
                            };
                        }
                    }

                    let stock = 0;
                    if (product && product.stocks) {
                        if (item.combinationId) {
                            const stockItem = product.stocks.find(s => s.combination_id === item.combinationId);
                            stock = stockItem ? stockItem.quantity : 0;
                        } else {
                            const stockItem = product.stocks.find(s => s.combination_id === null);
                            stock = stockItem ? stockItem.quantity : 0;
                        }
                    }

                    return {
                        id: item.id || `${item.productId}-${item.combinationId || 'simple'}-${index}`,
                        product_id: item.productId,
                        name: item.productName || (product ? product.product_name : 'Producto'),
                        price: parseFloat(item.price) || (product ? parseFloat(product.product_price) : 0),
                        originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : parseFloat(item.price),
                        quantity: item.quantity || 1,
                        combination: combination,
                        image: item.image || (product && product.media && product.media[0]
                            ? product.media[0].original_url
                            : 'https://picsum.photos/80'),
                        stock: stock,
                        hasDirectDiscount: item.hasDirectDiscount || false,
                        automaticDiscount: item.automaticDiscount || null,
                        discountAmount: item.discountAmount || 0,
                        discountType: item.discountType || 'none'
                    };
                });

                setCartItems(formattedItems);

                // Calcular total
                const cartSummary = cartHelper.getCartSummary(
                    companyId,
                    null,
                    automaticDiscountsRef.current
                );
                setCartTotal(cartSummary.totalAmount);

            } else if (isPreview || mode === 'builder') {
                // Datos de ejemplo para builder/preview
                const simulatedItems = [
                    {
                        id: 1,
                        product_id: 3,
                        name: 'Camisa azul',
                        price: 10.00,
                        originalPrice: 13.00,
                        quantity: 2,
                        combination: {
                            id: 3,
                            price: 13.00,
                            attribute_values: [
                                { attribute_name: 'talla', value_name: 'mediano' },
                                { attribute_name: 'marca', value_name: 'lacoste' }
                            ]
                        },
                        image: 'https://picsum.photos/80',
                        stock: 12,
                        hasDirectDiscount: true,
                        discountAmount: 6.00,
                        discountType: 'direct_discount'
                    },
                    {
                        id: 2,
                        product_id: 4,
                        name: 'Camisa azul premium',
                        price: 6.00,
                        originalPrice: 8.00,
                        quantity: 1,
                        combination: null,
                        image: 'https://picsum.photos/80',
                        stock: 9,
                        hasDirectDiscount: false,
                        automaticDiscount: {
                            id: 2,
                            name: 'Descuento automático',
                            discount_type: 'fixed_amount',
                            value: '2.00'
                        },
                        discountAmount: 2.00,
                        discountType: 'product_automatic'
                    }
                ];
                setCartItems(simulatedItems);
                const total = simulatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                setCartTotal(total);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            setCartItems([]);
            setCartTotal(0);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [mode, companyId, isPreview]);

    // EFFECT PRINCIPAL
    useEffect(() => {
        isMounted.current = true;

        // Actualizar referencias
        productsRef.current = products;
        automaticDiscountsRef.current = automaticDiscounts;

        // Cargar datos iniciales
        if (isMounted.current) {
            loadCartData();
        }

        return () => {
            isMounted.current = false;
        };
    }, [mode, companyId, isPreview]);

    // Manejar cambios en el carrito real
    useEffect(() => {
        if (mode === 'frontend') {
            const handleCartUpdate = () => {
                if (isMounted.current) {
                    loadCartData();
                }
            };

            window.addEventListener('cartUpdated', handleCartUpdate);

            return () => {
                window.removeEventListener('cartUpdated', handleCartUpdate);
            };
        }
    }, [mode, loadCartData]);

    // Funciones para manejar el carrito
    const updateQuantity = useCallback((itemId, newQuantity) => {
        const updatedItems = cartItems.map(item =>
            item.id === itemId
                ? { ...item, quantity: Math.max(1, newQuantity) }
                : item
        );

        setCartItems(updatedItems);
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);

        if (mode === 'frontend') {
            const item = cartItems.find(i => i.id === itemId);
            if (item) {
                cartHelper.updateItemQuantity(companyId, item.product_id, item.combination?.id, newQuantity);
            }
        }
    }, [cartItems, companyId, mode]);

    const removeItem = useCallback((itemId) => {
        const itemToRemove = cartItems.find(i => i.id === itemId);
        const updatedItems = cartItems.filter(item => item.id !== itemId);

        setCartItems(updatedItems);
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);

        if (mode === 'frontend' && itemToRemove) {
            cartHelper.removeItem(companyId, itemToRemove.product_id, itemToRemove.combination?.id);
        }
    }, [cartItems, companyId, mode]);

    // Si no hay hijos en modo frontend, usar configuración por defecto
    const getDisplayChildren = () => {
        if (mode === 'frontend' && children.length === 0) {
            return [
                {
                    type: 'cartItems',
                    id: 'default-items',
                    styles: {},
                    content: {
                        title: 'Tu Carrito de Compras',
                        showCombination: true,
                        showImage: true,
                        showStock: true
                    }
                },
                {
                    type: 'cartSummary',
                    id: 'default-summary',
                    styles: {},
                    content: {
                        title: 'Resumen del pedido',
                        checkoutButtonText: 'Proceder al pago',
                        showDivider: true,
                        showShippingNote: true
                    }
                }
            ];
        }
        return children;
    };

    const displayChildren = getDisplayChildren();

    // Función para eliminar un hijo (solo en modo builder)
    const handleDeleteChild = useCallback((childId) => {
        if (mode === 'builder' && setComponents) {
            setComponents((prev) => {
                const updateCartChildren = (components) => {
                    return components.map((c) => {
                        if (c.id === comp.id && c.content && c.content.children) {
                            return {
                                ...c,
                                content: {
                                    ...c.content,
                                    children: c.content.children.filter((sc) => sc.id !== childId)
                                }
                            };
                        }
                        return c;
                    });
                };
                const updated = updateCartChildren(prev);
                return updated;
            });
        }
    }, [comp.id, mode, setComponents]);

    // Render loading
    if (mode === 'frontend' && isLoading) {
        return (
            <div style={containerStyles}>
                <div className="text-center py-8">Cargando carrito...</div>
            </div>
        );
    }

    // Renderizar cada hijo
    const renderChild = (child) => {
        const commonProps = {
            comp: child,
            getStyles,
            isPreview: mode === 'frontend' ? true : isPreview,
            onEdit: mode === 'frontend' ? () => { } : () => onEdit(child),
            onDelete: mode === 'frontend' ? () => { } : () => handleDeleteChild(child.id),
            hoveredComponentId,
            setHoveredComponentId,
            themeSettings,
            cartItems,
            cartTotal,
            mode,
            companyId
        };

        switch (child.type) {
            case 'cartItems':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={() => 'Lista de productos'}
                    >
                        <CartItemsComponent
                            key={child.id}
                            {...commonProps}
                            onUpdateQuantity={updateQuantity}
                            onRemoveItem={removeItem}
                        />
                    </ComponentWithHover>
                );
            case 'cartSummary':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={() => 'Resumen del carrito'}
                    >
                        <CartSummaryComponent
                            key={child.id}
                            {...commonProps}
                            automaticDiscounts={automaticDiscountsRef.current}
                        />
                    </ComponentWithHover>
                );
            default:
                return null;
        }
    };

    return (
        <div style={containerStyles}>
            <div style={layoutStyles}>
                {displayChildren.map(renderChild)}
            </div>
        </div>
    );
};

export default CartComponent;