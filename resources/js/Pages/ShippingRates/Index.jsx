import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, lazy, Suspense, useEffect } from 'react'
import { toast } from 'sonner';
import { buttonVariants } from '@/Components/ui/button';
import { shippingRateColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useSelectOptions } from '@/hooks/useSelectOptions';
import { customStyles } from '@/hooks/custom-select';

const DataTable = lazy(() => import('@/Components/DataTable'));

export default function Index({ shippingRate, permission, stores, selectedStoreId }) {
    const [filteredShippingRates, setFilteredShippingRates] = useState(shippingRate);
    const [currentStoreId, setCurrentStoreId] = useState(selectedStoreId);
    const animatedComponents = makeAnimated();
    
    // Usar el hook para obtener las opciones de tiendas
    const { storeOptions } = useSelectOptions([], [], [], [], [], [], stores);
    
    // Encontrar la tienda con ecommerce activo por defecto
    const defaultEcommerceStore = stores.find(store => store.is_ecommerce_active);
    
    // Valor seleccionado actualmente
    const selectedValue = storeOptions.find(option => option.value === currentStoreId) || 
                         (defaultEcommerceStore ? storeOptions.find(option => option.value === defaultEcommerceStore.id) : null);
    
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
                // No llamar directamente a handleStoreChange para evitar múltiples renders
                const storeId = defaultStore.id;
                setCurrentStoreId(storeId);
                
                // Actualizar la URL con el parámetro
                router.get(route('shippingrate.index'), { store_id: storeId || '' }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                });
            }
        }
    }, [stores, currentStoreId]);

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <div className="flex items-center gap-4">
                        <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Tarifas de envío
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
                    
                    {permission.some(perm => perm.name === 'admin.shippingRate.create') && (
                        <Link className={buttonVariants({ variant: "default", size: "sm" })}
                            href={route('shippingrate.create')}
                        >
                            Añadir tarifa
                        </Link>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Tarifas de envío" />
            
            <Suspense fallback={<Loader />}>
                <DivSection>
                    {filteredShippingRates.length > 0 ? (
                        <DataTable
                            columns={shippingRateColumns}
                            data={filteredShippingRates}
                            routeEdit={'shippingrate.edit'}
                            routeDestroy={'shippingrate.destroy'}
                            editPermission={'admin.shippingrate.edit'}
                            deletePermission={'admin.shippingrate.delete'}
                            permissions={permission}
                        />
                    ) : (
                        <div className="flex justify-between text-start px-8 py-16">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-500">
                                    {currentStoreId ? 'No hay tarifas de envío para esta tienda' : 'Añade tarifas de envío'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {currentStoreId 
                                        ? 'No se encontraron tarifas de envío configuradas para esta tienda.'
                                        : 'Comience por configurar las tarifas de envío para sus tiendas.'
                                    }
                                </p>
                                {permission.some(perm => perm.name === 'admin.shippingRate.create') && (
                                    <Link className={buttonVariants({ variant: "default", size: "sm" })}
                                        href={route('shippingrate.create')}
                                    >
                                        Crear tarifa de envío
                                    </Link>
                                )}
                            </div>
                            <div className="text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                            </div>
                        </div>
                    )}
                </DivSection>
            </Suspense>

        </AuthenticatedLayout>
    )
}