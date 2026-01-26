import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Download, Eye, ArrowLeft } from 'lucide-react';

export default function SubscriptionPayments({ payments }) {
    const formatPrice = (price, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
            refunded: 'bg-purple-100 text-purple-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Pendiente',
            completed: 'Completado',
            failed: 'Fallido',
            cancelled: 'Cancelado',
            refunded: 'Reembolsado',
        };
        return texts[status] || status;
    };

    const getPaymentMethodText = (method) => {
        const methods = {
            paypal: 'PayPal',
            stripe: 'Tarjeta de Crédito',
            offline: 'Pago Offline',
        };
        return methods[method] || method;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Historial de Pagos
                    </h2>
                    <Button variant="outline" asChild>
                        <Link href={route('subscriptions.index')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a Planes
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title="Historial de Pagos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {payments.data.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <div className="text-gray-500 mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No hay pagos registrados
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Cuando realices tu primer pago, aparecerá aquí.
                                </p>
                                <Button asChild>
                                    <Link href={route('subscriptions.index')}>
                                        Ver Planes Disponibles
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {payments.data.map((payment) => (
                                <Card key={payment.id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Pago #{payment.id}
                                                </CardTitle>
                                                <CardDescription>
                                                    {payment.subscription.plan.name} - {' '}
                                                    {new Date(payment.created_at).toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold mb-1">
                                                    {formatPrice(payment.amount, payment.currency)}
                                                </div>
                                                <Badge className={getStatusColor(payment.status)}>
                                                    {getStatusText(payment.status)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Método de Pago:</span>
                                                <p className="font-semibold">
                                                    {getPaymentMethodText(payment.payment_method)}
                                                </p>
                                            </div>
                                            
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Período de Suscripción:</span>
                                                <p className="font-semibold">
                                                    {payment.subscription.billing_cycle === 'yearly' ? 'Anual' : 'Mensual'}
                                                </p>
                                            </div>
                                            
                                            {payment.paid_at && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Fecha de Pago:</span>
                                                    <p className="font-semibold">
                                                        {new Date(payment.paid_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {payment.transaction_id && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">ID de Transacción:</span>
                                                    <p className="font-semibold font-mono text-sm">
                                                        {payment.transaction_id}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Vigencia:</span>
                                                <p className="font-semibold">
                                                    {new Date(payment.subscription.starts_at).toLocaleDateString()} - {' '}
                                                    {new Date(payment.subscription.ends_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {payment.notes && (
                                            <div className="mt-4">
                                                <span className="text-sm font-medium text-gray-500">Notas:</span>
                                                <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                                                    {payment.notes}
                                                </p>
                                            </div>
                                        )}

                                        {payment.status === 'pending' && payment.payment_method === 'offline' && (
                                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <h4 className="font-medium text-yellow-900 mb-2">
                                                    Pago Pendiente de Verificación
                                                </h4>
                                                <p className="text-sm text-yellow-800">
                                                    Tu pago está siendo procesado. Te notificaremos cuando sea confirmado.
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-4 flex justify-end space-x-2">
                                            {payment.status === 'completed' && (
                                                <Button variant="outline" size="sm">
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Descargar Recibo
                                                </Button>
                                            )}
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                Ver Detalles
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Paginación */}
                            {payments.links && (
                                <div className="flex justify-center space-x-2">
                                    {payments.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 text-sm rounded-md ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}