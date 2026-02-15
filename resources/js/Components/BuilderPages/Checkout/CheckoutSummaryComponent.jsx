// components/BuilderPages/Checkout/CheckoutSummaryComponent.jsx - VERSIÓN ACTUALIZADA CON SOPORTE PARA REFERENCIAS AL TEMA
import React from 'react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const CheckoutSummaryComponent = ({
    comp,
    getStyles,
    cartItems,
    cartTotal,
    shipping,
    tax,
    giftCardAmount,
    orderTotal,
    themeSettings,
    appliedGiftCard,
    mode = 'builder',
    automaticDiscountsTotal = 0,
    taxDetails = [],
    appliedTheme
}) => {
    const { settings } = usePage().props;
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados del componente
    const rawStyles = comp.styles || {};
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    // Resolver contenido del componente
    const rawContent = comp.content || {};
    const content = {};
    Object.keys(rawContent).forEach(key => {
        content[key] = resolveValue(rawContent[key]);
    });

    // Datos de ejemplo para modo builder (actualizados con descuentos)
    const exampleCartItems = [
        {
            id: '1_simple',
            product_id: 1,
            name: 'Traje de baño',
            price: 10.00,
            originalPrice: 15.00,
            quantity: 2,
            hasDirectDiscount: true,
            discountAmount: 10.00,
            discountType: 'direct_discount',
            image: 'https://picsum.photos/150',
            stock: 10,
            taxRate: 8.00,
            taxName: 'TaxTest',
            taxAmount: 1.60
        },
        {
            id: '2_simple',
            product_id: 4,
            name: 'Camisa azul',
            price: 6.00,
            originalPrice: 8.00,
            quantity: 1,
            hasDirectDiscount: false,
            automaticDiscount: {
                id: 2,
                name: 'auto',
                discount_type: 'fixed_amount',
                value: '2.00'
            },
            discountAmount: 2.00,
            discountType: 'product_automatic',
            image: 'https://picsum.photos/151',
            stock: 5,
            taxRate: 16.00,
            taxName: 'IVA',
            taxAmount: 0.96
        }
    ];

    const exampleCartTotal = 26.00;
    const exampleOriginalTotal = 38.00;
    const exampleAutomaticDiscounts = 12.00;
    const exampleShipping = 50.00;
    const exampleTax = 2.56;
    const exampleTaxDetails = [
        { name: 'TaxTest', rate: '8%', amount: 1.60 },
        { name: 'IVA', rate: '16%', amount: 0.96 }
    ];
    const exampleOrderTotal = 78.56;

    // Asegurar que taxDetails siempre sea un array
    const safeTaxDetails = Array.isArray(taxDetails) ? taxDetails : [];

    const displayCartItems = mode === 'builder' ? exampleCartItems : cartItems;
    const displayCartTotal = mode === 'builder' ? exampleCartTotal : cartTotal;
    const displayOriginalTotal = mode === 'builder' ? exampleOriginalTotal :
        cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const displayAutomaticDiscounts = mode === 'builder' ? exampleAutomaticDiscounts : automaticDiscountsTotal;
    const displayShipping = mode === 'builder' ? exampleShipping : shipping;
    const displayTax = mode === 'builder' ? exampleTax : tax;
    const displayTaxDetails = mode === 'builder' ? exampleTaxDetails : safeTaxDetails;
    const displayOrderTotal = mode === 'builder' ? exampleOrderTotal : orderTotal;

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: resolveValue(styles.backgroundColor || themeWithDefaults.background),
        paddingTop: withUnit(styles.paddingTop || '24px'),
        paddingRight: withUnit(styles.paddingRight || '24px'),
        paddingBottom: withUnit(styles.paddingBottom || '24px'),
        paddingLeft: withUnit(styles.paddingLeft || '24px'),
        borderRadius: withUnit(styles.borderRadius || themeWithDefaults.border_radius_medium || '8px'),
        border: `1px solid ${resolveValue(themeWithDefaults.borders)}`,
    };

    const titleStyles = {
        fontSize: withUnit(styles.titleSize || themeWithDefaults.heading3_fontSize || '20px', styles.titleSizeUnit || 'px'),
        color: resolveValue(styles.titleColor || themeWithDefaults.heading),
        fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme),
        marginBottom: '20px',
        fontWeight: '600',
    };

    // Función para renderizar información de descuento por producto
    const renderDiscountInfo = (item) => {
        if (!item.originalPrice || item.originalPrice === item.price) return null;

        const discountAmount = item.discountAmount || (item.originalPrice - item.price) * item.quantity;
        const discountPercentage = Math.round((1 - item.price / item.originalPrice) * 100);

        return (
            <div className="mt-1">
                <div className="text-xs" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                    {item.discountType === 'direct_discount' ? 'Descuento directo' :
                        item.discountType === 'product_automatic' ? 'Descuento automático' :
                            'Descuento aplicado'}
                    : {settings?.currency ? (
                        <>-<CurrencyDisplay currency={settings.currency} amount={discountAmount} /></>
                    ) : (
                        `-$${discountAmount.toFixed(2)}`
                    )}
                </div>
                <div className="text-xs" style={{ color: resolveValue(themeWithDefaults.text) }}>
                    {discountPercentage}% de descuento
                </div>
            </div>
        );
    };

    const calculatedSubtotal = cartItems.reduce((sum, item) =>
        sum + (item.price * item.quantity), 0);

    const originalSubtotal = cartItems.reduce((sum, item) =>
        sum + (item.originalPrice * item.quantity), 0);

    return (
        <div style={containerStyles}>
            <h2 style={titleStyles}>
                {content.title || 'Resumen del Pedido'}
            </h2>

            {/* Productos con descuentos */}
            <div className="space-y-4">
                {displayCartItems.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-medium mb-3" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                            Productos
                        </h3>
                        <div className="space-y-4">
                            {displayCartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-start border-b pb-4"
                                    style={{ borderColor: resolveValue(themeWithDefaults.borders) }}>
                                    <div className="flex-1">
                                        <div className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                            {item.name}
                                        </div>
                                        {item.combination_name && (
                                            <div className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                {item.combination_name}
                                            </div>
                                        )}

                                        {/* Precios con/sin descuento */}
                                        <div className="text-sm mt-1">
                                            <div className="flex items-center gap-2">
                                                <span style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                    {item.quantity} ×
                                                    {item.originalPrice > item.price ? (
                                                        <>
                                                            <span className="line-through ml-1" style={{ color: resolveValue(themeWithDefaults.text), opacity: '0.6' }}>
                                                                {settings?.currency ? (
                                                                    <CurrencyDisplay currency={settings.currency} amount={item.originalPrice} />
                                                                ) : (
                                                                    `$${item.originalPrice.toFixed(2)}`
                                                                )}
                                                            </span>
                                                            <span className="ml-1 font-medium" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                                                                {settings?.currency ? (
                                                                    <CurrencyDisplay currency={settings.currency} amount={item.price} />
                                                                ) : (
                                                                    `$${item.price.toFixed(2)}`
                                                                )}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="ml-1">
                                                            {settings?.currency ? (
                                                                <CurrencyDisplay currency={settings.currency} amount={item.price} />
                                                            ) : (
                                                                `$${item.price.toFixed(2)}`
                                                            )}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            {item.manualDiscount && (
                                                <div className="mt-1">
                                                    <div className="text-xs font-medium" style={{ color: resolveValue(themeWithDefaults.links) }}>
                                                        ✓ Descuento por código: {item.manualDiscount.code}
                                                    </div>
                                                    <div className="text-xs" style={{ color: resolveValue(themeWithDefaults.links) }}>
                                                        {item.manualDiscount.discount_type === 'percentage'
                                                            ? `${item.manualDiscount.value}% de descuento aplicado`
                                                            : `$${item.manualDiscount.value} de descuento aplicado`}
                                                    </div>
                                                </div>
                                            )}
                                            {renderDiscountInfo(item)}
                                            {/* Mostrar impuesto del producto */}
                                            {item.taxRate > 0 && (
                                                <div className="text-xs mt-1" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                    Impuesto ({item.taxName || `${item.taxRate}%`}):
                                                    {settings?.currency ? (
                                                        <CurrencyDisplay currency={settings.currency} amount={(item.price * item.quantity) * (item.taxRate / 100)} />
                                                    ) : (
                                                        `$${((item.price * item.quantity) * (item.taxRate / 100)).toFixed(2)}`
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                        {settings?.currency ? (
                                            <CurrencyDisplay currency={settings.currency} amount={item.price * item.quantity} />
                                        ) : (
                                            `$${(item.price * item.quantity).toFixed(2)}`
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Totales con desglose de descuentos */}
                <div className="space-y-2">
                    {/* Subtotal original (sin descuentos) */}
                    <div className="flex justify-between">
                        <span style={{ color: resolveValue(themeWithDefaults.text) }}>Subtotal original</span>
                        <span className="line-through" style={{ color: resolveValue(themeWithDefaults.text), opacity: '0.6' }}>
                            {settings?.currency ? (
                                <CurrencyDisplay currency={settings.currency} amount={originalSubtotal} />
                            ) : (
                                `$${originalSubtotal.toFixed(2)}`
                            )}
                        </span>
                    </div>

                    {/* Descuentos automáticos */}
                    {displayAutomaticDiscounts > 0 && (
                        <div className="flex justify-between" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                            <span>Descuentos automáticos</span>
                            <span>
                                {settings?.currency ? (
                                    <>-<CurrencyDisplay currency={settings.currency} amount={displayAutomaticDiscounts} /></>
                                ) : (
                                    `-$${displayAutomaticDiscounts.toFixed(2)}`
                                )}
                            </span>
                        </div>
                    )}

                    {/* Gift Card aplicada */}
                    {appliedGiftCard && giftCardAmount > 0 && (
                        <div className="flex justify-between">
                            <span style={{ color: resolveValue(themeWithDefaults.text) }}>
                                Gift Card ({appliedGiftCard.code})
                            </span>
                            <span className="font-medium" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                                {settings?.currency ? (
                                    <>-<CurrencyDisplay currency={settings.currency} amount={giftCardAmount} /></>
                                ) : (
                                    `-$${giftCardAmount.toFixed(2)}`
                                )}
                            </span>
                        </div>
                    )}

                    {/* Mostrar saldo restante de la gift card */}
                    {appliedGiftCard && giftCardAmount > 0 && (
                        <div className="text-xs italic mt-1" style={{ color: resolveValue(themeWithDefaults.text) }}>
                            Saldo restante en {appliedGiftCard.code}:
                            {settings?.currency ? (
                                <CurrencyDisplay currency={settings.currency} amount={parseFloat(appliedGiftCard.current_balance) - giftCardAmount} />
                            ) : (
                                `$${(parseFloat(appliedGiftCard.current_balance) - giftCardAmount).toFixed(2)}`
                            )}
                        </div>
                    )}

                    <div className="flex justify-between font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                        <span>Subtotal</span>
                        <span>
                            {settings?.currency ? (
                                <CurrencyDisplay currency={settings.currency} amount={calculatedSubtotal} />
                            ) : (
                                `$${calculatedSubtotal.toFixed(2)}`
                            )}
                        </span>
                    </div>

                    {/* Envío */}
                    {content.showShipping !== false && displayShipping > 0 && (
                        <div className="flex justify-between">
                            <span style={{ color: resolveValue(themeWithDefaults.text) }}>Envío</span>
                            <span className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                {settings?.currency ? (
                                    <CurrencyDisplay currency={settings.currency} amount={displayShipping} />
                                ) : (
                                    `$${displayShipping.toFixed(2)}`
                                )}
                            </span>
                        </div>
                    )}

                    {/* Impuestos */}
                    {content.showTax !== false && displayTax > 0 && (
                        <div className="space-y-1">
                            {displayTaxDetails && displayTaxDetails.length > 0 ? (
                                <>
                                    {displayTaxDetails.map((taxDetail, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                {taxDetail.name} ({taxDetail.rate})
                                            </span>
                                            <span className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                                {settings?.currency ? (
                                                    <CurrencyDisplay currency={settings.currency} amount={taxDetail.amount} />
                                                ) : (
                                                    `$${taxDetail.amount.toFixed(2)}`
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                    {displayTaxDetails.length > 1 && (
                                        <div className="flex justify-between border-t pt-1" style={{ borderColor: resolveValue(themeWithDefaults.borders) }}>
                                            <span className="font-medium" style={{ color: resolveValue(themeWithDefaults.text) }}>Total impuestos</span>
                                            <span className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                                {settings?.currency ? (
                                                    <CurrencyDisplay currency={settings.currency} amount={displayTax} />
                                                ) : (
                                                    `$${displayTax.toFixed(2)}`
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex justify-between">
                                    <span style={{ color: resolveValue(themeWithDefaults.text) }}>Impuestos</span>
                                    <span className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                        {settings?.currency ? (
                                            <CurrencyDisplay currency={settings.currency} amount={displayTax} />
                                        ) : (
                                            `$${displayTax.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Total */}
                    {content.showOrderTotal !== false && (
                        <>
                            <hr className="my-3" style={{ borderColor: resolveValue(themeWithDefaults.borders) }} />
                            <div className="flex justify-between font-bold text-lg" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                <span>Total</span>
                                <span>
                                    {settings?.currency ? (
                                        <CurrencyDisplay currency={settings.currency} amount={displayOrderTotal} />
                                    ) : (
                                        `$${displayOrderTotal.toFixed(2)}`
                                    )}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Resumen de ahorros */}
            {displayAutomaticDiscounts > 0 && (
                <div
                    className="mt-6 p-3 rounded-lg"
                    style={{
                        backgroundColor: resolveValue(themeWithDefaults.success_color + '20'), // 20% opacidad
                        border: `1px solid ${resolveValue(themeWithDefaults.success_color)}`,
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: resolveValue(themeWithDefaults.success_color) }}></div>
                        <span className="text-sm font-medium" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                            ¡Has ahorrado {settings?.currency ? (
                                <CurrencyDisplay currency={settings.currency} amount={displayAutomaticDiscounts} />
                            ) : (
                                `$${displayAutomaticDiscounts.toFixed(2)}`
                            )} con descuentos automáticos!
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutSummaryComponent;