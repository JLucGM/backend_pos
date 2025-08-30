// PaymentMethodForm.jsx
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Textarea } from '@/Components/ui/textarea';

export default function PaymentMethodForm({ data, setData, errors }) {
    return (
        <>
            <div className="">
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

                <div className="mt-4">
                    <InputLabel htmlFor="description" value="Descripción" />
                    <Textarea
                        id="description"
                        name="description"
                        value={data.description}
                        className="mt-1 block w-full resize-none"
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="flex items-center mt-4">
                    <Checkbox
                        id="is_active"
                        name="is_active"
                        checked={data.is_active === 1}
                        onChange={(e) => setData('is_active', e.target.checked ? 1 : 0)}
                        className="mr-2"
                    />
                    <InputLabel htmlFor="is_active" value="Activar método de pago" />
                </div>
            </div>
        </>
    );
}