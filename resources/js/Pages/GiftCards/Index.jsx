import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Suspense, lazy } from 'react';
import DivSection from '@/Components/ui/div-section';
import { Button, buttonVariants } from '@/Components/ui/button';
import { giftCardsColumns } from './Columns';
import Loader from '@/Components/ui/loader';
import HeadingSmall from '@/Components/heading-small';
import { GiftIcon } from 'lucide-react';

import { usePermission } from '@/hooks/usePermission';

// Cargar los componentes de forma diferida
const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ giftCards }) {
    const { can } = usePermission();
console.log(giftCards)
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Tarjetas de Regalo
                    </h2>
                    {can('admin.giftCards.create') && (
                        <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('giftCards.create')}>
                            Crear Tarjeta de Regalo
                        </Link>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Tarjetas de Regalo" />

            <DivSection>
                {giftCards.length > 0 ? (
                    <Suspense fallback={<Loader />}>
                        <DataTable
                            columns={giftCardsColumns}
                            data={giftCards}
                            routeEdit={'giftCards.edit'}
                            routeDestroy={'giftCards.destroy'}
                            editPermission={'admin.giftCards.edit'}
                            deletePermission={'admin.giftCards.delete'}
                        />
                    </Suspense>
                ) : (
                    <div className="flex flex-col items-center justify-center h-96">
                        <GiftIcon size={64} />
                        <HeadingSmall
                            title="Tus tarjetas de regalo se mostrarán aquí"
                            description="Puedes crear una nueva tarjeta de regalo haciendo clic en el botón a continuación."
                            className="text-center"
                        />
                        {can('admin.giftCards.create') && (
                            <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('giftCards.create')}>
                                Crear Tarjeta de Regalo
                            </Link>
                        )}
                    </div>
                )}
            </DivSection>

        </AuthenticatedLayout>
    )
}
