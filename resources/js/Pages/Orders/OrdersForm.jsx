import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function OrdersForm({ data,paymentMethods, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="status" value="Estado" />
                <TextInput
                    id="status"
                    type="text"
                    name="status"
                    value={data.status}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('status', e.target.value)}
                />
                <InputError message={errors.status} className="mt-2" />
            </div>
            
            <div>
                <InputLabel htmlFor="total" value="Total" />
                <TextInput
                    id="total"
                    type="text"
                    name="total"
                    value={data.total}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('total', e.target.value)}
                />
                <InputError message={errors.total} className="mt-2" />
            </div>
            
            <div>
                <InputLabel htmlFor="direction_delivery" value="Dirección de Entrega" />
                <TextInput
                    id="direction_delivery"
                    type="text"
                    name="direction_delivery"
                    value={data.direction_delivery}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('direction_delivery', e.target.value)}
                />
                <InputError message={errors.direction_delivery} className="mt-2" />
            </div>

            <div>
      <h2>Detalles del Usuario</h2>
      <p>Nombre: {data.user_id.name}</p>
      <p>Email: {data.user_id.email}</p>
      <p>Teléfono: {data.user_id.phone}</p>
      {/* Agrega más campos según sea necesario */}
    </div>
            

    <div>
                <InputLabel htmlFor="payments_method_id" value="Método de Pago" />
                <select
                    id="payments_method_id"
                    name="payments_method_id"
                    value={data.payments_method_id}
                    onChange={(e) => setData('payments_method_id', e.target.value)}
                    className="mt-1 block w-full"
                >
                    <option value="">Seleccione un método de pago</option>
                    {paymentMethods.map(method => (
                        <option key={method.id} value={method.id}>
                            {method.payment_method_name} {/* Asegúrate de que 'name' sea el campo correcto */}
                        </option>
                    ))}
                </select>
                <InputError message={errors.payments_method_id} className="mt-2" />
            </div>
            
        </>
    );
}