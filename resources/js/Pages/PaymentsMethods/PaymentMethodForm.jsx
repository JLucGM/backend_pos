import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Textarea } from '@/Components/ui/textarea';
import { useSelectOptions } from '@/hooks/useSelectOptions';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';
import DivSection from '@/Components/ui/div-section';

export default function PaymentMethodForm({ data, setData, errors }) {
    const { statusOptions } = useSelectOptions();
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DivSection className='col-span-full md:col-span-2'>
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
                </DivSection>

                <div className="">
                    <DivSection className='col-span-full md:col-span-1'>
                        <div>
                            <InputLabel htmlFor="is_active" value="Estado" />
                            <Select
                                options={statusOptions}
                                name="is_active"
                                value={statusOptions.find(option => option.value === Number(data.is_active))}
                                onChange={(selectedOption) => setData('is_active', selectedOption.value)}
                                styles={customStyles} // si usas estilos personalizados
                                className="mt-1"
                            />
                            <InputError message={errors.is_active} className="mt-2" />
                        </div>
                    </DivSection>
                </div>
            </div>
        </>
    );
}