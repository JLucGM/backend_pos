import React, { Suspense, lazy } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { buttonVariants } from '@/Components/ui/button';
import { CollectionColumns } from './Columns';
import { FolderOpen, Plus } from 'lucide-react';
import Loader from '@/Components/ui/loader';

import { usePermission } from '@/hooks/usePermission';

const DataTable = lazy(() => import('@/Components/DataTable'));
const DivSection = lazy(() => import('@/Components/ui/div-section'));

export default function Index({ collections }) {
    const { can } = usePermission();

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize text-xl font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                        Colecciones
                    </h2>
                    {can('admin.collections.create') && (
                        <Link
                            className={buttonVariants({ variant: 'default', size: 'sm' })}
                            href={route('collections.create')}
                        >
                            <Plus className="size-4" />
                            Nueva colección
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Colecciones" />

            <Suspense fallback={<Loader />}>
                <DivSection>
                    {collections.length > 0 ? (
                        <DataTable
                            columns={CollectionColumns}
                            data={collections}
                            routeEdit={'collections.edit'}
                            routeDestroy={'collections.destroy'}
                        />
                    ) : (
                        <div className="flex justify-between text-start px-8 py-16">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-500">
                                    Crea tu primera colección
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Agrupa productos por categoría, temporada o promociones para facilitar la navegación en tu tienda.
                                </p>
                                {can('admin.collections.create') && (
                                    <Link
                                        className={buttonVariants({ variant: 'default', size: 'sm' })}
                                        href={route('collections.create')}
                                    >
                                        <Plus className="size-4" />
                                        Nueva colección
                                    </Link>
                                )}
                            </div>
                            <FolderOpen className="size-10 text-gray-400" />
                        </div>
                    )}
                </DivSection>
            </Suspense>
        </AuthenticatedLayout>
    );
}
