import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Textarea } from '@/Components/ui/textarea';
import Select from 'react-select';
import { useSelectOptions } from '@/hooks/useSelectOptions';
import { customStyles } from '@/hooks/custom-select';
import DivSection from '@/Components/ui/div-section';
import { usePage } from '@inertiajs/react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';

export default function ShippingRatesForm({ data, setData, errors, stores }) {
    const settings = usePage().props.settings;

    // Usar el hook para obtener las opciones de tiendas
    const { storeOptions } = useSelectOptions([], [], [], [], [], [], stores);

    // Valor seleccionado para el select
    const selectedStore = storeOptions.find(option => option.value === data.store_id) || null;

    const handleStoreChange = (selectedOption) => {
        setData('store_id', selectedOption ? selectedOption.value : null);
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className='col-span-full md:col-span-2'>
                <DivSection >
                    {/* Nombre de la tarifa */}
                    <div>
                        <InputLabel htmlFor="name" value="Nombre de la tarifa" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ej: Envío estándar, Envío express, etc."
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Precio */}
                    <div>
                        <InputLabel htmlFor="price" value="Precio" />
                        <div className="relative mt-1">
                            <TextInput
                                id="price"
                                type="number"
                                name="price"
                                value={data.price}
                                className="block w-full pl-7"
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-gray-500">
                                    <CurrencyDisplay currency={settings.currency}  />
                                </span>
                            </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Precio de la tarifa de envío
                        </p>
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    {/* Descripción */}
                    <div>
                        <InputLabel htmlFor="description" value="Descripción" />
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            className="mt-1 block w-full resize-none"
                            rows={4}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Describe los detalles de esta tarifa de envío (tiempo de entrega, zonas cubiertas, restricciones, etc.)"
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                </DivSection>
            </div>

            <div className='col-span-full md:col-span-1'>

                <DivSection>
                    {/* Selector de Tienda */}
                    <div>
                        <InputLabel htmlFor="store_id" value="Tienda" />
                        <Select
                            id="store_id"
                            name="store_id"
                            value={selectedStore}
                            onChange={handleStoreChange}
                            options={storeOptions}
                            styles={customStyles}
                            isSearchable={true}
                            placeholder="Seleccionar tienda..."
                            isClearable={false}
                            required
                        />
                        <InputError message={errors.store_id} className="mt-2" />
                    </div>
                    {/* Información adicional */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Información importante:
                        </h3>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Cada tarifa de envío está asociada a una tienda específica</li>
                            {/* <li>• Los clientes verán solo las tarifas disponibles para la tienda seleccionada</li> */}
                            <li>• Puedes crear diferentes tarifas para diferentes tiendas</li>
                        </ul>
                    </div>
                </DivSection>
            </div>
        </div>
    );
}