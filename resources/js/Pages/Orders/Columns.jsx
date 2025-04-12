export const ordersColumns = [
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
        header: "Fecha",
        accessorKey: "created_at",
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            return (
                <p>{formattedDate}</p>
            );
        },
    },
    {
        header: "Cliente",
        accessorKey: "client_id",
        cell: ({ row }) => {
            const clientName = row.original.client?.client_name;
            const userName = row.original.user?.name;
            return (
                <p>{clientName || userName || "N/A"}</p>
            );
        },
    },
    {
        header: "status",
        accessorKey: "status",
    },
    {
        header: "total",
        accessorKey: "total",
        cell: ({ row }) => {
            return (
                <p>${row.original.total}</p>
            )
        },
    },
];