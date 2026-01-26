import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';

export default function SubscriptionShow({ subscription }) {
    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            trial: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
            expired: 'bg-orange-100 text-orange-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status) => {
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
            active: 'Activa',
            inactive: 'Inactiva',
            trial: 'Prueba',
            cancelled: 'Cancelada',
            expired: 'Expirada',
        };
        return texts[status] || status;
    };

    const getPaymentStatusText = (status) => {
        const texts = {
            pending: 'Pendiente',
            completed: 'Completado',
            failed: 'Fallido',
            cancelled: 'Cancelado',
            refunded: 'Reembolsado',
        };
        return texts[status] || status;
    };

    const handleStatusChange = (newStatus) => {
        if (confirm(`¿Estás seguro de cambiar el estado a "${getStatusText(newStatus)}"?`)) {
            router.post(route('admin.subscriptions.update-status', subscription.id), {
                status: newStatus
            });
        }
    };

    const handleApprovePayment = (paymentId) => {
        if (confirm('¿Estás seguro de aprobar este pago?')) {
            router.post(route('admin.subscriptions.approve-payment', paymentId));
        }
    };

    const handleRejectPayment = (paymentId) => {
        if (confirm('¿Estás seguro de rechazar este pago?')) {
            router.post(route('admin.subscriptions.reject-payment', paymentId));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.subscriptions.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Link>
                        </Button>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Suscripción #{subscription.id}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Suscripción #${subscription.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Información Principal */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detalles de la Suscripción</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Empresa</label>
                                            <p className="text-lg font-semibold">{subscription.company?.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Plan</label>
                                            <p className="text-lg font-semibold">{subscription.plan?.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Estado</label>
                                            <div className="mt-1">
                                                <Badge className={getStatusColor(subscription.status)}>
                                                    {getStatusText(subscription.status)}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Ciclo de Facturación</label>
                                            <p className="text-lg font-semibold">
                                                {subscription.billing_cycle === 'yearly' ? 'Anual' : 'Mensual'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Monto</label>
                                            <p className="text-lg font-semibold">
                                                <CurrencyDisplay 
                                                    currency={{ symbol: '$', code: subscription.currency }} 
                                                    amount={subscription.amount} 
                                                />
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Moneda</label>
                                            <p className="text-lg font-semibold">{subscription.currency}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Fecha de Inicio</label>
                                            <p className="text-lg font-semibold">
                                                {subscription.starts_at ? 
                                                    new Date(subscription.starts_at).toLocaleDateString() : 
                                                    'N/A'
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Fecha de Vencimiento</label>
                                            <p className="text-lg font-semibold">
                                                {subscription.ends_at ? 
                                                    new Date(subscription.ends_at).toLocaleDateString() : 
                                                    'N/A'
                                                }
                                            </p>
                                        </div>
                                        {subscription.trial_ends_at && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Fin de Prueba</label>
                                                <p className="text-lg font-semibold">
                                                    {new Date(subscription.trial_ends_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                        {subscription.cancelled_at && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Fecha de Cancelación</label>
                                                <p className="text-lg font-semibold">
                                                    {new Date(subscription.cancelled_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Historial de Pagos */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Historial de Pagos</CardTitle>
                                    <CardDescription>
                                        Todos los pagos relacionados con esta suscripción
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {subscription.payments && subscription.payments.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead>Método</TableHead>
                                                    <TableHead>Monto</TableHead>
                                                    <TableHead>Estado</TableHead>
                                                    <TableHead>Fecha</TableHead>
                                                    <TableHead>Acciones</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {subscription.payments.map((payment) => (
                                                    <TableRow key={payment.id}>
                                                        <TableCell className="font-mono">#{payment.id}</TableCell>
                                                        <TableCell className="capitalize">
                                                            {payment.payment_method === 'paypal' ? 'PayPal' : 
                                                             payment.payment_method === 'stripe' ? 'Stripe' : 
                                                             'Offline'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <CurrencyDisplay 
                                                                currency={{ symbol: '$', code: payment.currency }} 
                                                                amount={payment.amount} 
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={getPaymentStatusColor(payment.status)}>
                                                                {getPaymentStatusText(payment.status)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(payment.created_at).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            {payment.status === 'pending' && (
                                                                <div className="flex gap-2">
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="outline"
                                                                        className="text-green-600 hover:text-green-700"
                                                                        onClick={() => handleApprovePayment(payment.id)}
                                                                    >
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="outline"
                                                                        className="text-red-600 hover:text-red-700"
                                                                        onClick={() => handleRejectPayment(payment.id)}
                                                                    >
                                                                        <XCircle className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No hay pagos registrados para esta suscripción.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Panel de Acciones */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Acciones</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button 
                                        className="w-full" 
                                        variant="outline"
                                        onClick={() => handleStatusChange('active')}
                                        disabled={subscription.status === 'active'}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Activar
                                    </Button>
                                    <Button 
                                        className="w-full" 
                                        variant="outline"
                                        onClick={() => handleStatusChange('inactive')}
                                        disabled={subscription.status === 'inactive'}
                                    >
                                        <Clock className="h-4 w-4 mr-2" />
                                        Desactivar
                                    </Button>
                                    <Button 
                                        className="w-full" 
                                        variant="outline"
                                        onClick={() => handleStatusChange('cancelled')}
                                        disabled={subscription.status === 'cancelled'}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Cancelar
                                    </Button>
                                    <Button 
                                        className="w-full" 
                                        variant="outline"
                                        onClick={() => handleStatusChange('expired')}
                                        disabled={subscription.status === 'expired'}
                                    >
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Marcar como Expirada
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Información de la Empresa */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información de la Empresa</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nombre</label>
                                        <p className="font-semibold">{subscription.company?.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="font-semibold">{subscription.company?.email}</p>
                                    </div>
                                    {subscription.company?.phone && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Teléfono</label>
                                            <p className="font-semibold">{subscription.company.phone}</p>
                                        </div>
                                    )}
                                    {subscription.company?.address && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Dirección</label>
                                            <p className="font-semibold">{subscription.company.address}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}