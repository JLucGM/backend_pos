import { Badge } from "@/Components/ui/badge";
import { Link } from "@inertiajs/react";


export const StocksColumns = [
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
        accessorKey: "product_id",
        cell: ({ row }) => {
            return (
                <Link 
                href={route('products.edit', row.original.product.slug)}
                buttonVariants={{ variant: 'link' }}
                >
                    {row.original.product.product_name}
                </Link>
            )
        },
    },
    {
        header: "cantidad",
        accessorKey: "quantity",
    },
    {
        header: "Estado",
        accessorKey: "status",
        cell: ({ row }) => {
            return (
                <Badge className={` ${row.original.status === "1" ? 'bg-primary' : 'bg-primary'}`}>
                    {row.original.status === "1" ? 'Saliendo' : 'Entrando'}
                </Badge>
            )
        },
    },
    {
        header: "Tienda",
        accessorKey: "store_id",
        cell: ({ row }) => {
            return (
                <p>{row.original.store.store_name}</p>
            )
        },
    },
];