"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n/config";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  // Swap the leading /{locale} segment, keep the rest of the path.
  const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "";
  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          className={l === current ? "rounded bg-brand-light px-2 py-1 text-brand-dark" : "px-2 py-1 text-muted hover:text-foreground"}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
