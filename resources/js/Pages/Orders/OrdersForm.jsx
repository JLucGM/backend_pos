// En OrdersForm.jsx
import React, { useEffect, useMemo, useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import DivSection from '@/Components/ui/div-section';
import { customStyles } from '@/hooks/custom-select';
import Select from 'react-select';
import { Table, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import { Button } from '@/Components/ui/button';
import DataTable from '@/Components/DataTable';
import UserInfo from '@/Components/UserInfo';
import { formatDate } from '@/utils/dateFormatter';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';
import { Input } from '@/Components/ui/input';
import { useDiscountsAndGiftCards } from '@/hooks/useDiscountsAndGiftCards';
import { useProductOptions } from '@/hooks/useProductOptions';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useOrderItems } from '@/hooks/useOrderItems';
import { useOrderTotals } from '@/hooks/useOrderTotals';
import { getBulkProductColumns } from './getBulkProductColumns';
import BulkProductDialog from './BulkProductDialog';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import InputData from '@/Components/InputData';
import { useSelectOptions } from '@/hooks/useSelectOptions';

export default function OrdersForm({
    data,
    orders = null,
    appliedGiftCard = null,
    products = [],
    users = [],
    paymentMethods = [],
    discounts = [],
    shippingRates = [],
    stores = [],
    setData,
    errors,
    isDisabled = false,
    isEdit = false // AGREGAR: Nueva prop para modo edición
}) {
    const settings = usePage().props.settings;

    const paymentOptions = useMemo(() => mapToSelectOptions(paymentMethods, 'id', 'payment_method_name', true), [paymentMethods]);
    const shippingRatesOptions = useMemo(() => {
        // Filtrar tarifas de envío por la tienda seleccionada
        const filteredRates = data.store_id
            ? shippingRates.filter(rate => rate.store_id === data.store_id)
            : shippingRates;

        return mapToSelectOptions(
            filteredRates,
            'id',
            rate => `${rate.name} (${rate.price})`,
            true
        );
    }, [shippingRates, data.store_id]);

    const { storeOptions } = useSelectOptions([], [], [], [], [], [], stores);

    const handleDeliveryTypeChange = (selectedOption) => {
        const newDeliveryType = selectedOption.value;
        setData('delivery_type', newDeliveryType);

        if (newDeliveryType === 'pickup') {
            setData('shipping_rate_id', null);
            setData('totalshipping', 0);
            setData('delivery_location_id', null);
        }
    };

    // MODIFICADO: Manejar cambio de tienda solo en modo creación
    const handleStoreChange = (selectedOption) => {
        if (isEdit) {
            return;
        }

        const newStoreId = selectedOption ? selectedOption.value : null;

        // Limpiar tarifa de envío cuando cambia la tienda
        if (data.shipping_rate_id) {
            setData('shipping_rate_id', null);
            setData('totalshipping', 0);

            import('sonner').then(({ toast }) => {
                toast.info('Tarifa de envío reiniciada. Por favor, selecciona una nueva tarifa para la tienda seleccionada.');
            });
        }

        if (data.order_items.length > 0) {
            import('sonner').then(({ toast }) => {
                toast.warning('Al cambiar de tienda, verifica que los productos tengan stock disponible en la nueva tienda.');
            });
        }

        setData('store_id', newStoreId);
    };

    // Modificar el useEffect que selecciona tienda automáticamente
useEffect(() => {
    if (!isEdit && !data.store_id && stores.length > 0) {
        const ecommerceStore = stores.find(store => store.is_ecommerce_active === true);
        const defaultStore = ecommerceStore || stores[0];

        if (defaultStore) {
            setData('store_id', defaultStore.id);
            
            // Verificar si la tienda por defecto tiene tarifas de envío
            const storeShippingRates = shippingRates.filter(rate => rate.store_id === defaultStore.id);
            // if (storeShippingRates.length > 0 && data.delivery_type === 'delivery') {
            //     // Podrías seleccionar automáticamente la primera tarifa
            //     // o dejarlo para que el usuario seleccione
            //     import('sonner').then(({ toast }) => {
            //         toast.info(`Tienda "${defaultStore.name}" seleccionada. Tiene ${storeShippingRates.length} tarifa(s) de envío disponible(s).`);
            //     });
            // }
        }
    }
}, [stores, data.store_id, setData, isEdit, shippingRates, data.delivery_type]);

    // Primero: Hook para gestión de usuarios
    const {
        selectedUser,
        deliveryLocations,
        handleUserChange,
        userOptions,
    } = useUserManagement(data, users, setData);

    // En edición, preselecciona el usuario si orders.user_id existe
    useEffect(() => {
        if (orders && orders.user_id && !selectedUser) {
            const userOption = userOptions.find(option => option.value === orders.user_id);
            if (userOption) {
                handleUserChange(userOption);
            }
        }
    }, [orders, userOptions, selectedUser, handleUserChange]);

    // Segundo: Hook unificado para descuentos y gift cards
    const {
        code,
        setCode,
        appliedDiscount,
        appliedGiftCard: appliedGiftCardHook,
        handleApply,
        orderTotalAutomaticDiscount,
        findApplicableDiscount,
        error,
    } = useDiscountsAndGiftCards(data, discounts, users, selectedUser, products, setData, appliedGiftCard);

    const {
        productOptions,
        selectedProductsBulk,
        setSelectedProductsBulk,
        selectedProductToAdd,
        setSelectedProductToAdd,
        handleAddBulkProducts,
        toggleBulkSelection,
        selectAllBulk,
        clearBulkSelection,
    } = useProductOptions(products, data, setData, findApplicableDiscount);

    const {
        orderItemsColumns,
    } = useOrderItems(data, discounts, setData, isDisabled, findApplicableDiscount, products);

    useOrderTotals(data, appliedDiscount, orderTotalAutomaticDiscount, data.gift_card_amount || 0, setData);

    const handlePaymentChange = (selectedOption) => setData('payments_method_id', selectedOption.value);

    const bulkProductColumns = useMemo(() =>
        getBulkProductColumns({
            selectedProductsBulk,
            toggleBulkSelection,
            isDisabled,
            settings
        }),
        [selectedProductsBulk, toggleBulkSelection, isDisabled, settings]
    );

    useEffect(() => {
        if (data.shipping_rate_id && shippingRates) {
            const selectedRate = shippingRates.find(rate => rate.id === data.shipping_rate_id);
            if (selectedRate) {
                setData('totalshipping', selectedRate.price || 0);
            }
        }
    }, [data.shipping_rate_id, shippingRates, setData]);

    // MODIFICADO: Solo limpiar productos seleccionados en modo creación
    const prevStoreIdRef = useRef(data.store_id);

    useEffect(() => {
        if (!isEdit) {
            // Solo ejecutar si el store_id realmente cambió (no es la primera vez)
            if (prevStoreIdRef.current !== data.store_id && prevStoreIdRef.current !== undefined) {
                // Limpiar productos seleccionados en bulk
                if (selectedProductsBulk && selectedProductsBulk.length > 0) {
                    setSelectedProductsBulk([]);
                    import('sonner').then(({ toast }) => {
                        toast.info('Tienda cambiada. Los productos seleccionados han sido limpiados.');
                    });
                }

                // También limpiar el producto individual seleccionado
                if (selectedProductToAdd) {
                    setSelectedProductToAdd(null);
                }
            }
            // Actualizar la referencia
            prevStoreIdRef.current = data.store_id;
        }
    }, [data.store_id, isEdit, selectedProductsBulk, selectedProductToAdd, setSelectedProductsBulk, setSelectedProductToAdd]);

    // Función para obtener información de la tienda
    const getStoreInfo = () => {
        if (!data.store_id) return null;
        const store = stores.find(s => s.id === data.store_id);
        return store;
    };

    const storeInfo = getStoreInfo();

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
                            {!isEdit ? (

                                <div>
                                    <InputLabel htmlFor="store_id" value="Tienda (Inventario)" />
                                    <Select
                                        id="store_id"
                                        name="store_id"
                                        options={storeOptions}
                                        value={storeOptions.find(option => option.value === data.store_id)}
                                        onChange={handleStoreChange}
                                        styles={customStyles}
                                        isDisabled={isDisabled}
                                        placeholder="Selecciona la tienda para el inventario"
                                        isClearable={true}
                                    />
                                    <InputData htmlFor="store_id" value="Se mostraran los productos de la tienda seleccionada" />
                                    <InputError message={errors.store_id} className="mt-2" />
                                </div>
                            ) : (null)}
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
                            <InputData htmlFor="payments_method_id" value="Método de Pago" />
                            <InputError message={errors.payments_method_id} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="delivery_type" value="Tipo de Entrega" />
                            <Select
                                id="delivery_type"
                                name="delivery_type"
                                options={[
                                    { value: 'pickup', label: 'Pickup' },
                                    { value: 'delivery', label: 'Delivery' },
                                ]}
                                value={{
                                    value: data.delivery_type,
                                    label: data.delivery_type === 'pickup' ? 'Pickup' : 'Delivery'
                                }}
                                onChange={handleDeliveryTypeChange}
                                styles={customStyles}
                                isDisabled={isDisabled}
                            />
                            <InputError message={errors.delivery_type} className="mt-2" />
                        </div>

                        {data.delivery_type === 'delivery' && (
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-1">
                                    <InputLabel htmlFor="shipping_rate_id" value="Tarifa de envío" />
                                    {data.store_id && storeInfo && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Tarifas para: {storeInfo.name}
                                        </span>
                                    )}
                                </div>
                                <Select
                                    id="shipping_rate_id"
                                    name="shipping_rate_id"
                                    options={shippingRatesOptions}
                                    value={shippingRatesOptions.find(option => option.value === data.shipping_rate_id)}
                                    onChange={(selectedOption) => setData('shipping_rate_id', selectedOption ? selectedOption.value : null)}
                                    styles={customStyles}
                                    isDisabled={isDisabled || !data.store_id}
                                    placeholder={data.store_id ? "Selecciona una tarifa" : "Primero selecciona una tienda"}
                                />
                                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {shippingRatesOptions.length === 0 && data.store_id && (
                                        <span>No hay tarifas de envío configuradas para esta tienda</span>
                                    )}
                                    {!data.store_id && (
                                        <span>Selecciona una tienda para ver sus tarifas de envío disponibles</span>
                                    )}
                                </div>
                                <InputError message={errors.shipping_rate_id} className="mt-2" />
                            </div>
                        )}
                    </DivSection>

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
                                isEdit={isEdit} // Pasar prop isEdit al diálogo
                            />
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <InputLabel value="Código de Descuento o Gift Card (Opcional)" className="mb-2" />
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Ingresa código de cupón o gift card"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    disabled={isDisabled}
                                />
                                <Button
                                    type="button"
                                    onClick={handleApply}
                                    disabled={!code.trim() || isDisabled}
                                    variant="outline"
                                    size="sm"
                                >
                                    Aplicar
                                </Button>
                            </div>
                            <InputError message={errors.manual_discount_code || errors.gift_card_id || error} className="mt-2" />
                            {appliedDiscount && (
                                <p className="text-sm text-green-600 mt-1">
                                    Descuento aplicado: {appliedDiscount.name} - Tipo: {appliedDiscount.applies_to}
                                </p>
                            )}
                            {appliedGiftCardHook && (
                                <p className="text-sm text-green-600 mt-1">
                                    Gift Card aplicada: {appliedGiftCardHook.code} - Monto usado: <CurrencyDisplay currency={settings.currency} amount={appliedGiftCardHook.amount_used} />
                                </p>
                            )}
                            {appliedGiftCard && !appliedGiftCardHook && (
                                <p className="text-sm text-blue-600 mt-1">
                                    Gift Card aplicada previamente: Código {appliedGiftCard.code} - Monto usado: <CurrencyDisplay currency={settings.currency} amount={appliedGiftCard.amount_used} />
                                </p>
                            )}
                        </div>

                        {data.order_items && data.order_items.length > 0 ? (
                            <DataTable
                                columns={orderItemsColumns}
                                data={data.order_items}
                            />
                        ) : (
                            <p className="text-gray-500 text-center py-8">No hay productos en el pedido. Agrega algunos para continuar.</p>
                        )}

                        <Table className="mt-6">
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan="3" className="text-right font-medium">Subtotal (post-descuentos por ítem)</TableCell>
                                    <TableCell className="font-medium">
                                        <CurrencyDisplay currency={settings.currency} amount={parseFloat(data.subtotal) || 0} />
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan="3" className="text-right font-medium">Total Descuentos</TableCell>
                                    <TableCell className="font-medium text-red-600">
                                        -<CurrencyDisplay currency={settings.currency} amount={parseFloat(data.totaldiscounts) || 0} />
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan="3" className="text-right font-medium">Costo de Envío</TableCell>
                                    <TableCell className="font-medium"><CurrencyDisplay currency={settings.currency} amount={parseFloat(data.totalshipping) || 0} /></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan="3" className="text-right font-medium">Impuestos</TableCell>
                                    <TableCell className="font-medium">
                                        <CurrencyDisplay currency={settings.currency} amount={parseFloat(data.tax_amount) || 0} />
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                <TableRow className="bg-gray-50 dark:bg-gray-800">
                                    <TableCell colSpan="3" className="text-right font-bold text-lg">Total Final</TableCell>
                                    <TableCell className="font-bold text-lg">
                                        <CurrencyDisplay currency={settings.currency} amount={parseFloat(data.total) || 0} />
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
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
            </div>
        </>
    );
}