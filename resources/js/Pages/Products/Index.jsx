import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
// import Breadcrumb from '@/Components/Breadcrumb';
import { buttonVariants } from '@/Components/ui/button';
import { ProductColumns } from './Columns';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Plus } from 'lucide-react';
import DivSection from '@/Components/ui/div-section';

export default function Index({ product, permission }) {
console.log(product)
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