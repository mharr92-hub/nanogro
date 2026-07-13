"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageProvider";
import { localizedHref } from "@/lib/i18n-shared";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const { locale, messages } = useLanguage();

  return (
    <>
      <header className="theme-surface sticky top-0 z-50 border-b">
        <div className="container flex min-h-16 flex-wrap items-center justify-between gap-3 py-3 md:flex-nowrap md:gap-6 md:py-0">
          <Link href={localizedHref(locale, "/")} className="font-black text-primary">
            {messages.common.brand}
          </Link>
          <nav className="scroll-strip order-3 flex w-full gap-4 overflow-x-auto pb-1 text-sm font-semibold text-muted-foreground md:order-none md:w-auto md:items-center md:gap-5 md:overflow-visible md:pb-0">
            <Link href={localizedHref(locale, "/cases")}>{messages.navigation.cases}</Link>
            <Link href={localizedHref(locale, "/problems")}>{messages.navigation.problems}</Link>
            <Link href={localizedHref(locale, "/crops")}>{messages.navigation.crops}</Link>
            <Link href={localizedHref(locale, "/countries")}>{messages.navigation.countries}</Link>
            <Link href={localizedHref(locale, "/fichas")}>{messages.navigation.technicalSheets}</Link>
            <Link href={localizedHref(locale, "/diagnostico")}>{messages.navigation.diagnostic}</Link>
            <Link href={localizedHref(locale, "/admin")}>{messages.navigation.admin}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      {children}
      <footer className="theme-surface border-t py-8">
        <div className="container text-sm text-muted-foreground">
          {messages.common.product} MVP. {messages.common.footer}
        </div>
      </footer>
    </>
  );
}
