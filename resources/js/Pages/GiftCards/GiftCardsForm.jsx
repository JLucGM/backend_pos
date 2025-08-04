import Checkbox from '@/Components/Checkbox';
import { DatePicker } from '@/Components/DatePicker';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { customStyles } from '@/hooks/custom-select';
import { useMemo } from 'react';
import Select from 'react-select';

export default function GiftCardsForm({ data, users, setData, errors }) {

    const userOptions = users.map(user => ({
        value: user.id,
        label: user.name
    }));

    const selectedUser   = useMemo(() => {
        return userOptions.find(option => option.value === data.user_id);
    }, [data.user_id, userOptions]);

    const handleUserChange = (selectedOption) => {
        setData('user_id', selectedOption ? selectedOption.value : null);
    };

    const statusOptions = [
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' },
    ];

    const handleStatusChange = (selectedOption) => {
        setData('is_active', selectedOption ? selectedOption.value : null);
    };

    return (
        <>
            <div>
                <InputLabel htmlFor="code" value="Código de la gift card" />
                <TextInput
                    id="code"
                    type="text"
                    name="code"
                    value={data.code ?? ''} // Asegúrate de que no sea null
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('code', e.target.value)}
                />
                <InputError message={errors.code} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="description" value="Descripción (opcional)" />
                <TextInput
                    id="description"
                    type="text"
                    name="description"
                    value={data.description ?? ''} // Asegúrate de que no sea null
                    className="mt-1 block w-full"
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="initial_balance" value="Valor Inicial" />
                <TextInput
                    id="initial_balance"
                    type="number"
                    name="initial_balance"
                    value={data.initial_balance ?? ''} // Asegúrate de que no sea null
                    className="mt-1 block w-full"
                    onChange={(e) => setData('initial_balance', e.target.value)}
                />
                <InputError message={errors.initial_balance} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="expiration_date" value="Fecha de Expiración (opcional)" />
                <DatePicker
                    selectedDate={data.expiration_date ? new Date(data.expiration_date) : undefined}
                    onDateChange={(date) => setData('expiration_date', date)}
                />
                <InputError message={errors.expiration_date} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="is_active" value="Estado" />
                <Select
                    id="is_active"
                    name="is_active"
                    options={statusOptions}
                    value={statusOptions.find(option => option.value === data.is_active)} // Asegúrate de que esto esté correcto
                    onChange={handleStatusChange}
                    styles={customStyles}
                    placeholder="Seleccionar estado..."
                    isClearable={false}
                />
                <InputError message={errors.is_active} className="mt-2" />
            </div>

            <div className="mt-2">
                <InputLabel htmlFor="user_id" value="Cliente" />
                <Select
                    id="user_id"
                    name="user_id"
                    options={userOptions}
                    value={selectedUser}
                    onChange={handleUserChange}
                    styles={customStyles}
                    placeholder="Buscar o seleccionar usuario..."
                    isClearable={true}
                />
                <InputError message={errors.user_id} className="mt-2" />
            </div>
        </>
    );
}

