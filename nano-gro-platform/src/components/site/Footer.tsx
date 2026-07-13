import Link from "next/link";
import { Container } from "../ui";
import { href } from "@/lib/nav";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = 2026;
  return (
    <footer className="mt-20 border-t border-border bg-brand-light/40">
      <Container className="flex flex-col gap-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-bold text-brand-dark">Nano-Gro</div>
          <p className="mt-1 max-w-sm">{dict.footer.tagline}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href={href(locale, "/case-studies")} className="hover:text-foreground">{dict.nav.cases}</Link>
          <Link href={href(locale, "/diagnostic")} className="hover:text-foreground">{dict.nav.diagnostic}</Link>
          <Link href={href(locale, "/distributors")} className="hover:text-foreground">{dict.nav.distributors}</Link>
          <Link href={href(locale, "/contact")} className="hover:text-foreground">{dict.nav.contact}</Link>
        </nav>
        <div>© {year} Nano-Gro. {dict.footer.rights}</div>
      </Container>
    </footer>
  );
}
