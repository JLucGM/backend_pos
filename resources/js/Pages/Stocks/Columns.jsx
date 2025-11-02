import { Badge } from "@/Components/ui/badge";
import { Link } from "@inertiajs/react";
import { useState } from "react";  // Agrega useState
import { Input } from "@/Components/ui/input";  // Agrega Input de shadcn/ui
import { router } from "@inertiajs/react";  // Asume que tienes router para el PUT

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
                        >
                            {product.product_name || 'Nombre de producto desconocido'}
                        </Link>
                    ) : (
                        <span>Producto no disponible</span>
                    )}
                    <div className="">
                        <Badge className={'bg-gray-300 text-black'}>{combinationText}</Badge>
                    </div>
                </div>
            )
        },
    },
    {
        header: "Código de barras",
        accessorKey: "product_barcode",
    },
    {
        header: "SKU",
        accessorKey: "product_sku",
    },
    {
        header: "Actualizar Stock",
        accessorKey: "update_stock",
        cell: ({ row }) => {
            const originalQuantity = row.original.quantity;
            const [localQuantity, setLocalQuantity] = useState(originalQuantity);

            const handleBlur = () => {
                const newQuantity = parseInt(localQuantity, 10);
                if (isNaN(newQuantity) || newQuantity < 0) {
                    setLocalQuantity(originalQuantity);
                    return;
                }
                if (newQuantity === parseInt(originalQuantity, 10)) return;

                // Cambia router.put a router.post para coincidir con la ruta POST
                router.post(route('stocks.update', row.original.id), {
                    quantity: newQuantity,
                    _method: 'PUT',  // Opcional: si tu backend espera PUT, agrega esto para simularlo
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        console.log('Stock actualizado');
                    },
                    onError: (errors) => {
                        console.error('Error al actualizar stock:', errors);
                        setLocalQuantity(originalQuantity);
                    },
                });
            };

            return (
                <Input
                    type="number"
                    min="0"
                    value={localQuantity}
                    onChange={(e) => setLocalQuantity(e.target.value)}
                    onBlur={handleBlur}
                    className="w-20"
                    placeholder="Cant."
                />
            );
        },
    },
];
