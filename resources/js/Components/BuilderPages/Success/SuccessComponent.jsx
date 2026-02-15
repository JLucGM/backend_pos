// components/BuilderPages/Success/SuccessComponent.jsx
import React from 'react';
import { CheckCircle, Package, Calendar, CreditCard, MapPin, Truck, Gift, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { Button } from '@/Components/ui/button';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const SuccessComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    isPreview,
    mode = 'builder',
    order = null,
    companyId,
    appliedTheme
}) => {
    // Obtener tema combinado
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos y contenido del componente
    const rawStyles = comp.styles || {};
    const rawContent = comp.content || {};
    const styles = {};
    const content = {};

    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });
    Object.keys(rawContent).forEach(key => {
        content[key] = resolveValue(rawContent[key]);
    });

    // Datos de ejemplo para el builder
    const exampleOrder = {
        id: 1,
        order_number: 'ORD-202401-0001',
        status: 'pending',
        payment_status: 'pending',
        total: 299.99,
        subtotal: 249.99,
        tax_amount: 25.00,
        totalshipping: 25.00,
        totaldiscounts: 0,
        gift_card_amount: 0,
        delivery_type: 'delivery',
        created_at: new Date().toISOString(),
        order_items: [
            {
                id: 1,
                name_product: 'Producto Ejemplo 1',
                quantity: 2,
                price_product: 75.00,
                discounted_price: 75.00,
                subtotal: 150.00,
                product_details: JSON.stringify({
                    image: 'https://picsum.photos/100/100',
                    combination_name: 'Talla M, Color Azul'
                })
            },
            {
                id: 2,
                name_product: 'Producto Ejemplo 2',
                quantity: 1,
                price_product: 99.99,
                discounted_price: 99.99,
                subtotal: 99.99,
                product_details: JSON.stringify({
                    image: 'https://picsum.photos/100/100',
                    combination_name: null
                })
            }
        ],
        payment_method: {
            payment_method_name: 'Tarjeta de Crédito'
        },
        shippingRate: {
            name: 'Envío Estándar',
            price: 25.00
        },
        delivery_location: {
            address_line_1: 'Calle Principal 123',
            address_line_2: 'Apartamento 4B',
            city: { city_name: 'Ciudad Ejemplo' },
            state: { state_name: 'Estado Ejemplo' },
            country: { country_name: 'País Ejemplo' },
            postal_code: '12345'
        }
    };

    // Usar orden real o ejemplo
    const displayOrder = order || (mode === 'builder' ? exampleOrder : null);

    if (!displayOrder && mode === 'frontend') {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 text-lg">
                    No se encontró información de la orden
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'processing': 'bg-purple-100 text-purple-800',
            'shipped': 'bg-indigo-100 text-indigo-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'completed': 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmado',
            'processing': 'Procesando',
            'shipped': 'Enviado',
            'delivered': 'Entregado',
            'cancelled': 'Cancelado',
            'completed': 'Completado'
        };
        return texts[status] || status;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const parseProductDetails = (productDetails) => {
        if (!productDetails) return {};

        try {
            const parsed = typeof productDetails === 'string'
                ? JSON.parse(productDetails)
                : productDetails;

            return {
                combination_name: parsed.attributes || parsed.combination_name || null,
                image: parsed.image || null,
                sku: parsed.sku || null,
                weight: parsed.weight || null,
                dimensions: parsed.dimensions || null
            };
        } catch (error) {
            console.error('Error parsing product details:', error);
            return {};
        }
    };

    // Valores resueltos del tema para usar en estilos dinámicos
    const resolvedBackground = resolveValue(themeWithDefaults.background);
    const resolvedHeading = resolveValue(themeWithDefaults.heading);
    const resolvedText = resolveValue(themeWithDefaults.text);
    const resolvedLinks = resolveValue(themeWithDefaults.links);
    const resolvedPrimaryButtonText = resolveValue(themeWithDefaults.primary_button_text);
    const resolvedBorders = resolveValue(themeWithDefaults.borders);

    return (
        <div
            className="w-full"
            style={{
                backgroundColor: styles.backgroundColor || resolvedBackground,
                paddingTop: withUnit(styles.paddingTop || '40px'),
                paddingRight: withUnit(styles.paddingRight || '20px'),
                paddingBottom: withUnit(styles.paddingBottom || '40px'),
                paddingLeft: withUnit(styles.paddingLeft || '20px'),
                maxWidth: withUnit(styles.maxWidth || '1200px', styles.maxWidthUnit || (styles.maxWidth?.toString().includes('%') ? '%' : 'px')),
                margin: '0 auto',
                borderRadius: withUnit(styles.borderRadius || '0px')
            }}
        >
            {/* Header de éxito */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <CheckCircle
                        size={64}
                        className="text-green-500"
                        style={{ color: content.iconColor || '#10b981' }}
                    />
                </div>

                <h1
                    className="text-3xl font-bold mb-2"
                    style={{
                        color: content.titleColor || styles.titleColor || resolvedHeading,
                        fontSize: withUnit(content.titleSize || styles.titleSize || '32px', content.titleSizeUnit || 'px'),
                        fontWeight: content.titleWeight || styles.titleWeight || 'bold'
                    }}
                >
                    {content.title || '¡Orden Exitosa!'}
                </h1>

                <p
                    className="text-lg"
                    style={{
                        color: content.subtitleColor || styles.subtitleColor || resolvedText,
                        fontSize: withUnit(content.subtitleSize || styles.subtitleSize || '18px', content.subtitleSizeUnit || 'px')
                    }}
                >
                    {content.subtitle || 'Tu orden ha sido procesada correctamente'}
                </p>
            </div>

            {/* Información de la orden */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Detalles principales */}
                <Card className="lg:col-span-2" style={{
                    backgroundColor: resolvedBackground,
                    borderColor: resolvedBorders
                }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2" style={{ color: resolvedHeading }}>
                            <Package size={20} />
                            Detalles de la Orden
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium" style={{ color: resolvedText }}>Número de Orden:</span>
                            <span className="font-mono text-lg" style={{ color: resolvedText }}>{displayOrder.id}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="font-medium" style={{ color: resolvedText }}>Estado:</span>
                            <Badge className={getStatusColor(displayOrder.status)}>
                                {getStatusText(displayOrder.status)}
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="font-medium" style={{ color: resolvedText }}>Fecha:</span>
                            <span className="flex items-center gap-1" style={{ color: resolvedText }}>
                                <Calendar size={16} />
                                {formatDate(displayOrder.created_at)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="font-medium" style={{ color: resolvedText }}>Método de Pago:</span>
                            <span className="flex items-center gap-1" style={{ color: resolvedText }}>
                                <CreditCard size={16} />
                                {displayOrder.payment_method?.payment_method_name || 'No especificado'}
                            </span>
                        </div>

                        {displayOrder.delivery_type === 'delivery' && displayOrder.delivery_location && (
                            <div>
                                <span className="font-medium flex items-center gap-1 mb-2" style={{ color: resolvedText }}>
                                    <MapPin size={16} />
                                    Dirección de Entrega:
                                </span>
                                <div className="text-sm ml-5" style={{ color: resolvedText }}>
                                    <div>{displayOrder.delivery_location.address_line_1}</div>
                                    {displayOrder.delivery_location.address_line_2 && (
                                        <div>{displayOrder.delivery_location.address_line_2}</div>
                                    )}
                                    <div>
                                        {displayOrder.delivery_location.city?.city_name}, {displayOrder.delivery_location.state?.state_name}
                                    </div>
                                    <div>
                                        {displayOrder.delivery_location.country?.country_name} {displayOrder.delivery_location.postal_code}
                                    </div>
                                </div>
                            </div>
                        )}

                        {displayOrder.shippingRate && (
                            <div className="flex justify-between items-center">
                                <span className="font-medium flex items-center gap-1" style={{ color: resolvedText }}>
                                    <Truck size={16} />
                                    Método de Envío:
                                </span>
                                <span style={{ color: resolvedText }}>{displayOrder.shippingRate.name}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Resumen de totales */}
                <Card style={{
                    backgroundColor: resolvedBackground,
                    borderColor: resolvedBorders
                }}>
                    <CardHeader>
                        <CardTitle style={{ color: resolvedHeading }}>Resumen del Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between" style={{ color: resolvedText }}>
                            <span>Subtotal:</span>
                            <CurrencyDisplay amount={displayOrder.subtotal} />
                        </div>

                        {displayOrder.totalshipping > 0 && (
                            <div className="flex justify-between" style={{ color: resolvedText }}>
                                <span>Envío:</span>
                                <CurrencyDisplay amount={displayOrder.totalshipping} />
                            </div>
                        )}

                        {displayOrder.tax_amount > 0 && (
                            <div className="flex justify-between" style={{ color: resolvedText }}>
                                <span>Impuestos:</span>
                                <CurrencyDisplay amount={displayOrder.tax_amount} />
                            </div>
                        )}

                        {displayOrder.totaldiscounts > 0 && (
                            <div className="flex justify-between">
                                <span className="flex items-center gap-1" style={{ color: resolvedText }}>
                                    <Tag size={16} />
                                    Descuentos:
                                </span>
                                <span style={{ color: '#059669' }}>
                                    <CurrencyDisplay amount={-displayOrder.totaldiscounts} />
                                </span>
                            </div>
                        )}

                        {displayOrder.gift_card_amount > 0 && (
                            <div className="flex justify-between">
                                <span className="flex items-center gap-1" style={{ color: resolvedText }}>
                                    <Gift size={16} />
                                    Gift Card:
                                </span>
                                <span style={{ color: '#7e3af2' }}>
                                    <CurrencyDisplay amount={-displayOrder.gift_card_amount} />
                                </span>
                            </div>
                        )}

                        <Separator style={{ backgroundColor: resolvedBorders }} />

                        <div className="flex justify-between text-lg font-bold" style={{ color: resolvedHeading }}>
                            <span>Total:</span>
                            <CurrencyDisplay amount={displayOrder.total} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Productos ordenados */}
            <Card className="mb-8" style={{
                backgroundColor: resolvedBackground,
                borderColor: resolvedBorders
            }}>
                <CardHeader>
                    <CardTitle style={{ color: resolvedHeading }}>Productos Ordenados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {displayOrder.order_items?.map((item, index) => {
                            const details = parseProductDetails(item.product_details);
                            return (
                                <div key={item.id || index} className="flex items-center gap-4 p-4 border rounded-lg" style={{
                                    borderColor: resolvedBorders,
                                    backgroundColor: resolvedBackground
                                }}>
                                    <div className="flex-1">
                                        <h4 className="font-medium" style={{ color: resolvedHeading }}>{item.name_product}</h4>
                                        {details.combination_name && (
                                            <p className="text-sm" style={{ color: resolvedText }}>{details.combination_name}</p>
                                        )}
                                        <p className="text-sm" style={{ color: resolvedText }}>
                                            Cantidad: {item.quantity} × <CurrencyDisplay amount={item.discounted_price} />
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-medium" style={{ color: resolvedLinks }}>
                                            <CurrencyDisplay amount={item.subtotal} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Acciones */}
            <div className="text-center space-y-4">
                {content.showContinueShoppingButton !== false && (
                    <Button
                        variant="outline"
                        size="lg"
                        className="mr-4"
                        style={{
                            backgroundColor: content.continueButtonBg || 'transparent',
                            color: content.continueButtonColor || resolvedText,
                            borderColor: content.continueButtonBorder || resolvedBorders
                        }}
                        onClick={() => {
                            if (mode === 'frontend') {
                                window.location.href = '/';
                            }
                        }}
                    >
                        {content.continueButtonText || 'Continuar Comprando'}
                    </Button>
                )}

                {content.showOrdersButton !== false && (
                    <Button
                        size="lg"
                        style={{
                            backgroundColor: content.ordersButtonBg || themeWithDefaults.primary_button_background,
                            color: content.ordersButtonColor || resolvedPrimaryButtonText
                        }}
                        onClick={() => {
                            if (mode === 'frontend') {
                                window.location.href = '/pedidos';
                            }
                        }}
                    >
                        {content.ordersButtonText || 'Ver Mis Pedidos'}
                    </Button>
                )}
            </div>

            {/* Mensaje adicional */}
            {content.additionalMessage && (
                <div
                    className="mt-8 p-4 rounded-lg text-center"
                    style={{
                        backgroundColor: content.messageBackgroundColor || resolvedBackground,
                        color: content.messageTextColor || resolvedText
                    }}
                >
                    <p>{content.additionalMessage}</p>
                </div>
            )}
        </div>
    );
};

export default SuccessComponent;