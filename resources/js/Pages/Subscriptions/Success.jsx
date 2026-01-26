import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';

export default function SubscriptionSuccess({ payment }) {
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
                    Pago Exitoso
                </h2>
            }
        >
            <Head title="Pago Exitoso" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            ¡Pago Exitoso!
                        </h1>
                        <p className="text-lg text-gray-600">
                            Tu suscripción ha sido activada correctamente
                        </p>
                    </div>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Detalles del Pago</CardTitle>
                            <CardDescription>
                                Información de tu transacción
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Plan:</span>
                                    <p className="text-lg font-semibold">{payment.subscription.plan.name}</p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Monto Pagado:</span>
                                    <p className="text-lg font-semibold">
                                        {formatPrice(payment.amount, payment.currency)}
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Método de Pago:</span>
                                    <p className="text-lg font-semibold capitalize">
                                        {payment.payment_method === 'paypal' ? 'PayPal' : 
                                         payment.payment_method === 'stripe' ? 'Tarjeta de Crédito' : 
                                         'Pago Offline'}
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Fecha de Pago:</span>
                                    <p className="text-lg font-semibold">
                                        {new Date(payment.paid_at || payment.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Período de Suscripción:</span>
                                    <p className="text-lg font-semibold">
                                        {new Date(payment.subscription.starts_at).toLocaleDateString()} - {' '}
                                        {new Date(payment.subscription.ends_at).toLocaleDateString()}
                                    </p>
                                </div>
                                
                                {payment.transaction_id && (
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">ID de Transacción:</span>
                                        <p className="text-lg font-semibold font-mono">
                                            {payment.transaction_id}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-green-900 mb-2">
                            ¿Qué sigue?
                        </h3>
                        <ul className="space-y-2 text-green-800">
                            <li>• Tu suscripción está activa y puedes usar todas las funcionalidades</li>
                            <li>• Recibirás un email de confirmación con los detalles</li>
                            <li>• Puedes ver tu historial de pagos en cualquier momento</li>
                            <li>• Tu próxima facturación será el {new Date(payment.subscription.ends_at).toLocaleDateString()}</li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                            <Link href={route('dashboard')}>
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Ir al Dashboard
                            </Link>
                        </Button>
                        
                        <Button variant="outline" asChild>
                            <Link href={route('subscriptions.payments')}>
                                <Download className="h-4 w-4 mr-2" />
                                Ver Historial de Pagos
                            </Link>
                        </Button>
                        
                        <Button variant="outline" asChild>
                            <Link href={route('subscriptions.index')}>
                                Gestionar Suscripción
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-600">
                            ¿Tienes alguna pregunta? {' '}
                            <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800">
                                Contáctanos
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}