// CartSummaryComponent.jsx - VERSIÓN SIMPLIFICADA PARA CARRITO
import React from 'react';

const CartSummaryComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    cartItems,
    cartTotal,
    themeSettings,
    mode = 'builder'
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

    // Solo calculamos el subtotal, sin envío, impuestos o descuentos
    const subtotal = cartTotal;
    const total = subtotal; // En el carrito, el total es igual al subtotal

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

        return {
            fontFamily: theme?.body_font || "'Inter', sans-serif",
            fontSize: styles.fontSize || '14px',
            color: styles.color || (theme?.text ? `hsl(${theme.text})` : '#374151'),
        };
    };

    const titleStyles = getFontStyles('title');
    const totalStyles = getFontStyles('total');
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
                {/* Subtotal */}
                <div className="flex justify-between" style={textStyles}>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                {/* Línea divisoria - solo si se muestra */}
                {(content.showDivider !== false) && (
                    <hr className="my-4" style={{ borderColor: styles.dividerColor || '#e5e7eb' }} />
                )}

                {/* Total */}
                <div className="flex justify-between" style={{ ...totalStyles, marginTop: '16px' }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
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
                            // Redirigir a la página de checkout
                            window.location.href = '/checkout';
                        }
                    }}
                >
                    {content.checkoutButtonText || 'Proceder al pago'}
                </button>

                {/* Texto informativo opcional */}
                {content.showShippingNote && (
                    <p className="text-xs text-center mt-4" style={{ color: '#6b7280' }}>
                        Los gastos de envío se calcularán en el checkout
                    </p>
                )}
            </div>
        </div>
    );
};

export default CartSummaryComponent;