import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, buttonVariants } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense, useState } from 'react'; // Importa useState
import { ArrowLongLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import Loader from '@/Components/ui/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

// Importa los nuevos componentes
const UserForm = lazy(() => import('./UserForm'));
const DeliveryLocationForm = lazy(() => import('./DeliveryLocationForm'));

// Asegúrate de recibir todas las props desde el controlador
export default function Edit({ user, roles, role, permission, countries, states, cities, deliveryLocations }) {
    const { data, setData, errors, post, processing } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone,
        identification: user.identification,
        status: user.status,
        avatar: null,
        role: user.roles.length > 0 ? user.roles[0].id : "",
        _method: 'POST', // Usaremos POST para el formulario principal, pero con un campo _method para PUT/PATCH en el backend si fuera necesario
    });

    // Estado para mostrar/ocultar el formulario de nueva dirección
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

    const submitUserForm = (e) => {
        e.preventDefault();
        // Usamos post para actualizar, Laravel detectará el método correcto por la ruta.
        // Si la ruta es PUT/PATCH, Inertia envía una petición POST con un campo _method.
        post(route('user.update', user.slug), {
            onSuccess: () => {
                toast.success("Usuario actualizado con éxito.");
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
                    <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('user.create')}>
                        Crear Usuario
                    </Link>
                </div>
            }
        >
            <Head className="capitalize" title={`Editar ${user.name}`} />

            <div className="space-y-6 py-6">
                {/* FORMULARIO PRINCIPAL DEL USUARIO */}
                <Suspense fallback={<Loader />}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Usuario</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitUserForm} className='space-y-4'>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <UserForm
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        roles={roles}
                                        user={user}
                                    />
                                </div>
                                <div className="flex justify-end p-2.5">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Guardando...' : 'Guardar Cambios de Usuario'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </Suspense>

                {/* SECCIÓN DE DIRECCIONES DE ENVÍO */}
                <Suspense fallback={<Loader />}>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Direcciones de Envío</h3>
                            {!isAddingNewAddress && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsAddingNewAddress(true)}
                                >
                                    <PlusIcon className="size-4 mr-2" />
                                    Agregar Dirección
                                </Button>
                            )}
                        </div>

                        {/* Formulario para agregar nueva dirección (se muestra condicionalmente) */}
                        {isAddingNewAddress && (
                            <DeliveryLocationForm
                                user={user}
                                location={null} // null indica que es para crear
                                countries={countries}
                                states={states}
                                cities={cities}
                                onCancel={() => setIsAddingNewAddress(false)} // Oculta el form al cancelar
                                onSuccess={() => setIsAddingNewAddress(false)} // Oculta el form al tener éxito
                            />
                        )}

                        {/* Lista de direcciones existentes */}
                        <div className="space-y-4">
                            {deliveryLocations.length > 0 ? (
                                deliveryLocations.map(location => (
                                    <DeliveryLocationForm
                                        key={location.id}
                                        user={user}
                                        location={location} // Pasa los datos de la dirección existente
                                        countries={countries}
                                        states={states}
                                        cities={cities}
                                    />
                                ))
                            ) : (
                                !isAddingNewAddress && (
                                    <p className="text-gray-500 dark:text-gray-400">Este usuario no tiene direcciones de envío.</p>
                                )
                            )}
                        </div>
                    </div>
                </Suspense>
            </div>
        </AuthenticatedLayout>
    );
}