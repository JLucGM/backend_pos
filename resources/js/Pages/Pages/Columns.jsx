import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Eye, Palette, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";

export const pagesColumns = [
    {
        header: "Nombre",
        accessorKey: "title",
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row }) => {
            const isDefault = row.original.is_default; // Asumiendo que is_default es un booleano

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('pages.show', row.original)}>
                                <Eye /> Ver
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('pages.edit', row.original)}>
                                <Pen /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('pages.builder', row.original)}> {/* Nueva ruta para el builder */}
                                <Palette /> Personalizar
                            </Link>
                        </DropdownMenuItem>
                        {!isDefault && ( // Solo mostrar "Eliminar" si NO es por defecto
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('pages.destroy', [row.original])} method="delete">
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