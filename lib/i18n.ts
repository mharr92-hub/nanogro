import { cookies, headers } from "next/headers";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import { isLocale, localeCookie, localeFromAcceptLanguage, type Locale, type Messages } from "@/lib/i18n-shared";
export type { Locale, Messages } from "@/lib/i18n-shared";
export { formatMessage, internalPathFromLocalized, isLocale, localeCookie, localeFromAcceptLanguage, localizedHref, locales } from "@/lib/i18n-shared";

const dictionaries: Record<Locale, Messages> = { en, es };

export async function getLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-nano-gro-locale");
  if (isLocale(headerLocale)) return headerLocale;
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookie)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;
  return localeFromAcceptLanguage(requestHeaders.get("accept-language"));
}

export async function getMessages(locale?: Locale) {
  return dictionaries[locale ?? await getLocale()];
}
