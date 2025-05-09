import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/react'
import { useState, lazy, Suspense } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import DataTable from '@/Components/DataTable';
import { Button } from '@/Components/ui/button';
import { countriesColumns } from './Columns';
// import CountriesForm from './CountriesForm';
const CountriesForm = lazy(() => import('./CountriesForm'));
import DivSection from '@/Components/ui/div-section';

export default function Index({ countries, permission }) {
    let [isOpen, setIsOpen] = useState(false);
    const { data, setData, errors, post } = useForm({
        country_name: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('countries.store'));
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


            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear pais</DialogTitle>
                        <DialogDescription className={'text-gray-700 dark:text-gray-300'}>Ingresa la información del pais</DialogDescription>
                        <form onSubmit={submit} className='space-y-4'>
                            <Suspense fallback={<div>Cargando formulario...</div>}>
                                <CountriesForm data={data} setData={setData} errors={errors} />
                            </Suspense>
                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                        toast("Creado.", {
                                            description: "Se ha creado con éxito.",
                                        })
                                    }
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