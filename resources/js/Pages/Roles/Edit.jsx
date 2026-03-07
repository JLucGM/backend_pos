import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import Loader from '@/Components/ui/loader';

const RolesForm = lazy(() => import('./RolesForm'));

export default function Edit({ role, permissionsList }) {
    const initialValues = {
        name: role.name,
        permissions: (role.permissions || []).map(p => p.id),
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('roles.update', role), {
            onSuccess: () => {
                toast("Rol actualizado con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar el rol.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <Link href={route('roles.index')} >
                            <ArrowLongLeftIcon className='size-6 text-gray-800 dark:text-gray-200' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar Rol: {role.name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Editar Rol - ${role.name}`} />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className='space-y-6'>
                    <DivSection>
                        <Suspense fallback={<Loader />}>
                            <RolesForm 
                                data={data} 
                                setData={setData} 
                                errors={errors} 
                                permissionsList={permissionsList} 
                            />
                        </Suspense>
                    </DivSection>

                    <div className="flex justify-end gap-3">
                        <Link 
                            href={route('roles.index')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            Volver
                        </Link>
                        <Button
                            variant="default"
                            type="submit"
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
