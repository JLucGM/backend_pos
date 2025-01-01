// PaymentMethodForm.jsx
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { Trash } from 'lucide-react';

export default function PaymentMethodForm({ data, setData, errors, addPaymentDetail, removePaymentDetail }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="payment_method_name" value="Nombre" />
                <TextInput
                    id="payment_method_name"
                    type="text"
                    name="payment_method_name"
                    value={data.payment_method_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('payment_method_name', e.target.value)}
                />
                <InputError message={errors.payment_method_name} className="mt-2" />
            </div>

            {data.payment_details.map((detail, index) => (
                <div key={index} className="grid grid-cols-5 gap-4">
                    <div className="col-span-2">
                        <InputLabel htmlFor={`payments_method_details_data_types_${index}`} value="Tipo de dato" />
                        <TextInput
                            id={`payments_method_details_data_types_${index}`}
                            type="text"
                            name={`payments_method_details_data_types_${index}`}
                            value={detail.data_type}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                const newDetails = [...data.payment_details];
                                newDetails[index].data_type = e.target.value;
                                setData('payment_details', newDetails);
                            }}
                        />
                        <InputError message={errors.payment_details?.[index]?.data_type} className="mt-2" />
                    </div>
                    <div className="col-span-2">
                        <InputLabel htmlFor={`payments_method_details_value_${index}`} value="Valor" />
                        <TextInput
                            id={`payments_method_details_value_${index}`}
                            type="text"
                            name={`payments_method_details_value_${index}`}
                            value={detail.value}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                const newDetails = [...data.payment_details];
                                newDetails[index].value = e.target.value;
                                setData('payment_details', newDetails);
                            }}
                        />
                        <InputError message={errors.payment_details?.[index]?.value} className="mt-2" />
                    </div>
                    <div className="flex justify-center items-end col-span-1">
                        <Button type="button" variant="destructive" onClick={() => removePaymentDetail(index)}>
                            <Trash size={24} />
                        </Button>
                    </div>
                </div>
            ))}

            <div className="flex justify-center">
                <Button type="button" onClick={addPaymentDetail}>
                    Agregar Detalle
                </Button>
            </div>
        </>
    );
}