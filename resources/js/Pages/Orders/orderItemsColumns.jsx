import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { BadgePercent, Tag, Trash2 } from 'lucide-react';

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

            // **NUEVO: Calcular el descuento directo del producto (product_price_discount)**
            // Suponemos que el precio original es product_price y el precio con descuento directo es discounted_price
            // Pero necesitamos diferenciar entre descuento directo y otros descuentos
            const directDiscountPerUnit = item.original_price && item.product_price 
                ? parseFloat(item.original_price) - parseFloat(item.product_price) 
                : 0;
            const directDiscountAmount = directDiscountPerUnit > 0 ? directDiscountPerUnit * item.quantity : 0;
            
            // Calcular otros descuentos (automáticos o por código)
            const otherDiscountAmount = Math.max(0, discountAmount - directDiscountAmount);

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
                        <div className="font-medium">{item.name_product}</div>
                        {/* Barcode */}
                        {item.barcode && (
                            <div className="text-xs text-gray-400 pl-2">
                                ({item.barcode})
                            </div>
                        )}
                    </div>

                    {attributesString && (
                        <div className="mt-1">
                            <Badge
                                variant="default" 
                                className="text-xs px-2 py-0.5"
                            >
                                {attributesString}
                            </Badge>
                        </div>
                    )}

                    <div className="flex items-center space-x-2 pt-1">
                        {/* **CORRECCIÓN: Mostrar precio original tachado si hay descuento directo** */}
                        {directDiscountPerUnit > 0 && (
                            <span className="line-through text-gray-500 text-sm">
                                {settings.default_currency} {item.original_price?.toFixed(2) || originalPrice.toFixed(2)}
                            </span>
                        )}
                        
                        {/* **CORRECCIÓN: Mostrar precio con descuento directo si existe** */}
                        {directDiscountPerUnit > 0 ? (
                            <span className="text-gray-700 text-sm">
                                {settings.default_currency} {item.product_price?.toFixed(2) || originalPrice.toFixed(2)}
                            </span>
                        ) : (
                            <span className="text-gray-700 text-sm">
                                {settings.default_currency} {originalPrice.toFixed(2)}
                            </span>
                        )}

                        {/* Mostrar precio final si hay descuentos adicionales */}
                        {hasDiscount && discountedPrice < (item.product_price || originalPrice) && (
                            <span className="font-semibold text-green-600 text-sm">
                                → {settings.default_currency} {discountedPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* **NUEVO: Mostrar desglose de descuentos** */}
                    {hasDiscount && (
                        <div className="flex flex-col gap-1 pt-1">
                            {/* Descuento directo del producto */}
                            {directDiscountAmount > 0 && (
                                <div className="flex items-center space-x-1">
                                    <Tag className='size-4 text-blue-500' />
                                    <span className="text-xs text-blue-600 font-medium">
                                        Descuento directo: -{settings.default_currency} {directDiscountAmount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            
                            {/* Otros descuentos (automáticos o por código) */}
                            {otherDiscountAmount > 0 && (
                                <div className="flex items-center space-x-1">
                                    <BadgePercent className='size-4 text-green-500' />
                                    <span className="text-xs text-green-600 font-medium">
                                        {item.discount_type === 'percentage' 
                                            ? `Descuento ${item.discount_type}: -${settings.default_currency} ${otherDiscountAmount.toFixed(2)}` 
                                            : `Descuento: -${settings.default_currency} ${otherDiscountAmount.toFixed(2)}`
                                        }
                                    </span>
                                </div>
                            )}
                            
                            {/* Mostrar total de descuento */}
                            <div className="flex items-center space-x-1 border-t border-gray-200 pt-1 mt-1">
                                <span className="text-xs font-bold">
                                    Descuento total: -{settings.default_currency} {discountAmount.toFixed(2)}
                                </span>
                            </div>
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