import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { lazy, Suspense } from 'react';
import Loader from '@/Components/ui/loader';
import ClientsForm from './ClientsForm';
import { toast } from 'sonner';

export default function Create({ role }) {
    const initialValues = {
        name: "",
        phone: "",
        email: "",
        identification: "",
        password: "",
        is_active: false,
        avatar: null,
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('client.store')), {
            onSuccess: () => {
                toast("Cliente creado con éxito.");

            },
            onError: (error) => {
                console.error("Error al crear el cliente:", error);
                toast.error("Error al crear el cliente.");
            }
        };
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-start items-center'>
                    <Link href={route('client.index')}>
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Cliente
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Cliente" />

            <Suspense fallback={<Loader />}>
                    <form onSubmit={submit} className='space-y-4'>
                            <ClientsForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                // stores={stores}
                                role={role}
                            />

                        <div className="flex justify-end p-2.5">
                            <Button>
                                Guardar
                            </Button>
                        </div>
                    </form>
            </Suspense>
        </AuthenticatedLayout>
    );
}