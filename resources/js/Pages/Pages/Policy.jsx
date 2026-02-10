import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react'
import { pagesColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ pages, permission }) {
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                       Politicas
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Gestión de Sitio" />

            <Suspense fallback={<Loader />}>
                <DivSection>
                    {pages.length > 0 ? (
                        <DataTable
                            columns={pagesColumns}
                            data={pages}
                            routeEdit={'pages.edit'}
                            routeDestroy={'pages.destroy'}
                            editPermission={'admin.pages.edit'}
                            deletePermission={'admin.pages.delete'}
                            permissions={permission}
                        />
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No hay páginas creadas aún.</p>
                            
                        </div>
                    )}
                </DivSection>
            </Suspense>

        </AuthenticatedLayout>
    )
}