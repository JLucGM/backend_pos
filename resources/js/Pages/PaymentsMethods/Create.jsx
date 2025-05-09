import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import PaymentMethodForm from './PaymentMethodForm';
import DivSection from '@/Components/ui/div-section';

export default function Create({ }) {

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

    const submit = (e) => {
        e.preventDefault();
        post(route('paymentmethod.store'));
    };
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center px-6'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear método de pago
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Método de pago" />

            <div className=" text-gray-900 dark:text-gray-100">
                <div className="relative overflow-x-auto">
                    <form onSubmit={submit} className='space-y-4'>

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
    )
}