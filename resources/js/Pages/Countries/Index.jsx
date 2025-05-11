import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { useState, lazy, Suspense } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { countriesColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

const DataTable = lazy(() => import('@/Components/DataTable'));
const CountriesForm = lazy(() => import('./CountriesForm'));

export default function Index({ countries, permission }) {
    let [isOpen, setIsOpen] = useState(false);
    const { data, setData, errors, post } = useForm({
        country_name: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('countries.store'), {
            onSuccess: () => {
                toast("País creado con éxito.");
            },
            onError: () => {
                toast.error("Error al crear el país.");
            }
        });
        setData({
            country_name: "",
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Paises
                    </h2>
                    {permission.some(perm => perm.name === 'admin.countries.create') && (
                        <Button variant="default" size="sm"
                            onClick={() => setIsOpen(true)}>
                            Añadir pais
                        </Button>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Paises" />
            <Suspense fallback={<Loader />}>
                <DivSection>
                    {countries.length > 0 ? (
                        <DataTable
                            columns={countriesColumns}
                            data={countries}
                            routeEdit={'countries.edit'}
                            routeDestroy={'countries.destroy'}
                            editPermission={'admin.countries.edit'}
                            deletePermission={'admin.countries.delete'}
                            permissions={permission}
                        />
                    ) : (
                        null
                    )}
                </DivSection>
            </Suspense>


            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear pais</DialogTitle>
                        <Description className={'text-gray-700 dark:text-gray-300'}>Ingresa la información del pais</Description>
                        <form onSubmit={submit} className='space-y-4'>
                            <Suspense fallback={<Loader />}>
                                <CountriesForm data={data} setData={setData} errors={errors} />
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