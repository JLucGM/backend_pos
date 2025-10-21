import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { lazy, Suspense } from 'react'
import { buttonVariants } from '@/Components/ui/button';
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
                        Página
                    </h2>
                    {permission.some(perm => perm.name === 'admin.pages.create') && (
                        <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('pages.create')}
                        >
                            Crear Página
                        </Link>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Página" />
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
                        null
                    )}
                </DivSection>
            </Suspense>

        </AuthenticatedLayout>
    )
}