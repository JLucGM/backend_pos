import DivSection from "./ui/div-section";

// SummaryCard.jsx
export default function SummaryCard({ label, value, prefix = '', className = '' }) {
  return (
    <DivSection className={` ${className}`}>
      <span className="block font-medium text-2xl text-gray-900 dark:text-white">
        {prefix}{Number(value)}
      </span>
      <p className="text-gray-500 dark:text-gray-400">{label}</p>
    </DivSection>
  );
}
