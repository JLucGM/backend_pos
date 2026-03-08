import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import { Store } from 'lucide-react';
import { ordersColumns } from './Columns';
import Loader from '@/Components/ui/loader';
import { buttonVariants } from '@/Components/ui/button';
import HeadingSmall from '@/Components/heading-small';

import { usePermission } from '@/hooks/usePermission';

// Define DataTable and ordersColumns as lazy components
const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ orders }) {
    const { can } = usePermission();

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Pedidos
                    </h2>
                    {can('admin.orders.create') && (
                        <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('orders.create')}
                        >
                            Crear Pedido
                        </Link>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Pedidos" />
            
            <Suspense fallback={<Loader />}>
                <DivSection>
                    {orders.length > 0 ? (
                        <DataTable
                            columns={ordersColumns}
                            data={orders}
                            routeEdit={'orders.edit'}
                            editPermission={'admin.orders.edit'}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Store size={64} />
                            <HeadingSmall
                                title="Tus pedidos se mostrarán aquí"
                                description="Puedes crear un nuevo pedido haciendo clic en el botón a continuación."
                                className="text-center"
                            />
                            {can('admin.orders.create') && (
                                <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('orders.create')}>
                                    Crear Pedido
                                </Link>
                            )}
                        </div>
                    )}
                </DivSection>
            </Suspense>
        </AuthenticatedLayout>
    );
}