import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Suspense, lazy } from 'react';
import DivSection from '@/Components/ui/div-section';
import { Button, buttonVariants } from '@/Components/ui/button';
import { subscriptionPlansColumns } from './Columns';
import Loader from '@/Components/ui/loader';
import { BadgePercent, Store } from 'lucide-react';
import HeadingSmall from '@/Components/heading-small';

import { usePermission } from '@/hooks/usePermission';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ subscriptionPlan }) {
    const { can } = usePermission();

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Planes de suscripción
                    </h2>
                    {can('admin.subscriptionPlan.create') && (
                        <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('admin.subscriptionPlan.create')}
                        >
                            Crear Plan de Suscripción
                        </Link>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Planes de suscripción" />

            <DivSection>
                {subscriptionPlan.length > 0 ? (
                    <Suspense fallback={<Loader />}>
                        <DataTable
                            columns={subscriptionPlansColumns}
                            data={subscriptionPlan}
                            routeEdit={'admin.subscriptionPlan.edit'}
                            routeDestroy={'admin.subscriptionPlan.destroy'}
                            editPermission={'admin.subscriptionPlan.edit'}
                            deletePermission={'admin.subscriptionPlan.destroy'}
                        />
                    </Suspense>
                ) : (
                    <div className="flex flex-col items-center justify-center h-96">
                        <BadgePercent size={64} />
                        <HeadingSmall
                            title="Tus planes de suscripción se mostrarán aquí"
                            description="Puedes crear un nuevo plan de suscripción haciendo clic en el botón a continuación."
                            className="text-center"
                        />
                        {can('admin.subscriptionPlan.create') && (
                            <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('admin.subscriptionPlan.create')}>
                                Crear Plan de Suscripción
                            </Link>
                        )}
                    </div>
                )}
            </DivSection>

        </AuthenticatedLayout>
    )
}
