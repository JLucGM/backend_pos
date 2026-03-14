import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Input } from '@/Components/ui/input';
import { Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Label } from '@/Components/ui/label';
import Select from 'react-select'; // Usar react-select para multiselect
import { useMemo } from 'react';

export default function SettingsForm({ data, setting, setData, errors, currencies }) {

    const favicon = setting.media.find(mediaItem => mediaItem.collection_name === 'favicon');
    const logo = setting.media.find(mediaItem => mediaItem.collection_name === 'logo');
    const logofooter = setting.media.find(mediaItem => mediaItem.collection_name === 'logofooter');

    const handleCurrencyChange = (index, field, value) => {
        const updatedCurrencies = [...data.company_currencies];
        updatedCurrencies[index] = { ...updatedCurrencies[index], [field]: value };
        setData('company_currencies', updatedCurrencies);
    };

    // Opciones para el multiselect de monedas
    const currencyOptions = useMemo(() => {
        return currencies?.map(currency => ({
            value: currency.id,
            label: `${currency.name} (${currency.code})`,
            currency: currency
        })) || [];
    }, [currencies]);

    // Manejar cambio en multiselect
    const handleSelectedCurrenciesChange = (selectedOptions) => {
        const ids = selectedOptions ? selectedOptions.map(option => option.value) : [];
        // Asegurarse de que la moneda base no se pueda remover del array de IDs
        if (!ids.includes(data.currency_id)) {
            ids.push(data.currency_id);
        }
        setData('selected_currencies', ids);
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
        })
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Información General</h3>
                    <div>
                        <InputLabel htmlFor="name" value="Nombre del Comercio" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="currency_id" value="Moneda Base de la Tienda" />
                        <UISelect
                            value={data.currency_id?.toString() || ''}
                            onValueChange={(value) => {
                                const newId = parseInt(value);
                                setData('currency_id', newId);
                                // Asegurarse de que si se cambia la base, también esté en las habilitadas
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

                    <div className="pt-4 mt-4 border-t border-dashed">
                        <h3 className="text-lg font-medium text-purple-600 dark:text-purple-400 mb-4">Configuración de Dominio</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <InputLabel value="Subdominio actual" />
                                <div className="mt-1 flex items-center p-2 bg-gray-50 dark:bg-gray-800 border rounded-md text-gray-600 dark:text-gray-400 text-sm italic">
                                    {data.subdomain}.audaz.pos.test
                                </div>
                                <p className="mt-1 text-[10px] text-gray-400">
                                    Este es tu subdominio asignado por defecto.
                                </p>
                            </div>

                            <div>
                                <InputLabel htmlFor="domain" value="Dominio Personalizado" />
                                <TextInput
                                    id="domain"
                                    type="text"
                                    placeholder="ejemplo.com"
                                    value={data.domain || ''}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('domain', e.target.value)}
                                />
                                <p className="mt-1 text-[10px] text-gray-500">
                                    Si tienes un dominio propio, ingrésalo aquí para apuntar tu tienda.
                                </p>
                                <InputError message={errors.domain} className="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">Tasas de Cambio Manual</h3>
                    <div className="space-y-4 border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                        {data.company_currencies?.filter(cc => cc.currency_id !== data.currency_id && data.selected_currencies.includes(cc.currency_id)).length === 0 && (
                            <p className="text-sm text-gray-500">No hay monedas secundarias habilitadas.</p>
                        )}
                        
                        {data.company_currencies?.map((cc, index) => {
                            // No mostrar la tasa para la moneda que ya es base
                            if (cc.currency_id === data.currency_id) return null;
                            
                            // No mostrar si no está en la lista de seleccionadas (esto filtra visualmente antes de guardar)
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t pt-6">
                <div>
                    <InputLabel htmlFor="logo" value="Logo Principal" />
                    <Input
                        id="logo"
                        type="file"
                        className="mt-1"
                        onChange={(e) => setData('logo', Array.from(e.target.files))}
                    />
                    {logo && <img src={logo.original_url} className="mt-2 w-20 h-20 object-contain border rounded" />}
                </div>

                <div>
                    <InputLabel htmlFor="favicon" value="Favicon" />
                    <Input
                        id="favicon"
                        type="file"
                        className="mt-1"
                        onChange={(e) => setData('favicon', Array.from(e.target.files))}
                    />
                    {favicon && <img src={favicon.original_url} className="mt-2 w-8 h-8 object-contain border rounded" />}
                </div>

                <div>
                    <InputLabel htmlFor="logofooter" value="Logo Footer" />
                    <Input
                        id="logofooter"
                        type="file"
                        className="mt-1"
                        onChange={(e) => setData('logofooter', Array.from(e.target.files))}
                    />
                    {logofooter && <img src={logofooter.original_url} className="mt-2 w-20 h-20 object-contain border rounded" />}
                </div>
            </div>
        </>
    );
}