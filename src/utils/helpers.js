/**
 * Utility Helper Functions
 */

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 * @returns {string} Today's date key
 */
export const todayKey = () => new Date().toISOString().slice(0, 10);

/**
 * Format date to long format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const fmtDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/**
 * Format date to short format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const fmtShort = (date) => new Date(date).toLocaleDateString();

/**
 * Format time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time string
 */
export const fmtTime = (date) => new Date(date).toLocaleTimeString();

/**
 * Check if a date is within specified days from now
 * @param {string} iso - ISO date string
 * @param {number} days - Number of days
 * @returns {boolean} True if within days range
 */
export const withinDays = (iso, days) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = (d - now) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
};

