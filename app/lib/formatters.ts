import dayjs from "dayjs";

export const formatCurrency = (
  value: string | number | null,
  decimals: 0 | 2 = 2
): string | undefined => {
  if (value === "" || value === null || value === undefined) return;
  const decimalPlaces = decimals ? decimals : Number(value) % 1 !== 0 ? 2 : 0;
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(value));
  return formattedValue;
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat().format(number);
};

export const convertKmToMiles = (distance: number): number => {
  const ratio = 0.62;
  return distance * ratio;
};

export const convertMilesToKm = (distance: number): number => {
  const ratio = 1.61;
  return distance * ratio;
};

export function formatDate(date: Date, template?: string) {
  return dayjs(date).format(template);
}

export function formatAsDateWithTime(date: Date | string | null): string {
  return dayjs(date).format("M/D/YYYY h:mma");
}

export function formatAsYear(date: Date | string | null): string {
  return dayjs(date).format("YYYY");
}
