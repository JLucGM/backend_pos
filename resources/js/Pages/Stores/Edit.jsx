import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

// Define StoresForm as a lazy component
const StoresForm = lazy(() => import('@/Pages/Stores/StoresForm'));

export default function Edit({ store, countries, states, cities, }) {
    const initialValues = {
        name: store.name,
        phone: store.phone,
        address: store.address,
        is_ecommerce_active: store.is_ecommerce_active,
        allow_delivery: store.allow_delivery,
        allow_pickup: store.allow_pickup,
        allow_shipping: store.allow_shipping,
        country_id: store.country_id,
        state_id: store.state_id,
        city_id: store.city_id,
    }

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('stores.update', store), {
            onSuccess: () => {
                toast.success("Tienda actualizada exitosamente");
            },
            onError: (error) => {
                toast.error("Error al actualizar la tienda");
            }
        });
    }

    return (
        <SettingsLayout>
            <Head className="capitalize" title={`Editar ${store.name}`} />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Actualizar Tienda</h2>
                    <p className="text-slate-500">Modifica los detalles de <strong>{store.name}</strong>.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <DivSection className='space-y-4'>
                        <Suspense fallback={<Loader />}>
                            <StoresForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                countries={countries}
                                states={states}
                                cities={cities}
                            />
                        </Suspense>
                    </DivSection>

                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            variant="default"
                            size="lg"
                            type="submit"
                            className="px-8 rounded-xl shadow-lg shadow-blue-100"
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    )
}
