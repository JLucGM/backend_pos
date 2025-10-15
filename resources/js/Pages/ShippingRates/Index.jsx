import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { useState, lazy, Suspense } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/Components/ui/button';
import { shippingRateColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ shippingRate, permission }) {

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Tarida de envio
                    </h2>
                    {permission.some(perm => perm.name === 'admin.shippingRate.create') && (
                        <Link className={buttonVariants({ variant: "default", size: "sm" })}
                            href={route('shippingrate.create')}
                        >
                            Añadir tarifa
                        </Link>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Tarida de envio" />
            <Suspense fallback={<Loader />}>
                <DivSection>
                    {shippingRate.length > 0 ? (
                        <DataTable
                            columns={shippingRateColumns}
                            data={shippingRate}
                            routeEdit={'shippingrate.edit'}
                            routeDestroy={'shippingrate.destroy'}
                            editPermission={'admin.shippingrate.edit'}
                            deletePermission={'admin.shippingrate.delete'}
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