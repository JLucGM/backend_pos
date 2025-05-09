import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { useState } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { StoresColumns } from './Columns';

// Define DataTable and StoresForm as lazy components
const DataTable = lazy(() => import('@/Components/DataTable'));
const StoresForm = lazy(() => import('@/Pages/Stores/StoresForm'));

export default function Index({ stores, countries, states, cities, permission }) {
    let [isOpen, setIsOpen] = useState(false)
    const { data, setData, errors, post } = useForm({
        store_name: "",
        store_phone: "",
        store_direction: "",
        country_id: countries[0].id,
        state_id: states[0].id,
        city_id: cities[0].id,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('stores.store'), {
            onSuccess: () => {
                toast.success("Tienda creada con éxito");
                setIsOpen(false); // Close dialog on success
                setData({ // Reset form data
                    store_name: "",
                    store_phone: "",
                    store_direction: "",
                    country_id: countries[0].id,
                    state_id: states[0].id,
                    city_id: cities[0].id,
                });
            },
            onError: (error) => {
                toast.error("Error al crear la tienda");
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Tiendas
                    </h2>
                    {permission.some(perm => perm.name === 'admin.stores.create') && (
                        <Button variant="default" size="sm"
                            onClick={() => setIsOpen(true)}>
                            Añadir tienda
                        </Button>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Tiendas" />

            <DivSection>
                <Suspense fallback={<div>Cargando tiendas...</div>}>
                    {stores.length > 0 ? (
                        <DataTable
                            columns={StoresColumns}
                            data={stores}
                            routeEdit={'stores.edit'}
                            routeDestroy={'stores.destroy'}
                            editPermission={'admin.stores.edit'}
                            deletePermission={'admin.stores.delete'}
                            permissions={permission}
                        />
                    ) : (
                        <p>No hay tiendas registradas.</p>
                    )}
                </Suspense>
            </DivSection>


            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear tiendas</DialogTitle>
                        {/* <Description className={'text-sm text-gray-700 dark:text-gray-300'}>
                            Estos datos podrían estar disponibles públicamente. No utilice su información personal.
                        </Description> */}
                        <form onSubmit={submit} className='space-y-4'>
                            <Suspense fallback={<div>Cargando formulario...</div>}>
                                <StoresForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    countries={countries}
                                    states={states}
                                    cities={cities}
                                />
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

