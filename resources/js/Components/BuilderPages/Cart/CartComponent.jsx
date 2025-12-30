// CartComponent.jsx - VERSIÓN CORREGIDA PARA USAR DATOS REALES
import React, { useState, useEffect } from 'react';
import CartItemsComponent from './CartItemsComponent';
import CartSummaryComponent from './CartSummaryComponent';
import ComponentWithHover from '../ComponentWithHover';
import cartHelper from '@/Helper/cartHelper'; // Asegúrate de que este helper existe
import HeadingComponent from '../HeadingComponent';

const CartComponent = ({
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
    mode = 'builder' // 'builder' o 'frontend'
}) => {
    const customStyles = comp.styles || {};
    const cartConfig = comp.content || {};

    const children = cartConfig.children || [];

    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(mode === 'frontend');

    // Cargar datos del carrito según el modo
    useEffect(() => {
        if (mode === 'frontend' && companyId) {
            // Modo frontend: cargar del carrito real usando cartHelper
            setIsLoading(true);
            try {
                const cart = cartHelper.getCart(companyId);

                // Si no hay carrito, mostrar vacío
                if (!cart || cart.length === 0) {
                    setCartItems([]);
                    setCartTotal(0);
                    setIsLoading(false);
                    return;
                }

                // Mapear los items del carrito a la estructura esperada
                const formattedItems = cart.map((item, index) => {
                    // Buscar el producto correspondiente en la lista de productos
                    const product = products.find(p => p.id === item.productId);

                    // Para combinaciones, encontrar la combinación específica
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

                    // Obtener el stock
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
                        quantity: item.quantity || 1,
                        combination: combination,
                        image: item.image || (product && product.media && product.media[0]
                            ? product.media[0].original_url
                            : 'https://picsum.photos/80'),
                        stock: stock
                    };
                });

                setCartItems(formattedItems);
                const total = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                setCartTotal(total);
            } catch (error) {
                console.error('Error loading cart:', error);
                setCartItems([]);
                setCartTotal(0);
            } finally {
                setIsLoading(false);
            }
        } else if (isPreview || products) {
            // Modo builder/preview: usar datos simulados
            const simulatedItems = [
                {
                    id: 1,
                    product_id: 3,
                    name: 'Camisa azul',
                    price: 13.00,
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
                    stock: 12
                },
                {
                    id: 2,
                    product_id: 2,
                    name: 'Pantalon',
                    price: 4.00,
                    quantity: 1,
                    combination: null,
                    image: 'https://picsum.photos/80',
                    stock: 9
                }
            ];
            setCartItems(simulatedItems);
            setCartTotal(simulatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
            setIsLoading(false);
        }
    }, [isPreview, products, companyId, mode]);

    // Funciones para manejar el carrito
    const updateQuantity = (itemId, newQuantity) => {
        const updatedItems = cartItems.map(item =>
            item.id === itemId
                ? { ...item, quantity: Math.max(1, newQuantity) }
                : item
        );

        setCartItems(updatedItems);
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);

        if (mode === 'frontend') {
            // Actualizar en el carrito real
            const item = cartItems.find(i => i.id === itemId);
            if (item) {
                cartHelper.updateItemQuantity(companyId, item.product_id, item.combination?.id, newQuantity);
            }
        }
    };

    const removeItem = (itemId) => {
        const itemToRemove = cartItems.find(i => i.id === itemId);
        const updatedItems = cartItems.filter(item => item.id !== itemId);

        setCartItems(updatedItems);
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);

        if (mode === 'frontend' && itemToRemove) {
            // Eliminar del carrito real
            cartHelper.removeItem(companyId, itemToRemove.product_id, itemToRemove.combination?.id);
        }
    };

    // Obtener estilos del layout
    const layoutType = customStyles.layoutType || 'grid';
    const paddingTop = customStyles.paddingTop || '20px';
    const paddingRight = customStyles.paddingRight || '20px';
    const paddingBottom = customStyles.paddingBottom || '20px';
    const paddingLeft = customStyles.paddingLeft || '20px';
    const backgroundColor = customStyles.backgroundColor || '#ffffff';
    const maxWidth = '100%';
    const gap = customStyles.gap || '40px';

    const [isMobile, setIsMobile] = useState(false);

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
        // En móvil, forzar columna sin importar el layout configurado
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

    // Si no hay hijos en modo frontend, usar configuración por defecto
    const getDisplayChildren = () => {
        if (mode === 'frontend' && children.length === 0) {
            // Configuración por defecto para frontend - SOLO SUBTOTAL Y TOTAL
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
                        showShippingNote: true // Nota opcional sobre envío
                    }
                }
            ];
        }
        return children;
    };

    const displayChildren = getDisplayChildren();

    // Renderizar según el modo
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
            mode
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
                        getComponentTypeName={() => 'Lista de productos'}
                    >

                    <CartSummaryComponent
                        key={child.id}
                        {...commonProps}
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