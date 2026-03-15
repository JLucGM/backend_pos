import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

const StoresForm = lazy(() => import('@/Pages/Stores/StoresForm'));
const StoreSchedulesForm = lazy(() => import('@/Pages/Stores/StoreSchedulesForm'));

export default function Create({ countries, states, cities }) {

    const defaultSchedules = Array.from({ length: 7 }, (_, i) => ({
        day_of_week: i,
        open_time: '09:00',
        close_time: '18:00',
        is_closed: false
    }));

    const { data, setData, errors, post, processing } = useForm({
        name: "",
        phone: "",
        address: "",
        is_ecommerce_active: false,
        allow_delivery: false,
        allow_pickup: false,
        allow_shipping: false,
        country_id: countries[0]?.id || "",
        state_id: states[0]?.id || "",
        city_id: cities[0]?.id || "",
        schedules: defaultSchedules,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('stores.store'), {
            onSuccess: () => {
                toast.success("Tienda creada con éxito");
            },
            onError: (error) => {
                toast.error("Error al crear la tienda");
            }
        });
    }

    return (
        <SettingsLayout>
            <Head className="capitalize" title="Nueva Tienda" />

            <div className="space-y-6">
                <div className='flex justify-start items-center'>
                    <Link href={route('stores.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Nueva Tienda
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
                            size="lg"
                            type="submit"
                            disabled={processing}
                            className="px-8 rounded-xl shadow-lg shadow-blue-100"
                        >
                            {processing ? 'Guardando...' : 'Crear Tienda'}
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    )
}
