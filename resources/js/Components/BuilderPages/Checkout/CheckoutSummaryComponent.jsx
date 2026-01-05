// components/BuilderPages/Checkout/CheckoutSummaryComponent.jsx
import React from 'react';

const CheckoutSummaryComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    cartItems,
    cartTotal,
    shipping,
    tax,
    discounts,
    giftCardAmount,
    orderTotal,
    themeSettings,
    selectedShippingRate,
    appliedDiscount,
    appliedGiftCard,
    deliveryType,
    selectedAddress,
    mode = 'builder'
}) => {
    const styles = comp.styles || {};
    const content = comp.content || {};

    // Datos de ejemplo para modo builder
    const exampleCartItems = [
        {
            id: '1_simple',
            product_id: 1,
            name: 'Producto Ejemplo 1',
            price: 299.99,
            quantity: 2,
            combination_name: 'Color: Rojo, Talla: M',
            image: 'https://picsum.photos/150',
            stock: 10
        },
        {
            id: '2_simple',
            product_id: 2,
            name: 'Producto Ejemplo 2',
            price: 149.50,
            quantity: 1,
            image: 'https://picsum.photos/151',
            stock: 5
        }
    ];

    const exampleCartTotal = 749.48;
    const exampleShipping = 50.00;
    const exampleTax = 119.92;
    const exampleOrderTotal = 919.40;

    const displayCartItems = mode === 'builder' ? exampleCartItems : cartItems;
    const displayCartTotal = mode === 'builder' ? exampleCartTotal : cartTotal;
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

    return (
        <div style={containerStyles}>
            <h2 style={titleStyles}>
                {content.title || 'Resumen del Pedido'}
            </h2>

            {/* Información de entrega */}
            <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                <div className="text-sm">
                    <div className="font-medium text-gray-900 mb-2">Método de entrega</div>
                    <div className="text-gray-600">
                        {deliveryType === 'delivery' ? 'Envío a domicilio' : 'Recoger en tienda'}
                    </div>
                    
                    {deliveryType === 'delivery' && selectedAddress && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="font-medium text-gray-900 mb-1">Dirección de envío:</div>
                            <div className="text-gray-600">
                                <div>{selectedAddress.address_line_1}</div>
                                {selectedAddress.address_line_2 && <div>{selectedAddress.address_line_2}</div>}
                                <div>{selectedAddress.city}, {selectedAddress.state}</div>
                                <div>{selectedAddress.country} - CP: {selectedAddress.postal_code}</div>
                            </div>
                        </div>
                    )}
                    
                    {selectedShippingRate && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="font-medium text-gray-900 mb-1">Método de envío:</div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{selectedShippingRate.name}</span>
                                <span className="font-medium">${selectedShippingRate.price}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Productos */}
            <div className="space-y-4">
                {displayCartItems.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-medium text-gray-900 mb-3">Productos</h3>
                        <div className="space-y-3">
                            {displayCartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{item.name}</div>
                                        {item.combination_name && (
                                            <div className="text-sm text-gray-500">{item.combination_name}</div>
                                        )}
                                        <div className="text-sm text-gray-500">
                                            {item.quantity} × ${item.price}
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

                {/* Totales */}
                <div className="space-y-2">
                    {content.showSubtotal !== false && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${displayCartTotal.toFixed(2)}</span>
                        </div>
                    )}

                    {appliedDiscount && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Descuento ({appliedDiscount.code})</span>
                            <span className="font-medium text-green-600">-${discounts.toFixed(2)}</span>
                        </div>
                    )}

                    {appliedGiftCard && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Gift Card ({appliedGiftCard.code})</span>
                            <span className="font-medium text-green-600">-${giftCardAmount.toFixed(2)}</span>
                        </div>
                    )}

                    {content.showShipping !== false && displayShipping > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Envío</span>
                            <span className="font-medium">${displayShipping}</span>
                        </div>
                    )}

                    {content.showTax !== false && displayTax > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Impuestos (16%)</span>
                            <span className="font-medium">${displayTax.toFixed(2)}</span>
                        </div>
                    )}

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