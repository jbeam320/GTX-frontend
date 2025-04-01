export const formatCompact = (value: number, usdPrice: number | null = null) =>
  Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(usdPrice ? (value * usdPrice) / 1e9 : value / 1e9);

// Format numbers with commas and fixed decimals
export const formatCompactSimple = (num: number, usdPrice: number | null = null) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdPrice ? num * usdPrice : num);
};

export const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

export const formatPrice = (price: number, usdPrice: number | null = null) => {
  return usdPrice
    ? `$${((price * usdPrice) / 1e9).toFixed(6)}`
    : `T${(price / 1e9).toFixed(6)}`;
};
