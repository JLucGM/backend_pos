import { Badge } from "@/Components/ui/badge";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { Input } from "@/Components/ui/input";
import { router } from "@inertiajs/react";

export const StocksColumns = [
    {
        header: "Producto",
        accessorKey: "product_id",
        cell: ({ row }) => {
            const product = row.original.product;
            const combination = row.original.combination;
            let combinationText = "Producto sencillo";

            if (combination && combination.combination_attribute_value) {
                const attributeValues = combination.combination_attribute_value.map(cav => cav.attribute_value.attribute_value_name).join(', ');
                combinationText = attributeValues;
            }

            return (
                <div className="">
                    {product ? (
                        <Link
                            href={route('products.edit', product.slug)}
                            className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            {product.product_name || 'Nombre de producto desconocido'}
                        </Link>
                    ) : (
                        <span className="text-gray-500">Producto no disponible</span>
                    )}
                    <div className="mt-1">
                        <Badge className={'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>
                            {combinationText}
                        </Badge>
                    </div>
                </div>
            )
        },
    },
    {
        header: "Código de barras",
        accessorKey: "product_barcode",
        cell: ({ row }) => {
            const barcode = row.original.product_barcode;
            return barcode ? (
                <span className="font-mono text-sm">{barcode}</span>
            ) : (
                <span className="text-gray-400 text-sm">-</span>
            );
        },
    },
    {
        header: "SKU",
        accessorKey: "product_sku",
        cell: ({ row }) => {
            const sku = row.original.product_sku;
            return sku ? (
                <span className="font-medium">{sku}</span>
            ) : (
                <span className="text-gray-400 text-sm">-</span>
            );
        },
    },
    {
        header: "Stock Actual",
        accessorKey: "quantity",
        cell: ({ row }) => {
            const quantity = row.original.quantity;
            return (
                <div className={`font-bold ${quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {quantity}
                </div>
            );
        },
    },
    {
        header: "Actualizar Stock",
        accessorKey: "update_stock",
        cell: ({ row }) => {
            const originalQuantity = row.original.quantity;
            const stockId = row.original.id;
            const [localQuantity, setLocalQuantity] = useState(originalQuantity);
            const [isUpdating, setIsUpdating] = useState(false);

            const handleUpdate = () => {
                const newQuantity = parseInt(localQuantity, 10);
                if (isNaN(newQuantity) || newQuantity < 0) {
                    setLocalQuantity(originalQuantity);
                    return;
                }
                if (newQuantity === parseInt(originalQuantity, 10)) return;

                setIsUpdating(true);
                
                router.put(route('stocks.update', stockId), {
                    quantity: newQuantity,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        setIsUpdating(false);
                    },
                    onError: (errors) => {
                        console.error('Error al actualizar stock:', errors);
                        setLocalQuantity(originalQuantity);
                        setIsUpdating(false);
                    },
                });
            };

            const handleKeyPress = (e) => {
                if (e.key === 'Enter') {
                    handleUpdate();
                }
            };

            const handleBlur = () => {
                handleUpdate();
            };

            return (
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        min="0"
                        value={localQuantity}
                        onChange={(e) => setLocalQuantity(e.target.value)}
                        onBlur={handleBlur}
                        onKeyPress={handleKeyPress}
                        className="w-24"
                        placeholder="Cant."
                        disabled={isUpdating}
                    />
                    {isUpdating && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100"></div>
                    )}
                </div>
            );
        },
    },
];