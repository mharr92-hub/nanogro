import Link from "next/link";
import { Container, CtaLink } from "../ui";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { href } from "@/lib/nav";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: href(locale, "/case-studies"), label: dict.nav.cases },
    { href: href(locale, "/results"), label: dict.nav.results },
    { href: href(locale, "/distributors"), label: dict.nav.distributors },
    { href: href(locale, "/contact"), label: dict.nav.contact },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href={href(locale)} className="font-bold text-brand-dark">
          Nano-Gro
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitcher current={locale} />
          <CtaLink href={href(locale, "/diagnostic")}>{dict.nav.diagnostic}</CtaLink>
        </div>
      </Container>
    </header>
  );
}
