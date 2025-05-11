import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, buttonVariants } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import Loader from '@/Components/ui/loader';

// Define UserForm como un componente cargado de forma lazy
const UserForm = lazy(() => import('./UserForm'));

export default function Edit({ user, stores, roles, role, permission }) {
    const initialValues = {
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone,
        status: user.status,
        avatar: null,
        role: user.roles.length > 0 ? user.roles[0].id : "",
        store_id: user.stores.length > 0 ? user.stores[0].id : "",
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('user.update', user), {
            onSuccess: () => {
                toast("Usuario actualizado con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar el usuario.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            roles={role}
            permission={permission}
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <Link href={route('user.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {user.name}
                        </h2>
                    </div>

                    <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('user.create')}
                    >
                        Crear Usuario
                    </Link>
                </div>
            }
        >
            <Head className="capitalize" title="Usuarios" />

            <div className="text-gray-900 dark:text-gray-100">
                <form onSubmit={submit} className='space-y-4'>
                    <div className="grid grid-cols-3 gap-4">
                        <Suspense fallback={<Loader />}>
                            <UserForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                stores={stores}
                                roles={roles}
                                role={role}
                                user={user}
                            />
                        </Suspense>
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
        </AuthenticatedLayout>
    );
}
