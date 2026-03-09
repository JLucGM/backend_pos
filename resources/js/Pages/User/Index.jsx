import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, Link } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { buttonVariants } from '@/Components/ui/button';
import { userColumns } from './Columns';
import Loader from '@/Components/ui/loader';
import { usePermission } from '@/hooks/usePermission';
import DivSection from '@/Components/ui/div-section';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ users, roles }) {
    const { can } = usePermission();

    return (
        <SettingsLayout>
            <Head className="capitalize" title="Usuarios" />

            <Suspense fallback={<Loader />}>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                Usuarios
                            </h2>
                        </div>
                        {can('admin.user.create') && (
                            <Link
                                className={buttonVariants({ variant: "default", size: "sm" })}
                                href={route('user.create')}
                            >
                                Añadir Usuario
                            </Link>
                        )}
                    </div>

                    <DivSection>
                        {users.length > 0 ? (
                            <DataTable
                                columns={userColumns}
                                data={users}
                                routeEdit={'user.edit'}
                                routeDestroy={'user.destroy'}
                                editPermission={'admin.user.edit'}
                                deletePermission={'admin.user.delete'}
                            />
                        ) : (
                            <p className="text-center py-8 text-gray-500">No hay usuarios registrados.</p>
                        )}
                    </DivSection>
                </div>
            </Suspense>
        </SettingsLayout>
    )
}