import React from 'react';
import Select from 'react-select';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Checkbox from '@/Components/Checkbox';
import DivSection from '@/Components/ui/div-section';
import { customStyles } from '@/hooks/custom-select';
import InputData from '../InputData';

export default function ProductSettings({ data, setData, errors, statusOptions, taxOptions }) {
    return (
        <DivSection className='space-y-4'>
            <div>
                <InputLabel htmlFor="is_active" value="Publicar" />
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
                <div className="flex items-center mt-4">
                    <Checkbox
                        id="product_status_pos"
                        name="product_status_pos"
                        checked={data.product_status_pos === 1}
                        onChange={(e) => setData('product_status_pos', e.target.checked ? 1 : 0)}
                        className="mr-2"
                    />
                    <InputLabel htmlFor="product_status_pos" value="Activar en POS" />
                </div>
                <InputError message={errors.product_status_pos} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="tax_id" value="Impuesto" />
                <Select
                    name="tax_id"
                    id="tax_id"
                    options={taxOptions}
                    value={taxOptions.find(option => option.value === (data.tax_id ?? null))}
                    onChange={(selectedOption) => setData('tax_id', selectedOption ? selectedOption.value : null)}
                    styles={customStyles}
                />
                <InputData htmlFor="tax_id" value="No selecciones ningún impuesto si ya viene incluido en el precio." />
                <InputError message={errors.tax_id} className="mt-2" />
            </div>
        </DivSection>
    );
}