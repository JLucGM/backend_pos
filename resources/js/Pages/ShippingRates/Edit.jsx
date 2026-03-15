import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, Link, useForm } from '@inertiajs/react'; // Añadido Link
import { lazy, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'; // Añadido icono

const ShippingRatesForm = lazy(() => import('../ShippingRates/ShippingRatesForm'));

export default function Edit({ shippingRate, stores }) {
    const initialValues = {
        name: shippingRate.name,
        price: shippingRate.price,
        description: shippingRate.description,
        store_id: shippingRate.store_id,
    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('shippingrate.update', shippingRate), {
            onSuccess: () => {
                toast.success("Tarifa de envío actualizada con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar la tarifa de envío.");
            }
        });
    };

    return (
        <SettingsLayout>
            <Head title={`Editar Tarifa: ${shippingRate.name}`} />

            <div className="space-y-6">
                <div className='flex justify-start items-center'>
                    <Link href={route('shippingrate.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Editar Tarifa de Envío: {shippingRate.name}
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
                            {processing ? "Actualizando..." : "Actualizar Tarifa"}
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}