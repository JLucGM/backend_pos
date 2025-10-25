import { Badge } from "@/Components/ui/badge";
import { buttonVariants } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";

export const discountColumns = [
    {
        header: "Nombre",
        accessorKey: "name",
    },
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
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('discounts.edit', row.original)}>
                                <Pen /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('discounts.destroy', [row.original])} method="delete">
                                <Trash /> Eliminar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];