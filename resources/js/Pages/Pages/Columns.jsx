import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Eye, Palette, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";
import ConfirmDeleteDialog from "@/Components/ConfirmDeleteDialog";

export const pagesColumns = [
    // {
    //     header: "id",
    //     accessorKey: "id",
    // },
    {
        header: "Nombre",
        accessorKey: "title",
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row, table }) => {
            const { isSuperAdmin, permissions = [] } = table.options.meta || {};
            const canEdit = isSuperAdmin || permissions.includes('admin.pages.edit');
            const canDelete = isSuperAdmin || permissions.includes('admin.pages.delete');

            const isDeletable = row.original.is_deletable; 
            const isEditable = row.original.is_editable; 

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {canEdit && isEditable && ( 
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('pages.edit', row.original)}>
                                <Pen /> Editar
                            </Link>
                        </DropdownMenuItem>
                            )}
                        {canDelete && isDeletable && ( 
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <ConfirmDeleteDialog url={route('pages.destroy', row.original)} />
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];