
export const categoriesColumns = [
    {
        header: "Nombre",
        accessorKey: "category_name",
    },
    {
            header: "Acciones",
            accessorKey: "actions",
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('categories.edit', row.original.id)}>
                            Editar
                        </Link>
                        <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('categories.delete', row.original.id)} method='delete' as="button">
                            Eliminar
                        </Link>
                    </div>
                );
            },
        }
];