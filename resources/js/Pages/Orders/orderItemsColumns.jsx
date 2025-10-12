// resources/js/Pages/Orders/orderItemsColumns.js
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { BadgePercent, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const getOrderItemsColumns = ({ handleQuantityChange, handleRemoveItem, isDisabled, showDiscount = true, isEdit = false }) => [
    {
        id: 'name_product',
        header: 'Producto',
        size: 250, // FIX: Ancho mayor para atributos/variaciones
        cell: ({ row }) => {
            const item = row.original;

            // --- CÁLCULO DE PRECIOS PARA MOSTRAR ---
            const originalPrice = parseFloat(item.product_price || 0);
            const discountedPrice = parseFloat(item.discounted_price || originalPrice);
            const discountAmount = parseFloat(item.discount_amount || 0);
            const hasDiscount = discountAmount > 0;
            // ----------------------------------------

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

                    {/* Atributos/Variaciones */}
                    {item.attributes_display && (
                        <div className="text-sm text-gray-500 pl-2 s-red-400"> {/* FIX: Muestra atributos debajo */}
                            {item.attributes_display}
                        </div>
                    )}


                    {/* --- SECCIÓN: PRECIO Y PRECIO DE DESCUENTO --- */}
                    <div className="flex items-center space-x-2 pt-1">
                        {/* 1. Precio Original (Tachado si hay descuento) */}
                        {hasDiscount && (
                            <span className="line-through text-gray-500 text-sm">
                                ${originalPrice.toFixed(2)}
                            </span>
                        )}

                        {/* 2. Precio Aplicado (Con o Sin Descuento) */}
                        {/* Si hay descuento, se pone en verde, si no, es el precio normal */}
                        <span className={`font-semibold ${hasDiscount ? 'text-green-600 text-sm' : 'text-gray-900 text-sm'}`}>
                            ${discountedPrice.toFixed(2)}
                        </span>

                        {/* 3. Monto del Descuento (Solo si > 0) */}
                    </div>
                    {hasDiscount && (
                        <div className="flex items-center space-x-1">

                            <BadgePercent className='size-4' />
                            {/* <span className="text-red-600 text-sm font-medium">
                                NombreDescuento:
                            </span> */}
                            <span className=" text-sm font-medium">
                                (-${discountAmount.toFixed(2)})
                            </span>
                        </div>
                    )}
                    {/* ---------------------------------------------------- */}

                    {/* {item.combination_id && !isEdit && ( // Opcional: ID variación para debug (no en edit)
                        <div className="text-xs text-blue-600 pl-2">
                            Variación ID: {item.combination_id}
                        </div>
                    )} */}
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
                    disabled={isDisabled || isEdit}
                    className="w-16"
                />
            );
        },
    },
    {
        id: 'product_price',
        header: 'Precio Unitario',
        size: 120,
        cell: ({ row, getValue }) => {
            const originalPrice = parseFloat(getValue() || row.original.product_price || 0);
            // Mostramos solo el precio aplicado para evitar redundancia con el nombre
            const discountedPrice = parseFloat(row.original.discounted_price || originalPrice);

            return <span className="font-medium text-right">${discountedPrice.toFixed(2)}</span>;
        },
    },
    {
        id: 'subtotal',
        header: 'Subtotal',
        size: 100,
        cell: ({ row, getValue }) => {
            const subtotal = parseFloat(getValue() || row.original.subtotal || 0); // Siempre post ($9)
            return <span className="text-right font-bold">${subtotal.toFixed(2)}</span>;
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