import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import cartHelper from '@/Helper/cartHelper';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';

const FrontendCartComponent = ({ comp, themeSettings, companyId }) => {
    const { settings } = usePage().props;
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cartTotal, setCartTotal] = useState(0);

    const styles = comp.styles || {};
    const content = comp.content || {};

     const loadCart = () => {
        if (!companyId) {
            setIsLoading(false);
            return;
        }
        
        try {
            const cart = cartHelper.getCart(companyId);
            setCartItems(cart);
            
            const total = cart.reduce((sum, item) => 
                sum + (parseFloat(item.price) * item.quantity), 0
            );
            setCartTotal(total);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        loadCart();
        
        // Escuchar cambios en el carrito de este tenant
        const handleCartUpdated = (e) => {
            if (e.detail.companyId === companyId) {
                loadCart();
            }
        };
        
        const handleStorageChange = (e) => {
            if (e.key === cartHelper.getCartKey(companyId)) {
                loadCart();
            }
        };
        
        window.addEventListener('cartUpdated', handleCartUpdated);
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdated);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [companyId]);

    const updateQuantity = (productId, combinationId, newQuantity) => {
        if (newQuantity < 1) return;
        
        const updatedCart = cartItems.map(item => {
            if (item.productId === productId && item.combinationId === combinationId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        
        setCartItems(updatedCart);
        localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
        
        // Recalcular total
        const total = updatedCart.reduce((sum, item) => 
            sum + (parseFloat(item.price) * item.quantity), 0
        );
        setCartTotal(total);
    };

    const removeItem = (productId, combinationId) => {
        const updatedCart = cartItems.filter(item => 
            !(item.productId === productId && item.combinationId === combinationId)
        );
        
        setCartItems(updatedCart);
        localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
        
        // Recalcular total
        const total = updatedCart.reduce((sum, item) => 
            sum + (parseFloat(item.price) * item.quantity), 0
        );
        setCartTotal(total);
    };

    const handleCheckout = () => {
        // Aquí puedes redirigir a la página de checkout
        alert('Redirigiendo al checkout...');
        // router.visit('/checkout');
    };

    const containerStyles = {
        paddingTop: styles.paddingTop || '20px',
        paddingRight: styles.paddingRight || '20px',
        paddingBottom: styles.paddingBottom || '20px',
        paddingLeft: styles.paddingLeft || '20px',
        backgroundColor: styles.backgroundColor || '#ffffff',
        borderRadius: styles.borderRadius || '8px',
        boxShadow: themeSettings?.shadows ? `0 4px 6px -1px rgba(0, 0, 0, ${themeSettings.shadows})` : '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: styles.maxWidth || '100%',
        margin: '0 auto',
    };

    if (isLoading) {
        return (
            <div style={containerStyles} className="shopping-cart">
                <div className="text-center py-8">
                    <p>Cargando carrito...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyles} className="shopping-cart">
            <h2 
                style={{
                    textAlign: styles.titleAlignment || 'center',
                    color: styles.titleColor || (themeSettings?.heading ? `hsl(${themeSettings.heading})` : '#000000'),
                    fontSize: styles.titleSize || themeSettings?.heading2_fontSize || '24px',
                    fontWeight: styles.titleWeight || 'bold',
                    fontFamily: themeSettings?.heading_font_family || 'inherit',
                    marginBottom: '20px'
                }}
            >
                {content.title || 'Tu Carrito de Compras'}
            </h2>

            {cartItems.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4" style={{
                        fontFamily: themeSettings?.body_font || 'inherit',
                    }}>
                        {content.emptyCartMessage || 'Tu carrito está vacío'}
                    </p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        style={{
                            backgroundColor: themeSettings?.primary_button_background ? `hsl(${themeSettings.primary_button_background})` : '#007bff',
                            color: themeSettings?.primary_button_text ? `hsl(${themeSettings.primary_button_text})` : '#ffffff',
                            padding: '10px 20px',
                            borderRadius: themeSettings?.button_border_radius || '4px',
                            fontFamily: themeSettings?.button_font_family || 'inherit',
                        }}
                        className="hover:opacity-90 transition-opacity"
                    >
                        {content.continueShoppingText || 'Seguir comprando'}
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={`${item.productId}-${item.combinationId || 'simple'}`} 
                                 className="flex items-center border-b pb-4"
                                 style={{
                                     borderColor: themeSettings?.borders ? `hsl(${themeSettings.borders})` : '#e5e7eb',
                                 }}>
                                {/* Imagen del producto */}
                                <div className="w-20 h-20 mr-4 flex-shrink-0">
                                    <img 
                                        src={item.image || 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png'} 
                                        alt={item.productName}
                                        className="w-full h-full object-cover rounded"
                                        style={{
                                            borderRadius: themeSettings?.border_radius || '4px',
                                        }}
                                    />
                                </div>
                                
                                <div className="flex-1">
                                    <h4 className="font-medium" style={{
                                        color: themeSettings?.heading ? `hsl(${themeSettings.heading})` : '#000000',
                                        fontFamily: themeSettings?.heading_font_family || 'inherit',
                                    }}>
                                        {item.productName}
                                    </h4>
                                    
                                    {item.combinationName && (
                                        <p className="text-sm" style={{
                                            color: themeSettings?.text ? `hsl(${themeSettings.text})` : '#666666',
                                            fontFamily: themeSettings?.body_font || 'inherit',
                                        }}>
                                            {item.combinationName}
                                        </p>
                                    )}
                                    
                                    <p className="text-gray-600" style={{
                                        fontFamily: themeSettings?.body_font || 'inherit',
                                    }}>
                                        {settings?.currency ? (
                                            <><CurrencyDisplay currency={settings.currency} amount={parseFloat(item.price)} /> c/u</>
                                        ) : (
                                            `$${parseFloat(item.price).toFixed(2)} c/u`
                                        )}
                                    </p>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    {/* Selector de cantidad */}
                                    <div className="flex items-center border rounded" style={{
                                        borderColor: themeSettings?.borders ? `hsl(${themeSettings.borders})` : '#d1d5db',
                                        borderRadius: themeSettings?.border_radius || '4px',
                                    }}>
                                        <button 
                                            className="px-3 py-1 hover:bg-gray-100"
                                            onClick={() => updateQuantity(item.productId, item.combinationId, item.quantity - 1)}
                                            style={{
                                                color: themeSettings?.text ? `hsl(${themeSettings.text})` : '#374151',
                                                fontFamily: themeSettings?.button_font_family || 'inherit',
                                            }}
                                        >
                                            -
                                        </button>
                                        <span className="px-3 py-1" style={{
                                            fontFamily: themeSettings?.body_font || 'inherit',
                                        }}>
                                            {item.quantity}
                                        </span>
                                        <button 
                                            className="px-3 py-1 hover:bg-gray-100"
                                            onClick={() => updateQuantity(item.productId, item.combinationId, item.quantity + 1)}
                                            disabled={item.quantity >= (item.stock || 99)}
                                            style={{
                                                color: themeSettings?.text ? `hsl(${themeSettings.text})` : '#374151',
                                                fontFamily: themeSettings?.button_font_family || 'inherit',
                                                opacity: item.quantity >= (item.stock || 99) ? 0.5 : 1,
                                                cursor: item.quantity >= (item.stock || 99) ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    
                                    <button 
                                        onClick={() => removeItem(item.productId, item.combinationId)}
                                        className="text-red-500 hover:text-red-700"
                                        style={{
                                            fontFamily: themeSettings?.body_font || 'inherit',
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen del carrito */}
                    <div className="mt-6 pt-4 border-t" style={{
                        borderColor: themeSettings?.borders ? `hsl(${themeSettings.borders})` : '#e5e7eb',
                    }}>
                        <div className="flex justify-between mb-2" style={{
                            fontFamily: themeSettings?.body_font || 'inherit',
                        }}>
                            <span>Subtotal:</span>
                            <span>
                                {settings?.currency ? (
                                    <CurrencyDisplay currency={settings.currency} amount={cartTotal} />
                                ) : (
                                    `$${cartTotal.toFixed(2)}`
                                )}
                            </span>
                        </div>
                        
                        {/* Aquí puedes agregar impuestos, envío, etc. si lo necesitas */}
                        
                        <div className="flex justify-between font-semibold text-lg mt-4" style={{
                            fontFamily: themeSettings?.heading_font_family || 'inherit',
                            color: themeSettings?.primary ? `hsl(${themeSettings.primary})` : '#007bff',
                        }}>
                            <span>Total:</span>
                            <span>
                                {settings?.currency ? (
                                    <CurrencyDisplay currency={settings.currency} amount={cartTotal} />
                                ) : (
                                    `$${cartTotal.toFixed(2)}`
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Botón de checkout */}
                    <div className="mt-6">
                        <button 
                            onClick={handleCheckout}
                            style={{
                                backgroundColor: themeSettings?.primary_button_background ? `hsl(${themeSettings.primary_button_background})` : '#007bff',
                                color: themeSettings?.primary_button_text ? `hsl(${themeSettings.primary_button_text})` : '#ffffff',
                                padding: '12px 24px',
                                borderRadius: themeSettings?.button_border_radius || '6px',
                                fontFamily: themeSettings?.button_font_family || 'inherit',
                                fontWeight: '600',
                                width: '100%',
                            }}
                            className="hover:opacity-90 transition-opacity"
                        >
                            {content.checkoutButtonText || 'Proceder al pago'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default FrontendCartComponent;