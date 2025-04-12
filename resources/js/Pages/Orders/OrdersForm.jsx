import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import DivSection from '@/Components/ui/div-section';
import { customStyles } from '@/hooks/custom-select';
import Select from 'react-select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"

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
                            <div className="">
                                <p className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                    Pedido recibido
                                </p>

                                {formatDate(orders.created_at)}
                                
                            </div>
                            <p className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Actualizado
                            </p>
                            {formatDate(orders.updated_at)}
                        </div>

                        <div>
                            <InputLabel htmlFor="status" value="Status" />
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
                                value={data.direction_delivery || ""}
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
                            {orders.client_id ? (
                                <>
                            <p>{orders.client.client_name}</p> 
                            <p>{orders.client.client_identification}</p>
                            <p>{orders.client.client_phone}</p>
                                </>
                        ) : (
                            <>
                                <p>{orders.user.name}</p>
                                <p>{orders.user.identification}</p>
                                <p>{orders.user.phone}</p>
                            </>
                        )}

{/* {initialValues.client_id ? (
        <>
            <p>ID del Cliente: {initialValues.client_id}</p>
            <p>Nombre del Cliente: {orders.client.client_name}</p>
            <p>Identificación del Cliente: {orders.client.client_identification}</p>
            <p>Teléfono del Cliente: {orders.client.client_phone}</p>
        </>
    ) : (
        <>
            <p>ID del Usuario: {initialValues.user_id}</p>
        </>
    )} */}
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
                            {orders.order_items && orders.order_items.length > 0 ? (
                                orders.order_items.map(detail => (
                                    <TableRow key={detail.id}>
                                        <TableCell className="capitalize flex flex-col">
                                            <p className='font-bold'>
                                                {detail.name_product}
                                            </p>
                                            {/* Mostrar los detalles del producto desde product_details */}
                                            {detail.product_details ? (
                                                Object.entries(JSON.parse(detail.product_details)).map(([key, value]) => (
                                                    <div className='flex flex-col mt-2' key={key}>
                                                        <span className="font-semibold">{key}:</span> {value}
                                                    </div>
                                                ))
                                            ) : (
                                                null // Mensaje si no hay detalles
                                            )}
                                        </TableCell>
                                        <TableCell>{detail.quantity}</TableCell>
                                        <TableCell>${detail.price_product}</TableCell>
                                        <TableCell>${detail.subtotal}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="4" className="text-center">
                                        No hay detalles de la orden disponibles.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <tfoot>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-bold">Subtotal</TableCell>
                                <TableCell className="font-bold">
                                    ${orders.subtotal}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-bold">Descuento</TableCell>
                                <TableCell className="font-bold">
                                    ${orders.totaldiscounts}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-bold">Total</TableCell>
                                <TableCell className="font-bold">
                                    ${orders.total}
                                </TableCell>
                            </TableRow>
                        </tfoot>
                    </Table>
                </DivSection>
            </div>

        </>
    );
}