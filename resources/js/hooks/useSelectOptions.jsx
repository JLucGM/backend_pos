import { useMemo } from 'react';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';
import { usePage } from '@inertiajs/react';

export const useSelectOptions = (
    categories = [],
    taxes = [],
    products = [],
    states = [],
    users = [],
    countries = [],
    stores = []  // Agregar stores como parámetro
) => {
    const settings = usePage().props.settings;

    // Opciones de categorías
    const categoryOptions = useMemo(() =>
        categories.length > 0 ? mapToSelectOptions(categories, 'id', 'category_name') : [],
        [categories]
    );

    // Opciones de impuestos
    const taxOptions = useMemo(() =>
        taxes.length > 0 ? mapToSelectOptions(taxes, 'id', tax => `${tax.tax_name} (${tax.tax_rate}%)`, true) : [],
        [taxes]
    );

    // Opciones de estado
    const statusOptions = useMemo(() => [
        { value: 0, label: 'Borrador' },
        { value: 1, label: 'Publicar' }
    ], []);

    // Opciones de productos
    const productOptions = useMemo(() => {
        const options = [];

        products.forEach(product => {
            if (!product.combinations || product.combinations.length === 0) {
                options.push({
                    value: `simple_${product.id}`,
                    label: `${product.product_name} - ${settings.currency?.symbol || '$'} ${parseFloat(product.product_price).toFixed(2)}`,
                    product_id: product.id,
                    combination_id: null,
                });
            } else {
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
    }, [products, settings.currency]);

    // Opciones para "Aplica a"
    const appliesToOptions = useMemo(() => [
        { value: 'product', label: 'Producto' },
        { value: 'category', label: 'Categoría' },
        { value: 'order_total', label: 'Total del pedido' },
    ], []);

    // Opciones para "Método"
    const automaticOptions = useMemo(() => [
        { value: true, label: 'Descuento Automático' },
        { value: false, label: 'Descuento por código' },
    ], []);

    // Opciones de estados
    const stateOptions = useMemo(() =>
        states.length > 0 ? mapToSelectOptions(states, 'id', 'state_name') : [],
        [states]
    );

    // Opciones de usuarios
    const userOptions = useMemo(() =>
        users.length > 0 ? mapToSelectOptions(users, 'id', 'name') : [],
        [users]
    );

    // Opciones de países
    const countryOptions = useMemo(() =>
        countries.length > 0 ? mapToSelectOptions(countries, 'id', 'country_name') : [],
        [countries]
    );

    // Opciones de tiendas
    const storeOptions = useMemo(() => {
        if (stores.length === 0) return [];

        // Ordenar tiendas: primero las con ecommerce activo
        const sortedStores = [...stores].sort((a, b) => {
            // Si a tiene ecommerce activo y b no, a va primero
            if (a.is_ecommerce_active && !b.is_ecommerce_active) return -1;
            // Si b tiene ecommerce activo y a no, b va primero
            if (!a.is_ecommerce_active && b.is_ecommerce_active) return 1;
            // Si ambos tienen el mismo estado, ordenar por nombre
            return a.name.localeCompare(b.name);
        });

        return sortedStores.map(store => ({
            value: store.id,
            label: `${store.name}${store.is_ecommerce_active ? ' (E-commerce)' : ''}`,
            store: store // Opcional: mantener el objeto completo para acceso rápido
        }));
    }, [stores]);

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
        countryOptions,
        storeOptions  // Agregado
    };
};