import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import DataTable from '@/Components/DataTable';
// import Breadcrumb from '@/Components/Breadcrumb';
import { Button, buttonVariants } from '@/Components/ui/button';
import { ProductColumns } from './Columns';
import ProductsForm from './ProductsForm';

export default function Index({ product, taxes, categories, permission }) {
    // let [isOpen, setIsOpen] = useState(false)
    // const { data, setData, errors, post } = useForm({
    //     product_name: "",
    //     product_description: "",
    //     product_price: "",
    //     tax_id: taxes[0].id,
    //     categories: categories.length > 0 ? [categories[0].id] : [], // Establece el primer valor por defecto si hay categorías
    //     attribute_names: [""],
    // });

    // const addAttribute = () => {
    //     setData('attribute_names', [...data.attribute_names, ""]);
    // };
    
    // // Función para manejar el cambio en los campos de atributo
    // const handleAttributeChange = (index, value) => {
    //     const newAttributes = [...data.attribute_names];
    //     newAttributes[index] = value;
    //     setData('attribute_names', newAttributes);
    // };

    // const submit = (e) => {
    //     e.preventDefault();
    //     post(route('products.store'))
    //     // console.log(data)
    //     setData({
    //         product_name: "",
    //         product_description: "",
    //         product_price: "",
    //         tax_id: taxes[0].id,
    //         categories: categories.length > 0 ? [categories[0].id] : [], // Establece el primer valor por defecto si hay categorías
    //         attribute_names: [""],
    //     });
    // }
    // console.log(data)
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Productos
                    </h2>
                    {permission.some(perm => perm.name === 'admin.products.create') && (
                        // <Button variant="outline"
                        //     onClick={() => setIsOpen(true)}>
                        //     Crear
                        // </Button>
                        <Link className={buttonVariants({ variant: "outline" })} 
                        href={route('products.create')}
                        >Crear</Link>
                    )}
                </div>
            }
        >
            {/* <Breadcrumb items={items} /> */}

            <Head title="Productos" />

            <div className="max-w-7xl mx-auto ">
                <div className="bg-white dark:bg-gray-800 overflow-hidden ">
                    <div className=" text-gray-900 dark:text-gray-100">
                        <div className="relative overflow-x-auto">
                            <DataTable
                                columns={ProductColumns}
                                data={product}
                                routeEdit={'products.edit'}
                                routeDestroy={'products.destroy'}
                                editPermission={'admin.products.edit'} // Pasa el permiso de editar
                                deletePermission={'admin.products.delete'} // Pasa el permiso de eliminar
                                // downloadPdfPermission={'downloadPdfPermission'} // Pasa el permiso de descargar PDF
                                permissions={permission}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear producto</DialogTitle>
                        <Description className={'text-gray-700 dark:text-gray-300'}>Ingresa la información del producto</Description>
                        <form onSubmit={submit} className='space-y-4'>

                            <ProductsForm data={data} setData={setData} errors={errors} taxes={taxes} categories={categories}
                            handleAttributeChange={handleAttributeChange}
                            />

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
                        <Button type="button" onClick={addAttribute}>
        Agregar Atributo
    </Button>
                    </DialogPanel>
                </div>
            </Dialog> */}
        </AuthenticatedLayout>
    )
}