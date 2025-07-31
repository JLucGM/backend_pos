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
const ClientsForm = lazy(() => import('./ClientsForm'));
const DeliveryLocationForm = lazy(() => import('./DeliveryLocationForm'));

// Asegúrate de recibir todas las props desde el controlador
export default function Edit({ client, permission }) {
    console.log(client);
    const { data, setData, errors, post, processing } = useForm({
        name: client.name,
        email: client.email,
        password: '',
        phone: client.phone,
        identification: client.identification,
        status: client.status,
        avatar: null,

    });



    const submitclientForm = (e) => {
        e.preventDefault();
        post(route('client.update', client), {
            onSuccess: () => {
                toast.success("Cliente actualizado con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar el cliente.");
            }
        });
    };

    return (
        <AuthenticatedLayout
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
                    <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('client.create')}>
                        Crear Usuario
                    </Link>
                </div>
            }
        >
            <Head className="capitalize" title={`Editar ${client.name}`} />

            <div className="space-y-6 py-6">
                {/* FORMULARIO PRINCIPAL DEL USUARIO */}
                <Suspense fallback={<Loader />}>


                    <form onSubmit={submitclientForm} className='space-y-4'>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ClientsForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                client={client}
                            />
                        </div>
                        <div className="flex justify-end p-2.5">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Guardar Cambios de Usuario'}
                            </Button>
                        </div>
                    </form>

                </Suspense>

            </div>

        </AuthenticatedLayout>
    );
}