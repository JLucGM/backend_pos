import { Badge } from '@/Components/ui/badge';

export const ProductColumns = [
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
        header: "Producto",
        accessorKey: "product_name",
    },
    {
        header: "Precio",
        accessorKey: "product_price",
        cell: ({ row }) => {
            return (
                <p>
                    ${row.original.product_price }
                </p>
            )
        },
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
        header: "Inventario",
        accessorKey: "stocks",
        cell: ({ row }) => {
            const stock = row.original.stocks[0]; // Accede al primer elemento del array de stocks
            const stockQuantity = stock ? stock.quantity : 0; // Obtiene la cantidad de stock o 0 si no existe
            return (
                <p className={stockQuantity === "0" ? 'text-destructive' : 'text-primary'}>
                    {stockQuantity} en stock
                </p>
            )
        },
    }
];