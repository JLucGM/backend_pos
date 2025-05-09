import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import DataTable from '@/Components/DataTable';
// import Breadcrumb from '@/Components/Breadcrumb';
import { Button } from '@/Components/ui/button';
import { StoresColumns } from './Columns';
import StoresForm from '@/Pages/Stores/StoresForm';
import DivSection from '@/Components/ui/div-section';

export default function Index({ stores, countries, states, cities, permission }) {
    const [isOpen, setIsOpen] = useState(false)

    const { data, setData, errors, post } = useForm({
        store_name: "",
        store_phone: "",
        store_direction: "",
        country_id: countries[0].id,
        state_id: states[0].id,
        city_id: cities[0].id,
    });

    // const items = [
    //     {
    //         name: 'Dashboard',
    //         href: 'dashboard',
    //         icon: {
    //             path: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
    //         },
    //     },
    //     {
    //         name: 'Lista de usuarios',
    //         icon: {
    //             path: 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z',
    //         },
    //     },
    // ];

    const submit = (e) => {
        e.preventDefault();
        post(route('stores.store'))
        // console.log(data)
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
                    {permission.some(perm => perm.name === 'admin.stores.create') && (
                        <Button variant="default" size="sm"
                            onClick={() => setIsOpen(true)}>
                            Añadir tienda
                        </Button>
                    )}
                </div>
            }
        >
            {/* <Breadcrumb items={items} /> */}

            <Head className="capitalize" title="Tiendas" />

            <DivSection>
                {stores.length > 0 ? (
                    <DataTable
                        columns={StoresColumns}
                        data={stores}
                        routeEdit={'stores.edit'}
                        routeDestroy={'stores.destroy'}
                        editPermission={'admin.stores.edit'} // Pasa el permiso de editar
                        deletePermission={'admin.stores.delete'} // Pasa el permiso de eliminar
                        // downloadPdfPermission={'downloadPdfPermission'} // Pasa el permiso de descargar PDF
                        permissions={permission}
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
                        <Description className={'text-sm text-gray-700 dark:text-gray-300'}>
                            Estos datos podrían estar disponibles públicamente. No utilice su información personal.
                        </Description>
                        <form onSubmit={submit} className='space-y-4'>

                            <StoresForm data={data} setData={setData} errors={errors} countries={countries} states={states} cities={cities} />

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