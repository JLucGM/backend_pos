import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { lazy, Suspense } from 'react'
import DivSection from '@/Components/ui/div-section';
import { buttonVariants } from '@/Components/ui/button';
import { RolesColumns } from './Columns';
import Loader from '@/Components/ui/loader';

const DataTable = lazy(() => import('@/Components/DataTable'));

import { usePermission } from '@/hooks/usePermission';

export default function Index({ roles }) {
    const { can } = usePermission();
    const { isSuperAdmin } = usePage().props.auth;

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Roles
                    </h2>
                    {can('admin.roles.create') && (
                        <Link
                            className={buttonVariants({ variant: "default", size: "sm" })}
                            href={route('roles.create')}
                        >
                            Añadir Rol
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Roles" />

            <DivSection>
                <Suspense fallback={<Loader />}>
                    {roles.length > 0 ? (
                        <DataTable
                            columns={RolesColumns}
                            data={roles}
                            routeEdit={'roles.edit'}
                            routeDestroy={'roles.destroy'}
                            editPermission={'admin.roles.edit'}
                            deletePermission={'admin.roles.delete'}
                        />
                    ) : (
                        <div className="text-center py-4 text-gray-500">No hay roles definidos.</div>
                    )}
                </Suspense>
            </DivSection>
        </AuthenticatedLayout>
    )
}
