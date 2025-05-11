import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

// Define ClientsForm como un componente cargado de forma lazy
const ClientsForm = lazy(() => import('./ClientForm'));

export default function Edit({ client, orderCount, orderTotal }) {
    const initialValues = {
        client_name: client.client_name,
        client_identification: client.client_identification,
        client_phone: client.client_phone,
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('clients.update', client.id), {
            onSuccess: () => {
                toast("Cliente creado con éxito.");
            },
            onError: () => {
                toast.error("Error al crear el cliente.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <Link href={route('clients.index')}>
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {client.client_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title="Clientes" />

            <div className="max-w-7xl mx-auto ">
                <div className=" overflow-hidden">
                    <div className=" text-gray-900 dark:text-gray-100">
                        <DivSection className='flex justify-around flex-wrap gap-4'>
                            <div className="text-center">
                                <p className='text-lg font-semibold capitalize'>Total gastado</p>
                                ${orderTotal}
                            </div>
                            <div className="text-center">
                                <p className='text-lg font-semibold capitalize'>Pedidos</p>
                                {orderCount}
                            </div>
                        </DivSection>
                        <form onSubmit={submit} className='space-y-4'>
                            <div className="grid grid-cols-1 gap-4">
                                <DivSection>
                                    <Suspense fallback={<Loader />}>
                                        <ClientsForm data={data} setData={setData} errors={errors} />
                                    </Suspense>
                                </DivSection>
                            </div>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
                                    size="sm"
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
