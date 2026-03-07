import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";

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
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start'} href={route('roles.edit', row.original)}>
                                <Pen className="mr-2 h-4 w-4" /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start text-red-600'} href={route('roles.destroy', [row.original])} method="delete">
                                <Trash className="mr-2 h-4 w-4" /> Eliminar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];
