import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import Select from 'react-select';
import { toast } from 'sonner';
import { TriangleAlert, Store } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RefundForm({ order, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: 0,
        reason: '',
        selectedReason: '',
        refund_money: false,
        restock_items: false,
        items: order.order_items.map(item => ({
            order_item_id: item.id,
            product_name: item.name_product,
            quantity: 0,
            max_quantity: item.quantity,
            restock_action: 'none',
        })),
    });

    const reasonOptions = [
        { value: 'cliente cambio de idea', label: 'Cliente cambió de idea' },
        { value: 'el producto no esta disponible', label: 'El producto no está disponible' },
        { value: 'fraudolenta', label: 'Fraude' },
        { value: 'cliente esta probando la aplicacion', label: 'Cliente está probando la aplicación' },
        { value: 'otro', label: 'Otro motivo' },
    ];

    const getLabel = (value) => {
        switch (value) {
            case 'return_to_stock': return 'Reponer';
            case 'discard': return 'Descartar';
            case 'none': return 'Sin acción';
            default: return '';
        }
    };

    const handleReasonChange = (selected) => {
        setData('selectedReason', selected.value);
        if (selected.value !== 'otro') {
            setData('reason', selected.value);
        } else {
            setData('reason', '');
        }
    };

    const handleRefundMoneyChange = (checked) => {
        setData('refund_money', checked);
        if (!checked) {
            setData('amount', 0);
        } else {
            setData('amount', order.total);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = { ...data };
        if (!data.refund_money) {
            submitData.amount = 0;
        }
        post(route('refunds.store'), {
            data: submitData,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Reembolso registrado correctamente');
                reset();
                onClose();
            },
            onError: () => {
                toast.error('Error al registrar el reembolso');
            },
        });
    };

    // AGREGAR: Mostrar información de la tienda
    const showStoreInfo = order.store_id && data.restock_items;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Alert variant="warning">
                <TriangleAlert />
                <AlertTitle>Ten en cuenta</AlertTitle>
                <AlertDescription>
                    En caso de haber recibido el pago, deberás devolver el dinero desde el medio de pago utilizado.
                </AlertDescription>
            </Alert>

            {/* AGREGAR: Información de la tienda */}
            {showStoreInfo && (
                <Alert variant="info">
                    <Store />
                    <AlertTitle>Tienda de destino</AlertTitle>
                    <AlertDescription>
                        Los productos serán devueltos a la tienda: <strong>{order.store?.store_name || `ID: ${order.store_id}`}</strong>
                        {order.store?.is_ecommerce_active && ' (E-commerce activo)'}
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium">Motivo</label>
                    <Select
                        value={reasonOptions.find(option => option.value === data.selectedReason)}
                        onChange={handleReasonChange}
                        options={reasonOptions}
                        placeholder="Selecciona un motivo"
                    />
                    {data.selectedReason === 'otro' && (
                        <Textarea
                            placeholder="Escribe el motivo personalizado"
                            value={data.reason}
                            onChange={e => setData('reason', e.target.value)}
                            className="mt-2"
                        />
                    )}
                    {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        checked={data.refund_money}
                        onCheckedChange={handleRefundMoneyChange}
                    />
                    <label className="text-sm">¿Desea reembolsar el dinero?</label>
                </div>

                {data.refund_money && (
                    <div>
                        <label className="block text-sm font-medium">Monto a reembolsar</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={data.amount}
                            onChange={e => setData('amount', e.target.value)}
                        />
                        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                    checked={data.restock_items}
                    onCheckedChange={val => setData('restock_items', val)}
                />
                <label className="text-sm">¿Reponer productos al inventario?</label>
            </div>

            {data.restock_items && (
                <div className="mt-4 space-y-4">
                    {/* AGREGAR: Información de la tienda para restock */}
                    {order.store_id && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Tienda de destino:</strong> {order.store?.store_name || `ID: ${order.store_id}`}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Los productos seleccionados para "Reponer" serán devueltos al inventario de esta tienda.
                            </p>
                        </div>
                    )}

                    <h4 className="font-medium">Productos a devolver</h4>
                    {data.items.map((item, index) => (
                        <div key={item.order_item_id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center border p-3 rounded">
                            <div className="col-span-2">
                                <p className="text-sm font-medium">{item.product_name}</p>
                                <p className="text-xs text-gray-500">Máx: {item.max_quantity}</p>
                            </div>
                            <Input
                                type="number"
                                min="0"
                                max={item.max_quantity}
                                value={item.quantity}
                                onChange={e => {
                                    const newItems = [...data.items];
                                    newItems[index].quantity = parseInt(e.target.value || 0);
                                    setData('items', newItems);
                                }}
                            />
                            <Select
                                value={{ value: item.restock_action, label: getLabel(item.restock_action) }}
                                onChange={selected => {
                                    const newItems = [...data.items];
                                    newItems[index].restock_action = selected.value;
                                    setData('items', newItems);
                                }}
                                options={[
                                    { value: 'return_to_stock', label: 'Reponer' },
                                    { value: 'discard', label: 'Descartar' },
                                    { value: 'none', label: 'Sin acción' },
                                ]}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Procesando...' : 'Aceptar'}
                </Button>
            </div>
        </form>
    );
}