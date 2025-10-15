import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Textarea } from '@/Components/ui/textarea';

export default function ShippingRatesForm({ data, setData, errors }) {
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
                <InputLabel htmlFor="price" value="Precio" />
                <TextInput
                    id="price"
                    type="text"
                    name="price"
                    value={data.price}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('price', e.target.value)}
                />
                <InputError message={errors.price} className="mt-2" />
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
        </>
    );
}