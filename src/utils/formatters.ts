export const formatCurrency = (value: number, decimals: number = 2): string => {
  if (value === 0) return "$0.00";

  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(decimals)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(decimals)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(decimals)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(decimals)}K`;
  } else if (value >= 1) {
    return `$${value.toFixed(decimals)}`;
  } else {
    // For values less than 1, show more decimal places
    const decimalPlaces = Math.max(
      2,
      Math.abs(Math.floor(Math.log10(value))) + 2
    );
    return `$${value.toFixed(Math.min(decimalPlaces, 8))}`;
  }
};

export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number, decimals: number = 0): string => {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(decimals)}T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  } else {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getChangeColor = (value: number): string => {
  return value >= 0 ? "text-green-600" : "text-red-600";
};

export const getChangeBgColor = (value: number): string => {
  return value >= 0 ? "bg-green-100" : "bg-red-100";
};
