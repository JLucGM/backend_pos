import { Badge } from "@/Components/ui/badge";
import { Link } from "@inertiajs/react";

export const StocksColumns = [
    {
        header: "Producto",
        accessorKey: "product_id",
        cell: ({ row }) => {
            const product = row.original.product;
            const combination = row.original.combination;
            let combinationText = "Producto sencillo";

            if (combination && combination.combination_attribute_value) {
                const attributeValues = combination.combination_attribute_value.map(cav => cav.attribute_value.attribute_value_name).join(', ');
                combinationText = attributeValues;
            }

            return (
                <div className="">
                    <Link
                        href={route('products.edit', product.slug)}
                        // buttonVariants={{ variant: 'link' }}
                    >
                        {product.product_name}
                    </Link>
                    <div className="">
                        <Badge className={'bg-gray-300 text-black'}>{combinationText}</Badge>
                    </div>
                </div>
            )
        },
    },
    {
        header: "Inventario",
        accessorKey: "quantity",
        cell: ({ row }) => {
            const stockQuantity = row.original.quantity;
            return (
                <p
                    className={stockQuantity === "0" ? 'text-destructive' : 'text-primary'}
                >
                    {stockQuantity} en stock
                </p>
            )
        },
    },
    // {
    //     header: "Tienda",
    //     accessorKey: "store_id",
    //     cell: ({ row }) => {
    //         return (
    //             <p>{row.original.store.store_name} </p>
    //         )
    //     },
    // },
];