import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { useState, lazy, Suspense } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import DataTable from '@/Components/DataTable';
// import Breadcrumb from '@/Components/Breadcrumb';
import { Button } from '@/Components/ui/button';
import { CitiesColumns } from './Columns';
// import CitiesForm from './CitiesForm';
const CitiesForm = lazy(() => import('./CitiesForm'));
import DivSection from '@/Components/ui/div-section';

export default function Index({ cities, state, permission }) {
    let [isOpen, setIsOpen] = useState(false)
    const { data, setData, errors, post } = useForm({
        city_name: "",
        state_id: state[0].id,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('cities.store'))
        setData({
            city_name: "",
            state_id: state[0].id,
        });
    }
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Ciudades
                    </h2>
                    {permission.some(perm => perm.name === 'admin.cities.create') && (
                        <Button variant="default" size="sm"
                            onClick={() => setIsOpen(true)}>
                            Anadir ciudad
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="Ciudades" />

            <DivSection>
                {cities.length > 0 ? (
                    <DataTable
                        columns={CitiesColumns}
                        data={cities}
                        routeEdit={'cities.edit'}
                        routeDestroy={'cities.destroy'}
                        editPermission={'admin.cities.edit'}
                        deletePermission={'admin.cities.delete'}
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
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear ciudad</DialogTitle>
                        <Description className={'text-gray-700 dark:text-gray-300'}>Ingresa la información del ciudad</Description>
                        <form onSubmit={submit} className='space-y-4'>
                            <Suspense fallback={<div>Cargando formulario...</div>}>
                                <CitiesForm data={data} setData={setData} errors={errors} states={state} />
                            </Suspense>
                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default" size="sm"
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