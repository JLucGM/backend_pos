import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, buttonVariants } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense, useState } from 'react';
import { ArrowLongLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import Loader from '@/Components/ui/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AddressDialog from './AddressDialog';
import { Badge } from '@/Components/ui/badge';
import { Pen, PenSquareIcon } from 'lucide-react';

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
        _method: 'POST',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const openDialogForNewAddress = () => {
        setSelectedLocation(null);
        setIsDialogOpen(true);
    };

    const openDialogForEditAddress = (location) => {
        setSelectedLocation(location);
        setIsDialogOpen(true);
    };

    const submitUserForm = (e) => {
        e.preventDefault();
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
                <div className='flex justify-between items-center'>
                    <div className="flex justify-start items-center">
                        <Link href={route('user.index')}>
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
                        
                   
                </Suspense>

                {/* SECCIÓN DE DIRECCIONES DE ENVÍO */}
                {/* <Suspense fallback={<Loader />}>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Direcciones de Envío</h3>
                            <Button variant="outline" size="sm" onClick={openDialogForNewAddress}>
                                <PlusIcon className="size-4 mr-2" />
                                Agregar Dirección
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {deliveryLocations.length > 0 ? (
                                deliveryLocations.map(location => (
                                    // La clave se mueve al componente Card, que es el elemento raíz en el map
                                    <Card key={location.id}>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                {!!location.is_default && (
                                                    <Badge className="ml-2" variant="secondary">
                                                        Predeterminada
                                                    </Badge>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDialogForEditAddress(location)}
                                                >
                                                    <Pen className="size-4" />
                                                </Button>
                                            </CardTitle>
                                            <CardDescription>{location.address_line_2}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {location.address_line_1}
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">Este usuario no tiene direcciones de envío.</p>
                            )}
                        </div>
                    </div>
                </Suspense> */}
            </div>

            {/* Diálogo para agregar/editar dirección */}
            {/* <AddressDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={user}
                location={selectedLocation}
                countries={countries}
                states={states}
                cities={cities}
                onSuccess={() => {
                    // Aquí puedes hacer algo después de que se haya creado o editado la dirección
                }}
            /> */}
        </AuthenticatedLayout>
    );
}