import { useMemo } from 'react';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';

export const useSelectOptions = (categories = [], taxes = []) => {
    const categoryOptions = useMemo(() => 
        categories.length > 0 ? mapToSelectOptions(categories, 'id', 'category_name') : [], 
        [categories]
    );
    const taxOptions = useMemo(() => 
        taxes.length > 0 ? mapToSelectOptions(taxes, 'id', tax => `${tax.tax_name} (${tax.tax_rate}%)`, true) : [], 
        [taxes]
    );
    const statusOptions = useMemo(() => [
        { value: 0, label: 'Borrador' },
        { value: 1, label: 'Publicar' }
    ], []);

    return { categoryOptions, taxOptions, statusOptions };
};