import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import DataTable from '@/Components/DataTable';
// import Breadcrumb from '@/Components/Breadcrumb';
import { Button } from '@/Components/ui/button';
import { PaymentMethodColumn } from './Columns';
import PaymentMethodForm from './PaymentMethodForm';

export default function Index({ paymentmethod, permission }) {
    let [isOpen, setIsOpen] = useState(false)
    const { data, setData, errors, post } = useForm({
        payment_method_name: "",
        payment_details: [{ data_type: "", value: "" }], // Cambiado para manejar múltiples entradas
    });
    // console.log(data)
    const addPaymentDetail = () => {
        setData('payment_details', [...data.payment_details, { data_type: "", value: "" }]);
    };

    const removePaymentDetail = (index) => {
        const newDetails = [...data.payment_details];
        newDetails.splice(index, 1); // Eliminar el detalle en el índice especificado
        setData('payment_details', newDetails);
    };
    console.log(data)
    const submit = (e) => {
        e.preventDefault();
        post(route('paymentmethod.store'));
        setData({
            payment_method_name: "",
            payment_details: [{ data_type: "", value: "" }], // Reiniciar el estado
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Metodos de pago
                    </h2>
                    {permission.some(perm => perm.name === 'admin.tax.create') && (
                        <Button variant="outline"
                            onClick={() => setIsOpen(true)}>
                            Crear
                        </Button>
                    )}
                </div>
            }
        >
            {/* <Breadcrumb items={items} /> */}

            <Head className="capitalize" title="Metodos de pago" />

            <div className="max-w-7xl mx-auto ">
                <div className="bg-white dark:bg-gray-800 overflow-hidden ">
                    <div className=" text-gray-900 dark:text-gray-100">
                        <div className="relative overflow-x-auto">
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
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="font-bold text-gray-700 dark:text-gray-300 capitalize">Crear categoria</DialogTitle>
                        <Description className={'text-gray-700 dark:text-gray-300'}>Ingresa la información del categoria</Description>
                        <form onSubmit={submit} className='space-y-4'>

                            <PaymentMethodForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                addPaymentDetail={addPaymentDetail}
                                removePaymentDetail={removePaymentDetail}
                            />

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        toast("Creado.", {
                                            description: "Se ha creado con éxito.",
                                        })
                                    }
                                >
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    )
}