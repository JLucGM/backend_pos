import { Badge } from "@/Components/ui/badge";

export const discountColumns = [
    {
        header: "Nombre",
        accessorKey: "name",
    },
    {
            header: "Estado",
            accessorKey: "status",
            cell: ({ row }) => {
                return (
                    <Badge variant={row.original.status === 1 ? 'success' : 'info'}>
                        {row.original.status === 1 ? 'Publicado' : 'Borrador'}
                    </Badge>
                )
            },
        },
];