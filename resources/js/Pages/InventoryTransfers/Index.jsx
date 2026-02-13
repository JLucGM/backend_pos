import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { Plus } from 'lucide-react';
import DivSection from '@/Components/ui/div-section';
import { InventoryTransferColumns } from './Columns';
import Loader from '@/Components/ui/loader';
import { Button } from '@/Components/ui/button';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ transfers }) {
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Transferencias de Inventario
                    </h2>
                    <Button asChild size="sm">
                        <Link href={route('inventory-transfers.create')}>
                            Nueva Transferencia
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title="Transferencias" />

            <DivSection>
                <div className="p-4">
                    <Suspense fallback={<Loader />}>
                        <DataTable
                            columns={InventoryTransferColumns}
                            data={transfers}
                        />
                    </Suspense>
                </div>
            </DivSection>
        </AuthenticatedLayout>
    );
}
