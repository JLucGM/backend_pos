import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";

export const userColumns = [
    {
        header: "",
        accessorKey: "id",
        cell: ({ row }) => (
            <div className="flex items-center">
                {/* <p className='me-2'>{row.original.id}</p> */}
                <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={row.original.avatar_url} alt={row.original.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
            </div>
        ),
    },
    {
        header: "Nombre",
        accessorKey: "name",
    },
    {
        header: "Correo",
        accessorKey: "email",
    },
    {
        header: "Teléfono",
        accessorKey: "phone",
    },
    {
        header: "Publicado",
        accessorKey: "is_active",
        cell: ({ row }) => {
            const isActive = row.original.is_active === true; // Verifica si el estado es "1" (Activo)
            return (
                <Badge variant={isActive === true ? 'success' : 'info'}>
                    {isActive === true ? 'Publicado' : 'Borrador'}
                </Badge>
            );
        },
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row, table }) => {
            const { isSuperAdmin, permissions = [] } = table.options.meta || {};
            const canEdit = isSuperAdmin || permissions.includes('admin.user.edit') || permissions.includes('admin.client.edit');
            const canDelete = isSuperAdmin || permissions.includes('admin.user.delete') || permissions.includes('admin.client.delete');

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {canEdit && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route(row.original.roles?.some(r => r.name === 'client') ? 'client.edit' : 'user.edit', row.original)}>
                                    <Pen /> Editar
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDelete && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route(row.original.roles?.some(r => r.name === 'client') ? 'client.destroy' : 'user.destroy', [row.original])} method="delete">
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
