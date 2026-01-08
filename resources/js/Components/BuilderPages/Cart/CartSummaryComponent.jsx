// CartSummaryComponent.jsx - VERSIÓN COMPLETA CON DESCUENTOS
import React from 'react';
import cartHelper from '@/Helper/cartHelper';

const CartSummaryComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    cartItems,
    cartTotal,
    themeSettings,
    mode = 'builder',
    automaticDiscounts = [],
    companyId
}) => {
    const styles = comp.styles || {};
    const content = comp.content || {};

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: styles.backgroundColor || '#f9fafb',
        padding: `${styles.paddingTop || '20px'} ${styles.paddingRight || '20px'} ${styles.paddingBottom || '20px'} ${styles.paddingLeft || '20px'}`,
        borderRadius: styles.borderRadius || '12px',
        border: `${styles.borderWidth || '0'} ${styles.borderStyle || 'solid'} ${styles.borderColor || '#000000'}`,
    };

    const handleClick = () => {
        if (mode === 'builder' && !isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Obtener resumen del carrito con descuentos automáticos
    const getCartSummary = () => {
        if (mode === 'frontend' && companyId) {
            // En modo frontend, usar cartHelper para calcular con descuentos automáticos
            return cartHelper.getCartSummary(companyId, null, automaticDiscounts);
        }
        
        // En modo builder, calcular manualmente
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const originalSubtotal = cartItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
        const automaticDiscountTotal = originalSubtotal - subtotal;
        
        return {
            subtotal: subtotal,
            originalSubtotal: originalSubtotal,
            taxTotal: 0,
            automaticDiscountTotal: automaticDiscountTotal,
            manualDiscountTotal: 0,
            totalAmount: subtotal,
            itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        };
    };

    const cartSummary = getCartSummary();

    // Estilos de fuente del tema
    const getFontStyles = (type = 'normal') => {
        const theme = themeSettings || {};

        if (type === 'title') {
            return {
                fontFamily: theme?.heading_font || "'Inter', sans-serif",
                fontSize: styles.titleSize || '20px',
                fontWeight: styles.titleWeight || 'bold',
                color: styles.titleColor || (theme?.foreground ? `hsl(${theme.foreground})` : '#000000'),
            };
        }

        if (type === 'total') {
            return {
                fontFamily: theme?.heading_font || "'Inter', sans-serif",
                fontSize: styles.totalFontSize || '24px',
                fontWeight: 'bold',
                color: styles.totalColor || (theme?.primary ? `hsl(${theme.primary})` : '#1d4ed8'),
            };
        }

        if (type === 'discount') {
            return {
                fontFamily: theme?.body_font || "'Inter', sans-serif",
                fontSize: styles.fontSize || '14px',
                color: '#059669',
                fontWeight: '500'
            };
        }

        return {
            fontFamily: theme?.body_font || "'Inter', sans-serif",
            fontSize: styles.fontSize || '14px',
            color: styles.color || (theme?.text ? `hsl(${theme.text})` : '#374151'),
        };
    };

    const titleStyles = getFontStyles('title');
    const totalStyles = getFontStyles('total');
    const discountStyles = getFontStyles('discount');
    const textStyles = getFontStyles();

    return (
        <div
            style={containerStyles}
            onClick={handleClick}
            className={mode === 'builder' && !isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            <h2 style={{ ...titleStyles, marginBottom: '20px' }}>
                {content.title || 'Resumen del pedido'}
            </h2>

            <div className="space-y-3">
                {/* Subtotal original (solo si hay descuentos) */}
                {cartSummary.automaticDiscountTotal > 0 && (
                    <div className="flex justify-between" style={textStyles}>
                        <span>Subtotal original</span>
                        <span className="line-through text-gray-500">
                            ${cartSummary.originalSubtotal.toFixed(2)}
                        </span>
                    </div>
                )}

                {/* Descuentos automáticos aplicados */}
                {cartSummary.automaticDiscountTotal > 0 && (
                    <div className="flex justify-between" style={discountStyles}>
                        <span>Descuentos automáticos</span>
                        <span>-${cartSummary.automaticDiscountTotal.toFixed(2)}</span>
                    </div>
                )}

                {/* Subtotal */}
                <div className="flex justify-between" style={textStyles}>
                    <span>Subtotal</span>
                    <span>${cartSummary.subtotal.toFixed(2)}</span>
                </div>

                {/* Impuestos */}
                {cartSummary.taxTotal > 0 && (
                    <div className="flex justify-between" style={textStyles}>
                        <span>Impuestos</span>
                        <span>${cartSummary.taxTotal.toFixed(2)}</span>
                    </div>
                )}

                {/* Descuentos manuales */}
                {cartSummary.manualDiscountTotal > 0 && (
                    <div className="flex justify-between" style={discountStyles}>
                        <span>Descuento por código</span>
                        <span>-${cartSummary.manualDiscountTotal.toFixed(2)}</span>
                    </div>
                )}

                {/* Línea divisoria */}
                {(content.showDivider !== false) && (
                    <hr className="my-4" style={{ borderColor: styles.dividerColor || '#e5e7eb' }} />
                )}

                {/* Total */}
                <div className="flex justify-between" style={{ ...totalStyles, marginTop: '16px' }}>
                    <span>Total</span>
                    <span>${cartSummary.totalAmount.toFixed(2)}</span>
                </div>

                {/* Botón de checkout */}
                <button
                    className="w-full mt-6 py-3 rounded-md font-medium transition-colors"
                    style={{
                        backgroundColor: themeSettings?.primary ? `hsl(${themeSettings.primary})` : '#3b82f6',
                        color: '#ffffff',
                        fontFamily: themeSettings?.button_font_family || 'inherit',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (mode === 'frontend') {
                            window.location.href = '/checkout';
                        }
                    }}
                >
                    {content.checkoutButtonText || 'Proceder al pago'}
                </button>

                {/* Texto informativo */}
                {content.showShippingNote && (
                    <p className="text-xs text-center mt-4" style={{ color: '#6b7280' }}>
                        Los gastos de envío se calcularán en el checkout
                    </p>
                )}

                {/* Información de ahorro */}
                {cartSummary.automaticDiscountTotal > 0 && (
                    <div className="mt-4 p-3 rounded-md" style={{ 
                        backgroundColor: 'rgba(5, 150, 105, 0.1)',
                        border: '1px solid rgba(5, 150, 105, 0.2)'
                    }}>
                        <p className="text-sm text-center" style={{ color: '#059669' }}>
                            ¡Has ahorrado ${cartSummary.automaticDiscountTotal.toFixed(2)} con descuentos automáticos!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSummaryComponent;