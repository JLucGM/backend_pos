import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function ProductsForm({ data, taxes, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="product_name" value="Nombre" />
                <TextInput
                    id="product_name"
                    type="text"
                    name="product_name"
                    value={data.product_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('product_name', e.target.value)}
                />
                <InputError message={errors.product_name} />
            </div>
            <div>
                <InputLabel htmlFor="product_price" value="precio" />
                <TextInput
                    id="product_price"
                    type="text"
                    name="product_price"
                    value={data.product_price}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('product_price', e.target.value)}
                />
                <InputError message={errors.product_price} />
            </div>
            <div>
                <InputLabel htmlFor="product_description" value="description" />
                <TextInput
                    id="product_description"
                    type="text"
                    name="product_description"
                    value={data.product_description}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('product_description', e.target.value)}
                />
                <InputError message={errors.product_description} />
            </div>

            <div>
                <InputLabel htmlFor="tax_id" value="Estados" />
                <select
                    name="tax_id"
                    id="tax_id"
                    className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-3xl shadow-sm"
                    value={data.tax_id}
                    onChange={(e) => setData('tax_id', parseInt(e.target.value))}
                >
                    {taxes.map((tax) => (
                        <option value={tax.id} key={tax.id}>
                            {tax.tax_name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.tax_id} className="mt-2" /> {/* Cambia a 'country_id' */}
            </div>
        </>
    );
}