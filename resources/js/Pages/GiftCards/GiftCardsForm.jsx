import { DatePicker } from '@/Components/DatePicker';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import DivSection from '@/Components/ui/div-section';
import { customStyles } from '@/hooks/custom-select';
import { useSelectOptions } from '@/hooks/useSelectOptions';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useMemo } from 'react';
import Select from 'react-select';

export default function GiftCardsForm({ data, users, setData, errors }) {

    const { statusOptions } = useSelectOptions([], [], [], [], users);  // taxes vacío si no las usas



    const {
        selectedUser,
        deliveryLocations,
        handleUserChange,
        userOptions, // Ahora del hook (reemplaza el memo local)
    } = useUserManagement(data, users, setData);

    return (
        <>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="col-span-full md:col-span-2">
                    <DivSection>
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

                    </DivSection>
                </div>

                <div className="col-span-full md:col-span-1">

                    <DivSection>
                        <div className="">
                            <InputLabel htmlFor="is_active" value="Estado" />
                            <Select
                                options={statusOptions}
                                name="is_active"
                                value={statusOptions.find(option => option.value === Number(data.is_active))}
                                onChange={(selectedOption) => setData('is_active', selectedOption.value)}
                                styles={customStyles} // si usas estilos personalizados
                                className="mt-1"
                            />
                            <InputError message={errors.is_active} className="mt-2" />
                        </div>
                        
                        <div className="">
                            <InputLabel htmlFor="user_id" value="Cliente" />
                            <Select
                                id="user_id"
                                name="user_id"
                                options={userOptions}
                                value={selectedUser}
                                onChange={handleUserChange}
                                styles={customStyles}
                                placeholder="Seleccionar usuario."
                                isClearable={true}
                            //   isDisabled={isDisabled}
                            />
                            <InputError message={errors.user_id} className="mt-2" />
                        </div>
                    </DivSection>
                </div>
            </div>
        </>
    );
}

