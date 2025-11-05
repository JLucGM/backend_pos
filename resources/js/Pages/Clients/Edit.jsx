import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button, buttonVariants } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense, useState } from 'react';
import { ArrowLongLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import Loader from '@/Components/ui/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Pen } from 'lucide-react';
import AddressDialog from '@/Components/Clients/AddressDialog';
import DivSection from '@/Components/ui/div-section';

// Importa los nuevos componentes
const ClientsForm = lazy(() => import('./ClientsForm'));

// Asegúrate de recibir todas las props desde el controlador
export default function Edit({ client, roles, role, permission, countries, states, cities, deliveryLocations }) {
    const settings = usePage().props.settings;

    const { data, setData, errors, post, processing } = useForm({
        name: client.name,
        email: client.email,
        password: '',
        phone: client.phone,
        identification: client.identification,
        is_active: client.is_active,
        avatar: null,
        role: client.roles.length > 0 ? client.roles[0].id : "",
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

    const submitClientForm = (e) => {
        e.preventDefault();

        post(route('client.update', client.slug), {
            onSuccess: () => {
                toast.success("Cliente actualizado con éxito.");
            },
            onError: (error) => {
                console.log(error);
                toast.error("Error al actualizar el cliente.");
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
                        <Link href={route('client.index')}>
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {client.name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title={`Editar ${client.name}`} />

            <div className="py-6">
                {/* FORMULARIO PRINCIPAL DEL CLIENTE */}
                <Suspense fallback={<Loader />}>
                    <form onSubmit={submitClientForm} className='space-y-4'>
                        <ClientsForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            roles={roles}
                            user={client}
                        />
                        <div className="flex justify-end p-2.5">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Guardar Cambios de Cliente'}
                            </Button>
                        </div>
                    </form>
                </Suspense>

                {/* SECCIÓN DE DIRECCIONES DE ENVÍO */}
                <Suspense fallback={<Loader />}>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Direcciones de Envío</h3>
                            <Button variant="outline" size="sm" onClick={openDialogForNewAddress}>
                                <PlusIcon className="size-4 mr-2" />
                                Agregar Dirección
                            </Button>
                        </div>

                        {/* Lista de direcciones existentes */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {deliveryLocations.length > 0 ? (
                                deliveryLocations.map(location => (
                                    // La clave se mueve al componente Card, que es el elemento raíz en el map
                                    <Card key={location.id}>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDialogForEditAddress(location)}
                                                >
                                                    <Pen className="size-4" />
                                                </Button>
                                                {!!location.is_default && (
                                                    <Badge className="ml-2" variant="secondary">
                                                        Predeterminada
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            {/* <CardDescription>{location.address_line_2}</CardDescription> */}
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
                </Suspense>
            </div>

            {/* Diálogo para agregar/editar dirección */}
            <AddressDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={client}
                location={selectedLocation}
                countries={countries}
                states={states}
                cities={cities}
                onSuccess={() => {
                    // Aquí puedes hacer algo después de que se haya creado o editado la dirección
                }}
            />
        </AuthenticatedLayout>
    );
}