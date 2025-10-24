import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import DivSection from '@/Components/ui/div-section';

export default function ProductPricing({ data, setData, errors, handlePriceChange, handleSkuChange, handleBarcodeChange, handleStockChange }) {
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
                        onChange={(e) => setData('product_price', e.target.value)}  // Usa setData directamente
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
                        onChange={(e) => setData('product_price_discount', e.target.value)}
                    />
                    <InputError message={errors.product_price_discount} />
                </div>
            </DivSection>

            <DivSection className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <InputLabel htmlFor="product_sku" value="SKU (Stock Keeping Unit)" />
                    <TextInput
                        id="product_sku"
                        type="text"
                        name="product_sku"
                        value={data.product_sku || ''}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('product_sku', e.target.value)}  // Usa setData directamente
                    />
                    <InputError message={errors.product_sku} />
                </div>

                <div>
                    <InputLabel htmlFor="product_barcode" value="Código de barra (ISBN, UPC, etc.)" />
                    <TextInput
                        id="product_barcode"
                        type="text"
                        name="product_barcode"
                        value={data.product_barcode || ''}
                        className="mt-1 block w-full uppercase"
                        onChange={(e) => setData('product_barcode', e.target.value)}  // Usa setData directamente
                    />
                    <InputError message={errors.product_barcode} />
                </div>

                <div>
                    <InputLabel htmlFor="quantity" value="Stock" />
                    <TextInput
                        id="quantity"
                        type="number"
                        name="quantity"
                        value={data.quantity}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('quantity', e.target.value)}  // Usa setData directamente
                    />
                    <InputError message={errors.quantity} />
                </div>
            </DivSection>
        </>
    );
}