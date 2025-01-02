import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function CategoriesForm({ data, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="country_name" value="Nombre" />
                <TextInput
                    id="country_name"
                    type="text"
                    name="country_name"
                    value={data.country_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('country_name', e.target.value)}
                />
                <InputError message={errors.country_name} className="mt-2" />
            </div>
        </>
    );
}