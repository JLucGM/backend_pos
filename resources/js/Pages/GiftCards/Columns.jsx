import { Badge } from "@/Components/ui/badge";
import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "@inertiajs/react";
import { Ellipsis, Pen, Trash } from "lucide-react";

export const giftCardsColumns = [
    {
        header: "Código",
        accessorKey: "code",
    },
    {
        header: "Estado",
        accessorKey: "is_active",
        cell: ({ row }) => {
            return (
                <Badge variant={row.original.is_active === 1 ? 'success' : 'info'}>
                    {row.original.is_active === 1 ? 'Publicado' : 'Borrador'}
                </Badge>
            )
        },
    },
    {
        header: "Fecha de Expiración",
        accessorKey: "expiration_date",
    },
    {
        header: "Balances",
        accessorFn: (row) => `${row.current_balance} / ${row.initial_balance}`,
        id: "balances",
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
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('giftCards.edit', row.original)}>
                                <Pen /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('giftCards.destroy', [row.original])} method="delete">
                                <Trash /> Eliminar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                // <div className="flex space-x-2">
                //     <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('giftCards.edit', row.original)}>
                //         Editar
                //     </Link>
                //     <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('giftCards.destroy', [row.original])} method="delete">
                //         Eliminar
                //     </Link>
                // </div>
            );
        },
    }
];
