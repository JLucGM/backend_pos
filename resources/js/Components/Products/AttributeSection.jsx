import React, { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { PlusCircle } from 'lucide-react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { calculateTotalStock } from '@/utils/calculateTotalStock';
import Select from 'react-select';

export default function AttributeSection({
    data,
    errors,
    showAttributes,
    setShowAttributes,
    addAttribute,
    removeAttribute,
    handleAttributeChange,
    handleAttributeValueChange,
    addAttributeValue,
    removeAttributeValue,
    handlePriceChange,
    // handleStoreStockChange,
    // handleStoreBarcodeChange,
    // handleStoreSkuChange,
    handleCombinationStoreStockChange,
    handleCombinationStoreBarcodeChange,
    handleCombinationStoreSkuChange,

    localErrors,
    setData,
    stores
}) {
    const [selectedStore, setSelectedStore] = useState(
        stores.find(store => store.is_ecommerce_active) || stores[0]
    );

    // Actualizar store seleccionado cuando cambia data.current_store_id
    useEffect(() => {
        if (data.current_store_id) {
            const store = stores.find(s => s.id === data.current_store_id);
            if (store) setSelectedStore(store);
        }
    }, [data.current_store_id, stores]);

    const handleStoreChange = (storeId) => {
        setSelectedStore(stores.find(s => s.id === storeId));
        setData('current_store_id', storeId);
    };

    // Calcular stock total para la tienda seleccionada
    const calculateStoreTotalStock = () => {
        if (!data.prices || !selectedStore) return 0;

        return data.prices.reduce((total, combo) => {
            const storeStock = combo.stocks_by_store?.[selectedStore.id]?.stock || 0;
            return total + parseInt(storeStock || 0);
        }, 0);
    };

    // Si solo hay una tienda, mantener la interfaz actual
    const isSingleStore = stores.length === 1;

    return (
        <DivSection className='space-y-4'>
            <div className="borders rounded-xl mb-4">
                <div className="flex justify-between px-4 pt-4">
                    <p className='font-semibold'>Opciones</p>
                </div>
                <div className="border rounded-xl mb-4">
                    {showAttributes && (
                        <>
                            <div className="p-4">
                                {data.attribute_names.map((attributeName, index) => (
                                    <div key={index} className="mb-4 p-2 border rounded-md">
                                        <div className="flex justify-between items-center mb-2">
                                            <InputLabel htmlFor={`attribute_name_${index}`} value="Nombre del Atributo" />
                                            <Button variant="link" type="button" onClick={() => removeAttribute(index)} className="text-red-600">
                                                <TrashIcon className="size-4" /> Eliminar opción
                                            </Button>
                                        </div>
                                        <TextInput
                                            id={`attribute_name_${index}`}
                                            type="text"
                                            value={attributeName}
                                            onChange={(e) => handleAttributeChange(index, e.target.value)}
                                            placeholder="Nombre del atributo"
                                            className="mb-2"
                                        />
                                        <InputError message={errors[`attribute_names.${index}`]} />

                                        <InputLabel htmlFor={`attribute_values_${index}`} value="Valores del Atributo (separados por coma)" />
                                        {data.attribute_values[index] && data.attribute_values[index].length > 0 && (
                                            <div className="my-2">
                                                {data.attribute_values[index].map((value, valueIndex) => (
                                                    <div key={valueIndex} className="mb-2 flex items-center space-x-2">
                                                        <TextInput
                                                            type="text"
                                                            value={value}
                                                            onChange={(e) => handleAttributeValueChange(index, valueIndex, e.target.value)}
                                                            placeholder={`Valor de ${attributeName}`}
                                                            className="flex-grow"
                                                        />
                                                        <Button variant="link" type="button" onClick={() => removeAttributeValue(index, valueIndex)} className="text-red-600">
                                                            <TrashIcon className="size-4" />
                                                        </Button>
                                                        <InputError message={errors[`attribute_values.${index}.${valueIndex}`]} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <Button variant="link" type="button" onClick={() => addAttributeValue(index)} className="w-full justify-start">
                                            <PlusCircle className="size-4 mr-1" /> Agregar Valor
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {data.attribute_names.length < 3 ? (
                                <Button className="w-full justify-start p-4" variant="link" size="sm" type="button" onClick={addAttribute}>
                                    <PlusCircle className="size-4 mr-1" />
                                    Agregar otro opción
                                </Button>
                            ) : null}
                        </>
                    )}
                    {!showAttributes && data.attribute_names.length < 3 ? (
                        <Button
                            className="w-full justify-start p-4"
                            variant="link"
                            size="sm"
                            type="button"
                            onClick={() => {
                                setShowAttributes(true);
                                if (data.attribute_names.length === 0) {
                                    setData('attribute_names', ['']);
                                    setData('attribute_values', [['']]);
                                }
                            }}
                        >
                            <PlusCircle className="size-4 mr-1" />
                            Agregar opción
                        </Button>
                    ) : null}
                </div>
            </div>

            {showAttributes && !isSingleStore && (
                <DivSection>
                    <div className="mb-4">
                        <InputLabel htmlFor="store_select" value="Seleccionar Tienda" />
                        <select
                            id="store_select"
                            value={selectedStore?.id || ''}
                            onChange={(e) => handleStoreChange(parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            {stores.map(store => (
                                <option key={store.id} value={store.id}>
                                    {store.name} {store.is_ecommerce_active && '(E-commerce)'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="text-sm text-gray-500">
                        Configura los precios y stock para la tienda: <strong>{selectedStore?.name}</strong>
                    </p>
                </DivSection>
            )}

            {showAttributes && data.prices && data.prices.length > 0 ? (
                <Table>
                    <TableCaption>
                        {isSingleStore
                            ? `Inventario total en ${stores[0].name}: ${calculateStoreTotalStock(data.prices, stores[0].id)} disponibles`
                            : `Inventario en ${selectedStore?.name}: ${calculateStoreTotalStock(data.prices, selectedStore?.id)} disponibles`
                        }
                    </TableCaption>
                    <TableHeader className="bg-gray-100 dark:bg-gray-800">
                        <TableRow>
                            <TableHead className="w-[100px]">Combinaciones</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            {/* {!isSingleStore && <TableHead>Tienda</TableHead>} */}
                            <TableHead>Código de Barras</TableHead>
                            <TableHead>SKU</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.prices.map((combinationObject) => {
                            const combinationDisplay = combinationObject.combination_attribute_value
                                ?.map(attrVal => attrVal.attribute_value?.attribute_value_name)
                                .join(", ") || combinationObject._key || '';

                            const rowKey = combinationObject.id || combinationObject._key;

                            // Para múltiples tiendas, usar datos de la tienda seleccionada
                            // Para una sola tienda, usar datos directos
                            const storeId = isSingleStore ? stores[0].id : selectedStore?.id;
                            const storeData = combinationObject.stocks_by_store?.[storeId] || {};

                            return (
                                <TableRow key={rowKey}>
                                    <TableCell>{combinationDisplay}</TableCell>
                                    <TableCell className="p-1">
                                        <TextInput
                                            type="number"
                                            value={combinationObject.combination_price || '0'}
                                            onChange={(e) => handlePriceChange(rowKey, e.target.value)}
                                        />
                                        {localErrors[`price_${rowKey}`] && <InputError message={localErrors[`price_${rowKey}`]} />}
                                    </TableCell>
                                    <TableCell className="p-1">
                                        <TextInput
                                            type="number"
                                            value={storeData.stock || '0'}
                                            onChange={(e) => handleCombinationStoreStockChange(rowKey, storeId, e.target.value)}
                                        />
                                        {localErrors[`stock_${rowKey}_${storeId}`] && <InputError message={localErrors[`stock_${rowKey}_${storeId}`]} />}
                                    </TableCell>
                                    {/* {!isSingleStore && (
                                        <TableCell className="p-1">
                                            <span className="text-sm">{selectedStore?.name}</span>
                                        </TableCell>
                                    )} */}
                                    <TableCell className="p-1">
                                        <TextInput
                                            type="text"
                                            value={storeData.product_barcode || ''}
                                            onChange={(e) => handleCombinationStoreBarcodeChange(rowKey, storeId, e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="p-1">
                                        <TextInput
                                            type="text"
                                            value={storeData.product_sku || ''}
                                            onChange={(e) => handleCombinationStoreSkuChange(rowKey, storeId, e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            ) : null}
        </DivSection>
    );
}