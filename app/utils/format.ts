export const formatCompact = (value: number, usdPrice: number | null = null) =>
    Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(usdPrice ? value * usdPrice / 1e9 : value / 1e9);
  
  export const formatPercent = (value: number) =>
    `${(value * 100).toFixed(2)}%`;
  
  export const formatPrice = (price: number, usdPrice: number | null = null) => {
    return usdPrice
      ? `$${(price * usdPrice / 1e9).toFixed(6)}`
      : `T${(price / 1e9).toFixed(6)}`;
  };
  