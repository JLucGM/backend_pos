import React, { useState } from 'react';
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
    XCircle 
} from 'lucide-react';
import { getThemeWithDefaults, getComponentStyles, hslToCss, getResolvedFont, getButtonStyles } from '@/utils/themeUtils';

function OrdersComponent({ 
    comp, 
    themeSettings, 
    isPreview = false, 
    mode = 'builder',
    companyId,
    orders = null
}) {
    const [expandedOrder, setExpandedOrder] = useState(null);
    const themeWithDefaults = getThemeWithDefaults(themeSettings);
    const themeProfileStyles = getComponentStyles(themeWithDefaults, 'profile');

    // Datos de ejemplo para el builder
    const exampleOrders = [
        {
            id: 1,
            order_number: 'ORD-2024-001',
            status: 'delivered',
            total: 125.50,
            created_at: '2024-01-15T10:30:00Z',
            delivery_address: 'Calle Principal 123, Ciudad',
            payment_method: 'Tarjeta de Crédito',
            items: [
                {
                    id: 1,
                    product_name: 'Producto A',
                    quantity: 2,
                    price: 50.00,
                    image: 'https://picsum.photos/80/80?random=1'
                },
                {
                    id: 2,
                    product_name: 'Producto B',
                    quantity: 1,
                    price: 25.50,
                    image: 'https://picsum.photos/80/80?random=2'
                }
            ]
        },
        {
            id: 2,
            order_number: 'ORD-2024-002',
            status: 'processing',
            total: 89.99,
            created_at: '2024-01-20T14:15:00Z',
            delivery_address: 'Avenida Central 456, Ciudad',
            payment_method: 'Efectivo',
            items: [
                {
                    id: 3,
                    product_name: 'Producto C',
                    quantity: 3,
                    price: 29.99,
                    image: 'https://picsum.photos/80/80?random=3'
                }
            ]
        },
        {
            id: 3,
            order_number: 'ORD-2024-003',
            status: 'pending',
            total: 199.99,
            created_at: '2024-01-22T09:45:00Z',
            delivery_address: 'Plaza Mayor 789, Ciudad',
            payment_method: 'Transferencia',
            items: [
                {
                    id: 4,
                    product_name: 'Producto Premium',
                    quantity: 1,
                    price: 199.99,
                    image: 'https://picsum.photos/80/80?random=4'
                }
            ]
        }
    ];

    const currentOrders = mode === 'frontend' ? orders : exampleOrders;

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: {
                label: 'Pendiente',
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: Clock
            },
            processing: {
                label: 'Procesando',
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: Package
            },
            shipped: {
                label: 'Enviado',
                color: 'bg-purple-100 text-purple-800 border-purple-200',
                icon: Truck
            },
            delivered: {
                label: 'Entregado',
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: CheckCircle
            },
            cancelled: {
                label: 'Cancelado',
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: XCircle
            }
        };
        return statusMap[status] || statusMap.pending;
    };

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const content = comp.content || {};
    const styles = comp.styles || {};

    // Aplicar estilos del tema
    const containerStyles = {
        backgroundColor: styles.backgroundColor || themeProfileStyles.backgroundColor || hslToCss(themeWithDefaults.background),
        padding: `${styles.paddingTop || '40'}px ${styles.paddingRight || '20'}px ${styles.paddingBottom || '40'}px ${styles.paddingLeft || '20'}px`,
        maxWidth: styles.maxWidth || '1000px',
        margin: '0 auto',
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
        ...styles
    };

    const titleStyles = {
        color: styles.titleColor || hslToCss(themeWithDefaults.heading),
        fontFamily: getResolvedFont(themeWithDefaults, 'heading_font'),
    };

    if (!currentOrders || currentOrders.length === 0) {
        return (
            <div style={containerStyles}>
                <Card>
                    <CardContent className="p-8 text-center">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2" style={titleStyles}>
                            {content.emptyTitle || 'No tienes pedidos aún'}
                        </h3>
                        <p className="mb-4" style={{ color: hslToCss(themeWithDefaults.text) }}>
                            {content.emptyMessage || 'Cuando realices tu primer pedido, aparecerá aquí.'}
                        </p>
                        <Button style={{
                            ...getButtonStyles(themeWithDefaults, 'primary'),
                            fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
                        }}>
                            {content.shopButtonText || 'Ir a la tienda'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div style={containerStyles}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={titleStyles}>
                        <Package className="h-6 w-6" />
                        {content.title || 'Mis Pedidos'}
                    </CardTitle>
                    <p style={{ color: hslToCss(themeWithDefaults.text) }}>
                        {content.subtitle || `Tienes ${currentOrders.length} pedido${currentOrders.length !== 1 ? 's' : ''}`}
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {currentOrders.map((order) => {
                        const statusInfo = getStatusInfo(order.status);
                        const StatusIcon = statusInfo.icon;
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <Card key={order.id} className="border">
                                <CardContent className="p-4">
                                    {/* Header del pedido */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h3 className="font-semibold text-lg" style={titleStyles}>
                                                    {order.order_number}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm" style={{ color: hslToCss(themeWithDefaults.text) }}>
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <Badge className={statusInfo.color}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusInfo.label}
                                            </Badge>
                                            <div className="text-right">
                                                <p className="font-semibold text-lg" style={{ color: hslToCss(themeWithDefaults.links) }}>
                                                    ${order.total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información básica */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span style={{ color: hslToCss(themeWithDefaults.text) }}>
                                                {order.delivery_address}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CreditCard className="h-4 w-4 text-gray-500" />
                                            <span style={{ color: hslToCss(themeWithDefaults.text) }}>
                                                {order.payment_method}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Botón para expandir/contraer */}
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleOrderExpansion(order.id)}
                                            className="flex items-center gap-2"
                                            style={{
                                                color: hslToCss(themeWithDefaults.links),
                                                fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
                                            }}
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
                                            <Separator className="my-4" />
                                            <div className="space-y-4">
                                                <h4 className="font-semibold" style={titleStyles}>Productos</h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg" style={{
                                                            backgroundColor: hslToCss(themeWithDefaults.background),
                                                            border: `1px solid ${hslToCss(themeWithDefaults.borders)}`,
                                                        }}>
                                                            <img
                                                                src={item.image}
                                                                alt={item.product_name}
                                                                className="w-16 h-16 object-cover rounded"
                                                            />
                                                            <div className="flex-1">
                                                                <h5 className="font-medium" style={{ color: hslToCss(themeWithDefaults.heading) }}>
                                                                    {item.product_name}
                                                                </h5>
                                                                <p className="text-sm" style={{ color: hslToCss(themeWithDefaults.text) }}>
                                                                    Cantidad: {item.quantity}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold" style={{ color: hslToCss(themeWithDefaults.links) }}>
                                                                    ${(item.price * item.quantity).toFixed(2)}
                                                                </p>
                                                                <p className="text-sm" style={{ color: hslToCss(themeWithDefaults.text) }}>
                                                                    ${item.price.toFixed(2)} c/u
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Resumen del pedido */}
                                                <div className="p-4 rounded-lg" style={{
                                                    backgroundColor: hslToCss(themeWithDefaults.background),
                                                    border: `1px solid ${hslToCss(themeWithDefaults.borders)}`,
                                                }}>
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold" style={{ color: hslToCss(themeWithDefaults.heading) }}>
                                                            Total del pedido:
                                                        </span>
                                                        <span className="font-bold text-lg" style={{ color: hslToCss(themeWithDefaults.links) }}>
                                                            ${order.total.toFixed(2)}
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
    );
}

export default OrdersComponent;