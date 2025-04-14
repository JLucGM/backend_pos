import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
// import Breadcrumb from '@/Components/Breadcrumb';
import { Button, buttonVariants } from '@/Components/ui/button';
import { toast } from 'sonner';
import UserForm from './UserForm';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ user, stores, roles, role, permission }) {
    // console.log(user)
    const initialValues = {
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone,
        status: user.status,
        avatar: null,
        role: user.roles.length > 0 ? user.roles[0].id : "", // Cambiado a ID del rol
        store_id: user.stores.length > 0 ? user.stores[0].id : "",
    }

    // const items = [
    //     {
    //         name: 'Dashboard',
    //         href: 'dashboard',
    //         icon: {
    //             path: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
    //         },
    //     },
    //     {
    //         name: 'Lista de usuario',
    //         href: 'user.index',
    //         icon: {
    //             path: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
    //         },
    //     },
    //     {
    //         name: 'Actualizar usuarios',
    //         icon: {
    //             path: 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z',
    //         },
    //     },
    // ];

    const { data, setData, errors, post } = useForm(initialValues)

    const submit = (e) => {
        e.preventDefault();
        post(route('user.update', user)), {
            onSuccess: () => {
                toast("Usuario actualizado con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar el usuario.");
            }
        }
        // console.log(data)
    }
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
            {/* <Breadcrumb items={items} /> */}

            <Head className="capitalize" title="Usuarios" />

            <div className="text-gray-900 dark:text-gray-100">

                <form onSubmit={submit} className='space-y-4'>

                    <div className="grid grid-cols-3 gap-4">
                        <UserForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            stores={stores}
                            roles={roles}
                            role={role}
                            user={user}
                        />
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
    )
}