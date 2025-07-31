import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { lazy, Suspense } from 'react';
import Loader from '@/Components/ui/loader';

// Define PaymentMethodForm como un componente cargado de forma lazy
const PaymentMethodForm = lazy(() => import('./PaymentMethodForm'));

export default function Edit({ payment_method }) {
    const initialValues = {
        payment_method_name: payment_method.payment_method_name,
        description: payment_method.description || "",
        is_active: payment_method.is_active,
        // payment_details: payment_method.payment_details || [],
    };

    const { data, setData, errors, post } = useForm(initialValues);

    // Función para agregar un detalle de pago
    const submit = (e) => {
        e.preventDefault();
        post(route('paymentmethod.update', payment_method), {
            onSuccess: () => {
                toast.success("Método de pago actualizado con éxito.");
            },
            onError: (err) => {
                console.error("Error al actualizar el método de pago:", err);
                toast.error("Error al actualizar el método de pago.");
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <div className="flex justify-start items-center">
                        <Link href={route('paymentmethod.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {payment_method.payment_method_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Actualizar Método de Pago" />

            <div className=" text-gray-900 dark:text-gray-100">
                <div className="relative overflow-x-auto">
                    <form onSubmit={submit} className='space-y-4'>
                        <DivSection>
                            <Suspense fallback={<Loader />}>
                                <PaymentMethodForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            </Suspense>
                        </DivSection>

                        <div className="flex justify-end p-2.5">
                            <Button
                                variant="default"
                                type="submit"
                            >
                                Guardar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}