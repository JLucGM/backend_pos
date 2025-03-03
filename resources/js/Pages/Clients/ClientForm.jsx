import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function ClientsForm({ data, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="client_name" value="Nombre" />
                <TextInput
                    id="client_name"
                    type="text"
                    name="client_name"
                    value={data.client_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('client_name', e.target.value)}
                />
                <InputError message={errors.client_name} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="client_identification" value="Identificación" />
                <TextInput
                    id="client_identification"
                    type="text"
                    name="client_identification"
                    value={data.client_identification}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('client_identification', e.target.value)}
                />
                <InputError message={errors.client_identification} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="client_phone" value="Teléfono" />
                <TextInput
                    id="client_phone"
                    type="text"
                    name="client_phone"
                    value={data.client_phone}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('client_phone', e.target.value)}
                />
                <InputError message={errors.client_phone} className="mt-2" />
            </div>
        </>
    );
}