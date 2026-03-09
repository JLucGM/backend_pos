import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, useForm } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';
import DivSection from '@/Components/ui/div-section';

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
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Editar Tarifa de Envío</h2>
                    <p className="text-slate-500">Modifica los detalles de la regla de envío <strong>{shippingRate.name}</strong>.</p>
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
                            {processing ? "Actualizando..." : "Actualizar Tarifa"}
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}