import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';
import { useSelectOptions } from '@/hooks/useSelectOptions';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { Input } from '@headlessui/react';
import { X, Plus } from 'lucide-react';

export default function SubscriptionPlanForm({ data, setData, errors, isEdit = false }) {

    const { statusOptions } = useSelectOptions();

    // Manejar features (array de strings)
    const handleAddFeature = () => {
        setData('features', [...data.features, '']);
    };

    const handleRemoveFeature = (index) => {
        const newFeatures = data.features.filter((_, i) => i !== index);
        setData('features', newFeatures);
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData('features', newFeatures);
    };

    // Manejar limits (objeto)
    const handleLimitChange = (key, value) => {
        setData('limits', {
            ...data.limits,
            [key]: parseInt(value) || 0
        });
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2">
                    <DivSection>
                        <div>
                            <InputLabel htmlFor="name" value="Nombre" />
                            <TextInput
                                id="name"
                                value={data.name}
                                className="block w-full"
                                isFocused={!isEdit}
                                onChange={e => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Descripción" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm w-full"
                                rows={3}
                            />
                            <InputError message={errors.description} />
                        </div>

                        {/* Features - Array de strings */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <InputLabel value="Características" />
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={handleAddFeature}
                                >
                                    <Plus className="size-4" /> Agregar
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {data.features && data.features.length > 0 ? (
                                    data.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <TextInput
                                                value={feature}
                                                onChange={e => handleFeatureChange(index, e.target.value)}
                                                className="flex-1"
                                                placeholder="Ej: Gestión de productos"
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleRemoveFeature(index)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No hay características. Haz clic en "Agregar" para añadir.</p>
                                )}
                            </div>
                            <InputError message={errors.features} />
                        </div>

                        {/* Limits - Objeto con propiedades */}
                        <div>
                            <InputLabel value="Límites del Plan" />
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <InputLabel htmlFor="limits_staff_users" value="Usuarios Staff" className="text-sm" />
                                    <TextInput
                                        id="limits_staff_users"
                                        type="number"
                                        value={data.limits?.staff_users || 0}
                                        onChange={e => handleLimitChange('staff_users', e.target.value)}
                                        className="w-full"
                                        placeholder="-1 para ilimitado"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Usuarios del dashboard (excluyendo clientes)</p>
                                </div>
                                <div>
                                    <InputLabel htmlFor="limits_stores" value="Tiendas" className="text-sm" />
                                    <TextInput
                                        id="limits_stores"
                                        type="number"
                                        value={data.limits?.stores || 0}
                                        onChange={e => handleLimitChange('stores', e.target.value)}
                                        className="w-full"
                                        placeholder="-1 para ilimitado"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Número de tiendas físicas o virtuales</p>
                                </div>
                                <div>
                                    <InputLabel htmlFor="limits_pages" value="Páginas Dinámicas" className="text-sm" />
                                    <TextInput
                                        id="limits_pages"
                                        type="number"
                                        value={data.limits?.pages || 0}
                                        onChange={e => handleLimitChange('pages', e.target.value)}
                                        className="w-full"
                                        placeholder="-1 para ilimitado"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Páginas personalizadas (0 = solo esenciales)</p>
                                </div>
                            </div>
                            <InputError message={errors.limits} />
                        </div>

                        <div className="flex gap-4 items-center">
                            <div>
                                <InputLabel htmlFor="price" value="Precio Mensual" />
                                <TextInput
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={data.price}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('price', e.target.value)}
                                />
                                <InputError message={errors.price} />
                            </div>

                            <div>
                                <InputLabel htmlFor="yearly_price" value="Precio Anual" />
                                <TextInput
                                    id="yearly_price"
                                    type="number"
                                    step="0.01"
                                    name="yearly_price"
                                    value={data.yearly_price}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('yearly_price', e.target.value)}
                                />
                                <InputError message={errors.yearly_price} />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="trial_days" value="Días de prueba" />
                            <TextInput
                                id="trial_days"
                                type="number"
                                name="trial_days"
                                value={data.trial_days}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('trial_days', e.target.value)}
                            />
                            <InputError message={errors.trial_days} />
                        </div>

                        <div>
                            <InputLabel htmlFor="sort_order" value="Orden de visualización" />
                            <TextInput
                                id="sort_order"
                                type="number"
                                name="sort_order"
                                value={data.sort_order}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('sort_order', e.target.value)}
                            />
                            <InputError message={errors.sort_order} />
                        </div>

                        <div className="flex items-center gap-2">
                            <Input
                                id="is_trial"
                                type="checkbox"
                                name="is_trial"
                                checked={data.is_trial}
                                onChange={(e) => setData('is_trial', e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <InputLabel htmlFor="is_trial" value="Plan de prueba" />
                            <InputError message={errors.is_trial} />
                        </div>

                        <div className="flex items-center gap-2">
                            <Input
                                id="is_featured"
                                type="checkbox"
                                name="is_featured"
                                checked={data.is_featured}
                                onChange={(e) => setData('is_featured', e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <InputLabel htmlFor="is_featured" value="Plan destacado" />
                            <InputError message={errors.is_featured} />
                        </div>
                    </DivSection>


                </div>

                <div className="">
                    <DivSection>

                        <InputLabel htmlFor="is_active" value="Estado" />
                        <Select
                            options={statusOptions}
                            name="is_active"
                            value={statusOptions.find(option => option.value === Number(data.is_active))}
                            onChange={(selectedOption) => setData('is_active', selectedOption.value)}
                            styles={customStyles}
                            className="mt-1"
                        />
                        <InputError message={errors.is_active} className="mt-2" />
                    </DivSection>
                </div>

            </div>
        </>
    );
}
