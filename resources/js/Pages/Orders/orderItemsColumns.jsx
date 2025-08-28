import { TrashIcon } from "lucide-react";

export const orderItemsColumns = [
  {
    header: 'Producto',
    accessorKey: 'name_product',
    cell: ({ row }) => (
      <div className="flex flex-col capitalize">
        <p className="font-bold">{row.original.name_product}</p>
        <p className="text-sm text-gray-500">{row.original.product_details || ''}</p>
      </div>
    ),
  },
  {
  header: 'Cantidad',
  accessorKey: 'quantity',
  cell: ({ row }) => {
    const index = row.index; // índice de la fila
    return (
      <input
        type="number"
        min="1"
        value={row.original.quantity}
        onChange={(e) => handleQuantityChange(index, e.target.value)}
        className="w-20"
        // disabled={isDisabled}
      />
    );
  },
},
  {
    header: 'Precio',
    accessorKey: 'product_price',
    cell: ({ row }) => (
      <span>${parseFloat(row.original.product_price || 0).toFixed(2)}</span>
    ),
  },
  {
    header: 'Subtotal',
    accessorKey: 'subtotal',
    cell: ({ row }) => (
      <span>${parseFloat(row.original.subtotal || 0).toFixed(2)}</span>
    ),
  },
  {
    header: 'Acciones',
    accessorKey: 'actions',
    cell: ({ row }) => {
      const index = row.index;
      return (
        <button
          type="button"
          onClick={() => handleRemoveItem(index)}
          className="text-red-600 hover:text-red-800"
          // disabled={isDisabled}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      );
    },
  },
];
