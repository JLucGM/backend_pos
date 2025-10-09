export function mapToSelectOptions(items, valueKey, labelKey, noneOption = false) {
  if (!Array.isArray(items)) return [];

  // Generar las opciones mapeadas de los items
  const mappedOptions = items.map(item => ({
    value: item[valueKey],
    label: typeof labelKey === 'function' ? labelKey(item) : item[labelKey],
  }));

  // Si noneOption es true, usa el default; si es un objeto, úsalo; si no, ignora
  let finalOptions = mappedOptions;
  if (noneOption) {
    const noneObj = typeof noneOption === 'object' 
      ? noneOption 
      : { value: null, label: 'Ninguno' }; // Default label
    finalOptions = [noneObj, ...mappedOptions];
  }

  return finalOptions;
}
