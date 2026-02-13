import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ChevronLeft, Info, Package, Store, Trash2, Plus } from 'lucide-react';
import DivSection from '@/Components/ui/div-section';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { customStyles } from '@/hooks/custom-select';
import Select from 'react-select';
import { useState, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from '@/Components/ui/badge';
import BulkProductDialog from '@/Pages/Orders/BulkProductDialog';
import { Checkbox } from '@/Components/ui/checkbox';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';

export default function Create({ stores, products }) {
    const { settings } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        from_store_id: '',
        to_store_id: '',
        items: [], // { product_id, combination_id, requested_quantity, product_name, attributes_display, stock }
    });

    const [selectedProductsBulk, setSelectedProductsBulk] = useState([]);

    const storeOptions = useMemo(() => stores.map(store => ({
        value: store.id,
        label: store.name
    })), [stores]);

    // Opciones de productos para el BulkProductDialog, filtradas por la tienda de origen
    const productOptions = useMemo(() => {
        if (!data.from_store_id) return [];

        const options = [];
        products.forEach(product => {
            if (!product.combinations || product.combinations.length === 0) {
                const stock = product.stocks?.find(s => s.store_id === data.from_store_id)?.quantity || 0;
                console.log(stock)
                options.push({
                    value: `simple_${product.id}`,
                    product_id: product.id,
                    combination_id: null,
                    product_name: product.product_name,
                    original_price: product.product_price,
                    effective_price: product.product_price,
                    stock: stock,
                    attributes_display: null,
                    is_combination: false,
                });
            } else {
                product.combinations.forEach(combination => {
                    const stock = combination.stocks?.find(s => s.store_id === data.from_store_id)?.quantity || 0;
                    const attributesDisplay = combination.combination_attribute_value
                        ?.map(cav => cav.attribute_value?.attribute_value_name)
                        .join(', ');

                    options.push({
                        value: `comb_${combination.id}`,
                        product_id: product.id,
                        combination_id: combination.id,
                        product_name: product.product_name,
                        original_price: combination.combination_price,
                        effective_price: combination.combination_price,
                        stock: stock,
                        attributes_display: attributesDisplay,
                        attributes: combination.combination_attribute_value?.map(cav => ({
                            attribute_name: cav.attribute_value?.attribute?.attribute_name,
                            attribute_value_name: cav.attribute_value?.attribute_value_name
                        })),
                        is_combination: true,
                    });
                });
            }
        });
        return options;
    }, [products, data.from_store_id]);
    console.log(productOptions)
    const toggleBulkSelection = useCallback((option) => {
        setSelectedProductsBulk(prev => {
            const isSelected = prev.some(opt => opt.value === option.value);
            if (isSelected) {
                return prev.filter(opt => opt.value !== option.value);
            }
            return [...prev, option];
        });
    }, []);

    const selectAllBulk = () => setSelectedProductsBulk(productOptions);
    const clearBulkSelection = () => setSelectedProductsBulk([]);

    const handleAddBulkProducts = () => {
        const newItems = selectedProductsBulk.map(opt => ({
            product_id: opt.product_id,
            combination_id: opt.combination_id,
            product_name: opt.product_name,
            attributes_display: opt.attributes_display,
            stock: opt.stock,
            requested_quantity: 1,
            value: opt.value
        }));

        // Combinar con los existentes evitando duplicados
        const updatedItems = [...data.items];
        newItems.forEach(newItem => {
            const exists = updatedItems.find(item => item.value === newItem.value);
            if (!exists) {
                updatedItems.push(newItem);
            }
        });

        setData('items', updatedItems);
        setSelectedProductsBulk([]);
    };

    const removeItem = (value) => {
        setData('items', data.items.filter(item => item.value !== value));
    };

    const updateItemQuantity = (value, quantity) => {
        setData('items', data.items.map(item =>
            item.value === value ? { ...item, requested_quantity: parseInt(quantity) || 0 } : item
        ));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('inventory-transfers.store'));
    };

    const bulkProductColumns = [
        {
            id: 'select',
            header: 'Seleccionar',
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedProductsBulk.some(opt => opt.value === row.original.value)}
                    onCheckedChange={() => toggleBulkSelection(row.original)}
                />
            ),
        },
        {
            header: 'Producto',
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.product_name}</p>
                    {row.original.attributes_display && (
                        <Badge variant="outline" className="text-[10px]">{row.original.attributes_display}</Badge>
                    )}
                </div>
            )
        },
        {
            header: 'Stock',
            accessorKey: 'stock',
            cell: ({ row }) => (
                <span className={`font-bold ${row.original.stock > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {row.original.stock}
                </span>
            )
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center gap-4'>
                    <Link href={route('inventory-transfers.index')} className="text-gray-500 hover:text-gray-700">
                        <ChevronLeft className="size-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Nueva Transferencia de Inventario
                    </h2>
                </div>
            }
        >
            <Head title="Crear Transferencia" />

            <div className="">
                <form onSubmit={submit} className="space-y-6">
                    <DivSection title="Ruta de Transferencia">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                            <div className="space-y-2">
                                <Label htmlFor="from_store_id">Tienda de Origen</Label>
                                <Select
                                    id="from_store_id"
                                    options={storeOptions}
                                    value={storeOptions.find(opt => opt.value === data.from_store_id)}
                                    onChange={(opt) => {
                                        setData(prev => ({
                                            ...prev,
                                            from_store_id: opt.value,
                                            items: [] // Limpiar items si cambia la tienda de origen para recalcular stock
                                        }));
                                    }}
                                    styles={customStyles}
                                    placeholder="Selecciona origen"
                                />
                                {errors.from_store_id && <p className="text-red-500 text-xs">{errors.from_store_id}</p>}
                                <p className="text-[10px] text-gray-500 italic">Los productos se descontarán de esta tienda.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="to_store_id">Tienda de Destino</Label>
                                <Select
                                    id="to_store_id"
                                    options={storeOptions.filter(opt => opt.value !== data.from_store_id)}
                                    value={storeOptions.find(opt => opt.value === data.to_store_id)}
                                    onChange={(opt) => setData('to_store_id', opt.value)}
                                    styles={customStyles}
                                    placeholder="Selecciona destino"
                                />
                                {errors.to_store_id && <p className="text-red-500 text-xs">{errors.to_store_id}</p>}
                                <p className="text-[10px] text-gray-500 italic">Los productos se cargarán a esta tienda.</p>
                            </div>
                        </div>
                    </DivSection>

                    <DivSection>
                        <BulkProductDialog
                            productOptions={productOptions}
                            selectedProductsBulk={selectedProductsBulk}
                            bulkProductColumns={bulkProductColumns}
                            handleAddBulkProducts={handleAddBulkProducts}
                            selectAllBulk={selectAllBulk}
                            clearBulkSelection={clearBulkSelection}
                            isDisabled={!data.from_store_id}
                        />
                        <div className="p-4">
                            {!data.from_store_id ? (
                                <div className="p-8 text-center border-2 border-dashed rounded-lg bg-gray-50">
                                    <Store className="size-8 mx-auto text-gray-300 mb-2" />
                                    <p className="text-sm text-gray-500">Primero selecciona una tienda de origen para ver productos disponibles.</p>
                                </div>
                            ) : data.items.length === 0 ? (
                                <div className="p-8 text-center border-2 border-dashed rounded-lg bg-gray-50">
                                    <Package className="size-8 mx-auto text-gray-300 mb-2" />
                                    <p className="text-sm text-gray-500">No hay productos seleccionados. Usa el botón "Agregar Productos".</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Producto</TableHead>
                                            <TableHead className="text-center w-24">Stock</TableHead>
                                            <TableHead className="text-center w-32">Cantidad</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.items.map((item) => (
                                            <TableRow key={item.value}>
                                                <TableCell>
                                                    <p className="font-medium">{item.product_name}</p>
                                                    {item.attributes_display && (
                                                        <Badge variant="outline" className="text-[10px]">{item.attributes_display}</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`text-sm font-bold ${item.stock > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                                        {item.stock}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max={item.stock}
                                                        value={item.requested_quantity}
                                                        onChange={(e) => updateItemQuantity(item.value, e.target.value)}
                                                        className="h-8 text-center"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeItem(item.value)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            {errors.items && <p className="text-red-500 text-xs mt-2">{errors.items}</p>}
                        </div>
                    </DivSection>

                    <div className="flex justify-end gap-4">
                        <Link href={route('inventory-transfers.index')}>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={processing || data.items.length === 0}>
                            Crear Transferencia ({data.items.length})
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
