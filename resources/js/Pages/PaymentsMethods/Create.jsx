import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';

// Definimos PaymentMethodForm como un componente lazy
const PaymentMethodForm = lazy(() => import('./PaymentMethodForm'));

export default function Create({ }) {
    const { data, setData, errors, post } = useForm({
        payment_method_name: "",
        description: "",
        is_active: false,
    });

    // Función para agregar un detalle de pago
    const submit = (e) => {
        e.preventDefault();
        post(route('paymentmethod.store'), {
            onSuccess: () => {
                toast.success("Método de pago creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el método de pago:", err);
                toast.error("Error al crear el método de pago.");
            },
        });
    };

    return (
        <SettingsLayout>
            <Head className="capitalize" title="Nuevo Método de Pago" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Nuevo Método de Pago</h2>
                    <p className="text-slate-500">Configura una nueva forma de recibir pagos en tu comercio.</p>
                </div>

                <form onSubmit={submit} className='space-y-6'>
                    <DivSection>
                        <Suspense fallback={<Loader />}>
                            <PaymentMethodForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </Suspense>
                    </DivSection>

                    <div className="flex justify-end pt-4 border-t">
                        <Button 
                            variant="default" 
                            size="lg" 
                            className="px-8 rounded-xl shadow-lg shadow-blue-100"
                        >
                            Crear Método
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}
