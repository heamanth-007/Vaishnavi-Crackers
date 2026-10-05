/**
 * Formats a product code to standard format without '#' symbol,
 * padded with leading zeros (e.g., 1 -> '001', 12 -> '012', 120 -> '120').
 */
export const formatProductCode = (val: any, fallbackNum?: number): string => {
  const clean = val !== undefined && val !== null ? String(val).trim().replace(/^#+/, '') : '';
  if (clean && /^\d+$/.test(clean)) {
    return clean.padStart(3, '0');
  }
  if (clean) return clean;
  if (fallbackNum !== undefined && fallbackNum !== null && !isNaN(Number(fallbackNum))) {
    return String(fallbackNum).padStart(3, '0');
  }
  return '';
};
