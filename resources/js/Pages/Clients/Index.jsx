import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { userColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';
import { buttonVariants } from '@/Components/ui/button';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ users, permission }) {

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Clientes
                    </h2>
                    {permission.some(perm => perm.name === 'admin.client.create') && (
                        <Link
                            className={buttonVariants({ variant: "default", size: "sm" })}
                            href={route('client.create')}
                        >
                            Añadir clients
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
                            routeEdit={'client.edit'}
                            routeDestroy={'client.destroy'}
                            editPermission={'admin.client.edit'}
                            deletePermission={'admin.client.delete'}
                            permissions={permission}
                        />
                    ) : (
                        <p>no hay nada</p>
                    )}
                </DivSection>
            </Suspense>

        </AuthenticatedLayout>
    )
}