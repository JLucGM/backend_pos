import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense, useState } from 'react';
import Loader from '@/Components/ui/loader';
import DivSection from '@/Components/ui/div-section';

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
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Actualizar Usuario</h2>
                    <p className="text-slate-500">Modifica los detalles del personal <strong>{user.name}</strong>.</p>
                </div>

                <form onSubmit={submitUserForm} className='space-y-6'>
                    <DivSection>
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
                    </DivSection>

                    <div className="flex justify-end pt-4 border-t">
                        <Button 
                            type="submit" 
                            disabled={processing}
                            size="lg"
                            className="px-12 rounded-xl shadow-xl shadow-blue-100"
                        >
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}