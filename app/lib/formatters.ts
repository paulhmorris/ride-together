import dayjs from "dayjs";

export const formatCurrency = (
  value: string | number | null,
  decimals: 0 | 2 = 2
) => {
  if (value === "" || value === null || value === undefined) return;
  const decimalPlaces = decimals ? decimals : +value % 1 !== 0 ? 2 : 0;
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(+value);
  return formattedValue;
};

export function formatAsDateWithTime(date: Date | string | null) {
  if (!date) return date;
  return dayjs(date).format("M/D/YYYY h:mma");
}

export function formatAsYear(date: Date | string | null) {
  if (!date) return date;
  return dayjs(date).format("YYYY");
}
