import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { PlusCircle } from 'lucide-react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { calculateTotalStock } from '@/utils/calculateTotalStock';

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
    handleStockChange,
    handleBarcodeChange,
    handleSkuChange,
    localErrors,
    setData
}) {
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

            {showAttributes && data.prices && data.prices.length > 0 ? (

                <Table>
                    <TableCaption>
                        Inventario total en la ubicación de la tienda: {calculateTotalStock(data.prices)} disponibles
                    </TableCaption>
                    <TableHeader className="bg-gray-100 dark:bg-gray-800">
                        <TableRow>
                            <TableHead className="w-[100px]">Combinaciones</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Código de Barras</TableHead>
                            <TableHead>SKU</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.prices.map((combinationObject) => {
                            const combinationDisplay = combinationObject.combination_attribute_value
                                .map(attrVal => attrVal.attribute_value.attribute_value_name)
                                .join(", ");
                            const rowKey = combinationObject.id || combinationObject._key;

                            return (
                                <TableRow key={rowKey}>
                                    <TableCell>{combinationDisplay}</TableCell>
                                    <TableCell className="p-1">
                                        <TextInput
                                            type="number"
                                            value={combinationObject.combination_price}
                                            onChange={(e) => handlePriceChange(rowKey, e.target.value)}
                                        />
                                        {localErrors[`price_${rowKey}`] && <InputError message={localErrors[`price_${rowKey}`]} />}
                                    </TableCell>
                                    <TableCell className="p-1">
                                        <TextInput
                                            type="number"
                                            value={combinationObject.stock}
                                            onChange={(e) => handleStockChange(rowKey, e.target.value)}
                                        />
                                        {localErrors[`stock_${rowKey}`] && <InputError message={localErrors[`stock_${rowKey}`]} />}
                                    </TableCell>
                                    <TableCell className="p-1">
                                        <TextInput
                                            type="text"
                                            value={combinationObject.product_barcode || ''}
                                            onChange={(e) => handleBarcodeChange(rowKey, e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="p-1">
                                        <TextInput
                                            type="text"
                                            value={combinationObject.product_sku || ''}
                                            onChange={(e) => handleSkuChange(rowKey, e.target.value)}
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