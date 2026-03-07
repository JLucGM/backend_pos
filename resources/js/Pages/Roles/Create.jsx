import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import Loader from '@/Components/ui/loader';

const RolesForm = lazy(() => import('./RolesForm'));

export default function Create({ permissionsList }) {
    const { data, setData, errors, post, processing } = useForm({
        name: "",
        permissions: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('roles.store'), {
            onSuccess: () => {
                toast("Rol creado con éxito.");
            },
            onError: () => {
                toast.error("Error al crear el rol.");
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
                            Crear Nuevo Rol
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Crear Rol" />

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
                            Cancelar
                        </Link>
                        <Button
                            variant="default"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Guardando...' : 'Crear Rol'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
