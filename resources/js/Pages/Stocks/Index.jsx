import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
// import Breadcrumb from '@/Components/Breadcrumb';
import { buttonVariants } from '@/Components/ui/button';
import { StocksColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import { Plus } from 'lucide-react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function Index({ stock, permission }) {

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
    console.log(stock)

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Inventarios
                    </h2>
                    {/* {permission.some(perm => perm.name === 'admin.stocks.create') && (
                        <Button variant="default" size="sm"
                            onClick={() => setIsOpen(true)}>
                            Crear
                        </Button>
                    )} */}
                </div>
            }
        >
            {/* <Breadcrumb items={items} /> */}

            <Head className="capitalize" title="Inventarios" />

            <DivSection>
                {stock.length > 0 ? (
                    <DataTable
                        columns={StocksColumns}
                        data={stock}
                        routeEdit={'stocks.edit'}
                        routeDestroy={'stocks.destroy'}
                        editPermission={'admin.stocks.edit'} // Pasa el permiso de editar
                        deletePermission={'admin.stocks.delete'} // Pasa el permiso de eliminar
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