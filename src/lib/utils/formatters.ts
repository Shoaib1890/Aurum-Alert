/**
 * Format numbers into standard Indian Rupee representation (e.g. ₹78,540)
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format change delta in INR with explicit + / - sign
 */
export function formatChangeDelta(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }

  const sign = amount > 0 ? '+' : '';
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return `${sign}${amount < 0 ? '-' : ''}${formatted}`;
}

/**
 * Format percentage change with explicit + / - sign
 */
export function formatPercentage(percent: number | null | undefined): string {
  if (percent === null || percent === undefined || isNaN(percent)) {
    return '—';
  }

  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

/**
 * Format date in Indian Standard Time (IST)
 */
export function formatISTDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Not available';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Format timestamp in IST with 12-hour AM/PM and seconds
 */
export function formatISTTimestamp(dateInput?: Date | string | null): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date) + ' IST';
}
