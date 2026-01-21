import React from 'react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';

/**
 * Componente de ejemplo que muestra diferentes usos del CurrencyDisplay
 */
export default function CurrencyExamples({ settings }) {
    // Ejemplos de monedas
    const currencies = [
        { id: 1, code: 'USD', name: 'US Dollar', symbol: '$' },
        { id: 2, code: 'EUR', name: 'Euro', symbol: '€' },
        { id: 3, code: 'MXN', name: 'Mexican Peso', symbol: '$' },
        { id: 4, code: 'GBP', name: 'British Pound', symbol: '£' },
    ];

    const amounts = [100, 1250.50, 0, 99.99];

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Ejemplos de CurrencyDisplay</h2>
            
            {/* Ejemplo 1: Con moneda de configuración */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Con moneda de configuración actual</h3>
                <div className="grid grid-cols-2 gap-4">
                    {amounts.map((amount, index) => (
                        <div key={index} className="p-3 border rounded">
                            <span className="text-sm text-gray-600">Monto: {amount}</span>
                            <div className="text-lg font-medium">
                                <CurrencyDisplay currency={settings?.currency} amount={amount} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ejemplo 2: Con diferentes monedas */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Con diferentes monedas</h3>
                <div className="grid grid-cols-2 gap-4">
                    {currencies.map((currency) => (
                        <div key={currency.id} className="p-3 border rounded">
                            <span className="text-sm text-gray-600">{currency.name} ({currency.code})</span>
                            <div className="text-lg font-medium">
                                <CurrencyDisplay currency={currency} amount={1250.50} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ejemplo 3: Sin moneda (fallback) */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Sin moneda (fallback a USD)</h3>
                <div className="p-3 border rounded">
                    <span className="text-sm text-gray-600">Cuando no hay moneda definida</span>
                    <div className="text-lg font-medium">
                        <CurrencyDisplay currency={null} amount={999.99} />
                    </div>
                </div>
            </div>

            {/* Ejemplo 4: Con clases CSS personalizadas */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Con estilos personalizados</h3>
                <div className="space-y-2">
                    <CurrencyDisplay 
                        currency={settings?.currency} 
                        amount={1500} 
                        className="text-2xl font-bold text-green-600" 
                    />
                    <CurrencyDisplay 
                        currency={settings?.currency} 
                        amount={250.75} 
                        className="text-sm text-gray-500" 
                    />
                    <CurrencyDisplay 
                        currency={settings?.currency} 
                        amount={99.99} 
                        className="text-lg font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded" 
                    />
                </div>
            </div>

            {/* Ejemplo 5: En contexto de tabla */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">En contexto de tabla</h3>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-2 text-left">Producto</th>
                            <th className="border border-gray-300 p-2 text-right">Precio</th>
                            <th className="border border-gray-300 p-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 p-2">Producto A</td>
                            <td className="border border-gray-300 p-2 text-right">
                                <CurrencyDisplay currency={settings?.currency} amount={25.99} />
                            </td>
                            <td className="border border-gray-300 p-2 text-right font-bold">
                                <CurrencyDisplay currency={settings?.currency} amount={77.97} />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Producto B</td>
                            <td className="border border-gray-300 p-2 text-right">
                                <CurrencyDisplay currency={settings?.currency} amount={15.50} />
                            </td>
                            <td className="border border-gray-300 p-2 text-right font-bold">
                                <CurrencyDisplay currency={settings?.currency} amount={31.00} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}