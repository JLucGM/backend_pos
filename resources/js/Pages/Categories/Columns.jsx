import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";

export const categoriesColumns = [
    {
        header: "Nombre",
        accessorKey: "category_name",
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row, table }) => {
            const { isSuperAdmin, permissions = [] } = table.options.meta || {};
            const canEdit = isSuperAdmin || permissions.includes('admin.category.edit');
            const canDelete = isSuperAdmin || permissions.includes('admin.category.delete');

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {canEdit && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('category.edit', row.original)}>
                                    <Pen /> Editar
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDelete && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('category.destroy', [row.original])} method="delete">
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
