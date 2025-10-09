// resources/js/Pages/Orders/orderItemsColumns.js
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const getOrderItemsColumns = ({ handleQuantityChange, handleRemoveItem, isDisabled, showDiscount = true, isEdit = false }) => [
    {
        id: 'name_product',
        header: 'Producto',
        cell: ({ row }) => (
            <div className="font-medium">{row.original.name_product}</div>
        ),
    },
    {
        id: 'quantity',
        header: 'Cantidad',
        cell: ({ row, getValue }) => {
            const quantity = getValue() || row.original.quantity || 1;
            const index = row.original.index;
            return (
                <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    min={1}
                    disabled={isDisabled || isEdit}
                    className="w-16"
                />
            );
        },
    },
    {
        id: 'product_price',
        header: 'Precio Unitario',
        cell: ({ row, getValue }) => {
            const originalPrice = parseFloat(getValue() || row.original.product_price || 0); // Debe ser $10 original
            const discountedPrice = parseFloat(row.original.discounted_price || originalPrice); // $9 post
            const discountAmount = parseFloat(row.original.discount_amount || 0); // $1

            // DEBUG: Verifica valores en cada fila de tabla
            // console.log(`Row ${row.original.index}: product_price=${originalPrice} (debe=10), discounted_price=${discountedPrice} (debe=9), discount_amount=${discountAmount}`);

            if (discountAmount > 0) {
                // Muestra original tachado + post al lado
                return (
                    <div className="flex flex-col">
                        <span className="line-through text-gray-500 text-sm">${originalPrice.toFixed(2)}</span>
                        <span className="font-medium text-green-600">${discountedPrice.toFixed(2)}</span>
                    </div>
                );
            }
            // Sin descuento: Solo original
            return <span className="font-medium">${originalPrice.toFixed(2)}</span>;
        },
    },
    ...(showDiscount ? [{
        id: 'discount_amount',
        header: 'Descuento',
        cell: ({ row, getValue }) => {
            const discount = parseFloat(getValue() || row.original.discount_amount || 0);
            if (discount > 0) {
                return <span className="text-red-600 font-medium">-${discount.toFixed(2)}</span>;
            }
            return <span className="text-gray-500">-$0.00</span>;
        },
    }] : []),
    {
        id: 'subtotal',
        header: 'Subtotal',
        cell: ({ row, getValue }) => {
            const subtotal = parseFloat(getValue() || row.original.subtotal || 0); // Siempre post ($9)
            return <span className="font-bold">${subtotal.toFixed(2)}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            const index = row.original.index;
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    disabled={isDisabled}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            );
        },
    },
];
