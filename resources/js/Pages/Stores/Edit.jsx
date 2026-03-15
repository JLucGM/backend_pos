import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

// Define StoresForm as a lazy component
const StoresForm = lazy(() => import('@/Pages/Stores/StoresForm'));
const StoreSchedulesForm = lazy(() => import('@/Pages/Stores/StoreSchedulesForm'));
export default function Edit({ store, countries, states, cities, }) {
    // Generar horarios base si no existen
    const defaultSchedules = Array.from({ length: 7 }, (_, i) => {
        const existing = (store.schedules || []).find(s => s.day_of_week === i);
        return existing ? {
            ...existing,
            open_time: existing.open_time ? existing.open_time.substring(0, 5) : '09:00',
            close_time: existing.close_time ? existing.close_time.substring(0, 5) : '18:00',
        } : {
            day_of_week: i,
            open_time: '09:00',
            close_time: '18:00',
            is_closed: false
        };
    });

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
        schedules: defaultSchedules,
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
                <div className='flex justify-start items-center'>
                    <Link href={route('stores.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Actualizar Tienda
                    </h2>
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
                            <StoreSchedulesForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </Suspense>
                    </DivSection>

                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            variant="default"
                            type="submit"
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    )
}
