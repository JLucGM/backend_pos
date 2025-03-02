import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import DataTable from '@/Components/DataTable';
// import Breadcrumb from '@/Components/Breadcrumb';
import { Button, buttonVariants } from '@/Components/ui/button';
import { PaymentMethodColumn } from './Columns';
import PaymentMethodForm from './PaymentMethodForm';
import DivSection from '@/Components/ui/div-section';

export default function Index({ paymentmethod, permission }) {

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Método de pago
                    </h2>
                    {permission.some(perm => perm.name === 'admin.paymentmethod.create') && (
                        <Link className={buttonVariants({ variant: "default", size: "sm" })}
                            href={route('paymentmethod.create')}
                        >
                            Añadir método de pago
                        </Link>
                    )}
                </div>
            }
        >
            {/* <Breadcrumb items={items} /> */}

            <Head className="capitalize" title="Método de pago" />

            <DivSection>
                {paymentmethod.length > 0 ? (
                    <DataTable
                        columns={PaymentMethodColumn}
                        data={paymentmethod}
                        routeEdit={'paymentmethod.edit'}
                        routeDestroy={'paymentmethod.destroy'}
                        editPermission={'admin.paymentmethod.edit'} // Pasa el permiso de editar
                        deletePermission={'admin.paymentmethod.delete'} // Pasa el permiso de eliminar
                        // downloadPdfPermission={'downloadPdfPermission'} // Pasa el permiso de descargar PDF
                        permissions={permission}
                    />
                ) : (
                    <p>no hay nada</p>
                )}
            </DivSection>

        </AuthenticatedLayout>
    )
}