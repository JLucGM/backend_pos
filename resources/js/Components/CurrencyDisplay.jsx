import React from 'react';

export default function CurrencyDisplay({ currency, amount, className = "" }) {
    // Convertir amount a número y manejar casos edge
    const numericAmount = parseFloat(amount) || 0;
    
    if (!currency) {
        return <span className={className}>$ {numericAmount.toFixed(2)}</span>;
    }

    const formatAmount = (value) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    return (
        <span className={className}>
            {currency.symbol} {formatAmount(numericAmount)}
        </span>
    );
}