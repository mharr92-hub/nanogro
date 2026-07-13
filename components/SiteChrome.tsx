"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageProvider";
import { internalPathFromLocalized, localizedHref } from "@/lib/i18n-shared";

/**
 * Cabecera y pie.
 *
 * Antes la navegacion era una tira horizontal de siete enlaces con scroll y la barra
 * oculta: en un movil, la mitad de las secciones (incluida /admin) se salian de pantalla
 * sin ninguna senal de que existieran. Ahora en movil hay un menu desplegable real y una
 * sola llamada a la accion visible, la que importa: el diagnostico gratuito.
 *
 * /admin sale de la navegacion publica. Un agricultor no tiene nada que hacer ahi.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const { locale, messages } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // El menu movil se cierra al navegar. Si no, queda abierto sobre la pagina nueva.
  useEffect(() => setOpen(false), [pathname]);

  const { internalPath } = internalPathFromLocalized(pathname ?? "/");

  const links = [
    { href: "/problems", label: messages.nav.problems },
    { href: "/cases", label: messages.nav.cases },
    { href: "/crops", label: messages.nav.crops },
    { href: "/countries", label: messages.nav.countries },
    { href: "/before-after", label: messages.nav.beforeAfter },
    { href: "/roi-calculator", label: messages.nav.roiCalculator },
    // El diagnostico es ademas el boton primario, pero tambien tiene que estar en el menu:
    // un usuario que busca la seccion con la vista no deberia depender de reconocer el CTA.
    { href: "/diagnostico", label: messages.nav.diagnostic },
    { href: "/fichas", label: messages.nav.sheets }
  ];

  const isActive = (href: string) => internalPath === href || internalPath.startsWith(`${href}/`);

  return (
    <>
      <header className="theme-surface sticky top-0 z-50 border-b">
        <div className="container flex min-h-16 items-center justify-between gap-4">
          <Link className="font-display text-h4 text-primary" href={localizedHref(locale, "/")}>
            {messages.common.brand}
          </Link>

          <nav aria-label={messages.nav.menu} className="hidden items-center gap-5 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={localizedHref(locale, link.href)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={[
                  "text-body font-medium",
                  isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link className="btn btn-primary hidden sm:inline-flex" href={localizedHref(locale, "/diagnostico")}>
              {messages.nav.primaryCta}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="btn btn-secondary lg:hidden"
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              {messages.nav.menu}
            </button>
          </div>
        </div>

        {open ? (
          <nav id="mobile-nav" aria-label={messages.nav.menu} className="border-t border-border lg:hidden">
            <div className="container grid gap-1 py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={localizedHref(locale, link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={[
                    "flex min-h-[44px] items-center rounded px-2 text-body",
                    isActive(link.href) ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
              <Link className="btn btn-primary mt-2 sm:hidden" href={localizedHref(locale, "/diagnostico")}>
                {messages.nav.primaryCta}
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      <main id="main">{children}</main>

      <footer className="theme-surface border-t py-8">
        <div className="container grid gap-4">
          <nav aria-label={messages.nav.menu} className="flex flex-wrap gap-x-5 gap-y-2 text-body">
            {links.map((link) => (
              <Link
                key={link.href}
                className="text-muted-foreground hover:text-foreground"
                href={localizedHref(locale, link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="max-w-prose text-caption leading-5 text-muted-foreground">
            {messages.common.product}. {messages.common.footer}
          </p>
        </div>
      </footer>
    </>
  );
}
