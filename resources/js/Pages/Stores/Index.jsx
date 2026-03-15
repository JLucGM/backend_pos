import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

// Define DataTable as a lazy component
const DataTable = lazy(() => import('@/Components/DataTable'));

import { usePermission } from '@/hooks/usePermission';
import { StoresColumns } from './Columns';

export default function Index({ stores }) {
    const { can } = usePermission();

    return (
        <SettingsLayout>
            <Head className="capitalize" title="Tiendas" />

            <Suspense fallback={<Loader />}>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                Tiendas
                            </h2>
                        </div>
                        {can('admin.stores.create') && (
                            <Link href={route('stores.create')}>
                                <Button variant="default" size="sm">
                                    Añadir tienda
                                </Button>
                            </Link>
                        )}
                    </div>

                    <DivSection>
                        {stores.length > 0 ? (
                            <DataTable
                                columns={StoresColumns}
                                data={stores}
                                routeEdit={'stores.edit'}
                                routeDestroy={'stores.destroy'}
                                editPermission={'admin.stores.edit'}
                                deletePermission={'admin.stores.delete'}
                            />
                        ) : (
                            <p>No hay tiendas registradas.</p>
                        )}
                    </DivSection>
                </div>
            </Suspense>
        </SettingsLayout>
    )
}

