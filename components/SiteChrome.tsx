"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
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

  /*
   * El diagnostico NO va en esta lista: ya es el boton primario verde de la derecha.
   * Tenerlo en los dos sitios lo duplicaba en pantalla y, al no caber, partia las etiquetas
   * en dos lineas ("Antes / Despues", "Calculadora de ROI"), que era lo que ensuciaba la
   * cabecera. Menos enlaces y `whitespace-nowrap`: cada seccion ocupa una sola linea.
   */
  const links = [
    { href: "/problems", label: messages.nav.problems },
    { href: "/cases", label: messages.nav.cases },
    { href: "/crops", label: messages.nav.crops },
    { href: "/countries", label: messages.nav.countries },
    { href: "/before-after", label: messages.nav.beforeAfter },
    { href: "/roi-calculator", label: messages.nav.roiCalculator },
    { href: "/fichas", label: messages.nav.sheets },
    { href: "/equipo", label: messages.nav.team }
  ];

  const isActive = (href: string) => internalPath === href || internalPath.startsWith(`${href}/`);

  return (
    <>
      {/*
        La cabecera es de ancho completo, no del contenedor de 1180px: con nueve secciones,
        el logotipo y el CTA, el contenido no cabia y el selector de idioma y el boton de
        tema se salian de la pantalla. Ahora la barra usa todo el ancho disponible, la
        navegacion puede encoger (`min-w-0`) y el bloque de la derecha nunca se comprime
        (`flex-none`): lo ultimo que se sacrifica es el acceso al idioma y al tema.
      */}
      <header className="theme-surface sticky top-0 z-50 border-b">
        <div className="flex min-h-16 w-full items-center gap-4 px-4 md:px-6">
          <Link className="flex-none" href={localizedHref(locale, "/")} aria-label={messages.common.brand}>
            <Logo />
          </Link>

          <nav
            aria-label={messages.nav.menu}
            className="scroll-strip hidden min-w-0 flex-1 items-center gap-5 overflow-x-auto xl:flex"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={localizedHref(locale, link.href)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={[
                  "whitespace-nowrap text-caption font-medium transition-colors",
                  isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex flex-none items-center gap-2">
            <Link
              className="btn btn-primary hidden whitespace-nowrap px-3 text-caption sm:inline-flex"
              href={localizedHref(locale, "/diagnostico")}
            >
              {messages.nav.primaryCta}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="btn btn-secondary xl:hidden"
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
          <nav id="mobile-nav" aria-label={messages.nav.menu} className="border-t border-border xl:hidden">
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
