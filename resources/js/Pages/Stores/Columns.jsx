import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";

export const StoresColumns = [
    {
        header: "Nombre",
        accessorKey: "name",
    },
    {
        header: "Dirección",
        accessorKey: "address",
    },
    {
        header: "Tienda en línea",
        accessorKey: "is_ecommerce_active",
        cell: ({ row }) => {
            return row.original.is_ecommerce_active ? "Sí" : "No";
        }
    },
    {
        header: "Tienda en línea",
        accessorKey: "is_ecommerce_active",
        cell: ({ row }) => {
            return (
                <Badge
                    variant={row.original.is_ecommerce_active === true ? 'success' : ''}
                >
                    {row.original.is_ecommerce_active === true ? 'Activa' : 'Inactiva'}
                </Badge>
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
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('stores.edit', row.original)}>
                                <Pen /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('stores.destroy', [row.original])} method="delete">
                                <Trash /> Eliminar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];