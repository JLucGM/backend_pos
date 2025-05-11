import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState, lazy, Suspense } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/Components/ui/button';
import { userColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

const DataTable = lazy(() => import('@/Components/DataTable'));
const UserForm = lazy(() => import('./UserForm'));

export default function Index({ users, roles, role, permission }) {
    let [isOpen, setIsOpen] = useState(false);
    const { data, setData, errors, post } = useForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        status: "0",
        avatar: null,
        role: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('user.store'));
        setData({
            name: "",
            phone: "",
            email: "",
            password: "",
            status: "0",
            avatar: null,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Usuarios
                    </h2>
                    {permission.some(perm => perm.name === 'admin.user.create') && (
                        <Link
                            className={buttonVariants({ variant: "default", size: "sm" })}
                            href={route('user.create')}
                        >
                            Añadir Usuario
                        </Link>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Usuarios" />

            <Suspense fallback={<Loader />}>
                <DivSection>
                    {users.length > 0 ? (
                        <DataTable
                            columns={userColumns}
                            data={users}
                            routeEdit={'user.edit'}
                            routeDestroy={'user.destroy'}
                            editPermission={'admin.user.edit'}
                            deletePermission={'admin.user.delete'}
                            permissions={permission}
                        />
                    ) : (
                        <p>no hay nada</p>
                    )}
                </DivSection>
            </Suspense>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear usuario</DialogTitle>
                        <Description className={'text-gray-700 dark:text-gray-300'}>Ingresa la información del usuario</Description>
                        <form onSubmit={submit} className='space-y-4'>

                            <Suspense fallback={<Loader />}>
                                <UserForm Form data={data} setData={setData} errors={errors} roles={roles} role={role} />
                            </Suspense>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default" size="sm"
                                    onClick={() =>
                                        toast("Creado.", {
                                            description: "Se ha creado con éxito.",
                                        })
                                    }
                                >
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    )
}