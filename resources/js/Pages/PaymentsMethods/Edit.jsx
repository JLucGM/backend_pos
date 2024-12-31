// Edit.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import PaymentMethodForm from './PaymentMethodForm';
import { toast } from 'sonner';

export default function Edit({ payment_method }) {
    const initialValues = {
        payment_method_name: payment_method.payment_method_name,
        payment_details: payment_method.details.map(detail => ({
            data_type: detail.payments_method_details_data_types,
            value: detail.payments_method_details_value,
        })),
    };

    const { data, setData, errors, post } = useForm(initialValues);
console.log(data);
    const addPaymentDetail = () => {
        setData('payment_details', [...data.payment_details, { data_type: "", value: "" }]);
    };

    const removePaymentDetail = (index) => {
        const newDetails = [...data.payment_details];
        newDetails.splice(index, 1); // Eliminar el detalle en el índice especificado
        setData('payment_details', newDetails);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('paymentmethod.update', payment_method), {
            // onSuccess: () => {
            //     toast.success("Método de pago actualizado con éxito.");
            // },
            // onError: () => {
            //     toast.error("Error al actualizar el método de pago.");
            // },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Actualizar Método de Pago
                    </h2>
                </div>
            }
        >
            <Head title="Actualizar Método de Pago" />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 overflow-hidden">
                    <div className="text-gray-900 dark:text-gray-100">
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}