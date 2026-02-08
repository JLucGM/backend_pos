import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import DivSection from '@/Components/ui/div-section';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

export default function ProductPricing({ 
    data, 
    setData, 
    errors, 
    handleSimpleProductChange,
    handleSimpleStoreStockChange,
    handleSimpleStoreSkuChange,
    handleSimpleStoreBarcodeChange,
    stores 
}) {
    const isSingleStore = stores.length === 1;

    return (
        <>
            <DivSection className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <InputLabel htmlFor="product_price" value="Precio" />
                    <TextInput
                        id="product_price"
                        type="number"
                        name="product_price"
                        value={data.product_price}
                        className="mt-1 block w-full"
                        onChange={(e) => handleSimpleProductChange('product_price', e.target.value)}
                    />
                    <InputError message={errors.product_price} />
                </div>

                <div>
                    <InputLabel htmlFor="product_price_discount" value="Precio de descuento" />
                    <TextInput
                        id="product_price_discount"
                        type="number"
                        name="product_price_discount"
                        value={data.product_price_discount || ''}
                        className="mt-1 block w-full"
                        onChange={(e) => handleSimpleProductChange('product_price_discount', e.target.value)}
                    />
                    <InputError message={errors.product_price_discount} />
                </div>
            </DivSection>

            {isSingleStore ? (
                // Una sola tienda - mostrar campos simples
                <DivSection className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <InputLabel htmlFor="product_sku" value="SKU (Stock Keeping Unit)" />
                        <TextInput
                            id="product_sku"
                            type="text"
                            name="product_sku"
                            value={data.stores_data?.[stores[0].id]?.product_sku || ''}
                            className="mt-1 block w-full"
                            onChange={(e) => handleSimpleStoreSkuChange(stores[0].id, e.target.value)}
                        />
                        <InputError message={errors[`stores_data.${stores[0].id}.product_sku`]} />
                    </div>

                    <div>
                        <InputLabel htmlFor="product_barcode" value="Código de barra (ISBN, UPC, etc.)" />
                        <TextInput
                            id="product_barcode"
                            type="text"
                            name="product_barcode"
                            value={data.stores_data?.[stores[0].id]?.product_barcode || ''}
                            className="mt-1 block w-full uppercase"
                            onChange={(e) => handleSimpleStoreBarcodeChange(stores[0].id, e.target.value)}
                        />
                        <InputError message={errors[`stores_data.${stores[0].id}.product_barcode`]} />
                    </div>

                    <div>
                        <InputLabel htmlFor="quantity" value="Stock" />
                        <TextInput
                            id="quantity"
                            type="number"
                            name="quantity"
                            value={data.stores_data?.[stores[0].id]?.quantity || 0}
                            className="mt-1 block w-full"
                            onChange={(e) => handleSimpleStoreStockChange(stores[0].id, e.target.value)}
                        />
                        <InputError message={errors[`stores_data.${stores[0].id}.quantity`]} />
                    </div>
                </DivSection>
            ) : (
                // Múltiples tiendas - mostrar tabla
                <DivSection>
                    <h3 className="text-lg font-semibold mb-4">Stock por Tienda</h3>
                    <Table>
                        <TableHeader className="bg-gray-100 dark:bg-gray-800">
                            <TableRow>
                                <TableHead>Tienda</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Código de Barras</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stores.map((store) => (
                                <TableRow key={store.id}>
                                    <TableCell className="font-medium">{store.name}</TableCell>
                                    <TableCell>
                                        <TextInput
                                            type="number"
                                            value={data.stores_data?.[store.id]?.quantity || 0}
                                            onChange={(e) => handleSimpleStoreStockChange(store.id, e.target.value)}
                                            className="w-full"
                                        />
                                        <InputError message={errors[`stores_data.${store.id}.quantity`]} />
                                    </TableCell>
                                    <TableCell>
                                        <TextInput
                                            type="text"
                                            value={data.stores_data?.[store.id]?.product_sku || ''}
                                            onChange={(e) => handleSimpleStoreSkuChange(store.id, e.target.value)}
                                            className="w-full"
                                        />
                                        <InputError message={errors[`stores_data.${store.id}.product_sku`]} />
                                    </TableCell>
                                    <TableCell>
                                        <TextInput
                                            type="text"
                                            value={data.stores_data?.[store.id]?.product_barcode || ''}
                                            onChange={(e) => handleSimpleStoreBarcodeChange(store.id, e.target.value)}
                                            className="w-full uppercase"
                                        />
                                        <InputError message={errors[`stores_data.${store.id}.product_barcode`]} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DivSection>
            )}
        </>
    );
}