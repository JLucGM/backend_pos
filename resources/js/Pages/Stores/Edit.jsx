import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import DivSection from '@/Components/ui/div-section';

// Define StoresForm as a lazy component
const StoresForm = lazy(() => import('@/Pages/Stores/StoresForm'));

export default function Edit({ store, countries, states, cities, }) {
    const initialValues = {
        store_name: store.store_name,
        store_phone: store.store_phone,
        store_direction: store.store_direction,
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
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <Link href={route('stores.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {store.store_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title="Tiendas" />

            <div className="max-w-7xl mx-auto ">
                <div className=" overflow-hidden">
                    <div className="text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} >
                            <div className="grid grid-cols-1 gap-4">
                                <DivSection className='space-y-4'>
                                    <Suspense fallback={<div>Cargando formulario de tienda...</div>}>
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
                            </div>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
                                    size="sm"
                                    type="submit"
                                >
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
