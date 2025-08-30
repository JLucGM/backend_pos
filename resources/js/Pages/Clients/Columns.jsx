import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
        header: "Estado",
        accessorKey: "status",
        cell: ({ row }) => {
            const isActive = row.original.status === "1"; // Verifica si el estado es "1" (Activo)
            return (
                <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? 'Activo' : 'Inactivo'}
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
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('client.edit', row.original)}>
                                <Pen /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('client.destroy', [row.original])} method="delete">
                                <Trash /> Eliminar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];