import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Eye, Palette, Pen, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";

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
        cell: ({ row }) => {
            const isDeletable = row.original.is_deletable; // Asumiendo que is_default es un booleano
            const isEditable = row.original.is_editable; // Asumiendo que is_editable es un booleano

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {/* <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('pages.show', row.original)}>
                                <Eye /> Ver
                            </Link>
                        </DropdownMenuItem> */}
                        {!isEditable == false && ( // Solo mostrar "Editar" si NO es por defecto}
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('pages.edit', row.original)}>
                                <Pen /> Editar
                            </Link>
                        </DropdownMenuItem>
                            )}
                        {/* <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('pages.builder', row.original)}>
                                <Palette /> Personalizar
                            </Link>
                        </DropdownMenuItem> */}
                        {!isDeletable == false && ( // Solo mostrar "Eliminar" si NO es por defecto
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