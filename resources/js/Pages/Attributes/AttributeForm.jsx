import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function CategoriesForm({ data, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="attribute_name" value="Nombre" />
                <TextInput
                    id="attribute_name"
                    type="text"
                    name="attribute_name"
                    value={data.attribute_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('attribute_name', e.target.value)}
                />
                <InputError message={errors.attribute_name} className="mt-2" />
            </div>
        </>
    );
}