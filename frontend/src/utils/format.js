export const parseDecimalValue = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;

  const raw = String(value).trim();
  if (!raw) return fallback;

  // Soporta tres casos sin confundirlos:
  // 17.80  -> decimal técnico que llega desde Postgres/JSON
  // 17,80  -> decimal escrito como en Excel
  // 1.234,56 -> formato local con separador de miles
  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const formatDecimal = (value, digits = 3) => {
  const number = parseDecimalValue(value, 0);
  return number.toLocaleString("es-UY", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

export const parseDecimalInput = parseDecimalValue;
