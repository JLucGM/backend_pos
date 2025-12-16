import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { lazy, Suspense } from 'react'
import { Button, buttonVariants } from '@/Components/ui/button';
import { menusColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ menus, permission }) {

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Menus
                    </h2>
                        <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('menus.create')}
                        >
                            Crear menu
                        </Link>
                    {permission.some(perm => perm.name === 'admin.menus.create') && (
                        <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('menus.create')}
                        >
                            Crear menu
                        </Link>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Menus" />
            <Suspense fallback={<Loader />}>
                <DivSection>
                    {menus.length > 0 ? (
                        <DataTable
                            columns={menusColumns}
                            data={menus}
                            routeEdit={'menus.edit'}
                            routeDestroy={'menus.destroy'}
                            editPermission={'admin.menus.edit'}
                            deletePermission={'admin.menus.delete'}
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