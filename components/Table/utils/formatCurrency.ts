export const formatCurrency = (amount?: number): string => {
  if (!amount || typeof amount !== "number") return "-";
  return `Q${amount.toFixed(2)}`;
};
