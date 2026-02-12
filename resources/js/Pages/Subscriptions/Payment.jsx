import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Textarea } from '@/Components/ui/textarea';
import TextInput from '@/Components/TextInput';
import { CreditCard, Smartphone, Building } from 'lucide-react';
import InputError from '@/Components/InputError';

export default function SubscriptionPayment({ subscription, systemPaymentMethods }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method: '',
        transaction_id: '',
        notes: '',
    });

    const selectedMethod = systemPaymentMethods?.find(
        m => m.slug === data.payment_method
    );

    const getIcon = (iconName) => {
        const icons = {
            'smartphone': <Smartphone className="h-6 w-6" />,
            'building': <Building className="h-6 w-6" />,
            'credit-card': <CreditCard className="h-6 w-6" />,
        };
        return icons[iconName] || <CreditCard className="h-6 w-6" />;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('subscriptions.process-payment', subscription.id));
    };

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

                                    {subscription.plan.features && (
                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <h4 className="font-medium text-blue-900 mb-2">
                                                Características incluidas:
                                            </h4>
                                            <ul className="space-y-1 text-sm text-blue-800">
                                                {subscription.plan.features.map((feature, index) => (
                                                    <li key={index}>• {feature}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
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
                                        {/* Métodos de pago */}
                                        <div className="space-y-3">
                                            {systemPaymentMethods?.map((method) => (
                                                <div
                                                    key={method.id}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${data.payment_method === method.slug
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => setData('payment_method', method.slug)}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <input
                                                            type="radio"
                                                            name="payment_method"
                                                            value={method.slug}
                                                            checked={data.payment_method === method.slug}
                                                            onChange={() => setData('payment_method', method.slug)}
                                                            className="text-blue-600"
                                                        />
                                                        <div className="text-blue-600">
                                                            {getIcon(method.icon)}
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

                                        {/* Información del método seleccionado */}
                                        {selectedMethod && (
                                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                                {/* Instrucciones */}
                                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <h4 className="font-medium text-blue-900 mb-2">
                                                        Instrucciones de pago:
                                                    </h4>
                                                    <div className="text-sm text-blue-800 whitespace-pre-line">
                                                        {selectedMethod.instructions}
                                                    </div>
                                                </div>

                                                {/* Información bancaria */}
                                                {selectedMethod.bank_info && (
                                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <h4 className="font-medium text-yellow-900 mb-2">
                                                            Datos para el pago:
                                                        </h4>
                                                        <div className="text-sm text-yellow-800 space-y-1">
                                                            {selectedMethod.bank_info.bank_name && (
                                                                <p>• <strong>Banco:</strong> {selectedMethod.bank_info.bank_name}</p>
                                                            )}
                                                            {selectedMethod.bank_info.account_number && (
                                                                <p>• <strong>Cuenta:</strong> {selectedMethod.bank_info.account_number}</p>
                                                            )}
                                                            {selectedMethod.bank_info.account_type && (
                                                                <p>• <strong>Tipo:</strong> {selectedMethod.bank_info.account_type}</p>
                                                            )}
                                                            {selectedMethod.bank_info.holder_name && (
                                                                <p>• <strong>Titular:</strong> {selectedMethod.bank_info.holder_name}</p>
                                                            )}
                                                            {selectedMethod.bank_info.rif && (
                                                                <p>• <strong>RIF:</strong> {selectedMethod.bank_info.rif}</p>
                                                            )}
                                                            {selectedMethod.bank_info.phone && (
                                                                <p>• <strong>Teléfono:</strong> {selectedMethod.bank_info.phone}</p>
                                                            )}
                                                            {selectedMethod.bank_info.holder_id && (
                                                                <p>• <strong>C.I.:</strong> {selectedMethod.bank_info.holder_id}</p>
                                                            )}
                                                            {selectedMethod.bank_info.email && (
                                                                <p>• <strong>Email:</strong> {selectedMethod.bank_info.email}</p>
                                                            )}
                                                            {selectedMethod.bank_info.contact_email && (
                                                                <p>• <strong>Contacto:</strong> {selectedMethod.bank_info.contact_email}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Número de referencia / transacción */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Número de referencia / transacción *
                                                    </label>
                                                    <TextInput
                                                        placeholder="Copia aquí el número de confirmación o referencia"
                                                        value={data.transaction_id}
                                                        name="transaction_id"
                                                        onChange={(e) => setData('transaction_id', e.target.value)}
                                                        className="w-full"
                                                        required
                                                    />
                                                    <InputError message={errors.transaction_id} />
                                                </div>

                                                {/* Notas adicionales */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Notas adicionales (opcional)
                                                    </label>
                                                    <Textarea
                                                        placeholder="Cualquier información adicional útil para verificar el pago..."
                                                        value={data.notes}
                                                        onChange={(e) => setData('notes', e.target.value)}
                                                        rows={3}
                                                    />
                                                    <InputError message={errors.notes} />
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
                                                disabled={processing || !data.payment_method || !data.transaction_id}
                                                className="flex-1"
                                            >
                                                {processing ? 'Registrando...' : 'Confirmar Pago'}
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
