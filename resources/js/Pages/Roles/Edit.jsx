import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import Loader from '@/Components/ui/loader';
import SettingsLayout from '@/Layouts/SettingsLayout';

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
        <SettingsLayout>

            <div className="space-y-6">
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
                <Head title={`Editar Rol - ${role.name}`} />

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
                            >
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </SettingsLayout>
    );
}
