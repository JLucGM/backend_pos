
export const countriesColumns = [
    {
        header: "Nombre",
        accessorKey: "country_name",
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('countries.edit', row.original)}>
                        Editar
                    </Link>
                    <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('countries.destroy', [row.original])} method="delete">
                        Eliminar
                    </Link>
                </div>
            );
        },
    }
];