import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import DataTable from '@/Components/DataTable';
// import Breadcrumb from '@/Components/Breadcrumb';
import { Button } from '@/Components/ui/button';
import { StoresColumns } from './Columns';
import SettingsForm from '@/Pages/Settings/SettingsForm';
import DivSection from '@/Components/ui/div-section';

import { usePermission } from '@/hooks/usePermission';

export default function Index({ stores, countries, states, cities }) {
    const { can } = usePermission();
    const { isSuperAdmin } = usePage().props.auth;
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
        post(route('stores.store'))
        setData({
            store_name: "",
            store_phone: "",
            store_direction: "",
            country_id: countries[0].id,
            state_id: states[0].id,
            city_id: cities[0].id,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Tiendas
                    </h2>
                    {can('admin.stores.create') && (
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
                    <p>no hay nada</p>
                )}
            </DivSection>


            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear tiendas</DialogTitle>
                        <Description className={'text-gray-700 dark:text-gray-300'}>Ingresa la información del tiendas</Description>
                        <form onSubmit={submit} className='space-y-4'>

                            <SettingsForm data={data} setData={setData} errors={errors} countries={countries} states={states} cities={cities} />

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
