import { updateProductData } from '@/utils/updateProductData';

export const useProductDataHandlers = (data, setData, showAttributes, validateAndSetError) => {
    const handlePriceChange = (identifier, value) => {
        if (!validateAndSetError(`price_${identifier}`, value, 'precio')) return;
        updateProductData(data, setData, identifier, { combination_price: value }, showAttributes);
    };

    const handleStockChange = (identifier, value) => {
        if (!validateAndSetError(`stock_${identifier}`, value, 'stock')) return;
        updateProductData(data, setData, identifier, { stock: value }, showAttributes);
    };

    const handleBarcodeChange = (identifier, value) => {
        updateProductData(data, setData, identifier, { product_barcode: value }, showAttributes);
    };

    const handleSkuChange = (identifier, value) => {
        updateProductData(data, setData, identifier, { product_sku: value }, showAttributes);
    };

    return { handlePriceChange, handleStockChange, handleBarcodeChange, handleSkuChange };
};