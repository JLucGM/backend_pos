import { Checkbox } from '@/Components/ui/checkbox';
import { Badge } from '@/Components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export const getBulkProductColumns = ({ selectedProductsBulk, toggleBulkSelection, isDisabled, settings }) => [
    {
        id: 'select',
        header: 'Seleccionar',
        size: 50,
        cell: ({ row }) => {
            const option = row.original;
            return (
                <Checkbox
                    checked={selectedProductsBulk.some(opt => opt.value === option.value)}
                    onCheckedChange={() => toggleBulkSelection(option)}
                    disabled={isDisabled}
                />
            );
        },
    },
    {
        id: 'product_name',
        header: 'Producto',
        size: 300,
        cell: ({ row }) => {
            const option = row.original;

            // Crea string unificado de atributos si existen
            const attributesString = option.attributes && option.attributes.length > 0
                ? option.attributes
                    .map(attr =>
                        `${attr.attribute_name.charAt(0).toUpperCase() + attr.attribute_name.slice(1)}: ${attr.attribute_value_name.charAt(0).toUpperCase() + attr.attribute_value_name.slice(1)}`
                    )
                    .join(', ')
                : null;

            return (
                <div className="space-y-1">
                    <div className="font-medium">
                        <div className="flex items-center gap-x-2">
                            {option.product_name}
                            {/* Barcode */}
                            {option.barcode && (
                                <span className="text-xs text-gray-500 block">({option.barcode})</span>
                            )}
                        </div>

                        {/* Un solo badge con todos los atributos */}
                        {attributesString && (
                            <div className="flex flex-wrap gap-1 mt-1">
                                <Badge
                                    variant="default" // O "outline" para borde más sutil
                                    className="text-xs px-2 py-0.5" // Padding ajustado para badge largo
                                >
                                    {attributesString} {/* e.g., "Talla: S, Color: Rojo" */}
                                </Badge>
                            </div>
                        )}
                    </div>
                    {/* Sección de precios */}
                    <div className="text-sm text-gray-500">
                        {option.original_price > option.effective_price && (
                            <span className="line-through mr-1">{settings.default_currency} {option.original_price.toFixed(2)}</span>
                        )}
                        {settings.default_currency} {option.effective_price.toFixed(2)}
                        {option.discount && (
                            <span className="ml-2 text-green-600 text-xs">
                                {option.discount.value}% off
                            </span>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        id: 'stock',
        header: 'Stock',
        size: 80,
        cell: ({ row }) => {
            const stock = row.original.stock ?? 0; // Fallback a 0 si null/undefined
            return stock === 0 ? (
                // Stock 0: Amarillo con icono de warning
                <div className="flex items-center justify-center gap-1 text-amber-600 font-semibold text-sm">
                    <AlertTriangle className="size-4" /> {/* Icono warning */}
                    <span>{stock}</span> {/* O cambia a 'Agotado' si quieres */}
                </div>
            ) : (
                <div className="flex items-center justify-center gap-1 text-sm">
                    <span className="font-semibold">{stock}</span>
                </div>
            );
        },
    },
    {
        id: 'original_price',
        header: 'Precio',
        size: 120,
        cell: ({ row }) => <span className="text-right">{settings.default_currency} {row.original.original_price.toFixed(2)}</span>,
    },
];