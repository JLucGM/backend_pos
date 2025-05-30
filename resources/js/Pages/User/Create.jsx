import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { lazy, Suspense } from 'react';
import Loader from '@/Components/ui/loader';

// Define UserForm como un componente cargado de forma lazy
const UserForm = lazy(() => import('./UserForm'));

export default function Create({ roles, role }) {
    const initialValues = {
        name: "",
        phone: "",
        email: "",
        identification: "",
        password: "",
        status: 0, // o 1, dependiendo del valor predeterminado que desees
        avatar: null,
        role: roles.length > 0 ? roles[0].id : null,
        // store_id: stores.length > 0 ? stores[0].id : null,
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('user.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-start items-center'>
                    <Link href={route('user.index')}>
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Usuario
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Usuario" />

            <Suspense fallback={<Loader />}>
                <div className="text-gray-900 dark:text-gray-100">
                    <form onSubmit={submit} className='space-y-4'>
                        <div className="grid grid-cols-3 gap-4">
                            <UserForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                // stores={stores}
                                roles={roles}
                                role={role}
                            />
                        </div>

                        <div className="flex justify-end p-2.5">
                            <Button>
                                Guardar
                            </Button>
                        </div>
                    </form>
                </div>
            </Suspense>
        </AuthenticatedLayout>
    );
}