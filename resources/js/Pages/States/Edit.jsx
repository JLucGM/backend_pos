import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import StatesForm from './StatesForm';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ state, countries }) { // Asegúrate de recibir 'countries'
    const initialValues = {
        state_name: state.state_name,
        country_id: state.country_id, // Cambia esto para usar el ID del estado
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('states.update', state)); // Asegúrate de usar el ID del estado
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
                                <StatesForm data={data} setData={setData} errors={errors} countries={countries} />
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