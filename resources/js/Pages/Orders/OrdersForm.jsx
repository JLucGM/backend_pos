import React, { useState, useEffect, useMemo } from 'react';

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import DivSection from '@/Components/ui/div-section';
import { customStyles } from '@/hooks/custom-select';
import Select from 'react-select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/Components/ui/table";
import { Button } from '@/Components/ui/button';
import { TrashIcon } from '@heroicons/react/24/outline';
import { PlusCircle } from 'lucide-react';
import { Checkbox } from "@/Components/ui/checkbox"
import { Badge } from '@/Components/ui/badge';


export default function OrdersForm({ data, orders = null, products = [], users = [], paymentMethods = [], setData, errors, isDisabled = false }) {
    // console.log('Datos de la orden en OrdersForm:', data);
    // console.log('Ítems de la orden:', data.order_items);
    // ...
    // Estado para el producto/combinación seleccionado en el dropdown para añadir a la orden
    const [selectedProductToAdd, setSelectedProductToAdd] = useState(null);
    // Estado para el usuario seleccionado en el dropdown
    const [selectedUser, setSelectedUser] = useState(null);
    const [deliveryLocations, setDeliveryLocations] = useState([]);

    // Función para formatear fechas, maneja valores nulos
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Opciones para el select de métodos de pago
    const paymentOptions = paymentMethods.map(method => ({
        value: method.id,
        label: method.payment_method_name
    }));

    // Opciones para el select de usuarios - ¡MEMOIZADAS!
    const userOptions = useMemo(() => {
        return users.map(user => ({
            value: user.id,
            label: `${user.name} (${user.email || 'Sin email'})`
        }));
    }, [users]); // Dependencia: solo se recalcula si la prop 'users' cambia

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

                    if (combinationStock > 0) { // Solo añadir si hay stock
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
                            // Almacenar las partes para la renderización personalizada
                            original_product_name: product.product_name,
                            combination_attributes_display: combinationAttributesDisplay,
                            barcode: barcode,
                            effective_price: effectivePrice,
                            original_display_price: originalProductPrice,

                            // Datos adicionales para el manejo interno
                            combination_id: combination.id,
                            combination_details: combination,
                            is_combination: true,
                            stock: combinationStock,
                            // La propiedad 'label' se usará para la búsqueda interna de react-select
                            label: `${product.product_name} ${combinationAttributesDisplay} ${barcode || ''} ${effectivePrice.toFixed(2)}`.toLowerCase()
                        });
                    }
                });
            } else {
                const effectivePrice = (product.product_price_discount !== null && product.product_price_discount !== undefined)
                    ? parseFloat(product.product_price_discount)
                    : originalProductPrice;

                const productStock = calculateStock(product); // Stock del producto base

                if (productStock > 0) { // Solo añadir si hay stock
                    const barcode = product.stocks.find(s => s.combination_id === null)?.product_barcode || null;
                    options.push({
                        value: product.id,
                        // Almacenar las partes para la renderización personalizada
                        original_product_name: product.product_name,
                        combination_attributes_display: null, // No hay atributos para productos sin combinación
                        barcode: barcode,
                        effective_price: effectivePrice,
                        original_display_price: (effectivePrice !== originalProductPrice) ? originalProductPrice : null,

                        // Datos adicionales para el manejo interno
                        is_combination: false,
                        stock: productStock,
                        // La propiedad 'label' se usará para la búsqueda interna de react-select
                        label: `${product.product_name} ${barcode || ''} ${effectivePrice.toFixed(2)}`.toLowerCase()
                    });
                }
            }
        });
        return options;
    }, [products]); // Dependencia: solo se recalcula si la prop 'products' cambia

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
        { value: 'completed', label: 'Completado' },
        { value: 'cancelled', label: 'Cancelado' },
        { value: 'processing', label: 'Procesando' },
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
            const existingItemIndex = data.order_items.findIndex(
                item => item.product_id === selectedProductToAdd.value &&
                    item.combination_id === (selectedProductToAdd.is_combination ? selectedProductToAdd.combination_id : null)
            );

            let productDetailsString = null;

            if (selectedProductToAdd.is_combination) {
                // product_details contendrá SÓLO los atributos (ej., "rojo y m")
                productDetailsString = selectedProductToAdd.combination_attributes_display || '';
            } else {
                // Para productos sin combinación, product_details debe ser null
                productDetailsString = null;
            }


            if (existingItemIndex > -1) {
                const updatedItems = data.order_items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * parseFloat(item.product_price || 0) } // Ensure product_price is a number
                        : item
                );
                setData('order_items', updatedItems);
            } else {
                const newItem = {
                    product_id: selectedProductToAdd.value,
                    name_product: selectedProductToAdd.original_product_name, // Usar el nombre original del producto
                    product_price: selectedProductToAdd.effective_price, // Usar effective_price
                    original_display_price: selectedProductToAdd.original_display_price,
                    quantity: 1,
                    subtotal: selectedProductToAdd.effective_price, // Usar effective_price
                    combination_id: selectedProductToAdd.is_combination ? selectedProductToAdd.combination_id : null,
                    product_details: productDetailsString, // Contiene solo los atributos para combinaciones
                    is_combination: selectedProductToAdd.is_combination
                };
                setData('order_items', [...data.order_items, newItem]);
            }
            setSelectedProductToAdd(null);
        }
    };

    // Maneja el cambio de cantidad para un item de la orden
    const handleQuantityChange = (index, newQuantity) => {
        const quantity = Math.max(1, parseInt(newQuantity) || 1);
        const updatedItems = data.order_items.map((item, i) =>
            i === index
                ? { ...item, quantity: quantity, subtotal: quantity * parseFloat(item.product_price || 0) } // Ensure product_price is a number
                : item
        );
        setData('order_items', updatedItems);
    };

    // Maneja la eliminación de un item de la orden
    const handleRemoveItem = (index) => {
        const updatedItems = data.order_items.filter((_, i) => i !== index);
        setData('order_items', updatedItems);
    };

    // Efecto para recalcular el total y subtotal cada vez que order_items cambia
    useEffect(() => {
        // Convertir item.subtotal a número antes de sumarlo
        const newSubtotal = data.order_items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);

        // Asegurarse de que data.subtotal sea un número antes de comparar
        if (newSubtotal.toFixed(2) !== (parseFloat(data.subtotal) || 0).toFixed(2)) {
            // console.log("Recalculando subtotal:", newSubtotal);
            setData(prevData => ({
                ...prevData,
                subtotal: newSubtotal,
                total: newSubtotal,
                totaldiscounts: 0,
            }));
        }
    }, [data.order_items, setData]);

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
                        <div>
                            <h2 className='font-semibold text-lg'>Usuario</h2>
                            {orders && orders.user ? ( // Check if orders and orders.user exist (edit mode)
                                <div className="mt-2">
                                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre:</p>
                                    <span className="text-gray-900 dark:text-gray-100">{orders.user.name}</span>
                                    {orders.user.email && (
                                        <>
                                            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Email:</p>
                                            <span className="text-gray-900 dark:text-gray-100">{orders.user.email}</span>
                                        </>
                                    )}
                                    {orders.user.phone && (
                                        <>
                                            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Teléfono:</p>
                                            <span className="text-gray-900 dark:text-gray-100">{orders.user.phone}</span>
                                        </>
                                    )}
                                    {orders.user.identification && (
                                        <>
                                            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">identification:</p>
                                            <span className="text-gray-900 dark:text-gray-100">{orders.user.identification}</span>
                                        </>
                                    )}
                                    {orders.delivery_location.address_line_1 && (
                                        <>
                                            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Dirección:</p>
                                            <span className="text-gray-900 dark:text-gray-100">{orders.delivery_location.address_line_1}</span>
                                        </>
                                    )}
                                </div>
                            ) : ( // Create mode
                                <>
                                    <div className="mt-2">
                                        <InputLabel htmlFor="user_id" value="Seleccionar Usuario" />
                                        <Select
                                            id="user_id"
                                            name="user_id"
                                            options={userOptions}
                                            value={selectedUser}
                                            onChange={handleUserChange}
                                            styles={customStyles}
                                            placeholder="Buscar o seleccionar usuario..."
                                            isClearable={true}
                                            isDisabled={isDisabled}
                                        />
                                        <InputError message={errors.user_id} className="mt-2" />
                                    </div>
                                    <div className="mt-4">

                                        <div className="mt-4">
                                            <InputLabel htmlFor="delivery_location_id" value="Direcciones de Entrega" />
                                            {deliveryLocations.length > 0 ? (
                                                <div className="space-y-3 mt-2">
                                                    {deliveryLocations.map((location) => (
                                                        <div key={location.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`location-${location.id}`}
                                                                checked={data.delivery_location_id === location.id}
                                                                onCheckedChange={(checked) => {
                                                                    setData('delivery_location_id', checked ? location.id : null)
                                                                }}
                                                                disabled={isDisabled}
                                                            />
                                                            <label
                                                                htmlFor={`location-${location.id}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                                                            >
                                                                <div className="flex flex-col">
                                                                    <div className="gap-2">
                                                                        {!!location.is_default && (
                                                                            <p className="text-muted-foreground text-xs">
                                                                                Dirección predeterminada
                                                                            </p>
                                                                        )}
                                                                        <p className="font-medium">
                                                                            {location.address_line_1}
                                                                            {location.address_line_2 && `, ${location.address_line_2}`}
                                                                        </p>
                                                                    </div>
                                                                    {location.postal_code && (
                                                                        <span className="text-muted-foreground text-xs">
                                                                            Código postal: {location.postal_code}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {data.user_id
                                                        ? "Este usuario no tiene direcciones registradas"
                                                        : "Seleccione un usuario para ver sus direcciones"}
                                                </p>
                                            )}

                                            <InputError message={errors.delivery_location_id} className="mt-2" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

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

                    <Table>
                        <TableCaption>Detalles de los productos en la orden</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead className="w-24">Cantidad</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Subtotal</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.order_items && data.order_items.length > 0 ? (
                                data.order_items.map((item, index) => (
                                    <TableRow key={`${item.product_id}-${item.combination_id || 'no-combo'}-${index}`}>
                                        <TableCell className="capitalize flex flex-col">
                                            <p className='font-bold'>{item.name_product}</p>
                                            <p className='text-sm text-gray-500'>{item.product_details || ''}</p>
                                        </TableCell>
                                        <TableCell>
                                            <TextInput
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                className="w-20"
                                                disabled={isDisabled}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {item.original_display_price && (parseFloat(item.original_display_price) || 0) !== (parseFloat(item.product_price) || 0) ? (
                                                <span className="line-through text-gray-500 mr-2">${(parseFloat(item.original_display_price) || 0).toFixed(2)}</span>
                                            ) : null}
                                            <span>${(parseFloat(item.product_price) || 0).toFixed(2)}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span>${(parseFloat(item.subtotal) || 0).toFixed(2)}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="link"
                                                type="button"
                                                onClick={() => handleRemoveItem(index)}
                                            >
                                                <TrashIcon className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="5" className="text-center text-gray-500 dark:text-gray-400">
                                        No hay productos en la orden. Agrega algunos.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>


                        <tfoot>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-bold">Subtotal</TableCell>
                                <TableCell className="font-bold">
                                    <span>${(parseFloat(data.subtotal) || 0).toFixed(2)}</span>
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
                                    <span>${(parseFloat(data.total) || 0).toFixed(2)}</span>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </tfoot>
                    </Table>

                </DivSection>
            </div>
        </>
    );
}