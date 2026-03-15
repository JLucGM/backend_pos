import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense, useState } from 'react';
import Loader from '@/Components/ui/loader';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

// Importa los nuevos componentes
const UserForm = lazy(() => import('./UserForm'));

// Asegúrate de recibir todas las props desde el controlador
export default function Edit({ user, roles, countries, states, cities, deliveryLocations }) {
    const isClient = user.roles.some(role => role.name === 'client');
    const Layout = isClient ? AuthenticatedLayout : SettingsLayout;

    const { data, setData, errors, post, processing } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone,
        identification: user.identification,
        is_active: user.is_active,
        avatar: null,
        role: user.roles.length > 0 ? user.roles[0].id : "",
        _method: 'POST',
    });

    const submitUserForm = (e) => {
        e.preventDefault();
        post(route('user.update', user.slug), {
            onSuccess: () => {
                toast.success("Usuario actualizado con éxito.");
            },
            onError: (error) => {
                console.error(error);
                toast.error("Error al actualizar el usuario.");
            }
        });
    };

    return (
        <Layout>
            <Head className="capitalize" title={`Editar Staff: ${user.name}`} />

            <div className="space-y-6">
                <div className='flex justify-start items-center'>
                    <Link href={route('user.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Editar usuario {user.name}
                    </h2>
                </div>

                <form onSubmit={submitUserForm} className='space-y-6'>
                    <Suspense fallback={<Loader />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <UserForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                roles={roles}
                                user={user}
                            />
                        </div>
                    </Suspense>

                    <div className="flex justify-end p-2.5">
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}