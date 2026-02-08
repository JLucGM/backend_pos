import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { lazy, Suspense, useState, useEffect } from 'react';
import { buttonVariants } from '@/Components/ui/button';
import { Plus } from 'lucide-react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import DivSection from '@/Components/ui/div-section';
import { StocksColumns } from './Columns';
import Loader from '@/Components/ui/loader';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useSelectOptions } from '@/hooks/useSelectOptions';
import { usePage } from '@inertiajs/react';
import { customStyles } from '@/hooks/custom-select';

// Define DataTable as lazy component
const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ stock, permission, stores, selectedStoreId }) {
    const [filteredStock, setFilteredStock] = useState(stock);
    const [currentStoreId, setCurrentStoreId] = useState(selectedStoreId);
    const animatedComponents = makeAnimated();

    // Usar el hook para obtener las opciones de tiendas
    const { storeOptions } = useSelectOptions([], [], [], [], [], [], stores);

    // Encontrar la tienda con ecommerce activo por defecto
    const defaultEcommerceStore = stores.find(store => store.is_ecommerce_active);

    // Valor seleccionado actualmente - SIN la opción "Todas las tiendas"
    const selectedValue = storeOptions.find(option => option.value === currentStoreId) ||
        (defaultEcommerceStore ? storeOptions.find(option => option.value === defaultEcommerceStore.id) : null);

    // Filtrar stock cuando cambie la tienda seleccionada
    useEffect(() => {
        if (currentStoreId) {
            const filtered = stock.filter(item => item.store_id == currentStoreId);
            setFilteredStock(filtered);
        } else {
            // Si no hay store seleccionada, muestra todas
            setFilteredStock(stock);
        }
    }, [currentStoreId, stock]);

    const handleStoreChange = (selectedOption) => {
        const storeId = selectedOption ? selectedOption.value : null;
        setCurrentStoreId(storeId);

        // Actualizar la URL con el parámetro
        router.get(route('stocks.index'), { store_id: storeId || '' }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    // Si no hay store seleccionada y hay stores disponibles, selecciona la tienda con ecommerce activo
    useEffect(() => {
        if (!currentStoreId && stores.length > 0) {
            // Buscar la tienda con ecommerce activo primero
            const defaultStore = stores.find(store => store.is_ecommerce_active) || stores[0];
            if (defaultStore) {
                // No llamar directamente a handleStoreChange para evitar múltiples renders
                const storeId = defaultStore.id;
                setCurrentStoreId(storeId);

                // Actualizar la URL con el parámetro
                router.get(route('stocks.index'), { store_id: storeId || '' }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                });
            }
        }
    }, [stores, currentStoreId]);

    // Obtener configuraciones para el diseño
    const { settings } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <div className="flex items-center gap-4">
                        <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Inventarios
                        </h2>

                        {/* Selector de Tienda en el header con react-select */}
                        {stores.length > 1 && (
                            <div className="flex items-center gap-2">
                                <div className="w-64">
                                    <Select
                                        value={selectedValue}
                                        onChange={handleStoreChange}
                                        options={storeOptions}
                                        components={animatedComponents}
                                        isSearchable={true}
                                        placeholder="Seleccionar tienda..."
                                        styles={customStyles}
                                        isClearable={false} // No permitir deseleccionar
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title="Inventarios" />

            <DivSection>
                <Suspense fallback={<Loader />}>
                    {filteredStock.length > 0 ? (
                        <DataTable
                            columns={StocksColumns}
                            data={filteredStock}
                        />
                    ) : (
                        <div className="flex justify-between text-start px-8 py-16">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-500">Añade tus productos</h2>
                                <p className="text-sm text-gray-500">Comience por abastecer su tienda con productos que les encantarán a sus clientes.</p>
                                {permission.some(perm => perm.name === 'admin.products.create') && (
                                    <Link className={buttonVariants({ variant: "default", size: "sm" })}
                                        href={route('products.create')}
                                    >
                                        <Plus className="size-4" />
                                        Añadir un producto
                                    </Link>
                                )}
                            </div>
                            <ShoppingBagIcon className="size-10" />
                        </div>
                    )}
                </Suspense>
            </DivSection>

        </AuthenticatedLayout>
    )
}