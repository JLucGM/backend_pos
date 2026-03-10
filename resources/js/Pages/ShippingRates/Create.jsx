import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, useForm } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';
import DivSection from '@/Components/ui/div-section';

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
                <div>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Nueva Tarifa de Envío</h2>
                </div>

                <form onSubmit={submit} className='space-y-6'>
                    <DivSection>
                        <Suspense fallback={<Loader />}>
                            <ShippingRatesForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                stores={stores}
                            />
                        </Suspense>
                    </DivSection>

                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            variant="default"
                            size="lg"
                            type="submit"
                            disabled={processing}
                            className="px-8 rounded-xl shadow-lg shadow-blue-100"
                        >
                            {processing ? "Guardando..." : "Crear Tarifa"}
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}