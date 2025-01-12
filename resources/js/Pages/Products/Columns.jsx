import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        header: "Nombre",
        accessorKey: "product_name",
    },
    {
        header: "price",
        accessorKey: "product_price",
    },
    {
        header: "Estado",
        accessorKey: "status",
        cell: ({ row }) => {
            return (
                <Badge className={` ${row.original.status === 1 ? 'bg-primary' : 'bg-destructive '}`}>
                    {row.original.status === 1 ? 'Activo' : 'Inactivo'}
                </Badge>
            )
        },
    },
];