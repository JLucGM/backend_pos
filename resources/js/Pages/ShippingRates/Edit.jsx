import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

// Define ShippingRatesForm como un componente cargado de forma lazy
const ShippingRatesForm = lazy(() => import('./ShippingRatesForm'));

export default function Edit({ shippingRate }) {
    const initialValues = {
        name: shippingRate.name,
        price: shippingRate.price,
        description: shippingRate.description,
    };

    const { data, setData, errors, post, recentlySuccessful } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('shippingrate.update', shippingRate), {
            onSuccess: () => {
                toast("tarifa de envio actualizado con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar el tarifa de envio.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <Link href={route('shippingrate.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar 
                        </h2>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title="Pais" />

            <div className="max-w-7xl mx-auto ">
                <div className=" overflow-hidden">
                    <div className=" text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} className='space-y-4'>
                            <DivSection>
                                <div className="grid grid-cols-1 gap-4">
                                    <Suspense fallback={<Loader />}>
                                        <ShippingRatesForm
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    </Suspense>
                                </div>
                            </DivSection>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
                                >
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

