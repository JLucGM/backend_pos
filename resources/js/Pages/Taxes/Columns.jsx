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
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('tax.edit', row.original)}>
                                <Pen /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('tax.destroy', [row.original])} method="delete">
                                <Trash /> Eliminar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                // <div className="flex space-x-2">
                //     <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('taxes.edit', row.original)}>
                //         Editar
                //     </Link>
                //     <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('taxes.destroy', [row.original])} method="delete">
                //         Eliminar
                //     </Link>
                // </div>
            );
        },
    }
];