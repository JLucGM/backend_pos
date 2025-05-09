import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import DivSection from '@/Components/ui/div-section';

// Define StatesForm como un componente cargado de forma lazy
const StatesForm = lazy(() => import('./StatesForm'));

export default function Edit({ state, countries }) {
    const initialValues = {
        state_name: state.state_name,
        country_id: state.country_id,
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('states.update', state));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <Link href={route('states.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {state.state_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title="Estado" />

            <div className="max-w-7xl mx-auto ">
                <div className=" overflow-hidden">
                    <div className=" text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} className='space-y-4'>
                            <DivSection>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Suspense fallback={<div>Cargando formulario...</div>}>
                                        <StatesForm data={data} setData={setData} errors={errors} countries={countries} />
                                    </Suspense>
                                </div>
                            </DivSection>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default" size="sm"
                                    onClick={() =>
                                        toast("Actualizado.", {
                                            description: "Se ha actualizado con éxito.",
                                        })
                                    }
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