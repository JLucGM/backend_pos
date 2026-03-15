import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import Loader from '@/Components/ui/loader';
import SettingsLayout from '@/Layouts/SettingsLayout';

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
        <SettingsLayout>

            <div className="space-y-6">
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
                <Head title="Crear Rol" />

                <div className="text-gray-900 dark:text-gray-100">
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

                        <div className="flex justify-end p-2.5">
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
            </div>
        </SettingsLayout>
    );
}
