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
        header: "Estado",
        accessorKey: "status",
        cell: ({ row }) => {
            return (
                <Badge variant={row.original.status === 1 ? 'success' : 'info'}>
                    {row.original.status === 1 ? 'Publicado' : 'Borrador'}
                </Badge>
            )
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