import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function TaxesForm({ data, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="tax_name" value="Nombre" />
                <TextInput
                    id="tax_name"
                    type="text"
                    name="tax_name"
                    value={data.tax_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('tax_name', e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="tax_rate" value="tax_rate %" />
                <TextInput
                    id="tax_rate"
                    type="text"
                    name="tax_rate"
                    value={data.tax_rate}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('tax_rate', e.target.value)}
                />
                <InputError message={errors.tax_rate} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="tax_description" value="tax_description" />
                <TextInput
                    id="tax_description"
                    type="text"
                    name="tax_description"
                    value={data.tax_description}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('tax_description', e.target.value)}
                />
                <InputError message={errors.tax_description} className="mt-2" />
            </div>

        </>
    );
}