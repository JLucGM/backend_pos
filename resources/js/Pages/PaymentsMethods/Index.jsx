import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, Link } from '@inertiajs/react';
import { buttonVariants } from '@/Components/ui/button';
import { PaymentMethodColumn } from './Columns';
import DivSection from '@/Components/ui/div-section';
import { lazy, Suspense } from 'react';
import Loader from '@/Components/ui/loader';
import { usePermission } from '@/hooks/usePermission';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ paymentmethod }) {
    const { can } = usePermission();

    return (
        <SettingsLayout>
            <Head className="capitalize" title="Método de pago" />

            <Suspense fallback={<Loader />}>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                Métodos de Pago
                            </h2>
                        </div>
                        {can('admin.paymentmethod.create') && (
                            <Link className={buttonVariants({ variant: "default", size: "sm" })}
                                href={route('paymentmethod.create')}
                            >
                                Añadir método de pago
                            </Link>
                        )}
                    </div>

                    <DivSection>
                        {paymentmethod.length > 0 ? (
                            <DataTable
                                columns={PaymentMethodColumn}
                                data={paymentmethod}
                                routeEdit={'paymentmethod.edit'}
                                routeDestroy={'paymentmethod.destroy'}
                                editPermission={'admin.paymentmethod.edit'}
                                deletePermission={'admin.paymentmethod.delete'}
                            />
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No hay métodos de pago registrados.
                            </div>
                        )}
                    </DivSection>
                </div>
            </Suspense>
        </SettingsLayout>
    )
}