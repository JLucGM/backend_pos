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
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('discounts.edit', row.original)}>
                        Editar
                    </Link>
                    <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('discounts.destroy', [row.original])} method="delete">
                        Eliminar
                    </Link>
                </div>
            );
        },
    }
];