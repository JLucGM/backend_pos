
export const PaymentMethodColumn = [
    {
        header: "Nombre",
        accessorKey: "payment_method_name",
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('paymentmethod.edit', row.original)}>
                        Editar
                    </Link>
                    <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('paymentmethod.destroy', [row.original])} method="delete">
                        Eliminar
                    </Link>
                </div>
            );
        },
    }
];