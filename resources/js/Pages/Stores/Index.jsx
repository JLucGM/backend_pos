import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, usePage } from '@inertiajs/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

// Define DataTable and StoresForm as lsazy components
const DataTable = lazy(() => import('@/Components/DataTable'));
const StoresForm = lazy(() => import('@/Pages/Stores/StoresForm'));

import { usePermission } from '@/hooks/usePermission';
import { StoresColumns } from './Columns';

export default function Index({ stores, countries, states, cities }) {
    const { can } = usePermission();
    const { isSuperAdmin } = usePage().props.auth;
    let [isOpen, setIsOpen] = useState(false)
    const { data, setData, errors, post } = useForm({
        name: "",
        phone: "",
        address: "",
        is_ecommerce_active: false,
        allow_delivery: false,
        allow_pickup: false,
        allow_shipping: false,
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
                    name: "",
                    phone: "",
                    address: "",
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
        <SettingsLayout>
            <Head className="capitalize" title="Tiendas" />

            <Suspense fallback={<Loader />}>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                Tiendas
                            </h2>
                        </div>
                        {can('admin.stores.create') && (
                            <Button variant="default" size="sm" onClick={() => setIsOpen(true)}>
                                Añadir tienda
                            </Button>
                        )}
                    </div>

                    <DivSection>
                        {stores.length > 0 ? (
                            <DataTable
                                columns={StoresColumns}
                                data={stores}
                                routeEdit={'stores.edit'}
                                routeDestroy={'stores.destroy'}
                                editPermission={'admin.stores.edit'}
                                deletePermission={'admin.stores.delete'}
                            />
                        ) : (
                            <p>No hay tiendas registradas.</p>
                        )}
                    </DivSection>
                </div>
            </Suspense>


            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear tiendas</DialogTitle>
                        <form onSubmit={submit} className='space-y-4'>
                            <Suspense fallback={<Loader />}>
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
                                    type="submit"
                                >
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </SettingsLayout>
    )
}

