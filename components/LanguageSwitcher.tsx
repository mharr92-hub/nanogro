"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { internalPathFromLocalized, localizedHref, type Locale } from "@/lib/i18n-shared";
import { useLanguage } from "@/components/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, messages, setLocale } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const nextLocale: Locale = locale === "es" ? "en" : "es";

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    const { internalPath } = internalPathFromLocalized(pathname);
    const query = searchParams.toString();
    router.push(`${localizedHref(nextLocale, internalPath)}${query ? `?${query}` : ""}`);
  };

  return (
    <button
      aria-label={nextLocale === "en" ? messages.common.english : messages.common.spanish}
      className="rounded px-2 py-1 text-xs font-black text-muted-foreground hover:bg-muted hover:text-primary"
      type="button"
      onClick={() => changeLocale(nextLocale)}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
