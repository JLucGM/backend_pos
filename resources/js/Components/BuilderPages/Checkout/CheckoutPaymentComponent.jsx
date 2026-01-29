// CheckoutPaymentComponent.jsx - VERSIÓN ACTUALIZADA
import React from 'react';
import { Button } from '@/Components/ui/button';
import { getThemeWithDefaults, getComponentStyles, hslToCss, getResolvedFont, getButtonStyles } from '@/utils/themeUtils';

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
    onSubmitOrder,  // <-- Recibir función
    paymentMethods = [],
    mode = 'builder',
    isSubmitting = false,  // <-- Recibir estado
    orderError = null      // <-- Recibir error
}) => {
    const styles = comp.styles || {};
    const content = comp.content || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings);
    
    // Obtener estilos del tema para checkout
    const themeCheckoutStyles = getComponentStyles(themeWithDefaults, 'checkout');
    const themeCheckoutTitleStyles = getComponentStyles(themeWithDefaults, 'checkout-title');

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
        backgroundColor: styles.backgroundColor || themeCheckoutStyles.backgroundColor || hslToCss(themeWithDefaults.background),
        padding: styles.padding || '24px',
        borderRadius: styles.borderRadius || themeCheckoutStyles.borderRadius || '8px',
        border: `1px solid ${hslToCss(themeWithDefaults.borders)}`,
    };

    const titleStyles = {
        fontSize: styles.titleSize || themeCheckoutTitleStyles.fontSize || themeWithDefaults.heading3_fontSize || '20px',
        color: styles.titleColor || themeCheckoutTitleStyles.color || hslToCss(themeWithDefaults.heading),
        fontFamily: getResolvedFont(themeWithDefaults, 'heading_font'),
        marginBottom: '20px',
        fontWeight: themeWithDefaults.heading3_fontWeight || '600',
    };

    // Manejar envío de orden
    const handleSubmit = async () => {
        if (typeof onSubmitOrder === 'function') {
            await onSubmitOrder();
        } else if (mode === 'builder') {
            alert('En modo builder: Simulando envío de orden...');
        }
    };

    return (
        <div style={containerStyles}>
            <h2 style={titleStyles}>
                {content.title || 'Método de Pago'}
            </h2>

            {/* Mostrar error si existe */}
            {orderError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">{orderError}</p>
                </div>
            )}

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
                            disabled={isSubmitting}
                        />
                        <span className="text-gray-700">
                            Acepto los términos y condiciones de compra
                        </span>
                    </label>
                </div>
            )}

            {/* Botón de submit */}
            <Button
                onClick={handleSubmit}
                disabled={!selectedPaymentMethod || (content.showTerms && !acceptTerms) || isSubmitting}
                className="w-full py-3 text-lg"
                style={{
                    ...getButtonStyles(themeWithDefaults, 'primary'),
                    backgroundColor: styles.buttonBackgroundColor || hslToCss(themeWithDefaults.primary_button_background),
                    color: styles.buttonColor || hslToCss(themeWithDefaults.primary_button_text),
                    borderRadius: styles.buttonBorderRadius || themeWithDefaults.primary_button_corner_radius || '8px',
                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
                }}
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Procesando...
                    </span>
                ) : (
                    content.buttonText || 'Realizar Pedido'
                )}
            </Button>

            {/* Información adicional en modo builder */}
            {/* {mode === 'builder' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500 italic">
                        Nota: En modo builder los botones son interactivos para diseño
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default CheckoutPaymentComponent;