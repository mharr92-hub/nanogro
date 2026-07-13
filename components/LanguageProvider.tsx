"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import type { Locale, Messages } from "@/lib/i18n-shared";

const storageKey = "nano-gro-language";
const cookieName = "nano_gro_lang";
const dictionaries: Record<Locale, Messages> = { en, es };

const LanguageContext = createContext<{
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
}>({
  locale: "es",
  messages: {} as Messages,
  setLocale: () => undefined
});

export function LanguageProvider({
  initialLocale,
  messages,
  children
}: {
  initialLocale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "en" || stored === "es") {
      setLocaleState(stored);
      document.documentElement.lang = stored;
      document.cookie = `${cookieName}=${stored}; path=/; max-age=31536000; samesite=lax`;
      return;
    }
    setLocaleState(initialLocale);
    document.documentElement.lang = initialLocale;
    window.localStorage.setItem(storageKey, initialLocale);
    document.cookie = `${cookieName}=${initialLocale}; path=/; max-age=31536000; samesite=lax`;
  }, [initialLocale]);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    document.documentElement.lang = nextLocale;
    window.localStorage.setItem(storageKey, nextLocale);
    document.cookie = `${cookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
  };

  const activeMessages = dictionaries[locale] ?? messages;
  const value = useMemo(() => ({ locale, messages: activeMessages, setLocale }), [activeMessages, locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
