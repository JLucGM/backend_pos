import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import Select from 'react-select'; 
import { useMemo } from 'react';

export default function CurrencyForm({ data, setData, errors, currencies }) {

    const handleCurrencyChange = (index, field, value) => {
        const updatedCurrencies = [...data.company_currencies];
        updatedCurrencies[index] = { ...updatedCurrencies[index], [field]: value };
        setData('company_currencies', updatedCurrencies);
    };

    // Opciones para el multiselect de monedas con lógica de "fija" para la base
    const currencyOptions = useMemo(() => {
        return currencies?.map(currency => ({
            value: currency.id,
            label: `${currency.name} (${currency.code})`,
            currency: currency,
            isFixed: currency.id === data.currency_id // La moneda base es fija
        })) || [];
    }, [currencies, data.currency_id]);

    const handleSelectedCurrenciesChange = (selectedOptions, { action, removedValue }) => {
        switch (action) {
            case 'remove-value':
            case 'pop-value':
                if (removedValue && removedValue.isFixed) {
                    return; // No permitir eliminar la moneda base
                }
                break;
            case 'clear':
                // No permitir limpiar si hay valores fijos
                return;
        }

        const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        
        // Asegurarse de que la moneda base esté siempre incluida (doble seguridad)
        if (!selectedIds.includes(data.currency_id)) {
            selectedIds.push(data.currency_id);
        }

        // 1. Actualizar los IDs seleccionados y company_currencies
        setData(prevData => {
            const currentCompanyCurrencies = [...prevData.company_currencies];
            
            // Filtrar las que se mantienen
            const filteredCurrencies = currentCompanyCurrencies.filter(cc => 
                selectedIds.includes(cc.currency_id)
            );

            // Añadir las nuevas que no existen
            selectedIds.forEach(id => {
                const exists = filteredCurrencies.find(cc => cc.currency_id === id);
                if (!exists) {
                    const currencyInfo = currencies.find(c => c.id === id);
                    filteredCurrencies.push({
                        id: null,
                        currency_id: id,
                        exchange_rate: 1.0,
                        currency: currencyInfo
                    });
                }
            });

            return {
                ...prevData,
                selected_currencies: selectedIds,
                company_currencies: filteredCurrencies
            };
        });
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '0.5rem',
            borderColor: 'rgb(209 213 219)',
            '&:hover': { borderColor: 'rgb(156 163 175)' },
            backgroundColor: 'transparent',
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 50,
        }),
        multiValue: (base, state) => {
            return state.data.isFixed ? { ...base, backgroundColor: 'rgb(243 244 246)' } : base;
        },
        multiValueLabel: (base, state) => {
            return state.data.isFixed
                ? { ...base, fontWeight: 'bold', color: 'rgb(55 65 81)', paddingRight: 6 }
                : base;
        },
        multiValueRemove: (base, state) => {
            return state.data.isFixed ? { ...base, display: 'none' } : base; // Ocultar "x" en la base
        },
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Configuración de Moneda</h3>
                <div>
                    <InputLabel htmlFor="currency_id" value="Moneda Base de la Tienda" />
                    <UISelect
                        value={data.currency_id?.toString() || ''}
                        onValueChange={(value) => {
                            const newId = parseInt(value);
                            setData('currency_id', newId);
                            if (!data.selected_currencies.includes(newId)) {
                                setData('selected_currencies', [...data.selected_currencies, newId]);
                            }
                        }}
                    >
                        <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Selecciona la moneda principal" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies?.map((currency) => (
                                <SelectItem key={currency.id} value={currency.id.toString()}>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{currency.symbol}</span>
                                        <span>{currency.name}</span>
                                        <span className="text-sm text-gray-500">({currency.code})</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </UISelect>
                    <p className="mt-1 text-xs text-gray-500 italic">
                        Esta es la moneda en la que se definen los precios de tus productos.
                    </p>
                    <InputError message={errors.currency_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="Otras Monedas Habilitadas" />
                    <Select
                        isMulti
                        options={currencyOptions}
                        value={currencyOptions.filter(opt => data.selected_currencies.includes(opt.value))}
                        onChange={handleSelectedCurrenciesChange}
                        placeholder="Habilitar más monedas..."
                        className="mt-1"
                        styles={customStyles}
                        isClearable={false}
                    />
                    <p className="mt-1 text-[10px] text-gray-500">
                        Selecciona las monedas adicionales que quieres ofrecer a tus clientes.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">Tasas de Cambio Manual</h3>
                <div className="space-y-4 border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                    {data.company_currencies?.filter(cc => cc.currency_id !== data.currency_id && data.selected_currencies.includes(cc.currency_id)).length === 0 && (
                        <p className="text-sm text-gray-500">No hay monedas secundarias habilitadas.</p>
                    )}
                    
                    {data.company_currencies?.map((cc, index) => {
                        if (cc.currency_id === data.currency_id) return null;
                        if (!data.selected_currencies.includes(cc.currency_id)) return null;

                        return (
                            <div key={cc.id} className="p-3 border-b last:border-0">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-sm">{cc.currency.name} ({cc.currency.code})</span>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <InputLabel value="Tasa de Cambio" className="text-xs" />
                                        <TextInput
                                            type="number"
                                            step="0.00000001"
                                            value={cc.exchange_rate}
                                            onChange={(e) => handleCurrencyChange(index, 'exchange_rate', e.target.value)}
                                            className="mt-1 block w-full text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
