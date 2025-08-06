export const ordersColumns = [
    {
        header: "Cliente",
        accessorKey: "user_id",
        cell: ({ row }) => {
            return (
                <p>{row.original.user?.name}</p>
            );
        },
    },
    {
        header: "Status",
        accessorKey: "status",
    },
    {
        header: "Origen",
        accessorKey: "order_origin",
    },
    {
        header: "Total",
        accessorKey: "total",
        cell: ({ row }) => {
            return (
                <p>${row.original.total}</p>
            );
        },
    },
    // {
    //     header: "Tienda",
    //     accessorKey: "stores",
    //     cell: ({ row }) => {
    //         const storeName = row.original.stores.length > 0 ? row.original.stores[0].store_name : "N/A";
    //         return (
    //             <p>{storeName}</p>
    //         );
    //     },
    // },
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
];