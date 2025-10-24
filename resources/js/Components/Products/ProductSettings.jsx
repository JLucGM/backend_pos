import React from 'react';
import Select from 'react-select';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Checkbox from '@/Components/Checkbox';
import DivSection from '@/Components/ui/div-section';
import { customStyles } from '@/hooks/custom-select';

export default function ProductSettings({ data, setData, errors, statusOptions, taxOptions }) {
    return (
        <DivSection className='space-y-4'>
            <div className='md:col-span-2 lg:col-span-1'>
                <InputLabel htmlFor="status" value="Publicar" />
                <Select
                    name="status"
                    id="status"
                    options={statusOptions}
                    value={statusOptions.find(option => option.value === data.status)}
                    onChange={(selectedOption) => setData('status', selectedOption.value)}
                    styles={customStyles}
                />
                <InputError message={errors.status} className="mt-2" />
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
                <InputError message={errors.tax_id} className="mt-2" />
            </div>
        </DivSection>
    );
}