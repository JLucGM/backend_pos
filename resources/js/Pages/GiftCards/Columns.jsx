import { Badge } from "@/Components/ui/badge";
import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/utils/dateFormatter";
import { Link } from "@inertiajs/react";
import { Ellipsis, Pen, Trash } from "lucide-react";
import ConfirmDeleteDialog from "@/Components/ConfirmDeleteDialog";

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
                <Badge variant={row.original.is_active === true ? 'success' : 'info'}>
                    {row.original.is_active === true ? 'Publicado' : 'Borrador'}
                </Badge>
            )
        },
    },
    {
        header: "Fecha de Expiración",
        accessorKey: "expiration_date",
        cell: ({ row }) => {
            return (
                <p>{formatDate(row.original.expiration_date)}</p>
            )
        },
    },
    {
        header: "Balances",
        accessorFn: (row) => `${row.current_balance} / ${row.initial_balance}`,
        id: "balances",
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row, table }) => {
            const { isSuperAdmin, permissions = [] } = table.options.meta || {};
            const canEdit = isSuperAdmin || permissions.includes('admin.giftCards.edit');
            const canDelete = isSuperAdmin || permissions.includes('admin.giftCards.delete');

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {canEdit && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('giftCards.edit', row.original)}>
                                    <Pen /> Editar
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDelete && (
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <ConfirmDeleteDialog url={route('giftCards.destroy', row.original)} />
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];
