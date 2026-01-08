// components/BuilderPages/Checkout/CheckoutSummaryComponent.jsx - VERSIÓN ACTUALIZADA
import React from 'react';

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
    automaticDiscountsTotal = 0 // Nuevo prop para descuentos automáticos
}) => {
    const styles = comp.styles || {};
    const content = comp.content || {};

    // Datos de ejemplo para modo builder (actualizados con descuentos)
    const exampleCartItems = [
        {
            id: '1_simple',
            product_id: 1,
            name: 'Traje de baño',
            price: 10.00, // Precio CON descuento directo
            originalPrice: 15.00, // Precio original
            quantity: 2,
            hasDirectDiscount: true,
            discountAmount: 10.00, // (15-10)*2
            discountType: 'direct_discount',
            image: 'https://picsum.photos/150',
            stock: 10
        },
        {
            id: '2_simple',
            product_id: 4,
            name: 'Camisa azul',
            price: 6.00, // Precio CON descuento automático
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
            stock: 5
        }
    ];

    const exampleCartTotal = 26.00; // (10*2) + (6*1) = 20 + 6 = 26
    const exampleOriginalTotal = 38.00; // (15*2) + (8*1) = 30 + 8 = 38
    const exampleAutomaticDiscounts = 12.00; // 38 - 26 = 12
    const exampleShipping = 50.00;
    const exampleTax = 4.16; // 26 * 0.16
    const exampleOrderTotal = 80.16; // 26 + 50 + 4.16

    const displayCartItems = mode === 'builder' ? exampleCartItems : cartItems;
    const displayCartTotal = mode === 'builder' ? exampleCartTotal : cartTotal;
    const displayOriginalTotal = mode === 'builder' ? exampleOriginalTotal :
        cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const displayAutomaticDiscounts = mode === 'builder' ? exampleAutomaticDiscounts : automaticDiscountsTotal;
    const displayShipping = mode === 'builder' ? exampleShipping : shipping;
    const displayTax = mode === 'builder' ? exampleTax : tax;
    const displayOrderTotal = mode === 'builder' ? exampleOrderTotal : orderTotal;

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: styles.backgroundColor || '#f9fafb',
        padding: styles.padding || '24px',
        borderRadius: styles.borderRadius || '8px',
        border: '1px solid #e5e7eb',
    };

    const titleStyles = {
        fontSize: styles.titleSize || '20px',
        color: styles.titleColor || '#000000',
        fontFamily: themeSettings?.heading_font,
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
                <div className="text-xs text-green-600 font-medium">
                    {item.discountType === 'direct_discount' ? 'Descuento directo' :
                        item.discountType === 'product_automatic' ? 'Descuento automático' :
                            'Descuento aplicado'}
                    : -${discountAmount.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">
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

            {/* Información de entrega (mantener igual) */}
            <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                {/* ... código existente ... */}
            </div>

            {/* Productos con descuentos */}
            <div className="space-y-4">
                {displayCartItems.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-medium text-gray-900 mb-3">Productos</h3>
                        <div className="space-y-4">
                            {displayCartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-start border-b pb-4">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{item.name}</div>
                                        {item.combination_name && (
                                            <div className="text-sm text-gray-500">{item.combination_name}</div>
                                        )}

                                        {/* Precios con/sin descuento */}
                                        <div className="text-sm mt-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">
                                                    {item.quantity} ×
                                                    {item.originalPrice > item.price ? (
                                                        <>
                                                            <span className="line-through text-gray-400 ml-1">
                                                                ${item.originalPrice.toFixed(2)}
                                                            </span>
                                                            <span className="ml-1 font-medium text-green-600">
                                                                ${item.price.toFixed(2)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="ml-1">${item.price.toFixed(2)}</span>
                                                    )}
                                                </span>
                                            </div>
                                            {item.manualDiscount && (
                                                <div className="mt-1">
                                                    <div className="text-xs text-blue-600 font-medium ">
                                                        ✓ Descuento por código: {item.manualDiscount.code}
                                                    </div>
                                                    <div className="text-xs text-blue-500">
                                                        {item.manualDiscount.discount_type === 'percentage'
                                                            ? `${item.manualDiscount.value}% de descuento aplicado`
                                                            : `$${item.manualDiscount.value} de descuento aplicado`}
                                                    </div>
                                                </div>
                                            )}
                                            {renderDiscountInfo(item)}
                                        </div>
                                    </div>
                                    <div className="font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
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
                        <span>Subtotal original</span>
                        <span className="line-through text-gray-400">${originalSubtotal.toFixed(2)}</span>
                    </div>

                    {/* Subtotal después de descuentos automáticos */}
                    {/* {content.showSubtotal !== false && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${displayCartTotal.toFixed(2)}</span>
                        </div>
                    )} */}

                    {/* Descuentos automáticos */}
                    {/* {automaticDiscountsTotal > 0 && (
                    <div className="flex justify-between">
                        <span>Descuentos automáticos</span>
                        <span className="text-green-600">-${automaticDiscountsTotal.toFixed(2)}</span>
                    </div>
                )} */}


                    {/* Descuento manual (por código) */}
                    {/* {appliedDiscount && discounts > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Descuento ({appliedDiscount.code})</span>
                            <span className="font-medium text-green-600">-${discounts.toFixed(2)}</span>
                        </div>
                    )}

                    {appliedDiscount && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Descuento por código ({appliedDiscount.code})
                                {appliedDiscount.product_name && ` - ${appliedDiscount.product_name}`}
                            </span>
                            <span className="font-medium text-green-600">
                                -${discounts}
                            </span>
                        </div>
                    )} */}

                    {/* {appliedDiscounts.map(discount => (
                    <div key={discount.code} className="flex justify-between">
                        <span>Descuento ({discount.code})</span>
                        <span className="text-green-600">-${(discount.amount || 0).toFixed(2)}</span>
                    </div>
                ))} */}

                    {/* Gift Card aplicada */}
                    {appliedGiftCard && giftCardAmount > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Gift Card ({appliedGiftCard.code})
                            </span>
                            <span className="font-medium text-green-600">
                                -${giftCardAmount.toFixed(2)}
                            </span>
                        </div>
                    )}

                    {/* Mostrar saldo restante de la gift card */}
                    {appliedGiftCard && giftCardAmount > 0 && (
                        <div className="text-xs text-gray-500 italic mt-1">
                            Saldo restante en {appliedGiftCard.code}:
                            ${(parseFloat(appliedGiftCard.current_balance) - giftCardAmount).toFixed(2)}
                        </div>
                    )}

                    <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span>${calculatedSubtotal.toFixed(2)}</span>
                    </div>

                    {/* Envío */}
                    {content.showShipping !== false && displayShipping > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Envío</span>
                            <span className="font-medium">${displayShipping}</span>
                        </div>
                    )}

                    {/* Impuestos */}
                    {content.showTax !== false && displayTax > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Impuestos (16%)</span>
                            <span className="font-medium">${displayTax.toFixed(2)}</span>
                        </div>
                    )}

                    {/* Total */}
                    {content.showOrderTotal !== false && (
                        <>
                            <hr className="my-3 border-gray-300" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${displayOrderTotal.toFixed(2)}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Resumen de ahorros */}
            {displayAutomaticDiscounts > 0 && (
                <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-green-700 font-medium">
                            ¡Has ahorrado ${displayAutomaticDiscounts.toFixed(2)} con descuentos automáticos!
                        </span>
                    </div>
                </div>
            )}

            {mode === 'builder' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500 italic">
                        Nota: En modo builder se muestran datos de ejemplo para diseño
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutSummaryComponent;