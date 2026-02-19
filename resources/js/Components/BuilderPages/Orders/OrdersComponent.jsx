import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import {
    Package,
    Calendar,
    MapPin,
    CreditCard,
    Eye,
    ChevronDown,
    ChevronUp,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    ShoppingCart,
    Tag
} from 'lucide-react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

function OrdersComponent({
    comp,
    themeSettings,
    appliedTheme,
    isPreview = false,
    mode = 'builder',
    companyId,
    orders = null
}) {
    const [expandedOrder, setExpandedOrder] = useState(null);
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

    // Datos de ejemplo enriquecidos para el builder (incluyendo product_details)
    const exampleOrders = [
        {
            id: 1,
            order_number: 'ORD-2024-001',
            status: 'delivered',
            total: 125.50,
            subtotal: 140.00,
            tax_amount: 10.50,
            totaldiscounts: 25.00,
            payment_status: 'paid',
            delivery_type: 'shipping',
            created_at: '2024-01-15T10:30:00Z',
            delivery_address: 'Calle Principal 123, Ciudad',
            payment_method: 'Tarjeta de Crédito',
            items: [
                {
                    id: 1,
                    product_name: 'Producto A',
                    quantity: 2,
                    price: 50.00,
                    original_price: 60.00,
                    discount_amount: 20.00,
                    discounted_price: 50.00,
                    subtotal: 100.00,
                    tax_amount: 8.00,
                    image: 'https://picsum.photos/80/80?random=1',
                    product_details: '{"attributes":" - color: rojo, talla: m"}'
                },
                {
                    id: 2,
                    product_name: 'Producto B',
                    quantity: 1,
                    price: 25.50,
                    original_price: 25.50,
                    discount_amount: 0,
                    discounted_price: 25.50,
                    subtotal: 25.50,
                    tax_amount: 2.50,
                    image: 'https://picsum.photos/80/80?random=2',
                    product_details: null
                }
            ]
        },
        {
            id: 2,
            order_number: 'ORD-2024-002',
            status: 'processing',
            total: 89.99,
            subtotal: 89.99,
            tax_amount: 7.20,
            totaldiscounts: 0,
            payment_status: 'pending',
            delivery_type: 'pickup',
            created_at: '2024-01-20T14:15:00Z',
            delivery_address: 'Recoger en tienda',
            payment_method: 'Efectivo',
            items: [
                {
                    id: 3,
                    product_name: 'Producto C',
                    quantity: 3,
                    price: 29.99,
                    original_price: 29.99,
                    discount_amount: 0,
                    discounted_price: 29.99,
                    subtotal: 89.97,
                    tax_amount: 7.20,
                    image: 'https://picsum.photos/80/80?random=3',
                    product_details: '{"attributes":" - color: azul, talla: s"}'
                }
            ]
        },
        {
            id: 3,
            order_number: 'ORD-2024-003',
            status: 'pending',
            total: 199.99,
            subtotal: 199.99,
            tax_amount: 16.00,
            totaldiscounts: 0,
            payment_status: 'pending',
            delivery_type: 'shipping',
            created_at: '2024-01-22T09:45:00Z',
            delivery_address: 'Plaza Mayor 789, Ciudad',
            payment_method: 'Transferencia',
            items: [
                {
                    id: 4,
                    product_name: 'Producto Premium',
                    quantity: 1,
                    price: 199.99,
                    original_price: 199.99,
                    discount_amount: 0,
                    discounted_price: 199.99,
                    subtotal: 199.99,
                    tax_amount: 16.00,
                    image: 'https://picsum.photos/80/80?random=4',
                    product_details: null
                }
            ]
        }
    ];

    // ===========================================
    // NORMALIZAR ÓRDENES REALES (TODOS LOS CAMPOS)
    // ===========================================
    const normalizeOrders = (rawOrders) => {
        if (!rawOrders || rawOrders.length === 0) return [];

        return rawOrders.map(order => {
            // Construir dirección
            let deliveryAddress = 'Recoger en tienda';
            if (order.delivery_type === 'shipping' && order.deliveryLocation) {
                const loc = order.deliveryLocation;
                deliveryAddress = `${loc.address || ''} ${loc.city || ''} ${loc.state || ''}`.trim() || 'Dirección no especificada';
            }

            // Método de pago
            const paymentMethod = order.paymentMethod?.name || 'Método no especificado';

            // Items
            const items = (order.items || []).map(item => {
                // Procesar product_details si existe
                let combinationText = '';
                if (item.product_details) {
                    try {
                        const details = JSON.parse(item.product_details);
                        if (details.attributes) {
                            combinationText = details.attributes.trim();
                        }
                    } catch (e) {
                        console.warn('Error parsing product_details:', e);
                    }
                }

                return {
                    id: item.id,
                    product_name: item.name_product || 'Producto',
                    quantity: item.quantity,
                    price: parseFloat(item.discounted_price) || parseFloat(item.price_product) || 0,
                    original_price: parseFloat(item.price_product) || 0,
                    discount_amount: parseFloat(item.discount_amount) || 0,
                    discounted_price: parseFloat(item.discounted_price) || parseFloat(item.price_product) || 0,
                    subtotal: parseFloat(item.subtotal) || 0,
                    tax_amount: parseFloat(item.tax_amount) || 0,
                    combinationText: combinationText, // Texto de atributos
                    image: `https://picsum.photos/80/80?random=${item.id}` // Placeholder
                };
            });

            return {
                id: order.id,
                order_number: `ORD-${order.id}`,
                status: order.status,
                total: parseFloat(order.total) || 0,
                subtotal: parseFloat(order.subtotal) || 0,
                tax_amount: parseFloat(order.tax_amount) || 0,
                totaldiscounts: parseFloat(order.totaldiscounts) || 0,
                payment_status: order.payment_status,
                delivery_type: order.delivery_type,
                created_at: order.created_at,
                delivery_address: deliveryAddress,
                payment_method: paymentMethod,
                items: items
            };
        });
    };

    // Órdenes a mostrar según el modo
    const displayOrders = useMemo(() => {
        if (mode === 'frontend') {
            return normalizeOrders(orders);
        }
        // Modo builder: usar datos de ejemplo
        return exampleOrders;
    }, [mode, orders]);

    // ===========================================
    // FUNCIONES AUXILIARES
    // ===========================================
    const getStatusInfo = (status) => {
        const statusMap = {
            pending: {
                label: 'Pendiente',
                color: 'yellow',
                icon: Clock
            },
            processing: {
                label: 'Procesando',
                color: 'blue',
                icon: Package
            },
            shipped: {
                label: 'Enviado',
                color: 'purple',
                icon: Truck
            },
            delivered: {
                label: 'Entregado',
                color: 'green',
                icon: CheckCircle
            },
            cancelled: {
                label: 'Cancelado',
                color: 'red',
                icon: XCircle
            }
        };
        return statusMap[status] || statusMap.pending;
    };

    const getPaymentStatusBadgeColor = (paymentStatus) => {
        const bgColor = themeWithDefaults.primary_button_background;
        const textColor = themeWithDefaults.text;
        const borderColor = themeWithDefaults.borders;

        // Personalizar según estado
        if (paymentStatus === 'paid') {
            return {
                background: '#05966920',
                color: '#059669',
                border: '1px solid #059669'
            };
        } else if (paymentStatus === 'pending') {
            return {
                background: '#d9770620',
                color: '#d97706',
                border: '1px solid #d97706'
            };
        } else if (paymentStatus === 'failed') {
            return {
                background: '#dc262620',
                color: '#dc2626',
                border: '1px solid #dc2626'
            };
        }
        return {
            background: `${bgColor}20`,
            color: textColor,
            border: `1px solid ${borderColor}`
        };
    };

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    // ===========================================
    // ESTILOS
    // ===========================================
    const outerContainerStyles = {
        width: '100%',
        minHeight: mode === 'frontend' ? '100vh' : 'auto',
        backgroundColor: themeWithDefaults.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: mode === 'frontend' ? 'flex-start' : 'center',
        padding: mode === 'frontend' ? '20px' : '0',
    };

    const containerStyles = {
        backgroundColor: styles.backgroundColor || themeWithDefaults.background,
        paddingTop: withUnit(styles.paddingTop || '40px'),
        paddingRight: withUnit(styles.paddingRight || '20px'),
        paddingBottom: withUnit(styles.paddingBottom || '40px'),
        paddingLeft: withUnit(styles.paddingLeft || '20px'),
        maxWidth: withUnit(styles.maxWidth || '1000px', styles.maxWidthUnit || (styles.maxWidth?.toString().includes('%') ? '%' : 'px')),
        width: '100%',
        margin: '0 auto',
        minHeight: mode === 'frontend' ? 'auto' : '100%',
    };

    const titleStyles = {
        color: resolveValue(styles.titleColor || themeWithDefaults.heading),
        fontSize: withUnit(styles.titleSize, styles.titleSizeUnit || 'px'),
        fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme),
    };

    const textStyles = {
        color: resolveValue(themeWithDefaults.text),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    const primaryButtonStyles = {
        backgroundColor: resolveValue(themeWithDefaults.primary_button_background),
        color: resolveValue(themeWithDefaults.primary_button_text),
        borderRadius: withUnit(themeWithDefaults.primary_button_corner_radius || '8px'),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    const ghostButtonStyles = {
        color: resolveValue(themeWithDefaults.text),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    const discountTextStyles = {
        color: '#059669',
        fontSize: '0.875rem',
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    // ===========================================
    // RENDER
    // ===========================================
    if (!displayOrders || displayOrders.length === 0) {
        return (
            <div style={outerContainerStyles}>
                <div style={containerStyles}>
                    <Card style={{
                        backgroundColor: themeWithDefaults.background,
                        borderColor: themeWithDefaults.borders,
                    }}>
                        <CardContent className="p-8 text-center">
                            <ShoppingCart className="h-16 w-16 mx-auto mb-4" style={{ color: themeWithDefaults.heading }} />
                            <h3 className="text-lg font-semibold mb-2" style={titleStyles}>
                                {content.emptyTitle || 'No tienes pedidos aún'}
                            </h3>
                            <p className="mb-4" style={textStyles}>
                                {content.emptyMessage || 'Cuando realices tu primer pedido, aparecerá aquí.'}
                            </p>
                            <Button style={primaryButtonStyles}>
                                {content.shopButtonText || 'Ir a la tienda'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div style={outerContainerStyles}>
            <div style={containerStyles}>
                <Card style={{
                    backgroundColor: themeWithDefaults.background,
                    borderColor: themeWithDefaults.borders,
                }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2" style={titleStyles}>
                            <Package className="h-6 w-6" />
                            {content.title || 'Mis Pedidos'}
                        </CardTitle>
                        <p style={textStyles}>
                            {content.subtitle || `Tienes ${displayOrders.length} pedido${displayOrders.length !== 1 ? 's' : ''}`}
                        </p>
                    </CardHeader>
                    <CardContent
                        className="space-y-4"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: withUnit(styles.gap || '16px', styles.gapUnit || 'px')
                        }}
                    >
                        {displayOrders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            const StatusIcon = statusInfo.icon;
                            const isExpanded = expandedOrder === order.id;

                            // Badge de estado del pedido
                            const getStatusBadgeColor = () => {
                                const bgColor = themeWithDefaults.primary_button_background;
                                const textColor = themeWithDefaults.text;
                                const borderColor = themeWithDefaults.borders;
                                return {
                                    background: `${bgColor}20`,
                                    color: textColor,
                                    border: `1px solid ${borderColor}`
                                };
                            };
                            const statusBadgeStyle = getStatusBadgeColor();

                            return (
                                <Card key={order.id} style={{
                                    borderColor: themeWithDefaults.borders,
                                    backgroundColor: themeWithDefaults.background,
                                }}>
                                    <CardContent className="p-4">
                                        {/* Header del pedido */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg" style={titleStyles}>
                                                        {order.order_number}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm" style={textStyles}>
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <Badge style={statusBadgeStyle}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {statusInfo.label}
                                                </Badge>
                                                <div className="text-right">
                                                    <p className="font-semibold text-lg" style={{ color: themeWithDefaults.links }}>
                                                        ${order.total.toFixed(2)}
                                                    </p>
                                                    {order.totaldiscounts > 0 && (
                                                        <p className="text-xs" style={discountTextStyles}>
                                                            Descuento: -${order.totaldiscounts.toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Información básica */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="h-4 w-4" style={{ color: themeWithDefaults.text }} />
                                                <span style={textStyles}>
                                                    {order.delivery_address}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <CreditCard className="h-4 w-4" style={{ color: themeWithDefaults.text }} />
                                                <span style={textStyles}>
                                                    {order.payment_method}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Botón para expandir/contraer */}
                                        <div className="flex items-center justify-between">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleOrderExpansion(order.id)}
                                                className="flex items-center gap-2"
                                                style={ghostButtonStyles}
                                            >
                                                <Eye className="h-4 w-4" />
                                                {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                                                {isExpanded ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>

                                        {/* Detalles expandidos */}
                                        {isExpanded && (
                                            <>
                                                <Separator className="my-4" style={{ backgroundColor: themeWithDefaults.borders }} />
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold" style={titleStyles}>Productos</h4>
                                                    <div className="space-y-3">
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-lg" style={{
                                                                backgroundColor: themeWithDefaults.background,
                                                                border: `1px solid ${themeWithDefaults.borders}`,
                                                            }}>
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.product_name}
                                                                    className="w-16 h-16 object-cover rounded"
                                                                    style={{
                                                                        border: `1px solid ${themeWithDefaults.borders}`,
                                                                    }}
                                                                />
                                                                <div className="flex-1">
                                                                    <h5 className="font-medium" style={titleStyles}>
                                                                        {item.product_name}
                                                                    </h5>
                                                                    {/* Mostrar combinación si existe */}
                                                                    {item.combinationText && (
                                                                        <p className="text-sm" style={{
                                                                            color: resolveValue(themeWithDefaults.text),
                                                                            opacity: 0.7
                                                                        }}>
                                                                            {item.combinationText}
                                                                        </p>
                                                                    )}
                                                                    <p className="text-sm" style={textStyles}>
                                                                        Cantidad: {item.quantity}
                                                                    </p>
                                                                    {item.discount_amount > 0 && (
                                                                        <div className="flex items-center gap-2 text-sm">
                                                                            <Tag className="h-3 w-3" style={discountTextStyles} />
                                                                            <span style={discountTextStyles}>
                                                                                Ahorro: ${item.discount_amount.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="text-right">
                                                                    {item.discount_amount > 0 ? (
                                                                        <>
                                                                            <div className="line-through text-sm" style={textStyles}>
                                                                                ${item.original_price.toFixed(2)} c/u
                                                                            </div>
                                                                            <div className="font-semibold" style={{ color: themeWithDefaults.links }}>
                                                                                ${item.price.toFixed(2)} c/u
                                                                            </div>
                                                                            <div className="text-sm font-medium" style={{ color: themeWithDefaults.links }}>
                                                                                Subtotal: ${item.subtotal.toFixed(2)}
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="font-semibold" style={{ color: themeWithDefaults.links }}>
                                                                                ${item.price.toFixed(2)} c/u
                                                                            </div>
                                                                            <div className="text-sm font-medium" style={{ color: themeWithDefaults.links }}>
                                                                                Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                    {item.tax_amount > 0 && (
                                                                        <div className="text-xs" style={textStyles}>
                                                                            Impuesto: ${item.tax_amount.toFixed(2)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Resumen financiero */}
                                                    <div className="p-4 rounded-lg space-y-2" style={{
                                                        backgroundColor: themeWithDefaults.background,
                                                        border: `1px solid ${themeWithDefaults.borders}`,
                                                    }}>
                                                        <div className="flex justify-between">
                                                            <span style={textStyles}>Subtotal:</span>
                                                            <span style={textStyles}>${order.subtotal.toFixed(2)}</span>
                                                        </div>
                                                        {order.totaldiscounts > 0 && (
                                                            <div className="flex justify-between" style={discountTextStyles}>
                                                                <span>Descuentos:</span>
                                                                <span>-${order.totaldiscounts.toFixed(2)}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between">
                                                            <span style={textStyles}>Impuestos:</span>
                                                            <span style={textStyles}>${order.tax_amount.toFixed(2)}</span>
                                                        </div>
                                                        <Separator className="my-2" style={{ backgroundColor: themeWithDefaults.borders }} />
                                                        <div className="flex justify-between font-bold">
                                                            <span style={titleStyles}>Total:</span>
                                                            <span style={{ color: themeWithDefaults.links }}>${order.total.toFixed(2)}</span>
                                                        </div>

                                                        {/* Información adicional */}
                                                        <div className="flex justify-between text-sm mt-2">
                                                            <span style={textStyles}>Método de pago:</span>
                                                            <span style={textStyles}>{order.payment_method}</span>
                                                        </div>
                                                        {order.payment_status && (
                                                            <div className="flex justify-between text-sm">
                                                                <span style={textStyles}>Estado del pago:</span>
                                                                <Badge style={getPaymentStatusBadgeColor(order.payment_status)}>
                                                                    {order.payment_status === 'paid' ? 'Pagado' : 
                                                                     order.payment_status === 'pending' ? 'Pendiente' : 
                                                                     order.payment_status === 'failed' ? 'Fallido' : order.payment_status}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between text-sm">
                                                            <span style={textStyles}>Tipo de entrega:</span>
                                                            <span style={textStyles}>
                                                                {order.delivery_type === 'shipping' ? 'Envío a domicilio' : 'Recoger en tienda'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default OrdersComponent;