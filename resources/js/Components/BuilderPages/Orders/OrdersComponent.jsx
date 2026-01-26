import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import CanvasItem from '../CanvasItem';
import CurrencyDisplay from '@/Components/CurrencyDisplay';

const OrdersComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme,
    isPreview,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId,
    mode = 'builder',
    currentUser = null,
    userOrders = [],
    companyId = null,
    currency = null
}) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    console.log(selectedOrder)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: comp.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const componentStyles = getStyles(comp);
    const content = comp.content || {};
    const children = content.children || [];

    // Datos de ejemplo para el builder
    const exampleOrders = mode === 'builder' ? [
        {
            id: 1,
            status: 'completed',
            total: 150.00,
            delivery_type: 'delivery',
            totaldiscounts: 2.00,
            payment_status: 'completed',
            tax_amount: 16.00,
            created_at: '2024-01-15T10:30:00Z',
            items: [
                {
                    id: 1,
                    name_product: 'Producto Ejemplo 1',
                    quantity: 2,
                    price_product: 50.00,
                    subtotal: 100.00
                },
                {
                    id: 2,
                    name_product: 'Producto Ejemplo 2',
                    quantity: 1,
                    price_product: 50.00,
                    subtotal: 50.00
                }
            ],
            paymentMethod: { name: 'Tarjeta de Crédito' },
            shippingRate: { name: 'Envío Estándar', price: 10.00 },
            deliveryLocation: {
                address_line_1: '',
                address_line_2: '',
                postal_code: '',
                phone_number: '',
                notes: '',
                is_default: '',
                country_id: '',
                state_id: '',
                city_id: '',
            }
        },
        {
            id: 2,
            status: 'pending',
            total: 75.50,
            created_at: '2024-01-10T14:20:00Z',
            items: [
                {
                    id: 3,
                    name_product: 'Producto Ejemplo 3',
                    quantity: 1,
                    price_product: 75.50,
                    subtotal: 75.50
                }
            ],
            paymentMethod: { name: 'Efectivo' },
            shippingRate: null
        }
    ] : userOrders;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Pendiente',
            processing: 'Procesando',
            completed: 'Completado',
            cancelled: 'Cancelado'
        };
        return texts[status] || status;
    };

    const handleOrderClick = (order) => {
        if (mode === 'frontend' && content.allowExpandDetails !== false) {
            setSelectedOrder(selectedOrder?.id === order.id ? null : order);
            setIsExpanded(!isExpanded || selectedOrder?.id !== order.id);
        }
    };

    const renderOrderCard = (order) => (
        <div
            key={order.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedOrder?.id === order.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
            onClick={() => handleOrderClick(order)}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-lg">
                        Orden #{order.id}
                    </h3>
                    {content.showOrderDate !== false && (
                        <p className="text-sm text-gray-600">
                            {formatDate(order.created_at)}
                        </p>
                    )}
                </div>
                <div className="text-right">
                    {content.showOrderTotal !== false && (
                        <div className="font-bold text-lg">
                            <CurrencyDisplay currency={currency} amount={order.total} />
                        </div>
                    )}
                    {content.showOrderStatus !== false && (
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                        </span>
                    )}
                </div>
            </div>

            {content.showItemCount !== false && (
                <div className="text-sm text-gray-600">
                    {order.items?.length || 0} producto(s)
                </div>
            )}

            {mode === 'frontend' && content.allowExpandDetails !== false && (
                <div className="mt-2 flex items-center text-blue-600 text-sm">
                    {selectedOrder?.id === order.id ? (
                        <>
                            <EyeOff size={16} className="mr-1" />
                            Ocultar detalles
                        </>
                    ) : (
                        <>
                            <Eye size={16} className="mr-1" />
                            Ver detalles
                        </>
                    )}
                </div>
            )}
        </div>
    );

    const renderOrderDetails = (order) => (
        <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold mb-3">Detalles del Pedido</h4>

            {/* Información del pedido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    {/* <h5 className="font-medium mb-2">Información General</h5> */}
                    <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Tipo de entrega:</span> {getStatusText(order.delivery_type)}</div>
                        {/* <div><span className="font-medium">Estado:</span> {getStatusText(order.status)}</div> */}
                        {/* <div><span className="font-medium">Fecha:</span> {formatDate(order.created_at)}</div> */}
                        {order.payment_status && (
                            <div><span className="font-medium">Estado de págo:</span> {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}</div>
                        )}
                        {order.paymentMethod && (
                            <div><span className="font-medium">Método de pago:</span> {order.paymentMethod.name}</div>
                        )}
                        {order.shippingRate && (
                            <div><span className="font-medium">Envío:</span> {order.shippingRate.name}</div>
                        )}
                        {order.deliveryLocation && (
                            <div><span className="font-medium">Dirección de envio:</span>
                                {order.deliveryLocation.address_line_1},
                                {order.deliveryLocation.address_line_2},
                                {order.deliveryLocation.country_id},
                                {order.deliveryLocation.state_id},
                                {order.deliveryLocation.city_id}, <br />
                                <span className="font-medium">Código postal:</span> {order.deliveryLocation.postal_code}, <br />
                                <span className="font-medium">Télefono:</span> {order.deliveryLocation.phone_number}, <br />
                                <span className="font-medium">Nota:</span> {order.deliveryLocation.notes},

                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h5 className="font-medium mb-2">Resumen</h5>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Descuento:</span>
                            <CurrencyDisplay currency={currency} amount={order.totaldiscounts || 0} />
                        </div>
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <CurrencyDisplay currency={currency} amount={order.subtotal || 0} />
                        </div>
                        <div className="flex justify-between">
                            <span>Impuesto:</span>
                            <CurrencyDisplay currency={currency} amount={order.tax_amount || 0} />
                        </div>
                        {order.shippingRate && (
                            <div className="flex justify-between">
                                <span>Envío:</span>
                                <CurrencyDisplay currency={currency} amount={order.shippingRate.price} />
                            </div>
                        )}
                        <div className="flex justify-between font-bold border-t pt-1">
                            <span>Total:</span>
                            <CurrencyDisplay currency={currency} amount={order.total} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Productos */}
            <div>
                <h5 className="font-medium mb-2">Productos</h5>
                <div className="space-y-2">
                    {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                                <div className="font-medium">{item.name_product}</div>
                                <div className="font-medium text-sm">
                                    {(() => {
                                        if (!item.product_details) return '';

                                        try {
                                            const details = typeof item.product_details === 'string'
                                                ? JSON.parse(item.product_details)
                                                : item.product_details;

                                            const attributes = details.attributes;
                                            if (!attributes) return '';

                                            // Limpia el formato " - "
                                            return attributes.replace(/^\s*-\s*/, '');
                                        } catch (error) {
                                            console.error('Error parsing product_details:', error);
                                            return 'Error al cargar variación';
                                        }
                                    })()}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Cantidad: {item.quantity} × <CurrencyDisplay currency={currency} amount={item.price_product} />
                                </div>

                                {item.discount_amount && (
                                    <div className="text-sm text-green-600">
                                        Ahorro: {item.quantity} × <CurrencyDisplay currency={currency} amount={item.discount_amount} />
                                    </div>
                                )}
                                {item.tax_amount && (
                                    <div className="text-sm text-gray-600">
                                        Impuesto: {item.quantity} × <CurrencyDisplay currency={currency} amount={item.tax_amount} />
                                    </div>
                                )}
                            </div>
                            <div className="font-medium">
                                <CurrencyDisplay currency={currency} amount={item.subtotal} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (!isPreview) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="relative group"
                {...attributes}
            >

                <div
                    className="min-h-[200px] mx-auto"
                    style={componentStyles}
                >
                    {/* Vista previa en builder */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold">
                                {content.title || 'Mis Pedidos'}
                            </h2>
                            {content.subtitle && (
                                <p className="text-gray-600 mt-2">{content.subtitle}</p>
                            )}
                        </div>
                        {exampleOrders.map(renderOrderCard)}
                    </div>
                </div>
            </div>
        );
    }

    // Vista frontend
    return (
        <div style={componentStyles} className="space-y-6 mx-auto">
            {/* Contenido principal */}
            {!currentUser ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">
                        {content.loginRequiredTitle || 'Inicia sesión para ver tus pedidos'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {content.loginRequiredMessage || 'Necesitas iniciar sesión para acceder a tu historial de pedidos.'}
                    </p>
                    <Button>
                        {content.loginButtonText || 'Iniciar Sesión'}
                    </Button>
                </div>
            ) : exampleOrders.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">
                        {content.emptyTitle || 'No tienes pedidos aún'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {content.emptyMessage || 'Cuando realices tu primer pedido, aparecerá aquí.'}
                    </p>
                    {/* Verificar si puede crear órdenes */}
                    {companyId && !window.canCreateOrders ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                                Funcionalidad Limitada
                            </h3>
                            <p className="text-yellow-800 mb-4">
                                Estás en período de prueba. Para crear pedidos necesitas una suscripción activa.
                            </p>
                            <Button asChild>
                                <a href="/dashboard/subscriptions">
                                    Ver Planes de Suscripción
                                </a>
                            </Button>
                        </div>
                    ) : (
                        <Button>
                            {content.shopButtonText || 'Explorar Productos'}
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {content.title || 'Mis Pedidos'}
                        </h2>
                        {content.subtitle && (
                            <p className="text-gray-600 mt-2">{content.subtitle}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        {exampleOrders.map((order) => (
                            <div key={order.id}>
                                {renderOrderCard(order)}
                                {selectedOrder?.id === order.id && content.allowExpandDetails !== false && renderOrderDetails(order)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersComponent;