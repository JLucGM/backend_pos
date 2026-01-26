import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Clock, Mail, Phone, ArrowLeft } from 'lucide-react';

export default function SubscriptionPending({ payment }) {
    const formatPrice = (price, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pago Pendiente
                </h2>
            }
        >
            <Head title="Pago Pendiente" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Clock className="h-16 w-16 text-yellow-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Pago en Proceso
                        </h1>
                        <p className="text-lg text-gray-600">
                            Estamos verificando tu pago
                        </p>
                    </div>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Detalles del Pago</CardTitle>
                            <CardDescription>
                                Información de tu transacción pendiente
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Plan:</span>
                                    <p className="text-lg font-semibold">{payment.subscription.plan.name}</p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Monto:</span>
                                    <p className="text-lg font-semibold">
                                        {formatPrice(payment.amount, payment.currency)}
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Método de Pago:</span>
                                    <p className="text-lg font-semibold">
                                        {payment.payment_method === 'offline' ? 'Pago Offline' : payment.payment_method}
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Fecha de Solicitud:</span>
                                    <p className="text-lg font-semibold">
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {payment.notes && (
                                <div className="mt-4">
                                    <span className="text-sm font-medium text-gray-500">Notas del Pago:</span>
                                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">{payment.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                            ¿Qué está pasando?
                        </h3>
                        <div className="space-y-3 text-yellow-800">
                            <p>
                                Tu pago está siendo procesado y verificado por nuestro equipo. 
                                Este proceso puede tomar entre 1-3 días hábiles.
                            </p>
                            <p>
                                Una vez confirmado el pago, tu suscripción se activará automáticamente 
                                y recibirás una notificación por email.
                            </p>
                        </div>
                    </div>

                    {payment.payment_method === 'offline' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">
                                Información de Pago Offline
                            </h3>
                            <div className="space-y-2 text-blue-800">
                                <p><strong>Banco:</strong> Banco de Venezuela</p>
                                <p><strong>Cuenta:</strong> 0102-1234-5678-9012</p>
                                <p><strong>Titular:</strong> Tu Empresa SaaS</p>
                                <p><strong>Pago Móvil:</strong> 0414-123-4567 (C.I. 12.345.678)</p>
                            </div>
                            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    <strong>Importante:</strong> Asegúrate de haber realizado el pago por el monto exacto: {' '}
                                    <span className="font-bold">{formatPrice(payment.amount, payment.currency)}</span>
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            ¿Necesitas ayuda?
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">Email de Soporte</p>
                                    <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800">
                                        support@example.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">Teléfono de Soporte</p>
                                    <a href="tel:+58414123456" className="text-blue-600 hover:text-blue-800">
                                        +58 414-123-4567
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                            <Link href={route('dashboard')}>
                                Ir al Dashboard
                            </Link>
                        </Button>
                        
                        <Button variant="outline" asChild>
                            <Link href={route('subscriptions.payments')}>
                                Ver Historial de Pagos
                            </Link>
                        </Button>
                        
                        <Button variant="outline" asChild>
                            <Link href={route('subscriptions.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver a Planes
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}