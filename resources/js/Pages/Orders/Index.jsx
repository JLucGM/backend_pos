import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import { Store } from 'lucide-react';
import { ordersColumns } from './Columns';
import Loader from '@/Components/ui/loader';

// Define DataTable and ordersColumns as lazy components
const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ orders, permission }) {
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Pedidos
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Pedidos" />
            <DivSection>
                <Suspense fallback={<Loader />}>
                    {orders.length > 0 ? (
                        <DataTable
                            columns={ordersColumns}
                            data={orders}
                            routeEdit={'orders.edit'}
                            editPermission={'admin.orders.edit'}
                            permissions={permission}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Store size={64} />
                            <p>No hay pedidos registradas.</p>
                        </div>
                    )}
                </Suspense>
            </DivSection>
        </AuthenticatedLayout>
    );
}