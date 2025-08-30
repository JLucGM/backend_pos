import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function CategoriesForm({ data, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="category_name" value="Nombre" />
                <TextInput
                    id="category_name"
                    type="text"
                    name="category_name"
                    value={data.category_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('category_name', e.target.value)}
                />
                <InputError message={errors.category_name} className="mt-2" />
            </div>
        </>
    );
}