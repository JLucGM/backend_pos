import { usePage } from "@inertiajs/react";

/**
 * Componente universal para mostrar precios en el Storefront del SaaS.
 * Muestra el símbolo, el monto convertido y el código de la moneda.
 * 
 * @param {number|string} amount - El monto en la moneda base del comercio.
 * @param {string} className - Clases adicionales de Tailwind.
 */
export default function FormattedPrice({ amount, className = "" }) {
  const { currency } = usePage().props;

  const baseAmount = parseFloat(amount || 0);

  // Fallback si no hay datos de moneda
  if (!currency || !currency.selected) {
    return (
        <span className={className}>
            $ {baseAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD
        </span>
    );
  }

  const { symbol, code, exchange_rate } = currency.selected;
  const convertedAmount = baseAmount * (exchange_rate || 1.0);

  return (
    <span className={className}>
      {symbol} {convertedAmount.toLocaleString('es-ES', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })} <small className="ml-1 opacity-80 font-normal">{code}</small>
    </span>
  );
}
