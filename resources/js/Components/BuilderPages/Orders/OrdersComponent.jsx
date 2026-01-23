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
            shippingRate: { name: 'Envío Estándar', price: 10.00 }
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
        if (mode === 'frontend') {
            setSelectedOrder(selectedOrder?.id === order.id ? null : order);
            setIsExpanded(!isExpanded || selectedOrder?.id !== order.id);
        }
    };

    const renderOrderCard = (order) => (
        <div
            key={order.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedOrder?.id === order.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleOrderClick(order)}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-lg">
                        Orden #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                    </p>
                </div>
                <div className="text-right">
                    <div className="font-bold text-lg">
                        <CurrencyDisplay currency={currency} amount={order.total} />
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                    </span>
                </div>
            </div>
            
            <div className="text-sm text-gray-600">
                {order.items?.length || 0} producto(s)
            </div>
            
            {mode === 'frontend' && (
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
                    <h5 className="font-medium mb-2">Información General</h5>
                    <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Estado:</span> {getStatusText(order.status)}</div>
                        <div><span className="font-medium">Fecha:</span> {formatDate(order.created_at)}</div>
                        {order.paymentMethod && (
                            <div><span className="font-medium">Método de pago:</span> {order.paymentMethod.name}</div>
                        )}
                        {order.shippingRate && (
                            <div><span className="font-medium">Envío:</span> {order.shippingRate.name}</div>
                        )}
                    </div>
                </div>
                
                <div>
                    <h5 className="font-medium mb-2">Resumen</h5>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <CurrencyDisplay currency={currency} amount={order.subtotal || 0} />
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
                                <div className="text-sm text-gray-600">
                                    Cantidad: {item.quantity} × <CurrencyDisplay currency={currency} amount={item.price_product} />
                                </div>
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
                {/* Controles del builder */}
                <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 bg-white border-gray-300"
                        onClick={() => onEdit(comp)}
                    >
                        <Edit size={12} />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 bg-white border-gray-300"
                        onClick={() => onDelete(comp.id)}
                    >
                        <Trash2 size={12} />
                    </Button>
                    <div
                        className="h-6 w-6 bg-white border border-gray-300 rounded flex items-center justify-center cursor-grab"
                        {...listeners}
                    >
                        <GripVertical size={12} />
                    </div>
                </div>

                <div
                    className="min-h-[200px] p-4 border-2 border-dashed border-gray-300 rounded-lg"
                    style={componentStyles}
                >
                    {/* Vista previa en builder */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Mis Pedidos</h2>
                        {exampleOrders.map(renderOrderCard)}
                    </div>
                </div>
            </div>
        );
    }

    // Vista frontend
    return (
        <div style={componentStyles} className="space-y-6">
            {/* Contenido principal */}
            {!currentUser ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">Inicia sesión para ver tus pedidos</h2>
                    <p className="text-gray-600 mb-6">
                        Necesitas iniciar sesión para acceder a tu historial de pedidos.
                    </p>
                    <Button>
                        Iniciar Sesión
                    </Button>
                </div>
            ) : exampleOrders.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">No tienes pedidos aún</h2>
                    <p className="text-gray-600 mb-6">
                        Cuando realices tu primer pedido, aparecerá aquí.
                    </p>
                    <Button>
                        Explorar Productos
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Mis Pedidos</h2>
                    
                    <div className="space-y-4">
                        {exampleOrders.map((order) => (
                            <div key={order.id}>
                                {renderOrderCard(order)}
                                {selectedOrder?.id === order.id && renderOrderDetails(order)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersComponent;