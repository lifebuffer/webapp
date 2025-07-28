/**
 * Get a date in YYYY-MM-DD format using local timezone
 * @param date - The date to format (defaults to today)
 * @returns Date string in YYYY-MM-DD format
 */
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format using local timezone
 * @returns Today's date string in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return getLocalDateString(new Date());
};