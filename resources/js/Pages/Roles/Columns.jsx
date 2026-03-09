import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import ConfirmDeleteDialog from "@/Components/ConfirmDeleteDialog";

export const RolesColumns = [
    {
        header: "Nombre",
        accessorKey: "name",
    },
    {
        header: "Permisos",
        accessorKey: "permissions",
        cell: ({ row }) => {
            const permissions = row.original.permissions || [];
            return (
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {permissions.slice(0, 5).map(permission => (
                        <Badge key={permission.id} variant="secondary" className="text-[10px]">
                            {permission.name}
                        </Badge>
                    ))}
                    {permissions.length > 5 && (
                        <Badge variant="outline" className="text-[10px]">
                            +{permissions.length - 5} más
                        </Badge>
                    )}
                </div>
            );
        }
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row, table }) => {
            const meta = table.options.meta || {};
            const isSuperAdmin = meta.isSuperAdmin;
            const permissions = meta.permissions || [];

            const canEdit = isSuperAdmin || permissions.some(p => p.name === 'admin.roles.edit');
            const canDelete = isSuperAdmin || permissions.some(p => p.name === 'admin.roles.delete');

            // Usamos el slug para rutas amigables (Laravel Sluggable)
            // Si el slug no existe por alguna razón, usamos el ID como fallback
            const roleIdentifier = row.original.slug || row.original.id;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {canEdit && (
                            <DropdownMenuItem>
                                <Link
                                    className={buttonVariants({ variant: 'ghost' }) + ' w-full'}
                                    href={route('roles.edit', { role: roleIdentifier })}
                                >
                                    <Pen />
                                    <span>Editar</span>
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDelete && (
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <ConfirmDeleteDialog
                                    url={route('roles.destroy', { role: roleIdentifier })}
                                />
                            </DropdownMenuItem>
                        )}
                        {!canEdit && !canDelete && (
                            <div className="px-2 py-1.5 text-xs text-gray-500 italic">
                                Sin acciones
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];
