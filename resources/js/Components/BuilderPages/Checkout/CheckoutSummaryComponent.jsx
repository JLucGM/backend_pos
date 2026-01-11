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
    automaticDiscountsTotal = 0,
    taxDetails = []
}) => {
    const styles = comp.styles || {};
    const content = comp.content || {};

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
                                            {/* Mostrar impuesto del producto */}
                                            {item.taxRate > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Impuesto ({item.taxName || `${item.taxRate}%`}): 
                                                    ${((item.price * item.quantity) * (item.taxRate / 100)).toFixed(2)}
                                                </div>
                                            )}
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

                    {/* Descuentos automáticos */}
                    {displayAutomaticDiscounts > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Descuentos automáticos</span>
                            <span>-${displayAutomaticDiscounts.toFixed(2)}</span>
                        </div>
                    )}

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
                        <div className="space-y-1">
                            {displayTaxDetails && displayTaxDetails.length > 0 ? (
                                <>
                                    {displayTaxDetails.map((taxDetail, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span className="text-gray-600">
                                                {taxDetail.name} ({taxDetail.rate})
                                            </span>
                                            <span className="font-medium">${taxDetail.amount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                    {displayTaxDetails.length > 1 && (
                                        <div className="flex justify-between border-t pt-1">
                                            <span className="text-gray-600 font-medium">Total impuestos</span>
                                            <span className="font-medium">${displayTax.toFixed(2)}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Impuestos</span>
                                    <span className="font-medium">${displayTax.toFixed(2)}</span>
                                </div>
                            )}
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

            {/* {mode === 'builder' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500 italic">
                        Nota: En modo builder se muestran datos de ejemplo para diseño
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default CheckoutSummaryComponent;