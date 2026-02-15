// CheckoutPaymentComponent.jsx - VERSIÓN ACTUALIZADA CON SOPORTE PARA REFERENCIAS AL TEMA
import React from 'react';
import { Button } from '@/Components/ui/button';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, getButtonStyles, resolveStyleValue } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const CheckoutPaymentComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings,
    appliedTheme,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    acceptTerms,
    setAcceptTerms,
    onSubmitOrder,
    paymentMethods = [],
    mode = 'builder',
    isSubmitting = false,
    orderError = null
}) => {
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

    // Obtener estilos del tema para checkout (resueltos)
    const themeCheckoutStyles = getComponentStyles(themeWithDefaults, 'checkout', appliedTheme);
    const themeCheckoutTitleStyles = getComponentStyles(themeWithDefaults, 'checkout-title', appliedTheme);

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
        backgroundColor: resolveValue(styles.backgroundColor || themeCheckoutStyles.backgroundColor || themeWithDefaults.background),
        paddingTop: withUnit(styles.paddingTop || '24px'),
        paddingRight: withUnit(styles.paddingRight || '24px'),
        paddingBottom: withUnit(styles.paddingBottom || '24px'),
        paddingLeft: withUnit(styles.paddingLeft || '24px'),
        borderRadius: withUnit(styles.borderRadius || themeCheckoutStyles.borderRadius || '8px'),
        border: `1px solid ${resolveValue(themeWithDefaults.borders)}`,
    };

    const titleStyles = {
        fontSize: withUnit(styles.titleSize || themeCheckoutTitleStyles.fontSize || themeWithDefaults.heading3_fontSize || '20px', styles.titleSizeUnit || 'px'),
        color: resolveValue(styles.titleColor || themeCheckoutTitleStyles.color || themeWithDefaults.heading),
        fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme),
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
                <div
                    className="mb-4 p-3 rounded-md"
                    style={{
                        backgroundColor: resolveValue(themeWithDefaults.danger_color + '20'), // 20% de opacidad
                        border: `1px solid ${resolveValue(themeWithDefaults.danger_color)}`,
                        color: resolveValue(themeWithDefaults.danger_color),
                        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                    }}
                >
                    <p className="text-sm">{orderError}</p>
                </div>
            )}

            {/* Mostrar métodos de pago */}
            {displayPaymentMethods.length > 0 ? (
                <div className="space-y-3 mb-6">
                    {displayPaymentMethods.map(method => {
                        const isSelected = selectedPaymentMethod === method.id;
                        return (
                            <div
                                key={method.id}
                                className="p-4 rounded-lg cursor-pointer"
                                style={{
                                    border: `1px solid ${isSelected
                                        ? resolveValue(themeWithDefaults.links)
                                        : resolveValue(themeWithDefaults.borders)
                                        }`,
                                    backgroundColor: isSelected
                                        ? resolveValue(themeWithDefaults.links + '10') // 10% de opacidad
                                        : 'transparent',
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                    transition: 'all 0.2s',
                                }}
                                onClick={() => setSelectedPaymentMethod(method.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                            {method.name}
                                        </div>
                                        {method.description && (
                                            <div className="text-sm mt-1" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                {method.description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isSelected && (
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: resolveValue(themeWithDefaults.links) }}
                                            >
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div
                    className="text-center py-4 mb-6 rounded-lg"
                    style={{
                        backgroundColor: resolveValue(themeWithDefaults.secondary_button_background),
                        color: resolveValue(themeWithDefaults.text),
                        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                    }}
                >
                    <p>No hay métodos de pago disponibles</p>
                </div>
            )}

            {/* Términos y condiciones */}
            {content.showTerms && (
                <div className="mb-6">
                    <label className="flex items-center cursor-pointer" style={{ fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme) }}>
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            className="mr-3 h-5 w-5"
                            style={{ accentColor: resolveValue(themeWithDefaults.links) }}
                            disabled={isSubmitting}
                        />
                        <span style={{ color: resolveValue(themeWithDefaults.text) }}>
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
                    ...getButtonStyles(themeWithDefaults, 'primary', appliedTheme),
                    backgroundColor: resolveValue(styles.buttonBackgroundColor || themeWithDefaults.primary_button_background),
                    color: resolveValue(styles.buttonColor || themeWithDefaults.primary_button_text),
                    borderRadius: withUnit(styles.buttonBorderRadius || themeWithDefaults.primary_button_corner_radius || '8px'),
                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
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
        </div>
    );
};

export default CheckoutPaymentComponent;