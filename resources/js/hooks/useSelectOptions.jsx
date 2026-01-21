import { useMemo } from 'react';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';
import { usePage } from '@inertiajs/react';

export const useSelectOptions = (categories = [], taxes = [], products = [], states = [], users = [], countries = []) => {
    const settings = usePage().props.settings;
    // Opciones de categorías (centralizadas aquí)
    const categoryOptions = useMemo(() => 
        categories.length > 0 ? mapToSelectOptions(categories, 'id', 'category_name') : [], 
        [categories]
    );

    // Opciones de impuestos (ya estaban)
    const taxOptions = useMemo(() => 
        taxes.length > 0 ? mapToSelectOptions(taxes, 'id', tax => `${tax.tax_name} (${tax.tax_rate}%)`, true) : [], 
        [taxes]
    );

    // Opciones de estado (ya estaban, para discounts)
    const statusOptions = useMemo(() => [
        { value: 0, label: 'Borrador' },
        { value: 1, label: 'Publicar' }
    ], []);

    // Opciones de productos (mover la lógica del componente aquí)
    const productOptions = useMemo(() => {
        const options = [];

        products.forEach(product => {
            // Simple (sin combinations)
            if (!product.combinations || product.combinations.length === 0) {
                options.push({
                    value: `simple_${product.id}`,
                    label: `${product.product_name} - ${settings.currency?.symbol || '$'} ${parseFloat(product.product_price).toFixed(2)}`,
                    product_id: product.id,
                    combination_id: null,
                });
            } else {
                // Variables: Cada combination individual
                product.combinations.forEach(comb => {
                    let attributes = '';
                    if (comb.combination_attribute_value && Array.isArray(comb.combination_attribute_value)) {
                        attributes = comb.combination_attribute_value.map(cav =>
                            `${cav.attribute_value.attribute.attribute_name}: ${cav.attribute_value.attribute_value_name}`
                        ).join(', ');
                        attributes = attributes ? ` - ${attributes}` : '';
                    }
                    const price = comb.combination_price ? ` - ${settings.currency?.symbol || '$'} ${parseFloat(comb.combination_price).toFixed(2)}` : '';

                    options.push({
                        value: `comb_${comb.id}`,
                        label: `${product.product_name}${attributes}${price}`,
                        product_id: product.id,
                        combination_id: comb.id,
                    });
                });
            }
        });

        return options;
    }, [products]);

    // Opciones para "Aplica a" (nuevo)
    const appliesToOptions = useMemo(() => [
        { value: 'product', label: 'Producto' },
        { value: 'category', label: 'Categoría' },
        { value: 'order_total', label: 'Total del pedido' },
    ], []);

    // Opciones para "Método" (nuevo)
    const automaticOptions = useMemo(() => [
        { value: true, label: 'Descuento Automático' },
        { value: false, label: 'Descuento por código' },
    ], []);

    // Opciones de estados (nuevo, movido de CitiesForm)
    const stateOptions = useMemo(() => 
        states.length > 0 ? mapToSelectOptions(states, 'id', 'state_name') : [], 
        [states]
    );

    // Opciones de usuarios (nuevo, movido de GiftCardsForm)
    const userOptions = useMemo(() => 
        users.length > 0 ? mapToSelectOptions(users, 'id', 'name') : [], 
        [users]
    );

    // Opciones de países (nuevo, movido de StatesForm)
    const countryOptions = useMemo(() => 
        countries.length > 0 ? mapToSelectOptions(countries, 'id', 'country_name') : [], 
        [countries]
    );

    // Devuelve todas las opciones
    return { 
        categoryOptions, 
        taxOptions, 
        statusOptions, 
        productOptions, 
        appliesToOptions, 
        automaticOptions,
        stateOptions,
        userOptions,
        countryOptions  // Agregado
    };
};