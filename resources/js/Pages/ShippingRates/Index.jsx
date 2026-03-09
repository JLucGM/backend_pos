import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, lazy, Suspense, useEffect, useMemo } from 'react'
import { buttonVariants } from '@/Components/ui/button';
import { shippingRateColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useSelectOptions } from '@/hooks/useSelectOptions';
import { customStyles } from '@/hooks/custom-select';

import { usePermission } from '@/hooks/usePermission';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ shippingRate, stores, selectedStoreId }) {
    const { can } = usePermission();
    const [filteredShippingRates, setFilteredShippingRates] = useState(shippingRate);
    const [currentStoreId, setCurrentStoreId] = useState(selectedStoreId);
    const animatedComponents = makeAnimated();

    // Usar el hook para obtener las opciones de tiendas
    const { storeOptions } = useSelectOptions([], [], [], [], [], [], stores);

    // Encontrar la tienda con ecommerce activo por defecto
    const defaultEcommerceStore = stores.find(store => store.is_ecommerce_active);

    // Valor seleccionado actualmente
    const selectedValue = useMemo(() => {
        return storeOptions.find(option => option.value === currentStoreId) ||
            (defaultEcommerceStore ? storeOptions.find(option => option.value === defaultEcommerceStore.id) : null);
    }, [storeOptions, currentStoreId, defaultEcommerceStore]);

    // Filtrar tarifas cuando cambie la tienda seleccionada
    useEffect(() => {
        if (currentStoreId) {
            const filtered = shippingRate.filter(item => item.store_id == currentStoreId);
            setFilteredShippingRates(filtered);
        } else {
            // Si no hay store seleccionada, muestra todas
            setFilteredShippingRates(shippingRate);
        }
    }, [currentStoreId, shippingRate]);

    const handleStoreChange = (selectedOption) => {
        const storeId = selectedOption ? selectedOption.value : null;
        setCurrentStoreId(storeId);

        // Actualizar la URL con el parámetro
        router.get(route('shippingrate.index'), { store_id: storeId || '' }, {
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
                const storeId = defaultStore.id;
                setCurrentStoreId(storeId);

                router.get(route('shippingrate.index'), { store_id: storeId || '' }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                });
            }
        }
    }, [stores, currentStoreId]);

    return (
        <SettingsLayout>
            <Head className="capitalize" title="Tarifas de envío" />

            <Suspense fallback={<Loader />}>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                Tarifas de Envío
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            {stores.length > 1 && (
                                <div className="w-64">
                                    <Select
                                        value={selectedValue}
                                        onChange={handleStoreChange}
                                        options={storeOptions}
                                        components={animatedComponents}
                                        isSearchable={true}
                                        placeholder="Seleccionar tienda..."
                                        styles={customStyles}
                                        isClearable={false}
                                    />
                                </div>
                            )}
                            {can('admin.shippingRate.create') && (
                                <Link className={buttonVariants({ variant: "default", size: "sm" })}
                                    href={route('shippingrate.create')}
                                >
                                    Añadir tarifa
                                </Link>
                            )}
                        </div>
                    </div>

                    <DivSection>
                        {filteredShippingRates.length > 0 ? (
                            <DataTable
                                columns={shippingRateColumns}
                                data={shippingRate}
                                routeEdit={'shippingRates.edit'}
                                routeDestroy={'shippingRates.destroy'}
                                editPermission={'admin.shippingRate.edit'}
                                deletePermission={'admin.shippingRate.delete'}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-8 text-center space-y-4">
                                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {currentStoreId ? 'No hay tarifas de envío para esta tienda' : 'Añade tarifas de envío'}
                                    </h3>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                                        {currentStoreId
                                            ? 'No se encontraron tarifas de envío configuradas para esta tienda.'
                                            : 'Comience por configurar las tarifas de envío para sus tiendas.'
                                        }
                                    </p>
                                </div>
                                {can('admin.shippingRate.create') && (
                                    <Link className={buttonVariants({ variant: "default", size: "sm" })}
                                        href={route('shippingrate.create')}
                                    >
                                        Crear tarifa de envío
                                    </Link>
                                )}
                            </div>
                        )}
                    </DivSection>
                </div>
            </Suspense>
        </SettingsLayout>
    )
}