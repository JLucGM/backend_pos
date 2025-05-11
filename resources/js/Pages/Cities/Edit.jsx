import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import Loader from '@/Components/ui/loader';

// Define CitiesForm como un componente cargado de forma lazy
const CitiesForm = lazy(() => import('./CitiesForm'));

export default function Edit({ city, states }) {
    const initialValues = {
        city_name: city.city_name,
        state_id: city.state_id,
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('cities.update', city), {
            onSuccess: () => {
                toast("Ciudad actualizado con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar el ciudad.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <Link href={route('cities.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {city.city_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Ciudad" />

            <div className="max-w-7xl mx-auto ">
                <div className=" overflow-hidden">
                    <div className=" text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} className='space-y-4'>
                            <DivSection>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Suspense fallback={<Loader />}>
                                        <CitiesForm data={data} setData={setData} errors={errors} states={states} />
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