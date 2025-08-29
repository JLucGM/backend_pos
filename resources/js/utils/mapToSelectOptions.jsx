
export function mapToSelectOptions(items, valueKey, labelKey) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    value: item[valueKey],
    label: typeof labelKey === 'function' ? labelKey(item) : item[labelKey],
  }));
}