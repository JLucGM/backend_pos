import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import SubscriptionPlanCard from '@/Components/SubscriptionPlanCard';
import BillingCycleSelector from '@/Components/BillingCycleSelector';

export default function SubscriptionsIndex({ plans, currentSubscription, company }) {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [selectedPlanForConfirmation, setSelectedPlanForConfirmation] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [processing, setProcessing] = useState(false);
    
    const { flash } = usePage().props;

    const formatPrice = (price, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const getPlanPrice = (plan, cycle) => {
        return cycle === 'yearly' && plan.yearly_price ? plan.yearly_price : plan.price;
    };

    const handleSelectPlan = (plan) => {
        // Si es el plan actual, no hacer nada
        if (isCurrentPlan(plan)) {
            return;
        }

        // Si es un plan de prueba, activarlo directamente
        if (plan.is_trial) {
            setProcessing(true);
            router.post(route('subscriptions.select-plan', plan.id), {
                billing_cycle: billingCycle
            }, {
                onSuccess: () => {
                    setProcessing(false);
                },
                onError: (errors) => {
                    console.error('Error al seleccionar plan:', errors);
                    setProcessing(false);
                }
            });
            return;
        }

        // Para planes de pago, mostrar diálogo de confirmación
        setSelectedPlanForConfirmation(plan);
        setShowConfirmDialog(true);
    };

    const confirmPlanSelection = () => {
        if (!selectedPlanForConfirmation) return;

        setProcessing(true);
        router.post(route('subscriptions.select-plan', selectedPlanForConfirmation.id), {
            billing_cycle: billingCycle
        }, {
            onSuccess: () => {
                setShowConfirmDialog(false);
                setSelectedPlanForConfirmation(null);
                setProcessing(false);
            },
            onError: (errors) => {
                console.error('Error al seleccionar plan:', errors);
                setProcessing(false);
            }
        });
    };

    const cancelPlanSelection = () => {
        setShowConfirmDialog(false);
        setSelectedPlanForConfirmation(null);
    };

    const isCurrentPlan = (plan) => {
        return currentSubscription && currentSubscription.subscription_plan_id === plan.id;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Planes de Suscripción
                </h2>
            }
        >
            <Head title="Planes de Suscripción" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Mensaje de éxito */}
                    {flash?.message && (
                        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <p className="text-green-800">{flash.message}</p>
                        </div>
                    )}

                    {/* Mensaje de error */}
                    {flash?.error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <p className="text-red-800">{flash.error}</p>
                        </div>
                    )}
                    {/* Estado actual */}
                    {currentSubscription && (
                        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-900">
                                        Plan Actual: {currentSubscription.plan?.name}
                                    </h3>
                                    <p className="text-blue-700">
                                        {currentSubscription.status === 'active' ? 'Activo' : 'Inactivo'} - 
                                        Vence el {new Date(currentSubscription.ends_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    {formatPrice(currentSubscription.amount, currentSubscription.currency)} / 
                                    {currentSubscription.billing_cycle === 'yearly' ? 'año' : 'mes'}
                                </Badge>
                            </div>
                        </div>
                    )}

                    {/* Información de prueba */}
                    {company.is_trial && (
                        <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-900">
                                        Período de Prueba
                                    </h3>
                                    <p className="text-yellow-700">
                                        {company.trial_ends_at 
                                            ? `Tu prueba gratuita vence el ${new Date(company.trial_ends_at).toLocaleDateString()}`
                                            : 'Estás en período de prueba'
                                        }
                                    </p>
                                </div>
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    Prueba Gratuita
                                </Badge>
                            </div>
                        </div>
                    )}

                    {/* Selector de ciclo de facturación */}
                    <BillingCycleSelector 
                        billingCycle={billingCycle}
                        onCycleChange={setBillingCycle}
                    />

                    {/* Planes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => (
                            <SubscriptionPlanCard
                                key={plan.id}
                                plan={plan}
                                billingCycle={billingCycle}
                                isCurrentPlan={isCurrentPlan(plan)}
                                onSelect={handleSelectPlan}
                                processing={processing}
                                buttonText={
                                    processing ? 'Procesando...' :
                                    isCurrentPlan(plan) ? 'Plan Actual' :
                                    plan.is_trial ? 'Activar Prueba' :
                                    currentSubscription ? 'Cambiar Plan' : 'Seleccionar Plan'
                                }
                            />
                        ))}
                    </div>

                    {/* Enlaces adicionales */}
                    <div className="mt-12 text-center space-y-4">
                        <div className="flex justify-center space-x-6">
                            <a href={route('subscriptions.payments')} className="text-blue-600 hover:text-blue-800">
                                Ver Historial de Pagos
                            </a>
                            {currentSubscription && (
                                <button 
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => {
                                        if (confirm('¿Estás seguro de que quieres cancelar tu suscripción?')) {
                                            router.post(route('subscriptions.cancel', currentSubscription.id));
                                        }
                                    }}
                                >
                                    Cancelar Suscripción
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">
                            ¿Necesitas ayuda? <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800">Contáctanos</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Diálogo de Confirmación */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Confirmar Cambio de Plan
                        </DialogTitle>
                        <DialogDescription>
                            {selectedPlanForConfirmation && (
                                <div className="space-y-3 mt-4">
                                    <p>
                                        Estás a punto de cambiar al plan <strong>{selectedPlanForConfirmation.name}</strong>.
                                    </p>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <div className="flex justify-between">
                                            <span>Plan:</span>
                                            <span className="font-semibold">{selectedPlanForConfirmation.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Precio:</span>
                                            <span className="font-semibold">
                                                {formatPrice(getPlanPrice(selectedPlanForConfirmation, billingCycle), selectedPlanForConfirmation.currency)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Ciclo:</span>
                                            <span className="font-semibold">
                                                {billingCycle === 'yearly' ? 'Anual' : 'Mensual'}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        {selectedPlanForConfirmation?.is_trial 
                                            ? 'El plan de prueba se activará inmediatamente.'
                                            : 'Serás redirigido a la página de pago para completar la suscripción.'
                                        }
                                    </p>

                                    {currentSubscription && (
                                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                            <p className="text-sm text-yellow-800">
                                                <strong>Nota:</strong> Tu suscripción actual será reemplazada por este nuevo plan.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={cancelPlanSelection}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={confirmPlanSelection}
                            disabled={processing}
                            className={`${
                                selectedPlanForConfirmation?.is_trial 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {processing ? 'Procesando...' : 
                             selectedPlanForConfirmation?.is_trial ? 'Activar Prueba' : 'Continuar al Pago'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}