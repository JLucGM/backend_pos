import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Textarea } from '@/Components/ui/textarea';
import { CreditCard, Smartphone, Building } from 'lucide-react';
import InputError from '@/Components/InputError';

export default function SubscriptionPayment({ subscription, paymentMethods }) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        payment_method: '',
        notes: '',
    });

    const formatPrice = (price, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('subscriptions.process-payment', subscription.id));
    };

    const paymentMethodOptions = [
        {
            id: 'paypal',
            name: 'PayPal',
            description: 'Paga de forma segura con tu cuenta PayPal',
            icon: <CreditCard className="h-6 w-6" />,
            enabled: paymentMethods.paypal,
        },
        {
            id: 'stripe',
            name: 'Tarjeta de Crédito/Débito',
            description: 'Visa, Mastercard, American Express',
            icon: <CreditCard className="h-6 w-6" />,
            enabled: paymentMethods.stripe,
        },
        {
            id: 'offline',
            name: 'Pago Móvil / Transferencia',
            description: 'Pago móvil, transferencia bancaria u otros métodos offline',
            icon: <Smartphone className="h-6 w-6" />,
            enabled: paymentMethods.offline,
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Procesar Pago
                </h2>
            }
        >
            <Head title="Procesar Pago" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Resumen del pedido */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Resumen del Pedido</CardTitle>
                                    <CardDescription>
                                        Detalles de tu suscripción
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Plan:</span>
                                        <span>{subscription.plan.name}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Ciclo de facturación:</span>
                                        <Badge variant="secondary">
                                            {subscription.billing_cycle === 'yearly' ? 'Anual' : 'Mensual'}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Período:</span>
                                        <span>
                                            {new Date(subscription.starts_at).toLocaleDateString()} - {' '}
                                            {new Date(subscription.ends_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <hr />
                                    
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Total:</span>
                                        <span>{formatPrice(subscription.amount, subscription.currency)}</span>
                                    </div>

                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-medium text-blue-900 mb-2">
                                            Características incluidas:
                                        </h4>
                                        <ul className="space-y-1 text-sm text-blue-800">
                                            {subscription.plan.features?.map((feature, index) => (
                                                <li key={index}>• {feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Métodos de pago */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Método de Pago</CardTitle>
                                    <CardDescription>
                                        Selecciona cómo quieres pagar
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-3">
                                            {paymentMethodOptions
                                                .filter(method => method.enabled)
                                                .map((method) => (
                                                <div
                                                    key={method.id}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                        data.payment_method === method.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                    onClick={() => setData('payment_method', method.id)}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <input
                                                            type="radio"
                                                            name="payment_method"
                                                            value={method.id}
                                                            checked={data.payment_method === method.id}
                                                            onChange={() => setData('payment_method', method.id)}
                                                            className="text-blue-600"
                                                        />
                                                        <div className="text-blue-600">
                                                            {method.icon}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium">{method.name}</div>
                                                            <div className="text-sm text-gray-600">
                                                                {method.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <InputError message={errors.payment_method} />

                                        {/* Notas adicionales para pagos offline */}
                                        {data.payment_method === 'offline' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Notas adicionales (opcional)
                                                </label>
                                                <Textarea
                                                    placeholder="Incluye detalles del pago como número de referencia, banco utilizado, etc."
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                    rows={3}
                                                />
                                                <InputError message={errors.notes} />
                                                
                                                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                    <p className="text-sm text-yellow-800">
                                                        <strong>Información de pago:</strong><br />
                                                        • Banco: Banco de Venezuela<br />
                                                        • Cuenta: 0102-1234-5678-9012<br />
                                                        • Titular: Tu Empresa SaaS<br />
                                                        • Pago Móvil: 0414-123-4567 (C.I. 12.345.678)
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex space-x-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => window.history.back()}
                                                className="flex-1"
                                            >
                                                Volver
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing || !data.payment_method}
                                                className="flex-1"
                                            >
                                                {processing ? 'Procesando...' : 'Procesar Pago'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}