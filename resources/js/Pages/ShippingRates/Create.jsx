import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, Link, useForm } from '@inertiajs/react'; // Añadido Link
import { lazy, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'; // Añadido icono

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
        <SettingsLayout>
            <Head title="Crear Tarifa de Envío" />

            <div className="space-y-6">
                <div className='flex justify-start items-center'>
                    <Link href={route('shippingrate.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Nueva Tarifa de Envío
                    </h2>
                </div>

                <form onSubmit={submit} className='space-y-6'>
                    <Suspense fallback={<Loader />}>
                        <ShippingRatesForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            stores={stores}
                        />
                    </Suspense>

                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            variant="default"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? "Guardando..." : "Crear Tarifa"}
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}