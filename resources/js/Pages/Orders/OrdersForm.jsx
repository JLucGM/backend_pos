import React, { useState, useEffect, useMemo } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import DivSection from '@/Components/ui/div-section';
import { customStyles } from '@/hooks/custom-select';
import Select from 'react-select';
import { Table, TableBody, TableCell, TableRow, } from "@/Components/ui/table";
import { Button } from '@/Components/ui/button';
import { PlusCircle } from 'lucide-react';
import DataTable from '@/Components/DataTable';
import { getOrderItemsColumns } from './orderItemsColumns';
import UserInfo from '@/Components/UserInfo';
import { formatDate } from '@/utils/dateFormatter';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';

export default function OrdersForm({ data, orders = null, products = [], users = [], paymentMethods = [], setData, errors, isDisabled = false }) {

    const [selectedProductToAdd, setSelectedProductToAdd] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deliveryLocations, setDeliveryLocations] = useState([]);

    const paymentOptions = useMemo(() => mapToSelectOptions(paymentMethods, 'id', 'payment_method_name'), [paymentMethods]);
    const userOptions = useMemo(() => mapToSelectOptions(users, 'id', 'name'), [users]);

    // Helper para calcular el stock de un producto o combinación
    const calculateStock = (product, combinationId = null) => {
        if (!product.stocks || product.stocks.length === 0) {
            return 0;
        }

        if (combinationId !== null) {
            // Para una combinación específica, busca el stock por combination_id
            const stockEntry = product.stocks.find(s => s.combination_id === combinationId);
            return stockEntry ? parseInt(stockEntry.quantity) : 0;
        } else {
            // Para un producto sin combinaciones, busca el stock con combination_id null
            const stockEntry = product.stocks.find(s => s.combination_id === null);
            return stockEntry ? parseInt(stockEntry.quantity) : 0;
        }
    };

    // Opciones para el select de productos, incluyendo precio y combinaciones - ¡MEMOIZADAS!
    const productOptions = useMemo(() => {
        const options = [];
        products.forEach(product => {
            const originalProductPrice = parseFloat(product.product_price);

            if (product.combinations && product.combinations.length > 0) {
                product.combinations.forEach(combination => {
                    const effectivePrice = parseFloat(combination.combination_price);
                    const combinationStock = calculateStock(product, combination.id); // Stock de la combinación

                    // Cambia la condición para incluir productos sin stock
                    if (combinationStock >= 0) { // Cambiado de > 0 a >= 0
                        let combinationAttributesDisplay = '';
                        if (combination.combination_attribute_value && Array.isArray(combination.combination_attribute_value)) {
                            const attributeNames = combination.combination_attribute_value.map(
                                cav => cav.attribute_value.attribute_value_name
                            );
                            if (attributeNames.length > 0) {
                                combinationAttributesDisplay = attributeNames.join(', ');
                            }
                        }
                        const barcode = product.stocks.find(s => s.combination_id === combination.id)?.product_barcode || null;

                        options.push({
                            value: product.id,
                            original_product_name: product.product_name,
                            combination_attributes_display: combinationAttributesDisplay,
                            barcode: barcode,
                            effective_price: effectivePrice,
                            original_display_price: originalProductPrice,
                            combination_id: combination.id,
                            combination_details: combination,
                            is_combination: true,
                            stock: combinationStock,
                            tax_rate: product.taxes ? parseFloat(product.taxes.tax_rate) : 0, // AÑADIDO: Tasa de impuesto del producto
                            label: `${product.product_name} ${combinationAttributesDisplay} ${barcode || ''} ${effectivePrice.toFixed(2)}`.toLowerCase()
                        });
                    }
                });
            } else {
                const effectivePrice = (product.product_price_discount !== null && product.product_price_discount !== undefined)
                    ? parseFloat(product.product_price_discount)
                    : originalProductPrice;

                const productStock = calculateStock(product); // Stock del producto base

                // Cambia la condición para incluir productos sin stock
                if (productStock >= 0) { // Cambiado de > 0 a >= 0
                    const barcode = product.stocks.find(s => s.combination_id === null)?.product_barcode || null;
                    options.push({
                        value: product.id,
                        original_product_name: product.product_name,
                        combination_attributes_display: null,
                        barcode: barcode,
                        effective_price: effectivePrice,
                        original_display_price: (effectivePrice !== originalProductPrice) ? originalProductPrice : null,
                        is_combination: false,
                        stock: productStock,
                        tax_rate: product.taxes ? parseFloat(product.taxes.tax_rate) : 0, // AÑADIDO: Tasa de impuesto del producto
                        label: `${product.product_name} ${barcode || ''} ${effectivePrice.toFixed(2)}`.toLowerCase()
                    });
                }
            }
        });
        return options;
    }, [products]);

    // Función para formatear la etiqueta de la opción en el Select
    const formatProductOptionLabel = ({ original_product_name, combination_attributes_display, barcode, effective_price, original_display_price }) => (
        <div className="flex flex-col">
            <span className="">{original_product_name}
                {combination_attributes_display && (
                    <span className="text-sm mx-1">- {combination_attributes_display}</span>
                )}
                {barcode && `(${barcode}) `}
            </span>

            <span className="text-xs text-gray-500">

                {original_display_price && original_display_price !== effective_price ? (
                    <span className="line-through mr-1">${(parseFloat(original_display_price) || 0).toFixed(2)}</span>
                ) : null}
                ${(parseFloat(effective_price) || 0).toFixed(2)}
            </span>
        </div>
    );

    // Función para filtrar las opciones del Select por nombre o código de barras
    const filterProductOptions = (option, inputValue) => {
        // La propiedad 'label' de la opción ahora está pre-formateada en minúsculas para la búsqueda
        const optionLabelForSearch = option.data.label;
        const searchInput = inputValue.toLowerCase();

        return optionLabelForSearch.includes(searchInput);
    };

    // Opciones para el select de estado de la orden
    const statusOptions = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'processing', label: 'Procesando' },
        { value: 'completed', label: 'Completado' },
        { value: 'cancelled', label: 'Cancelado' },
        { value: 'shipped', label: 'Enviado' },
    ];

    // Maneja el cambio en el select de método de pago
    const handlePaymentChange = (selectedOption) => {
        setData('payments_method_id', selectedOption.value);
    };

    // Maneja el cambio en el select de estado
    const handleStatusChange = (selectedOption) => {
        setData('status', selectedOption.value);
    };

    const handleUserChange = (selectedOption) => {
        setSelectedUser(selectedOption);
        setData('user_id', selectedOption ? selectedOption.value : null);

        // Actualiza las direcciones de entrega del usuario seleccionado
        const selectedUserData = users.find(user => user.id === selectedOption.value);
        setDeliveryLocations(selectedUserData ? selectedUserData.delivery_locations : []);

        // Asegúrate de que delivery_location_id se restablezca al cambiar de usuario
        setData('delivery_location_id', null);
    };

    useEffect(() => {
        if (data.user_id && users.length > 0) {
            const selectedUserData = users.find(user => user.id === data.user_id);
            if (selectedUserData) {
                const userLocations = selectedUserData.delivery_locations || [];
                setDeliveryLocations(userLocations);

                // Encuentra y selecciona automáticamente la dirección predeterminada
                const defaultLocation = userLocations.find(loc => loc.is_default);
                if (defaultLocation) {
                    setData('delivery_location_id', defaultLocation.id);
                } else if (userLocations.length > 0) {
                    // Si no hay predeterminada, selecciona la primera
                    setData('delivery_location_id', userLocations[0].id);
                } else {
                    setData('delivery_location_id', null);
                }
            }
        } else {
            setDeliveryLocations([]);
            setData('delivery_location_id', null);
        }
    }, [data.user_id, users, setData]);


    // Efecto para inicializar el usuario seleccionado si ya viene en los datos (para edición)
    useEffect(() => {
        if (data.user_id && userOptions.length > 0) {
            const user = userOptions.find(option => option.value === data.user_id);
            if (user && user !== selectedUser) {
                setSelectedUser(user);
            }
        } else if (!data.user_id && selectedUser) {
            setSelectedUser(null);
        }
    }, [data.user_id, userOptions, selectedUser]);

    // Maneja la adición de un producto a la lista de order_items
    const handleAddProduct = () => {
        if (selectedProductToAdd) {
            const taxRate = selectedProductToAdd.tax_rate || 0;


            const existingItemIndex = data.order_items.findIndex(
                item => item.product_id === selectedProductToAdd.value &&
                    item.combination_id === (selectedProductToAdd.is_combination ? selectedProductToAdd.combination_id : null)
            );

            if (existingItemIndex > -1) {
                const updatedItems = data.order_items.map((item, index) => {
                    if (index === existingItemIndex) {
                        // Aquí debes usar item.tax_rate para calcular el impuesto
                        const taxRate = item.tax_rate || 0;
                        const newQuantity = item.quantity + 1;
                        const newSubtotal = newQuantity * parseFloat(item.product_price || 0);
                        const newTaxAmount = newSubtotal * (taxRate / 100);
                        return {
                            ...item,
                            quantity: newQuantity,
                            subtotal: newSubtotal,
                            tax_amount: newTaxAmount,
                            tax_rate: taxRate
                        };
                    }
                    return item;
                });
                setData('order_items', updatedItems);
            } else {
                const newItem = {
                    product_id: selectedProductToAdd.value,
                    name_product: selectedProductToAdd.original_product_name,
                    product_price: selectedProductToAdd.effective_price,
                    quantity: 1,
                    subtotal: selectedProductToAdd.effective_price,
                    tax_rate: taxRate, // Tasa de impuesto del producto
                    tax_amount: selectedProductToAdd.effective_price * (taxRate / 100), // Monto de impuesto para el ítem
                    combination_id: selectedProductToAdd.is_combination ? selectedProductToAdd.combination_id : null,
                    product_details: selectedProductToAdd.is_combination
                        ? JSON.stringify(selectedProductToAdd.combination_attributes_display || '') // <-- CAMBIO AQUÍ
                        : null
                };
                setData('order_items', [...data.order_items, newItem]);
            }
            setSelectedProductToAdd(null);
        }
    };

    // Maneja el cambio de cantidad para un item de la orden
    const handleQuantityChange = (index, newQuantity) => {
        const quantity = Math.max(1, parseInt(newQuantity) || 1);
        const updatedItems = data.order_items.map((item, i) => {
            if (i === index) {
                const newSubtotal = quantity * parseFloat(item.product_price || 0);
                const taxRate = item.tax_rate || 0;
                const newTaxAmount = newSubtotal * (taxRate / 100); // Recalcula tax_amount del ítem
                return {
                    ...item,
                    quantity: quantity,
                    subtotal: newSubtotal,
                    tax_amount: newTaxAmount // Actualiza tax_amount del ítem
                };
            }
            return item;
        });
        setData('order_items', updatedItems);
    };

    // Maneja la eliminación de un item de la orden
    const handleRemoveItem = (index) => {
        const updatedItems = data.order_items.filter((_, i) => i !== index);
        setData('order_items', updatedItems);
    };

    // Efecto para recalcular el total, subtotal e impuestos cada vez que order_items cambia
    useEffect(() => {
        const newSubtotal = data.order_items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
        const newTotalTaxAmount = data.order_items.reduce((sum, item) => sum + parseFloat(item.tax_amount || 0), 0);

        setData(prevData => ({
            ...prevData,
            subtotal: newSubtotal,
            tax_amount: newTotalTaxAmount,
            total: newSubtotal + newTotalTaxAmount - parseFloat(prevData.totaldiscounts || 0),
        }));
    }, [data.order_items, setData]);

    const orderItemsColumns = useMemo(() => getOrderItemsColumns({
        handleQuantityChange,
        handleRemoveItem,
        isDisabled,
    }), [handleQuantityChange, handleRemoveItem, isDisabled]);

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-full md:col-span-2">
                    <DivSection >
                        {orders && orders.created_at && (
                            <div>
                                <div className="mb-4">
                                    <p className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        Pedido recibido
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
                    </DivSection>
                </div>

                <div className="col-span-full md:col-span-1 ">
                    <DivSection >
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
                        <Select
                            id="product_selector"
                            name="product_selector"
                            options={productOptions}
                            value={selectedProductToAdd}
                            onChange={setSelectedProductToAdd}
                            styles={customStyles}
                            placeholder="Seleccionar producto..."
                            className="flex-grow"
                            isDisabled={isDisabled}
                            filterOption={filterProductOptions}
                            formatOptionLabel={formatProductOptionLabel}
                        />
                        <Button
                            type="button"
                            onClick={handleAddProduct}
                            disabled={!selectedProductToAdd || isDisabled}
                            variant="link"
                        >
                            <PlusCircle className="size-5 " />
                        </Button>
                    </div>

                    <DataTable
                        columns={orderItemsColumns}
                        data={data.order_items || []}
                    />

                    <Table>
                        <TableBody>
                        <TableRow>
                            <TableCell colSpan="3" className="text-right font-bold">Subtotal</TableCell>
                            <TableCell className="font-bold">
                                <span>${(parseFloat(data.subtotal) || 0).toFixed(2)}</span>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan="3" className="text-right font-bold">Impuestos</TableCell>
                            <TableCell className="font-bold">
                                <span>${(parseFloat(data.tax_amount) || 0).toFixed(2)}</span>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan="3" className="text-right font-bold">Descuentos</TableCell>
                            <TableCell className="font-bold">
                                <span>-${(parseFloat(data.totaldiscounts) || 0).toFixed(2)}</span>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-100 dark:bg-gray-700">
                            <TableCell colSpan="3" className="text-right font-bold text-lg">Total</TableCell>
                            <TableCell className="font-bold text-lg">
                                <span>${(parseFloat(data.subtotal) + parseFloat(data.tax_amount) - parseFloat(data.totaldiscounts)).toFixed(2)}</span>
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