// CartSummaryComponent.jsx - VERSIÓN COMPLETA CON DESCUENTOS E IMPUESTOS
import React from 'react';
import cartHelper from '@/Helper/cartHelper';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, getButtonStyles } from '@/utils/themeUtils';

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
    companyId,
    appliedTheme
}) => {
    const { settings } = usePage().props;
    const styles = comp.styles || {};
    const content = comp.content || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    console.log(styles)
    // console.log(content)
    // console.log(themeWithDefaults)
    // Obtener estilos del tema para cart
    const themeCartStyles = getComponentStyles(themeWithDefaults, 'cart', appliedTheme);
    // console.log(themeWithDefaults.background)

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: styles.backgroundColor || themeCartStyles.backgroundColor || themeWithDefaults.background,
        paddingTop: withUnit(styles.paddingTop || '20px'),
        paddingRight: withUnit(styles.paddingRight || '20px'),
        paddingBottom: withUnit(styles.paddingBottom || '20px'),
        paddingLeft: withUnit(styles.paddingLeft || '20px'),
        borderRadius: withUnit(styles.borderRadius || themeCartStyles.borderRadius || '12px'),
        borderStyle: styles.borderStyle || 'solid',
        borderWidth: withUnit(styles.borderWidth || '0'),
        borderColor: styles.borderColor || themeWithDefaults.borders,
    };

    const handleClick = () => {
        if (mode === 'builder' && !isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Obtener resumen del carrito con descuentos automáticos e impuestos
    const getCartSummary = () => {
        if (mode === 'frontend' && companyId) {
            // En modo frontend, usar cartHelper
            return cartHelper.getCartSummary(companyId, null, automaticDiscounts);
        }

        // En modo builder, calcular manualmente
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const originalSubtotal = cartItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
        const automaticDiscountTotal = originalSubtotal - subtotal;

        // Calcular impuestos por tipo
        const taxDetailsMap = {};
        let taxTotal = 0;

        cartItems.forEach(item => {
            if (item.taxRate && item.taxRate > 0) {
                const taxKey = item.taxName ? `${item.taxName}_${item.taxRate}` : `tax_${item.taxRate}`;
                if (!taxDetailsMap[taxKey]) {
                    taxDetailsMap[taxKey] = {
                        name: item.taxName || `Impuesto (${item.taxRate}%)`,
                        rate: `${item.taxRate}%`,
                        amount: 0
                    };
                }
                const itemTax = (item.price * item.quantity) * (item.taxRate / 100);
                taxDetailsMap[taxKey].amount += itemTax;
                taxTotal += itemTax;
            }
        });

        const taxDetails = Object.values(taxDetailsMap);

        return {
            subtotal: subtotal,
            originalSubtotal: originalSubtotal,
            taxTotal: taxTotal,
            taxDetails: taxDetails,
            automaticDiscountTotal: automaticDiscountTotal,
            manualDiscountTotal: 0,
            totalAmount: subtotal,
            itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        };
    };

    const cartSummary = getCartSummary();

    // Estilos de fuente del tema
    const getFontStyles = (type = 'normal') => {
        if (type === 'title') {
            const themeCartTitleStyles = getComponentStyles(themeWithDefaults, 'cart-title', appliedTheme);
            return {
                fontFamily: getResolvedFont(themeWithDefaults, 'heading_font'),
                fontSize: styles.titleSize || themeCartTitleStyles.fontSize || themeWithDefaults.heading3_fontSize || '20px',
                fontWeight: styles.titleWeight || themeWithDefaults.heading3_fontWeight || 'bold',
                color: styles.titleColor || themeCartTitleStyles.color || themeWithDefaults.heading,
            };
        }

        if (type === 'total') {
            return {
                fontFamily: getResolvedFont(themeWithDefaults, 'heading_font'),
                fontSize: withUnit(styles.totalFontSize || '24px', styles.totalFontSizeUnit || 'px'),
                fontWeight: 'bold',
                color: styles.totalColor || themeWithDefaults.links,
            };
        }

        if (type === 'discount') {
            return {
                fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
                fontSize: styles.fontSize || themeWithDefaults.paragraph_fontSize || '14px',
                color: '#059669',
                fontWeight: '500'
            };
        }

        return {
            fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
            fontSize: styles.fontSize || themeWithDefaults.paragraph_fontSize || '14px',
            color: styles.color || themeWithDefaults.text,
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
                            {settings?.currency ? (
                                <CurrencyDisplay currency={settings.currency} amount={cartSummary.originalSubtotal} />
                            ) : (
                                `$${cartSummary.originalSubtotal.toFixed(2)}`
                            )}
                        </span>
                    </div>
                )}

                {/* Descuentos automáticos aplicados */}
                {cartSummary.automaticDiscountTotal > 0 && (
                    <div className="flex justify-between" style={discountStyles}>
                        <span>Descuentos automáticos</span>
                        <span>
                            {settings?.currency ? (
                                <>-<CurrencyDisplay currency={settings.currency} amount={cartSummary.automaticDiscountTotal} /></>
                            ) : (
                                `-$${cartSummary.automaticDiscountTotal.toFixed(2)}`
                            )}
                        </span>
                    </div>
                )}

                {/* Subtotal */}
                <div className="flex justify-between" style={textStyles}>
                    <span>Subtotal</span>
                    <span>
                        {settings?.currency ? (
                            <CurrencyDisplay currency={settings.currency} amount={cartSummary.subtotal} />
                        ) : (
                            `$${cartSummary.subtotal.toFixed(2)}`
                        )}
                    </span>
                </div>

                {/* Impuestos */}
                {cartSummary.taxTotal > 0 && (
                    <div className="space-y-1">
                        {cartSummary.taxDetails && cartSummary.taxDetails.length > 0 ? (
                            cartSummary.taxDetails.map((tax, index) => (
                                <div key={index} className="flex justify-between" style={textStyles}>
                                    <span>{tax.name} ({tax.rate})</span>
                                    <span>
                                        {settings?.currency ? (
                                            <CurrencyDisplay currency={settings.currency} amount={tax.amount} />
                                        ) : (
                                            `$${tax.amount.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-between" style={textStyles}>
                                <span>Impuestos</span>
                                <span>
                                    {settings?.currency ? (
                                        <CurrencyDisplay currency={settings.currency} amount={cartSummary.taxTotal} />
                                    ) : (
                                        `$${cartSummary.taxTotal.toFixed(2)}`
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Descuentos manuales */}
                {cartSummary.manualDiscountTotal > 0 && (
                    <div className="flex justify-between" style={discountStyles}>
                        <span>Descuento por código</span>
                        <span>
                            {settings?.currency ? (
                                <>-<CurrencyDisplay currency={settings.currency} amount={cartSummary.manualDiscountTotal} /></>
                            ) : (
                                `-$${cartSummary.manualDiscountTotal.toFixed(2)}`
                            )}
                        </span>
                    </div>
                )}

                {/* Línea divisoria */}
                {(content.showDivider !== false) && (
                    <hr className="my-4" style={{ borderColor: styles.dividerColor || themeWithDefaults.borders }} />
                )}

                {/* Total */}
                <div className="flex justify-between" style={{ ...totalStyles, marginTop: '16px' }}>
                    <span>Total</span>
                    <span>
                        {settings?.currency ? (
                            <CurrencyDisplay currency={settings.currency} amount={cartSummary.totalAmount} />
                        ) : (
                            `$${cartSummary.totalAmount.toFixed(2)}`
                        )}
                    </span>
                </div>

                {/* Botón de checkout */}
                <button
                    className="w-full mt-6 py-3 rounded-md font-medium transition-colors"
                    style={{
                        ...getButtonStyles(themeWithDefaults, 'primary'),
                        fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
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
                            ¡Has ahorrado {settings?.currency ? (
                                <CurrencyDisplay currency={settings.currency} amount={cartSummary.automaticDiscountTotal} />
                            ) : (
                                `$${cartSummary.automaticDiscountTotal.toFixed(2)}`
                            )} con descuentos automáticos!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSummaryComponent;
