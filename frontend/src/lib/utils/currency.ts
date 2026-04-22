/**
 * Converts cents to US dollars
 * @param {number} cents - The amount in cents
 * @returns {string|number} The dollar amount as formatted string or number
 */
export const centsToDollars = (cents: number): string => {
  const dollars = cents / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
};
