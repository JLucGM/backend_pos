
export const clientColumns = [
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
        accessorKey: "client_name",
    },
    {
        header: "cedula",
        accessorKey: "client_identification",
    },
    {
        header: "Telefono",
        accessorKey: "client_phone",
    },
    
];