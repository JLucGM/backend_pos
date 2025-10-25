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
    // {
    //     header: "Precio",
    //     accessorKey: "product_price",
    //     cell: ({ row }) => {
    //         // Determine if the product has combinations by checking if any stock has a combination_id
    //         const hasCombinations = row.original.stocks.some(stock => stock.combination_id !== null);

    //         if (hasCombinations) {
    //             // If product has combinations, display prices based on combinations
    //             // Note: If 'combinations' relation is not eager loaded, row.original.combinations might be empty
    //             // or undefined. We'll use product_price as a fallback or if combinations array is empty.
    //             if (Array.isArray(row.original.combinations) && row.original.combinations.length > 0) {
    //                 const prices = row.original.combinations.map(combo => parseFloat(combo.combination_price));
    //                 const minPrice = Math.min(...prices);
    //                 const maxPrice = Math.max(...prices);

    //                 if (minPrice === maxPrice) {
    //                     return <p>${minPrice}</p>;
    //                 } else {
    //                     return <p>${minPrice} - ${maxPrice}</p>;
    //                 }
    //             } else {
    //                 // Fallback if combinations array is not loaded, but stocks indicate combinations
    //                 // This might not be ideal as it just shows the main product price.
    //                 // Ideally, the backend should eager load 'combinations' for accurate price range.
    //                 return <p>${row.original.product_price} (Variantes)</p>;
    //             }
    //         } else {
    //             // For simple products, display product_price
    //             return <p>${row.original.product_price}</p>;
    //         }
    //     },
    // },
    {
        header: "Publicado",
        accessorKey: "is_active",
        cell: ({ row }) => {
            const isActive = row.original.is_active === true; // Verifica si el estado es "1" (Activo)
            return (
                // <Badge variant={isActive ? "default" : "secondary"}>
                //     {isActive ? 'Activo' : 'Inactivo'}
                // </Badge>
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
            // Determine if the product has combinations by checking if any stock has a combination_id
            const hasCombinations = stocks.some(stock => stock.combination_id !== null);

            // Log the full row original data to help debug the backend response
            // This will show if `row.original.combinations` is being sent from the backend
            // console.log("Product ID:", row.original.id, "Full Row Data:", row.original);

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
                // <div className="flex space-x-2">
                //     <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('products.edit', row.original)}>
                //         Editar
                //     </Link>
                //     <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('products.destroy', [row.original])} method="delete">
                //         Eliminar
                //     </Link>
                // </div>
            );
        },
    }
];