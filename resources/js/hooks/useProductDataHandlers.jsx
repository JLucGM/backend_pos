import { updateProductData } from '@/utils/updateProductData';

export const useProductDataHandlers = (data, setData, showAttributes, validateAndSetError, stores) => {
    const isSingleStore = stores.length === 1;

    // Para productos simples (sin atributos)
    const handleSimpleProductChange = (field, value) => {
        setData(field, value);
    };

    // Para productos con atributos: precio de combinación
    const handlePriceChange = (identifier, value) => {
        if (!validateAndSetError(`price_${identifier}`, value, 'precio')) return;
        
        const updatedPrices = data.prices.map(combo => {
            if (combo.id === identifier || combo._key === identifier) {
                return {
                    ...combo,
                    combination_price: value
                };
            }
            return combo;
        });
        setData('prices', updatedPrices);
    };

    // Para productos con atributos: stock por tienda
    const handleCombinationStoreStockChange = (combinationKey, storeId, value) => {
        if (!validateAndSetError(`stock_${combinationKey}_${storeId}`, value, 'stock')) return;
        
        const updatedPrices = data.prices.map(combo => {
            if (combo.id === combinationKey || combo._key === combinationKey) {
                return {
                    ...combo,
                    stocks_by_store: {
                        ...combo.stocks_by_store,
                        [storeId]: {
                            ...combo.stocks_by_store?.[storeId],
                            stock: value
                        }
                    }
                };
            }
            return combo;
        });
        setData('prices', updatedPrices);
    };

    // Para productos con atributos: SKU por tienda
    const handleCombinationStoreSkuChange = (combinationKey, storeId, value) => {
        const updatedPrices = data.prices.map(combo => {
            if (combo.id === combinationKey || combo._key === combinationKey) {
                return {
                    ...combo,
                    stocks_by_store: {
                        ...combo.stocks_by_store,
                        [storeId]: {
                            ...combo.stocks_by_store?.[storeId],
                            product_sku: value
                        }
                    }
                };
            }
            return combo;
        });
        setData('prices', updatedPrices);
    };

    // Para productos con atributos: Barcode por tienda
    const handleCombinationStoreBarcodeChange = (combinationKey, storeId, value) => {
        const updatedPrices = data.prices.map(combo => {
            if (combo.id === combinationKey || combo._key === combinationKey) {
                return {
                    ...combo,
                    stocks_by_store: {
                        ...combo.stocks_by_store,
                        [storeId]: {
                            ...combo.stocks_by_store?.[storeId],
                            product_barcode: value
                        }
                    }
                };
            }
            return combo;
        });
        setData('prices', updatedPrices);
    };

    // Para productos simples con múltiples tiendas
    const handleSimpleStoreStockChange = (storeId, value) => {
        const updatedStoresData = { ...data.stores_data };
        updatedStoresData[storeId] = {
            ...updatedStoresData[storeId],
            quantity: value
        };
        setData('stores_data', updatedStoresData);
    };

    const handleSimpleStoreSkuChange = (storeId, value) => {
        const updatedStoresData = { ...data.stores_data };
        updatedStoresData[storeId] = {
            ...updatedStoresData[storeId],
            product_sku: value
        };
        setData('stores_data', updatedStoresData);
    };

    const handleSimpleStoreBarcodeChange = (storeId, value) => {
        const updatedStoresData = { ...data.stores_data };
        updatedStoresData[storeId] = {
            ...updatedStoresData[storeId],
            product_barcode: value
        };
        setData('stores_data', updatedStoresData);
    };

    return {
        // Para productos simples (sin atributos)
        handleSimpleProductChange,
        handleSimpleStoreStockChange,
        handleSimpleStoreSkuChange,
        handleSimpleStoreBarcodeChange,
        
        // Para productos con atributos
        handlePriceChange,
        handleCombinationStoreStockChange,
        handleCombinationStoreSkuChange,
        handleCombinationStoreBarcodeChange,
    };
};