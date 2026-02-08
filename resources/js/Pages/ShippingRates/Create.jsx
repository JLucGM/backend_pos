import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

const ShippingRatesForm = lazy(() => import('../ShippingRates/ShippingRatesForm'));

export default function Create({ stores }) {
    // Encontrar la tienda con ecommerce activo por defecto
    const defaultStore = stores.find(store => store.is_ecommerce_active) || stores[0];

    const initialValues = {
        name: "",
        price: 0,
        description: "",
        store_id: defaultStore?.id || null,
    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('shippingrate.store'), {
            onSuccess: () => toast.success("Tarifa de envío creada con éxito."),
            onError: (error) => {
                console.error('Error:', error);
                toast.error("Error al crear la tarifa de envío.");
            }
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className='flex justify-between items-center'>
                <div className="flex justify-start items-center">
                    <Link href={route('shippingrate.index')}>
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear tarifa de envío
                    </h2>
                </div>
            </div>
        }>
            <Head title="Crear Tarifa de Envío" />

            {/* <div className="max-w-7xl mx-auto">
                <div className="text-gray-900 dark:text-gray-100"> */}
                    <form onSubmit={submit} className='space-y-4'>
                        {/* <div className="grid grid-cols-3 gap-4"> */}
                                <Suspense fallback={<Loader />}>
                                    <ShippingRatesForm
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        stores={stores}
                                    />
                                </Suspense>
                        {/* </div> */}

                        <div className="flex justify-end p-2.5">
                            <Button variant="default" type="submit" disabled={processing}>
                                {processing ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </form>
                {/* </div>
            </div> */}
        </AuthenticatedLayout>
    );
}