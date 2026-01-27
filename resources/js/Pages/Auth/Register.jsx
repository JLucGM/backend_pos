import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import SubscriptionPlanCard from '@/Components/SubscriptionPlanCard';
import BillingCycleSelector from '@/Components/BillingCycleSelector';
import Stepper from '@/Components/Stepper'; // Importar el nuevo componente

export default function Register({ subscriptionPlans = [] }) {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPlans, setShowPlans] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // Paso actual
    
    // Definir los pasos del stepper
    const steps = [
        { label: 'Datos Personales', component: 'userData' },
        { label: 'Datos Empresa', component: 'companyData' },
        { label: 'Selección Plan', component: 'planSelection' },
        { label: 'Confirmación', component: 'confirmation' },
    ];
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar: null,
        company_name: '',
        company_phone: '',
        company_address: '',
        selected_plan_id: null,
        billing_cycle: 'monthly',
    });

    const handlePlanSelection = (plan) => {
        setSelectedPlan(plan);
        setData('selected_plan_id', plan.id);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const nextStep = () => {
        // Validar campos del paso actual antes de avanzar
        if (currentStep === 0) {
            // Validar datos del usuario
            if (!data.name || !data.email || !data.password || !data.password_confirmation) {
                return;
            }
        } else if (currentStep === 1) {
            // Validar datos de la empresa
            if (!data.company_name) {
                return;
            }
        }
        
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Renderizar el contenido según el paso actual
    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Datos del usuario
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Datos del Usuario</h2>
                        
                        {/* <div>
                            <InputLabel htmlFor="avatar" value="Avatar (Opcional)" />
                            <Input
                                id="avatar"
                                className="mt-1 block w-full"
                                name="avatar"
                                onChange={(e) => setData('avatar', e.target.files[0])}
                                type="file"
                            />
                            <InputError className="mt-2" message={errors.avatar} />
                        </div> */}

                        <div>
                            <InputLabel htmlFor="name" value="Tu Nombre *" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email *" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Contraseña *" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirmar Contraseña *"
                            />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>
                    </div>
                );

            case 1: // Datos de la empresa
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Datos de la Empresa</h2>
                        
                        <div>
                            <InputLabel htmlFor="company_name" value="Nombre de la Empresa *" />
                            <TextInput
                                id="company_name"
                                name="company_name"
                                value={data.company_name}
                                className="mt-1 block w-full"
                                autoComplete="organization"
                                onChange={(e) => setData('company_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.company_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="company_phone" value="Teléfono de la Empresa" />
                            <TextInput
                                id="company_phone"
                                name="company_phone"
                                value={data.company_phone}
                                className="mt-1 block w-full"
                                autoComplete="tel"
                                onChange={(e) => setData('company_phone', e.target.value)}
                            />
                            <InputError message={errors.company_phone} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="company_address" value="Dirección de la Empresa" />
                            <TextInput
                                id="company_address"
                                name="company_address"
                                value={data.company_address}
                                className="mt-1 block w-full"
                                autoComplete="street-address"
                                onChange={(e) => setData('company_address', e.target.value)}
                            />
                            <InputError message={errors.company_address} className="mt-2" />
                        </div>
                    </div>
                );

            case 2: // Selección de plan
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Selecciona tu Plan</h2>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPlans(!showPlans)}
                            >
                                {showPlans ? 'Ocultar Planes' : 'Ver Planes'}
                            </Button>
                        </div>

                        {!selectedPlan && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    Puedes registrarte sin seleccionar un plan y comenzar con una prueba gratuita de 14 días.
                                    También puedes elegir un plan ahora y pagar directamente.
                                </p>
                            </div>
                        )}

                        {selectedPlan && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-green-800">Plan Seleccionado: {selectedPlan.name}</h3>
                                        <p className="text-sm text-green-600">
                                            {selectedPlan.is_trial ? 'Gratis' : 
                                             new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: selectedPlan.currency,
                                             }).format(data.billing_cycle === 'yearly' && selectedPlan.yearly_price ? selectedPlan.yearly_price : selectedPlan.price)
                                            } {!selectedPlan.is_trial && `/ ${data.billing_cycle === 'yearly' ? 'año' : 'mes'}`}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedPlan(null);
                                            setData('selected_plan_id', null);
                                        }}
                                    >
                                        Cambiar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {showPlans && subscriptionPlans.length > 0 && (
                            <div className="space-y-4">
                                <BillingCycleSelector 
                                    billingCycle={data.billing_cycle}
                                    onCycleChange={(cycle) => setData('billing_cycle', cycle)}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {subscriptionPlans.filter(plan => plan.is_active).map((plan) => (
                                        <SubscriptionPlanCard
                                            key={plan.id}
                                            plan={plan}
                                            billingCycle={data.billing_cycle}
                                            isSelected={selectedPlan?.id === plan.id}
                                            onSelect={handlePlanSelection}
                                            showSelectButton={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 3: // Confirmación
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Resumen del Registro</h2>
                        
                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Datos del Usuario</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Nombre:</span> {data.name}</p>
                                    <p><span className="font-medium">Email:</span> {data.email}</p>
                                    <p><span className="font-medium">Avatar:</span> {data.avatar ? data.avatar.name : 'No seleccionado'}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">Datos de la Empresa</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Nombre:</span> {data.company_name}</p>
                                    <p><span className="font-medium">Teléfono:</span> {data.company_phone || 'No especificado'}</p>
                                    <p><span className="font-medium">Dirección:</span> {data.company_address || 'No especificada'}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">Plan Seleccionado</h3>
                                <div className="text-sm">
                                    {selectedPlan ? (
                                        <div className="bg-green-50 p-3 rounded">
                                            <p><span className="font-medium">Plan:</span> {selectedPlan.name}</p>
                                            <p><span className="font-medium">Ciclo de facturación:</span> {data.billing_cycle === 'yearly' ? 'Anual' : 'Mensual'}</p>
                                            {!selectedPlan.is_trial && (
                                                <p><span className="font-medium">Precio:</span> {
                                                    new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: selectedPlan.currency,
                                                    }).format(data.billing_cycle === 'yearly' && selectedPlan.yearly_price ? selectedPlan.yearly_price : selectedPlan.price)
                                                } / {data.billing_cycle === 'yearly' ? 'año' : 'mes'}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">Sin plan seleccionado (Prueba gratuita de 14 días)</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                Al hacer clic en "Registrarse", aceptas nuestros términos y condiciones y políticas de privacidad.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            <form onSubmit={submit} encType="multipart/form-data">
                {/* Stepper */}
                <Stepper 
                    steps={steps}
                    activeStep={currentStep}
                    onStepChange={setCurrentStep}
                />
                
                {/* Contenido del paso actual */}
                <div className="mb-8">
                    {renderStepContent()}
                </div>

                {/* Botones de navegación */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                    <div>
                        {currentStep === 0 ? (
                            <Link
                                href={route('login')}
                                className="text-sm text-gray-600 underline hover:text-gray-900"
                            >
                                ¿Ya tienes cuenta? Inicia sesión
                            </Link>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                            >
                                ← Anterior
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {currentStep < steps.length - 1 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="px-6"
                            >
                                Siguiente →
                            </Button>
                        ) : (
                            <PrimaryButton 
                                type="submit" 
                                disabled={processing}
                                className="px-6"
                            >
                                {processing ? 'Registrando...' : 'Registrarse'}
                            </PrimaryButton>
                        )}
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}