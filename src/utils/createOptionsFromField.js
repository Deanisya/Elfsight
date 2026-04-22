export function createOptionsFromField(items, fieldName) {
  if (!Array.isArray(items) || !fieldName) {
    return [];
  }

  const uniqueValues = Array.from(
    new Set(items.map((item) => item?.[fieldName]).filter(Boolean))
  );

  return uniqueValues.map((value) => ({
    label: value,
    value
  }));
}
