/**
 * Calculates day change amount and percentage between current price and previous trading close
 */
export function calculateDayChange(
  currentPrice: number | null,
  previousClose: number | null
): {
  changeAmount: number | null;
  changePercentage: number | null;
  isPositive: boolean;
  isNeutral: boolean;
} {
  if (
    currentPrice === null ||
    previousClose === null ||
    previousClose === 0
  ) {
    return {
      changeAmount: null,
      changePercentage: null,
      isPositive: false,
      isNeutral: true,
    };
  }

  const changeAmount = currentPrice - previousClose;
  const changePercentage = (changeAmount / previousClose) * 100;

  return {
    changeAmount: Math.round(changeAmount * 100) / 100,
    changePercentage: Math.round(changePercentage * 100) / 100,
    isPositive: changeAmount > 0,
    isNeutral: changeAmount === 0,
  };
}
