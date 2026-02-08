import React from 'react';

export default function CurrencyDisplay({ currency, amount, className = "" }) {
    // Definimos el símbolo primero porque DEBE aparecer siempre
    const symbol = currency?.symbol || '$';

    // 1. Si el amount NO existe (undefined, null o vacío), 
    // solo mostramos el símbolo de la moneda.
    if (amount === undefined || amount === null || amount === '') {
        return <span className={className}>{symbol}</span>;
    }

    const numericAmount = parseFloat(amount);

    // 2. Si no es un número válido, igual solo mostramos el símbolo
    if (isNaN(numericAmount)) {
        return <span className={className}>{symbol}</span>;
    }

    const formatAmount = (value) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    // 3. Si hay un monto válido (incluyendo 0), mostramos Símbolo + Monto
    return (
        <span className={className}>
            {symbol} {formatAmount(numericAmount)}
        </span>
    );
}