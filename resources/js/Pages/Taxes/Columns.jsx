import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";

export const taxesColumns = [
    {
        header: "Nombre",
        accessorKey: "tax_name",
    },
    {
        header: "Tasa impositiva %",
        accessorKey: "tax_rate",
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row, table }) => {
            const { isSuperAdmin, permissions = [] } = table.options.meta || {};
            const canEdit = isSuperAdmin || permissions.includes('admin.tax.edit');
            const canDelete = isSuperAdmin || permissions.includes('admin.tax.delete');

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {canEdit && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('tax.edit', row.original)}>
                                    <Pen /> Editar
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDelete && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('tax.destroy', [row.original])} method="delete">
                                    <Trash /> Eliminar
                                </Link>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];
