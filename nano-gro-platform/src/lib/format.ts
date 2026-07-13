import type { Locale } from "./i18n/config";

// Pick the localized name from a taxonomy row that carries nameEn / nameEs.
export function localizedName(
  row: { nameEn: string; nameEs: string } | null | undefined,
  locale: Locale,
): string {
  if (!row) return "";
  return locale === "es" ? row.nameEs : row.nameEn;
}

export function localizedField<T extends Record<string, unknown>>(
  row: T | null | undefined,
  base: string,
  locale: Locale,
): string | null {
  if (!row) return null;
  const key = base + (locale === "es" ? "Es" : "En");
  const val = row[key];
  return typeof val === "string" ? val : null;
}

export function formatPercent(value: number | null | undefined, locale: Locale): string {
  if (value == null) return "—";
  return new Intl.NumberFormat(locale === "es" ? "es" : "en", {
    maximumFractionDigits: 1,
  }).format(value) + "%";
}

export function formatNumber(value: number | null | undefined, locale: Locale): string {
  if (value == null) return "—";
  return new Intl.NumberFormat(locale === "es" ? "es" : "en").format(value);
}

// Simple {placeholder} interpolation for dictionary strings.
export function t(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
