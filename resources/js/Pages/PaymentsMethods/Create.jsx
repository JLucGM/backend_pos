import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { lazy, Suspense } from 'react';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

// Definimos PaymentMethodForm como un componente lazy
const PaymentMethodForm = lazy(() => import('./PaymentMethodForm'));

export default function Create({ }) {
    const { data, setData, errors, post, processing } = useForm({
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
                <div className='flex justify-start items-center'>
                    <Link href={route('paymentmethod.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Nuevo Método de Pago
                    </h2>
                </div>
                <div>
                    <p className="text-slate-500">Configura una nueva forma de recibir pagos en tu comercio.</p>
                </div>

                <form onSubmit={submit} className='space-y-6'>
                    <Suspense fallback={<Loader />}>
                        <PaymentMethodForm
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </Suspense>

                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            variant="default"
                            disabled={processing}

                        >
                            {processing ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}
