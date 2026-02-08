import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";

export const shippingRateColumns = [
    {
        header: "Nombre",
        accessorKey: "name",
    },
    {
        header: "Precio",
        accessorKey: "price",
        cell: ({ row }) => {
            const price = row.original.price;
            return (
                <span className="font-medium">
                    ${parseFloat(price).toFixed(2)}
                </span>
            );
        },
    },
    
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Link className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                href={route('shippingrate.edit', row.original)}
                            >
                                <Pen className="h-4 w-4" /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-red-600 dark:text-red-400"
                                href={route('shippingrate.destroy', [row.original])} 
                                method="delete"
                                as="button"
                                confirm="¿Estás seguro de eliminar esta tarifa de envío?"
                            >
                                <Trash className="h-4 w-4" /> Eliminar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];