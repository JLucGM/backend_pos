
export const StoresColumns = [
    {
        header: "#id",
        accessorKey: "id",
        cell: ({ row }) => (
            <div className="flex items-center">
                <p className='me-2'>{row.original.id}</p>  
            </div>
        ),
    },
    {
        header: "Nombre",
        accessorKey: "store_name",
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('setting.edit', row.original)}>
                        Editar
                    </Link>
                    <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('setting.destroy', [row.original])} method="delete">
                        Eliminar
                    </Link>
                </div>
            );
        },
    }
];