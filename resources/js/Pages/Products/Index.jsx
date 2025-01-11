import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
// import Breadcrumb from '@/Components/Breadcrumb';
import { buttonVariants } from '@/Components/ui/button';
import { ProductColumns } from './Columns';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Plus } from 'lucide-react';
import DivSection from '@/Components/ui/div-section';

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
                    <h2 className="capitalize text-xl font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                        Productos
                    </h2>

                    {permission.some(perm => perm.name === 'admin.products.create') && (
                        <Link className={buttonVariants({ variant: "default", size: "sm" })}
                            href={route('products.create')}
                        >
                            Añadir producto
                        </Link>
                    )}
                </div>
            }
        >
            {/* <Breadcrumb items={items} /> */}

            <Head title="Productos" />

            <DivSection>
                {product.length > 0 ? ( // Verifica si hay productos
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
                ) : (
                    <div className="flex justify-between text-start px-8 py-16">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-500">Añade tus productos</h2>
                            <p className="text-sm text-gray-500">Comience por abastecer su tienda con productos que les encantarán a sus clientes.</p>
                            {permission.some(perm => perm.name === 'admin.products.create') && (
                                <Link className={buttonVariants({ variant: "default", size: "sm" })}
                                    href={route('products.create')}
                                >
                                    <Plus className="size-4" />
                                    Añadir un producto
                                </Link>
                            )}
                        </div>
                        <ShoppingBagIcon className="size-10" />
                    </div>
                )}
            </DivSection>

        </AuthenticatedLayout>
    )
}