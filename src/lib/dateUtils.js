/**
 * AHH City — Date Formatter Utility
 * Formats YYYY-MM-DD or ISO date string into dd/mm/yy format.
 * Example: "2026-08-05" -> "05/08/26"
 */

export function formatDateDDMMYY(dateStr) {
  if (!dateStr) return 'N/A';
  if (typeof dateStr === 'string' && dateStr.includes('/')) return dateStr;

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}
