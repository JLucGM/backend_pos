import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react'
import { pagesColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ pages, permission }) {
    return (
        <SettingsLayout>
            <Head className="capitalize" title="Gestión de Sitio" />

            <Suspense fallback={<Loader />}>
                <div className="space-y-6">
                    <div>
                        <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Políticas
                        </h2>
                    </div>
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
                </div>
            </Suspense>
        </SettingsLayout>
    )
}