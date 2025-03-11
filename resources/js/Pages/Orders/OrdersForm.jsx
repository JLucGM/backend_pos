import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import DivSection from '@/Components/ui/div-section';
import { customStyles } from '@/hooks/custom-select';
import Select from 'react-select';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  

export default function OrdersForm({ data, orders = "", paymentMethods, setData, errors, isDisabled = false }) {

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options); // Cambia 'es-ES' por tu configuración regional preferida
    };

    const paymentOptions = paymentMethods.map(method => ({
        value: method.id,
        label: method.payment_method_name
    }));

    // Maneja el cambio en el select
    const handlePaymentChange = (selectedOption) => {
        setData('payments_method_id', selectedOption.value);
    };

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-full md:col-span-2">
                    <DivSection >
                        <div>
                            <p className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Pedido recibido</p>
                            {formatDate(orders.created_at)}
                            <p className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Actualizado
                            </p>
                            {formatDate(orders.updated_at)}
                        </div>

                        <div>
                            <InputLabel htmlFor="status" value="Dirección de Entrega" />
                            <TextInput
                                id="status"
                                type="text"
                                name="status"
                                value={data.status}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('status', e.target.value)}
                            />
                            <InputError message={errors.status} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="direction_delivery" value="Dirección de Entrega" />
                            <TextInput
                                id="direction_delivery"
                                type="text"
                                name="direction_delivery"
                                value={data.direction_delivery}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('direction_delivery', e.target.value)}
                            />
                            <InputError message={errors.direction_delivery} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="payments_method_id" value="Método de Pago" />
                            <Select
                                id="payments_method_id"
                                name="payments_method_id"
                                options={paymentOptions}
                                value={paymentOptions.find(option => option.value === data.payments_method_id)} // Encuentra el valor seleccionado
                                onChange={handlePaymentChange} // Maneja el cambio
                                styles={customStyles} // Aplica estilos personalizados si los tienes
                                isDisabled={isDisabled} // Deshabilitar el select si es necesario
                            />
                            <InputError message={errors.payments_method_id} className="mt-2" />
                        </div>

                    </DivSection>
                </div>

                <div className="col-span-full md:col-span-1 ">
                    <DivSection >
                        <div>
                            <h2 className='font-semibold'>Cliente</h2>
                            <p>{orders.client.client_name}</p> {/* Asegúrate de que orders tenga el objeto del cliente */}
                            <p>{orders.client.client_identification}</p>
                            <p>{orders.client.client_phone}</p>
                        </div>

                    </DivSection>
                </div>
                <DivSection className='col-span-full'>
                    <Table>
                        <TableCaption>Detalles de la Orden</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.order_items.map(detail => (
                                <TableRow key={detail.id}>
                                    <TableCell className="capitalize flex flex-col">
                                        {detail.name_product}
                                        {detail.combination ? (
                                            detail.combination.attribute_values && detail.combination.attribute_values.length > 0 ? (
                                                detail.combination.attribute_values.map(attrValue => (
                                                    <div className='flex flex-col' key={attrValue.id}>
                                                        <span className="font-bold">
                                                            {attrValue.attribute_value.attribute.attribute_name}
                                                        </span>
                                                        {attrValue.attribute_value.attribute_value_name}  {/* Mostrar el nombre del atributo y su valor */}
                                                    </div>
                                                ))
                                            ) : (
                                                'Sin atributos' // Mensaje si no hay atributos
                                            )
                                        ) : (
                                            'Sin combinación' // Mensaje si no hay combinación
                                        )}
                                    </TableCell>
                                    <TableCell>{detail.quantity}</TableCell>
                                    <TableCell>${detail.price_product}</TableCell>
                                    <TableCell>${detail.subtotal}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <tfoot>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-bold">Total</TableCell>
                                <TableCell className="font-bold">
                                    {orders.total}
                                </TableCell>
                            </TableRow>
                        </tfoot>
                    </Table>
                </DivSection>
            </div>

        </>
    );
}