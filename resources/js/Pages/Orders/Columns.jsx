import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { formatDate } from "@/utils/dateFormatter";
import { Badge } from "@/Components/ui/badge";

export const ordersColumns = [
    {
        header: "",
        accessorKey: "id",
        cell: ({ row }) => {
            return (
                <p>#{row.original.id}</p>
            );
        },
    },
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
        header: "Estado",
        accessorKey: "status",
        cell: ({ row }) => {
            return (
                <Badge>{row.original.status}</Badge>
            );
        },
    },
    // {
    //     header: "Origen",
    //     accessorKey: "order_origin",
    // },
    
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
            const formattedDate = formatDate(date);
            return (
                <p>{formattedDate}</p>
            );
        },
    },
    {
        header: "Total",
        accessorKey: "total",
        cell: ({ row }) => {
            const settings = usePage().props.settings.default_currency;
            return (
                <p>{settings} {row.original.total}</p>
            );
        },
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('orders.edit', row.original)}>
                                <Pen /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('orders.destroy', [row.original])} method="delete">
                                <Trash /> Eliminar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];