// components/BuilderPages/Checkout/CheckoutPaymentComponent.jsx
import React from 'react';
import { Button } from '@/Components/ui/button';

const CheckoutPaymentComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    acceptTerms,
    setAcceptTerms,
    onSubmitOrder,
    paymentMethods = [],
    mode = 'builder'
}) => {
    const styles = comp.styles || {};
    const content = comp.content || {};

    // Datos de ejemplo para modo builder
    const examplePaymentMethods = [
        {
            id: 'card',
            name: 'Tarjeta de Crédito/Débito',
            description: 'Paga con tu tarjeta Visa, Mastercard o American Express'
        },
        {
            id: 'paypal',
            name: 'PayPal',
            description: 'Paga de forma segura con tu cuenta PayPal'
        },
        {
            id: 'cash',
            name: 'Efectivo',
            description: 'Paga al momento de recibir tu pedido'
        }
    ];

    const displayPaymentMethods = mode === 'builder' ? examplePaymentMethods : paymentMethods;

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: styles.backgroundColor || '#ffffff',
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
                {content.title || 'Método de Pago'}
            </h2>

            {/* Mostrar métodos de pago */}
            {displayPaymentMethods.length > 0 ? (
                <div className="space-y-3 mb-6">
                    {displayPaymentMethods.map(method => (
                        <div
                            key={method.id}
                            className={`p-4 border rounded-lg cursor-pointer ${
                                selectedPaymentMethod === method.id 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200'
                            }`}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{method.name}</div>
                                    {method.description && (
                                        <div className="text-sm text-gray-600 mt-1">
                                            {method.description}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedPaymentMethod === method.id && (
                                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-4 mb-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No hay métodos de pago disponibles</p>
                </div>
            )}

            {/* Términos y condiciones */}
            {content.showTerms && (
                <div className="mb-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            className="mr-3 h-5 w-5"
                        />
                        <span className="text-gray-700">
                            Acepto los términos y condiciones de compra
                        </span>
                    </label>
                </div>
            )}

            {/* Botón de submit */}
            <Button
                onClick={onSubmitOrder}
                disabled={!selectedPaymentMethod || (content.showTerms && !acceptTerms)}
                className="w-full py-3 text-lg"
                style={{
                    backgroundColor: styles.buttonBackgroundColor || '#3b82f6',
                    color: styles.buttonColor || '#ffffff',
                    borderRadius: styles.buttonBorderRadius || '8px'
                }}
            >
                {content.buttonText || 'Realizar Pedido'}
            </Button>

            {mode === 'builder' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500 italic">
                        Nota: En modo builder los botones son interactivos para diseño
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPaymentComponent;