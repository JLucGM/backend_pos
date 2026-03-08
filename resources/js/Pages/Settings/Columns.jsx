
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
        cell: ({ row, table }) => {
            const { isSuperAdmin, permissions = [] } = table.options.meta || {};
            const canEdit = isSuperAdmin || permissions.includes('admin.stores.edit');
            const canDelete = isSuperAdmin || permissions.includes('admin.stores.delete');

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {canEdit && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('setting.edit', row.original)}>
                                    <Pen /> Editar
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDelete && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('setting.destroy', [row.original])} method="delete">
                                    <Trash /> Eliminar
                                </Link>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];