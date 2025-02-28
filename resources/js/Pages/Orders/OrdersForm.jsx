import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import DivSection from '@/Components/ui/div-section';
import { customStyles } from '@/hooks/custom-select';
import Select from 'react-select';

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
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.order_items.map(detail => (
                                    <tr key={detail.id}>
                                        <td className="capitalize px-6 py-4 whitespace-nowrap">{detail.name_product}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{detail.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${detail.price_product}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${detail.subtotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-right font-bold">Total</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold">
                                        {orders.total}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                </DivSection>
            </div>

        </>
    );
}