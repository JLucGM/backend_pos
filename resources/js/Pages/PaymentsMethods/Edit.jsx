// Edit.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import PaymentMethodForm from './PaymentMethodForm';
import { toast } from 'sonner';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ payment_method }) {
    const initialValues = {
        payment_method_name: payment_method.payment_method_name,
        payment_details: payment_method.details.map(detail => ({
            data_type: detail.payments_method_details_data_types,
            value: detail.payments_method_details_value,
        })),
    };

    const { data, setData, errors, post } = useForm(initialValues);

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
                    <div className="flex justify-start items-center">
                        <Link href={route('paymentmethod.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {payment_method.payment_method_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Actualizar Método de Pago" />

                <div className=" text-gray-900 dark:text-gray-100">
                    <div className="relative overflow-x-auto">
                        <form onSubmit={submit}>

                            <DivSection>
                                <PaymentMethodForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    addPaymentDetail={addPaymentDetail}
                                    removePaymentDetail={removePaymentDetail}
                                />
                            </DivSection>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
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
        </AuthenticatedLayout>
    );
}