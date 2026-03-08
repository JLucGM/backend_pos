import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { lazy, Suspense } from 'react'
import { buttonVariants } from '@/Components/ui/button';
import { pagesColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';
import { Palette, Edit } from 'lucide-react'; // Agregar Edit icon

import { usePermission } from '@/hooks/usePermission';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ pages }) { // Agregar homepage en props
    const { can } = usePermission();

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Páginas
                    </h2>
                    {can('admin.pages.create') && (
                        <div className="flex gap-2">
                            <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('pages.create')}
                            >
                                Crear Página
                            </Link>
                        </div>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Páginas" />

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
                        />
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No hay páginas creadas aún.</p>
                            {/* {homepage && (
                                <div className="mt-4">
                                    <Link
                                        href={route('pages.builder', homepage.id)}
                                        className={buttonVariants({ variant: "outline", size: "sm" })}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar Tema de la Página Principal
                                    </Link>
                                </div>
                            )} */}
                        </div>
                    )}
                </DivSection>
            </Suspense>

        </AuthenticatedLayout>
    )
}