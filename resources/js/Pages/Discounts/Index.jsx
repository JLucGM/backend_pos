import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {  Suspense, lazy } from 'react';
import DivSection from '@/Components/ui/div-section';
import { Button, buttonVariants } from '@/Components/ui/button';
import { discountColumns } from './Columns';
import Loader from '@/Components/ui/loader';
import { BadgePercent, Store } from 'lucide-react';
import HeadingSmall from '@/Components/heading-small';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ discounts, permission }) {

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Descuentos
                    </h2>
                    {permission.some(perm => perm.name === 'admin.discount.create') && (
                         <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('discounts.create')}
                        >
                            Crear Descuento
                        </Link>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Descuentos" />

            <DivSection>
                {discounts.length > 0 ? (
                    <Suspense fallback={<Loader />}>
                        <DataTable
                            columns={discountColumns}
                            data={discounts}
                            routeEdit={'discounts.edit'}
                            routeDestroy={'discounts.destroy'}
                            editPermission={'admin.discount.edit'}
                            deletePermission={'admin.discount.delete'}
                            permissions={permission}
                        />
                    </Suspense>
                ) : (
                   <div className="flex flex-col items-center justify-center h-96">
                            <BadgePercent size={64} />
                            <HeadingSmall
                                title="Tus descuentos se mostrarán aquí"
                                description="Puedes crear un nuevo descuento haciendo clic en el botón a continuación."
                                className="text-center"
                            />
                            {permission.some(perm => perm.name === 'admin.discount.create') && (
                                <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('discounts.create')}>
                                    Crear Descuento
                                </Link>
                            )}
                        </div>
                )}
            </DivSection>

        </AuthenticatedLayout>
    )
}
