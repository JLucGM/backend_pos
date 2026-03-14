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
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';
import { usePage } from '@inertiajs/react';

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
    const { settings } = usePage().props;
    console.log(orders)
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

    // Datos de ejemplo enriquecidos para el builder
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
                    image: '/product-example.png',
                    product_details: '{"attributes":" - color: rojo, talla: m"}'
                }
            ],
            currency: settings?.currency || { symbol: '$', code: 'USD' }
        }
    ];

    // ===========================================
    // NORMALIZAR ÓRDENES REALES
    // ===========================================
    const normalizeOrders = (rawOrders) => {
        if (!rawOrders || rawOrders.length === 0) return [];

        return rawOrders.map(order => {
            let deliveryAddress = 'Recoger en tienda';
            if (order.delivery_type === 'shipping' && order.deliveryLocation) {
                const loc = order.deliveryLocation;
                deliveryAddress = `${loc.address || ''} ${loc.city || ''} ${loc.state || ''}`.trim() || 'Dirección no especificada';
            }

            const paymentMethod = order.paymentMethod?.name || 'Método no especificado';

            const items = (order.items || []).map(item => {
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
                    combinationText: combinationText,
                    image: '/product-example.png'
                };
            });

            // FALLBACK DE MONEDA: Si la orden no tiene moneda, usar la moneda base de la tienda
            let orderCurrency = order.currency || settings?.currency;

            // Si después de todo sigue siendo null, crear un objeto básico USD para no romper
            if (!orderCurrency) {
                orderCurrency = { symbol: '$', code: 'USD' };
            }

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
                items: items,
                currency: {
                    ...orderCurrency,
                    // Asegurar que si viene de settings.currency tenga el formato correcto
                    symbol: orderCurrency.symbol || '$',
                    code: orderCurrency.code || 'USD'
                }
            };
        });
    };

    const displayOrders = useMemo(() => {
        if (mode === 'frontend') {
            return normalizeOrders(orders);
        }
        return exampleOrders;
    }, [mode, orders, settings]);

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Pendiente', color: 'yellow', icon: Clock },
            processing: { label: 'Procesando', color: 'blue', icon: Package },
            shipped: { label: 'Enviado', color: 'purple', icon: Truck },
            delivered: { label: 'Entregado', color: 'green', icon: CheckCircle },
            cancelled: { label: 'Cancelado', color: 'red', icon: XCircle }
        };
        return statusMap[status] || statusMap.pending;
    };

    const getPaymentStatusBadgeColor = (paymentStatus) => {
        if (paymentStatus === 'paid') return { background: '#05966920', color: '#059669', border: '1px solid #059669' };
        if (paymentStatus === 'pending') return { background: '#d9770620', color: '#d97706', border: '1px solid #d97706' };
        if (paymentStatus === 'failed') return { background: '#dc262620', color: '#dc2626', border: '1px solid #dc2626' };
        return { background: `${themeWithDefaults.primary_button_background}20`, color: themeWithDefaults.text, border: `1px solid ${themeWithDefaults.borders}` };
    };

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const outerContainerStyles = {
        width: '100%',
        minHeight: mode === 'frontend' ? '100vh' : 'auto',
        backgroundColor: themeWithDefaults.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: mode === 'frontend' ? '20px' : '0',
    };

    const containerStyles = {
        backgroundColor: styles.backgroundColor || themeWithDefaults.background,
        paddingTop: withUnit(styles.paddingTop || '40px'),
        paddingRight: withUnit(styles.paddingRight || '20px'),
        paddingBottom: withUnit(styles.paddingBottom || '40px'),
        paddingLeft: withUnit(styles.paddingLeft || '20px'),
        maxWidth: withUnit(styles.maxWidth || '1000px'),
        width: '100%',
        margin: '0 auto',
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

    const discountTextStyles = {
        color: '#059669',
        fontSize: '0.875rem',
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    const ghostButtonStyles = {
        color: resolveValue(themeWithDefaults.text),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    if (!displayOrders || displayOrders.length === 0) {
        return (
            <div style={outerContainerStyles}>
                <div style={containerStyles}>
                    <Card style={{ backgroundColor: themeWithDefaults.background, borderColor: themeWithDefaults.borders }}>
                        <CardContent className="p-8 text-center">
                            <ShoppingCart className="h-16 w-16 mx-auto mb-4" style={{ color: themeWithDefaults.heading }} />
                            <h3 className="text-lg font-semibold mb-2" style={titleStyles}>
                                {content.emptyTitle || 'No tienes pedidos aún'}
                            </h3>
                            <Button style={{ background: resolveValue(themeWithDefaults.primary_button_background), color: resolveValue(themeWithDefaults.primary_button_text) }}>
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
                <Card style={{ backgroundColor: themeWithDefaults.background, borderColor: themeWithDefaults.borders }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2" style={titleStyles}>
                            <Package className="h-6 w-6" />
                            {content.title || 'Mis Pedidos'}
                        </CardTitle>
                        <p style={textStyles}>
                            {content.subtitle || `Tienes ${displayOrders.length} pedido${displayOrders.length !== 1 ? 's' : ''}`}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: withUnit(styles.gap || '16px') }}>
                        {displayOrders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            const StatusIcon = statusInfo.icon;
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <Card key={order.id} style={{ borderColor: themeWithDefaults.borders, backgroundColor: themeWithDefaults.background }}>
                                    <CardContent className="p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg" style={titleStyles}>{order.order_number}</h3>
                                                    <div className="flex items-center gap-2 text-sm" style={textStyles}>
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Badge style={{ background: `${themeWithDefaults.primary_button_background}20`, color: themeWithDefaults.text, border: `1px solid ${themeWithDefaults.borders}` }}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {statusInfo.label}
                                                </Badge>
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end gap-1 font-semibold text-lg" style={{ color: themeWithDefaults.links }}>
                                                        <CurrencyDisplay currency={order.currency} amount={order.total} />
                                                        <span className="text-xs opacity-70 font-normal">{order.currency.code}</span>
                                                    </div>
                                                    {order.totaldiscounts > 0 && (
                                                        <p className="text-xs" style={discountTextStyles}>
                                                            Descuento: -<CurrencyDisplay currency={order.currency} amount={order.totaldiscounts} />
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Button variant="outline" size="sm" onClick={() => toggleOrderExpansion(order.id)} className="flex items-center gap-2" style={ghostButtonStyles}>
                                                <Eye className="h-4 w-4" />
                                                {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </Button>
                                        </div>

                                        {isExpanded && (
                                            <>
                                                <Separator className="my-4" style={{ backgroundColor: themeWithDefaults.borders }} />
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold" style={titleStyles}>Productos</h4>
                                                    <div className="space-y-3">
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-lg" style={{ backgroundColor: themeWithDefaults.background, border: `1px solid ${themeWithDefaults.borders}` }}>
                                                                <img src={item.image || '/product-example.png'} alt={item.product_name} className="w-16 h-16 object-cover rounded border" style={{ borderColor: themeWithDefaults.borders }} onError={(e) => e.target.src = '/product-example.png'} />
                                                                <div className="flex-1">
                                                                    <h5 className="font-medium" style={titleStyles}>{item.product_name}</h5>
                                                                    {item.combinationText && <p className="text-sm opacity-70" style={textStyles}>{item.combinationText}</p>}
                                                                    <p className="text-sm" style={textStyles}>Cantidad: {item.quantity}</p>
                                                                    {item.discount_amount > 0 && (
                                                                        <div className="flex items-center gap-2 text-sm" style={discountTextStyles}>
                                                                            <Tag className="h-3 w-3" />
                                                                            <span>Ahorro: <CurrencyDisplay currency={order.currency} amount={item.discount_amount} /></span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="text-right">
                                                                    {item.discount_amount > 0 ? (
                                                                        <>
                                                                            <div className="line-through text-sm opacity-70" style={textStyles}>
                                                                                <CurrencyDisplay currency={order.currency} amount={item.original_price} /> c/u
                                                                            </div>
                                                                            <div className="font-semibold" style={{ color: themeWithDefaults.links }}>
                                                                                <CurrencyDisplay currency={order.currency} amount={item.price} /> c/u
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <div className="font-semibold" style={{ color: themeWithDefaults.links }}>
                                                                            <CurrencyDisplay currency={order.currency} amount={item.price} /> c/u
                                                                        </div>
                                                                    )}
                                                                    <div className="text-sm font-medium" style={{ color: themeWithDefaults.links }}>
                                                                        Subtotal: <CurrencyDisplay currency={order.currency} amount={item.subtotal} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="p-4 rounded-lg space-y-2 border" style={{ backgroundColor: themeWithDefaults.background, borderColor: themeWithDefaults.borders }}>
                                                        <div className="flex justify-between" style={textStyles}>
                                                            <span>Subtotal:</span>
                                                            <span><CurrencyDisplay currency={order.currency} amount={order.subtotal} /></span>
                                                        </div>
                                                        {order.totaldiscounts > 0 && (
                                                            <div className="flex justify-between" style={discountTextStyles}>
                                                                <span>Descuentos:</span>
                                                                <span>-<CurrencyDisplay currency={order.currency} amount={order.totaldiscounts} /></span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between" style={textStyles}>
                                                            <span>Impuestos:</span>
                                                            <span><CurrencyDisplay currency={order.currency} amount={order.tax_amount} /></span>
                                                        </div>
                                                        <Separator className="my-2" style={{ backgroundColor: themeWithDefaults.borders }} />
                                                        <div className="flex justify-between font-bold">
                                                            <span style={titleStyles}>Total:</span>
                                                            <span style={{ color: themeWithDefaults.links }}><CurrencyDisplay currency={order.currency} amount={order.total} /></span>
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
