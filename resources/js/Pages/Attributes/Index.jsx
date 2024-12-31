import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import DataTable from '@/Components/DataTable';
// import Breadcrumb from '@/Components/Breadcrumb';
import { Button } from '@/Components/ui/button';
import { attributeColumns } from './Columns';
import AttributeForm from './AttributeForm';

export default function Index({ attribute, permission }) {
    let [isOpen, setIsOpen] = useState(false)
    const { data, setData, errors, post } = useForm({
        attribute_name: "",
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
        post(route('attribute.store'))
        // console.log(data)
        setData({
            attribute_name: "",
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Atributos del producto
                    </h2>
                    {permission.some(perm => perm.name === 'admin.tax.create') && (
                        <Button variant="outline"
                            onClick={() => setIsOpen(true)}>
                            Crear
                        </Button>
                    )}
                </div>
            }
        >
            {/* <Breadcrumb items={items} /> */}

            <Head className="capitalize" title="Atributos del producto" />

            <div className="max-w-7xl mx-auto ">
                <div className="bg-white dark:bg-gray-800 overflow-hidden ">
                    <div className=" text-gray-900 dark:text-gray-100">
                        <div className="relative overflow-x-auto">
                            <DataTable
                                columns={attributeColumns}
                                data={attribute}
                                routeEdit={'attribute.edit'}
                                routeDestroy={'attribute.destroy'}
                                editPermission={'admin.attribute.edit'} // Pasa el permiso de editar
                                deletePermission={'admin.attribute.delete'} // Pasa el permiso de eliminar
                                // downloadPdfPermission={'downloadPdfPermission'} // Pasa el permiso de descargar PDF
                                permissions={permission}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear categoria</DialogTitle>
                        <Description className={'text-gray-700 dark:text-gray-300'}>Ingresa la información del categoria</Description>
                        <form onSubmit={submit} className='space-y-4'>

                            <AttributeForm data={data} setData={setData} errors={errors} />

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="outline"
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