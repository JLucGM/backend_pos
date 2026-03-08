import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { buttonVariants } from '@/Components/ui/button';
import { userColumns } from './Columns';
import Loader from '@/Components/ui/loader';
import { usePermission } from '@/hooks/usePermission';
import DivSection from '@/Components/ui/div-section';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ users, roles }) {
    const { can, isSuperAdmin } = usePermission();

    // console.log(users)

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Usuarios
                    </h2>
                    {can('admin.user.create') && (
                        <Link
                            className={buttonVariants({ variant: "default", size: "sm" })}
                            href={route('user.create')}
                        >
                            Añadir Usuario
                        </Link>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Usuarios" />

            <Suspense fallback={<Loader />}>
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
                        <p>no hay nada</p>
                    )}
                </DivSection>
            </Suspense>

        </AuthenticatedLayout>
    )
}