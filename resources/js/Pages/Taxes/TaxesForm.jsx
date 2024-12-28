import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function TaxesForm({ data, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="name" value="Nombre" />
                <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('name', e.target.value)}
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
                <InputLabel htmlFor="description" value="description" />
                <TextInput
                    id="description"
                    type="text"
                    name="description"
                    value={data.description}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

        </>
    );
}