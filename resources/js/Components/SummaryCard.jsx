import DivSection from "./ui/div-section";

// SummaryCard.jsx
export default function SummaryCard({ label, value, prefix = '', className = '' }) {
  // Si value es un componente React (como CurrencyDisplay), lo renderizamos directamente
  const displayValue = typeof value === 'object' && value !== null ? value : `${prefix}${Number(value) || 0}`;
  
  return (
    <DivSection className={` ${className}`}>
      <span className="block font-medium text-2xl text-gray-900 dark:text-white">
        {displayValue}
      </span>
      <p className="text-gray-500 dark:text-gray-400">{label}</p>
    </DivSection>
  );
}
