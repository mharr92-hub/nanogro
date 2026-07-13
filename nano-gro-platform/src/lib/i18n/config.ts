export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es"; // primary market is LATAM/Spanish

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
