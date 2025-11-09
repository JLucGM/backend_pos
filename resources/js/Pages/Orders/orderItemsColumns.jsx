import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { BadgePercent, Trash2 } from 'lucide-react';

export const getOrderItemsColumns = ({ handleQuantityChange, handleRemoveItem, isDisabled, showDiscount = true, settings }) => [
    {
        id: 'name_product',
        header: 'Producto',
        size: 250, 
        cell: ({ row }) => {
            const item = row.original;
            const originalPrice = parseFloat(item.product_price || 0);
            const discountedPrice = parseFloat(item.discounted_price || originalPrice);
            const discountAmount = parseFloat(item.discount_amount || 0);
            const hasDiscount = discountAmount > 0;

            let attributesString = null;
            if (item.attributes && Array.isArray(item.attributes) && item.attributes.length > 0) {
                attributesString = item.attributes
                    .map(attr => 
                        `${attr.attribute_name.charAt(0).toUpperCase() + attr.attribute_name.slice(1)}: ${attr.attribute_value_name.charAt(0).toUpperCase() + attr.attribute_value_name.slice(1)}`
                    )
                    .join(', ');
            } else if (item.attributes_display) {
                attributesString = item.attributes_display
                    .replace(/^ - /, '') 
                    .trim();
            }

            return (
                <div className="space-y-1">
                    <div className="flex">
                        {/* Nombre del Producto */}
                        <div className="font-medium">{item.name_product}</div> {/* Principal: "pantalon" */}
                        {/* Barcode */}
                        {item.barcode && (
                            <div className="text-xs text-gray-400 pl-2"> {/* Opcional: Barcode */}
                                ({item.barcode})
                            </div>
                        )}
                    </div>

                    {attributesString && (
                        <div className=" mt-1">
                            <Badge
                                variant="default" 
                                className="text-xs px-2 py-0.5"
                            >
                                {attributesString}
                            </Badge>
                        </div>
                    )}

                    <div className="flex items-center space-x-2 pt-1">
                        {hasDiscount && (
                            <span className="line-through text-gray-500 text-sm">
                                {settings.default_currency} {originalPrice.toFixed(2)}
                            </span>
                        )}

                        <span className={`font-semibold ${hasDiscount ? 'text-green-600 text-sm' : 'text-gray-900 text-sm'}`}>
                            {settings.default_currency} {discountedPrice.toFixed(2)}
                        </span>

                    </div>
                    {hasDiscount && (
                        <div className="flex items-center space-x-1">
                            <BadgePercent className='size-4' />
                            <span className=" text-sm font-medium">
                                (-{settings.default_currency} {discountAmount.toFixed(2)})
                            </span>
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        id: 'quantity',
        header: 'Cantidad',
        size: 80,
        cell: ({ row, getValue }) => {
            const quantity = getValue() || row.original.quantity || 1;
            const index = row.original.index;
            return (
                <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    min={1}
                    disabled={isDisabled}
                    className="w-16"
                />
            );
        },
    },
    // {
    //     id: 'product_price',
    //     header: 'Precio Unitario',
    //     size: 120,
    //     cell: ({ row, getValue }) => {
    //         const originalPrice = parseFloat(getValue() || row.original.product_price || 0);
    //         const discountedPrice = parseFloat(row.original.discounted_price || originalPrice);

    //         return <span className="font-medium text-right">${discountedPrice.toFixed(2)}</span>;
    //     },
    // },
    {
        id: 'subtotal',
        header: 'Subtotal',
        size: 100,
        cell: ({ row, getValue }) => {
            const subtotal = parseFloat(getValue() || row.original.subtotal || 0); // Siempre post ($9)
            return <span className="text-right font-bold">{settings.default_currency} {subtotal.toFixed(2)}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Acciones',
        size: 80,
        cell: ({ row }) => {
            const index = row.original.index;
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    disabled={isDisabled}
                    className="h-8 w-8 p-0"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            );
        },
    },
];