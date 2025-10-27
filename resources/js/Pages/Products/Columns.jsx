import { Badge } from '@/Components/ui/badge';
import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";

export const ProductColumns = [
    {
        header: "",
        accessorKey: "id",
        cell: ({ row }) => (
            <div className="flex items-center">
                {row.original.media.length > 0 && (
                    <img
                        src={row.original.media[0]?.original_url} // URL de la imagen o del placeholder
                        alt={row.original.product_name}
                        className="h-8 w-8 rounded-lg me-2 object-cover content-center"
                        onError={(e) => {
                            e.target.onerror = null; // Evita bucles infinitos
                            e.target.src = "https://placehold.co/32"; // URL del placeholder
                        }}
                    />
                )}
            </div>
        ),
    },
    {
        header: "Producto",
        accessorKey: "product_name",
    },
    {
        header: "Publicado",
        accessorKey: "is_active",
        cell: ({ row }) => {
            const isActive = row.original.is_active === true; // Verifica si el estado es "1" (Activo)
            return (
                <Badge variant={isActive === true ? 'success' : 'info'}>
                    {isActive === true ? 'Publicado' : 'Borrador'}
                </Badge>
            );
        },
    },
    {
        header: "Inventario",
        accessorKey: "stocks",
        cell: ({ row }) => {
            const stocks = row.original.stocks;
            const hasCombinations = stocks.some(stock => stock.combination_id !== null);

            if (hasCombinations) {
                // For variable products
                const totalQuantity = stocks.reduce((sum, stock) => sum + parseFloat(stock.quantity), 0);
                // Count unique non-null combination_ids to get the number of variants
                const numberOfVariants = new Set(stocks.filter(stock => stock.combination_id !== null).map(stock => stock.combination_id)).size;

                return (
                    <p className={totalQuantity === 0 ? 'text-destructive' : 'text-primary'}>
                        {totalQuantity} disponibles en {numberOfVariants} variantes
                    </p>
                );
            } else {
                // For simple products
                // Ensure stock exists before accessing its properties
                const stockQuantity = (stocks && stocks.length > 0 && stocks[0]) ? parseFloat(stocks[0].quantity) : 0;
                return (
                    <p className={stockQuantity === 0 ? 'text-destructive' : 'text-primary'}>
                        {stockQuantity} en stock
                    </p>
                );
            }
        },
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('products.edit', row.original)}>
                                <Pen /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('products.destroy', [row.original])} method="delete">
                                <Trash /> Eliminar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];