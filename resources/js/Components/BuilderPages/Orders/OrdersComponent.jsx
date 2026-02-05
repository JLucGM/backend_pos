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
    XCircle,
    ShoppingCart
} from 'lucide-react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, getButtonStyles } from '@/utils/themeUtils';

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

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const content = comp.content || {};
    const styles = comp.styles || {};

    // 1. Contenedor principal que usa el fondo del tema
    const outerContainerStyles = {
        width: '100%',
        minHeight: mode === 'frontend' ? '100vh' : 'auto',
        backgroundColor: themeWithDefaults.background || { h: 0, s: 0, l: 100 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: mode === 'frontend' ? 'flex-start' : 'center',
        padding: mode === 'frontend' ? '20px' : '0',
    };

    // 2. Contenedor interno
    const containerStyles = {
        backgroundColor: styles.backgroundColor || themeWithDefaults.background,
        padding: `${styles.paddingTop || '40px'} ${styles.paddingRight || '20px'} ${styles.paddingBottom || '40px'} ${styles.paddingLeft || '20px'}`,
        maxWidth: styles.maxWidth || '1000px',
        width: '100%',
        margin: '0 auto',
        minHeight: mode === 'frontend' ? 'auto' : '100%',
    };

    // Estilos para títulos
    const titleStyles = {
        color: styles.titleColor || themeWithDefaults.heading,
        fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme),
    };

    // Estilos para texto general
    const textStyles = {
        color: themeWithDefaults.text,
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    // Estilos para botones primarios
    const primaryButtonStyles = {
        backgroundColor: themeWithDefaults.primary_button_background,
        color: themeWithDefaults.primary_button_text,
        borderRadius: themeWithDefaults.primary_button_corner_radius || '8px',
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    // Estilos para botones ghost/outline
    const ghostButtonStyles = {
        color: themeWithDefaults.text,
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    if (!currentOrders || currentOrders.length === 0) {
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
                            {content.subtitle || `Tienes ${currentOrders.length} pedido${currentOrders.length !== 1 ? 's' : ''}`}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {currentOrders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            const StatusIcon = statusInfo.icon;
                            const isExpanded = expandedOrder === order.id;

                            // Determinar color del badge según el estado
                            const getStatusBadgeColor = () => {
                                switch(statusInfo.color) {
                                    case 'yellow':
                                        return {
                                            background: `${themeWithDefaults.primary_button_background}20`,
                                            color: themeWithDefaults.text,
                                            border: `1px solid ${themeWithDefaults.borders}`
                                        };
                                    case 'green':
                                        return {
                                            background: `${{...themeWithDefaults, primary_button_background: '131 98% 40%'}}20`,
                                            color: {...themeWithDefaults, text: '131 50% 20%'},
                                            border: `1px solid ${themeWithDefaults.borders}`
                                        };
                                    case 'red':
                                        return {
                                            background: `${{...themeWithDefaults, primary_button_background: '0 84% 60%'}}20`,
                                            color: {...themeWithDefaults, text: '0 72% 51%'},
                                            border: `1px solid ${themeWithDefaults.borders}`
                                        };
                                    case 'blue':
                                        return {
                                            background: `${{...themeWithDefaults, primary_button_background: '221 83% 53%'}}20`,
                                            color: {...themeWithDefaults, text: '221 83% 53%'},
                                            border: `1px solid ${themeWithDefaults.borders}`
                                        };
                                    case 'purple':
                                        return {
                                            background: `${{...themeWithDefaults, primary_button_background: '262 83% 58%'}}20`,
                                            color: {...themeWithDefaults, text: '262 83% 58%'},
                                            border: `1px solid ${themeWithDefaults.borders}`
                                        };
                                    default:
                                        return {
                                            background: `${themeWithDefaults.primary_button_background}20`,
                                            color: themeWithDefaults.text,
                                            border: `1px solid ${themeWithDefaults.borders}`
                                        };
                                }
                            };

                            const badgeStyle = getStatusBadgeColor();

                            return (
                                <Card key={order.id} style={{
                                    borderColor: themeWithDefaults.borders,
                                    backgroundColor: themeWithDefaults.background,
                                }}>
                                    <CardContent className="p-4">
                                        {/* Header del pedido */}
                                        <div className="flex items-center justify-between mb-4">
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
                                            
                                            <div className="flex items-center gap-3">
                                                <Badge style={badgeStyle}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {statusInfo.label}
                                                </Badge>
                                                <div className="text-right">
                                                    <p className="font-semibold text-lg" style={{ color: themeWithDefaults.links }}>
                                                        ${order.total.toFixed(2)}
                                                    </p>
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
                                                variant="ghost"
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
                                                            <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg" style={{
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
                                                                    <p className="text-sm" style={textStyles}>
                                                                        Cantidad: {item.quantity}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold" style={{ color: themeWithDefaults.links }}>
                                                                        ${(item.price * item.quantity).toFixed(2)}
                                                                    </p>
                                                                    <p className="text-sm" style={textStyles}>
                                                                        ${item.price.toFixed(2)} c/u
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Resumen del pedido */}
                                                    <div className="p-4 rounded-lg" style={{
                                                        backgroundColor: themeWithDefaults.background,
                                                        border: `1px solid ${themeWithDefaults.borders}`,
                                                    }}>
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-semibold" style={titleStyles}>
                                                                Total del pedido:
                                                            </span>
                                                            <span className="font-bold text-lg" style={{ color: themeWithDefaults.links }}>
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
        </div>
    );
}

export default OrdersComponent;
