import React, { useEffect, useMemo } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import DivSection from '@/Components/ui/div-section';
import { customStyles } from '@/hooks/custom-select';
import Select from 'react-select';
import { Table, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import { Button } from '@/Components/ui/button';
import { AlertTriangle, PlusCircle } from 'lucide-react';
import DataTable from '@/Components/DataTable';
import UserInfo from '@/Components/UserInfo';
import { formatDate } from '@/utils/dateFormatter';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';
import { Input } from '@/Components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from '@/Components/ui/dialog';
import { Checkbox } from '@/Components/ui/checkbox';
import { useDiscounts } from '@/hooks/useDiscounts';
import { useProductOptions } from '@/hooks/useProductOptions';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useOrderItems } from '@/hooks/useOrderItems';
import { useOrderTotals } from '@/hooks/useOrderTotals';
import { Badge } from '@/Components/ui/badge';
import { getBulkProductColumns } from './getBulkProductColumns';
import BulkProductDialog from './BulkProductDialog';

export default function OrdersForm({
    data,
    orders = null,
    products = [],
    users = [],
    paymentMethods = [],
    discounts = [],
    shippingRates = [],
    setData,
    errors,
    isEdit = false,
    isDisabled = false
}) {
    const paymentOptions = useMemo(() => mapToSelectOptions(paymentMethods, 'id', 'payment_method_name'), [paymentMethods]);
    const shippingRatesOptions = useMemo(() => mapToSelectOptions(shippingRates, 'id', shippingRates => `${shippingRates.name} (${shippingRates.price})`, true), [shippingRates]);

    const {
        manualDiscountCode,
        setManualDiscountCode,
        manualDiscountAmount,
        appliedManualDiscount,
        handleManualDiscountApply,
        orderTotalAutomaticDiscount,
        findApplicableDiscount,
    } = useDiscounts(data, discounts, setData, isEdit, products);

    const {
        productOptions, // Aún útil para DataTable en Dialog
        selectedProductsBulk,
        handleAddBulkProducts,
        toggleBulkSelection,
        selectAllBulk,
        clearBulkSelection,
        filterProductOptions, // Si DataTable usa filtrado
    } = useProductOptions(products, data, setData, isEdit, findApplicableDiscount);

    const {
        selectedUser,
        deliveryLocations,
        handleUserChange,
        userOptions, // Ahora del hook (reemplaza el memo local)
    } = useUserManagement(data, users, setData);

    const {
        handleQuantityChange,
        handleRemoveItem,
        orderItemsColumns,
    } = useOrderItems(data, discounts, setData, isEdit, isDisabled, findApplicableDiscount, products);

    useOrderTotals(data, appliedManualDiscount, orderTotalAutomaticDiscount, setData, isEdit);


    const statusOptions = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'processing', label: 'Procesando' },
        { value: 'completed', label: 'Completado' },
        { value: 'cancelled', label: 'Cancelado' },
        { value: 'shipped', label: 'Enviado' },
    ];

    const handlePaymentChange = (selectedOption) => setData('payments_method_id', selectedOption.value);
    const handleStatusChange = (selectedOption) => setData('status', selectedOption.value);

    const bulkProductColumns = useMemo(() =>
        getBulkProductColumns({
            selectedProductsBulk,
            toggleBulkSelection,
            isDisabled,
            isEdit
        }),
        [selectedProductsBulk, toggleBulkSelection, isDisabled, isEdit]
    );

    useEffect(() => {
        if (data.shipping_rate_id && shippingRates) {
            const selectedRate = shippingRates.find(rate => rate.id === data.shipping_rate_id);
            if (selectedRate) {
                setData('totalshipping', selectedRate.price || 0);  // Asume que shippingRates tiene un campo 'price'
            }
        }
    }, [data.shipping_rate_id, shippingRates, setData]);

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-full md:col-span-2">
                    <DivSection>
                        {orders && orders.created_at && (
                            <div>
                                <div className="mb-4">
                                    <p className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        Recibido
                                    </p>
                                    <span className="text-gray-900 dark:text-gray-100">{formatDate(orders.created_at)}</span>
                                </div>
                                <div>
                                    <p className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        Actualizado
                                    </p>
                                    <span className="text-gray-900 dark:text-gray-100">{formatDate(orders.updated_at)}</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <InputLabel htmlFor="status" value="Status" />
                            <Select
                                id="status"
                                name="status"
                                options={statusOptions}
                                value={statusOptions.find(option => option.value === data.status)}
                                onChange={handleStatusChange}
                                styles={customStyles}
                                isDisabled={isDisabled}
                            />
                            <InputError message={errors.status} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="payments_method_id" value="Método de Pago" />
                            <Select
                                id="payments_method_id"
                                name="payments_method_id"
                                options={paymentOptions}
                                value={paymentOptions.find(option => option.value === data.payments_method_id)}
                                onChange={handlePaymentChange}
                                styles={customStyles}
                                isDisabled={isDisabled}
                            />
                            <InputError message={errors.payments_method_id} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="shipping_rate_id" value="Tarifa de envio" />
                            <Select
                                id="shipping_rate_id"
                                name="shipping_rate_id"
                                options={shippingRatesOptions}
                                value={shippingRatesOptions.find(option => option.value === data.shipping_rate_id)}
                                onChange={(selectedOption) => setData('shipping_rate_id', selectedOption ? selectedOption.value : null)}  // Handler corregido
                                styles={customStyles}
                                isDisabled={isDisabled}
                            />
                            <InputError message={errors.shipping_rate_id} className="mt-2" />
                        </div>
                    </DivSection>
                </div>

                <div className="col-span-full md:col-span-1">
                    <DivSection>
                        <UserInfo
                            orders={orders}
                            userOptions={userOptions}
                            selectedUser={selectedUser}
                            handleUserChange={handleUserChange}
                            customStyles={customStyles}
                            deliveryLocations={deliveryLocations}
                            data={data}
                            setData={setData}
                            errors={errors}
                            isDisabled={isDisabled}
                        />
                    </DivSection>
                </div>

                <DivSection className='col-span-full'>
                    <h3 className='font-semibold text-lg mb-4'>Productos del Pedido</h3>

                    <div className="flex items-center gap-2 mb-4">
                        <BulkProductDialog
                            productOptions={productOptions}
                            selectedProductsBulk={selectedProductsBulk}
                            bulkProductColumns={bulkProductColumns}
                            handleAddBulkProducts={handleAddBulkProducts}
                            selectAllBulk={selectAllBulk}
                            clearBulkSelection={clearBulkSelection}
                            isDisabled={isDisabled}
                            isEdit={isEdit}
                        />

                    </div>

                    {/* Input para Código de Descuento Manual (intacto) */}
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <InputLabel value="Código de Descuento (Opcional)" className="mb-2" />
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Ingresa código de cupón"
                                value={manualDiscountCode}
                                onChange={(e) => setManualDiscountCode(e.target.value)}
                                disabled={isDisabled || isEdit}
                            />
                            <Button
                                type="button"
                                onClick={handleManualDiscountApply}
                                disabled={!manualDiscountCode.trim() || isDisabled || isEdit}
                                variant="outline"
                                size="sm"
                            >
                                Aplicar
                            </Button>
                        </div>
                        {/* {appliedManualDiscount && (
                            <p className="mt-1 text-sm text-green-600">
                                Aplicado: {appliedManualDiscount.name} - Ahorro: ${manualDiscountAmount.toFixed(2)}
                                {appliedManualDiscount.applied_to && (
                                    <span className="text-xs"> (aplicado a {appliedManualDiscount.applied_to.length} ítem{appliedManualDiscount.applied_to.length > 1 ? 's' : ''})</span>
                                )}
                            </p>
                        )} */}
                        <InputError message={errors.manual_discount_code} className="mt-2" />
                    </div>

                    {/* DataTable: Muestra order_items con columnas para discounted_price, discount_amount (intacto) */}
                    {data.order_items && data.order_items.length > 0 ? (
                        <DataTable
                            columns={orderItemsColumns}
                            data={data.order_items}
                        />
                    ) : (
                        <p className="text-gray-500 text-center py-8">No hay productos en el pedido. Agrega algunos para continuar.</p>
                    )}

                    {/* Tabla de Totales: Subtotal post-descuentos por ítem, total final (intacto) */}
                    <Table className="mt-6">
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-medium">Subtotal (post-descuentos por ítem)</TableCell>
                                <TableCell className="font-medium">
                                    ${(parseFloat(data.subtotal) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-medium">Total Descuentos</TableCell>
                                <TableCell className="font-medium text-red-600">
                                    -${(parseFloat(data.totaldiscounts) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-medium">Costo de Envío</TableCell>
                                <TableCell className="font-medium">${(parseFloat(data.totalshipping) || 0).toFixed(2)}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-medium">Impuestos</TableCell>
                                <TableCell className="font-medium">
                                    ${(parseFloat(data.tax_amount) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow className="bg-gray-50 dark:bg-gray-800">
                                <TableCell colSpan="3" className="text-right font-bold text-lg">Total Final</TableCell>
                                <TableCell className="font-bold text-lg">
                                    ${(parseFloat(data.total) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DivSection>
            </div>
        </>
    );
}
