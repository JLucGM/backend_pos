import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/react'
import { useState } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { Button, buttonVariants } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { taxesColumns } from './Columns';
import Loader from '@/Components/ui/loader';
import { ReceiptText } from 'lucide-react';
import HeadingSmall from '@/Components/heading-small';

// Define DataTable and TaxesForm as lazy components
const DataTable = lazy(() => import('@/Components/DataTable'));
const TaxesForm = lazy(() => import('./TaxesForm'));

export default function Index({ taxes, permission }) {
    let [isOpen, setIsOpen] = useState(false);
    const { data, setData, errors, post } = useForm({
        tax_name: "",
        tax_description: "",
        tax_rate: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tax.store'), {
            onSuccess: () => {
                toast.success("Impuesto creado con éxito");
                setIsOpen(false);
                setData({
                    tax_name: "",
                    tax_description: "",
                    tax_rate: "",
                });
            },
            onError: () => {
                toast.error("Error al crear impuesto");
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Impuestos
                    </h2>
                    {permission.some(perm => perm.name === 'admin.tax.create') && (
                        <Button variant="default" size="sm"
                            onClick={() => setIsOpen(true)}>
                            Añadir impuesto
                        </Button>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Impuestos" />

            <Suspense fallback={<Loader />}>
                <DivSection>
                    {taxes.length > 0 ? (
                        <DataTable
                            columns={taxesColumns}
                            data={taxes}
                            routeEdit={'tax.edit'}
                            routeDestroy={'tax.destroy'}
                            editPermission={'admin.tax.edit'}
                            deletePermission={'admin.tax.delete'}
                            permissions={permission}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96">
                            <ReceiptText size={64} />
                            <HeadingSmall
                                title="Tus impuestos se mostrarán aquí"
                                description="Puedes crear un nuevo impuesto haciendo clic en el botón a continuación."
                                className="text-center"
                            />
                            {permission.some(perm => perm.name === 'admin.tax.create') && (
                        <Button variant="default" size="sm"
                            onClick={() => setIsOpen(true)}>
                            Añadir impuesto
                        </Button>
                    )}
                        </div>
                    )}
                </DivSection>
            </Suspense>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear impuesto</DialogTitle>
                        <DialogDescription className={'text-gray-700 dark:text-gray-300'}>
                            Ingresa la información del impuesto
                        </DialogDescription>
                        <form onSubmit={submit} className='space-y-4'>
                            <Suspense fallback={<div>Cargando formulario de impuestos...</div>}>
                                <TaxesForm data={data} setData={setData} errors={errors} />
                            </Suspense>
                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
                                    size="sm"
                                    type="submit"
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

