
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
                <div className="flex space-x-2">
                    <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('taxes.edit', row.original)}>
                        Editar
                    </Link>
                    <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('taxes.destroy', [row.original])} method="delete">
                        Eliminar
                    </Link>
                </div>
            );
        },
    }
];