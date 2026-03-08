import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";

export const CitiesColumns = [
    {
        header: "Nombre",
        accessorKey: "city_name",
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row, table }) => {
            const { isSuperAdmin, permissions } = table.options.meta || {};
            const canEdit = isSuperAdmin || (permissions || []).some(p => p.name === 'admin.cities.edit');
            const canDelete = isSuperAdmin || (permissions || []).some(p => p.name === 'admin.cities.delete');

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {canEdit && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start'} href={route('cities.edit', row.original)}>
                                    <Pen className="mr-2 h-4 w-4" /> Editar
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDelete && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start text-red-600'} href={route('cities.destroy', [row.original])} method="delete">
                                    <Trash className="mr-2 h-4 w-4" /> Eliminar
                                </Link>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];
