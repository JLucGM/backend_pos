import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { buttonVariants } from '@/Components/ui/button';
import { Plus } from 'lucide-react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import DivSection from '@/Components/ui/div-section';
import { StocksColumns } from './Columns';

// Define DataTable and StocksColumns as lazy components
const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ stock, permission }) {

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Inventarios
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Inventarios" />

            <DivSection>
                <Suspense fallback={<div>Cargando inventario...</div>}>
                    {stock.length > 0 ? (
                        <DataTable
                            columns={StocksColumns}
                            data={stock}
                            routeEdit={'stocks.edit'}
                            routeDestroy={'stocks.destroy'}
                            editPermission={'admin.stocks.edit'}
                            deletePermission={'admin.stocks.delete'}
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
                </Suspense>
            </DivSection>

        </AuthenticatedLayout>
    )
}