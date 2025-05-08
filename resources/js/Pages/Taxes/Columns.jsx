
export const taxesColumns = [
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
        accessorKey: "tax_name",
    },
    {
        header: "Tasa impositiva %",
        accessorKey: "tax_rate",
    },
];