import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function StocksForm({ data, stores, products, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="quantity" value="Cantidad" />
                <TextInput
                    id="quantity"
                    type="text"
                    name="quantity"
                    value={data.quantity}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('quantity', e.target.value)}
                />
                <InputError message={errors.quantity} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="status" value="Status" />
                <select
                    name="status"
                    id="status"
                    className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-3xl shadow-sm"
                    value={data.status}
                    onChange={(e) => setData('status', parseInt(e.target.value))}
                >
                    <option value={0}>
                        Entrando
                    </option>
                    <option value={1}>
                        Saliendo
                    </option>

                </select>
                <InputError message={errors.status} className="mt-2" /> {/* Cambia a 'status' */}
            </div>

            <div>
                <InputLabel htmlFor="store" value="Tiendas" />
                <select
                    name="store_id"
                    id="store"
                    className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-3xl shadow-sm"
                    value={data.store_id}
                    onChange={(e) => setData('store_id', parseInt(e.target.value))}
                >
                    {stores.length === 0 ? (
                        <option value="" disabled>
                            No hay tiendas disponibles
                        </option>
                    ) : (
                        stores.map((store) => (
                            <option value={store.id} key={store.id}>
                                {store.store_name}
                            </option>
                        ))
                    )}
                </select>
                <InputError message={errors.store_id} className="mt-2" /> {/* Cambia a 'store_id' */}
            </div>

            <div>
                <InputLabel htmlFor="product" value="Tiendas" />
                <select
                    name="product_id"
                    id="product"
                    className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-3xl shadow-sm"
                    value={data.product_id}
                    onChange={(e) => setData('product_id', parseInt(e.target.value))}
                >
                    {products.length === 0 ? (
                        <option value="" disabled>
                        No hay tiendas disponibles
                    </option>
                        
                    ) : (
                        products.map((product) => (
                            <option value={product.id} key={product.id}>
                                {product.product_name}
                            </option>
                        ))
                        
                    )}
                </select>
                <InputError message={errors.product_id} className="mt-2" /> {/* Cambia a 'product_id' */}
            </div>
        </>
    );
}