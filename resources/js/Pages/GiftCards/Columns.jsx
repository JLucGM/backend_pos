import { Badge } from "@/Components/ui/badge";

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
];
