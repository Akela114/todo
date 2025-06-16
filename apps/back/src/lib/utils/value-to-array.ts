export const valueToArray = (value: unknown) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};
