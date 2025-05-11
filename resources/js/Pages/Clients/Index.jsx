import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { useState, lazy, Suspense } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { clientColumns } from './Columns';
// import ClientsForm from './ClientForm';
import DivSection from '@/Components/ui/div-section';
import { UserCircle2 } from 'lucide-react';
import Loader from '@/Components/ui/loader';

const DataTable = lazy(() => import('@/Components/DataTable'));
const ClientsForm = lazy(() => import('./ClientForm'));

export default function Index({ client, permission }) {
    let [isOpen, setIsOpen] = useState(false)
    const { data, setData, errors, post } = useForm({
        client_name: "",
        client_identification: "",
        client_phone: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('clients.store'), {
            onSuccess: () => {
                toast("Cliente creado con éxito.");
            },
            onError: () => {
                toast.error("Error al crear el cliente.");
            }
        })
        setData({
            client_name: "",
            client_identification: "",
            client_phone: "",
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Clientes
                    </h2>
                    {permission.some(perm => perm.name === 'admin.client.create') && (
                        <Button variant="default"
                            size="sm"
                            onClick={() => setIsOpen(true)}
                        >
                            Añadir cliente
                        </Button>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Clientes" />

            <Suspense fallback={<Loader />}>
                <DivSection>
                    {client.length > 0 ? (
                        <DataTable
                            columns={clientColumns}
                            data={client}
                            routeEdit={'clients.edit'}
                            routeDestroy={'clients.destroy'}
                            editPermission={'admin.client.edit'}
                            deletePermission={'admin.client.delete'}
                            permissions={permission}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96">
                            <UserCircle2 size={64} />
                            <p>No hay clientes registradas.</p>
                        </div>)}
                </DivSection>
            </Suspense>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear cliente</DialogTitle>
                        <Description className={'text-gray-700 dark:text-gray-300'}>Ingresa la información del cliente</Description>
                        <form onSubmit={submit} className='space-y-4'>
                            <Suspense fallback={<Loader />}>
                                <ClientsForm data={data} setData={setData} errors={errors} />
                            </Suspense>
                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
                                >
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    )
}

