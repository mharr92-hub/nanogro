import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { localizedHref, type Locale, type Messages } from "@/lib/i18n-shared";
import { SITE_URL } from "@/lib/site";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumbs visibles + BreadcrumbList de schema.org en el mismo componente, para que
 * no puedan desincronizarse. La spec (seccion 14) pide las dos cosas.
 */
export function Breadcrumbs({
  crumbs,
  locale,
  messages
}: {
  crumbs: Crumb[];
  locale: Locale;
  messages: Messages;
}) {
  const site = SITE_URL;
  const all: Crumb[] = [{ label: messages.breadcrumbs.home, href: "/" }, ...crumbs];

  return (
    <>
      <nav aria-label={messages.breadcrumbs.home} className="text-caption text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((crumb, index) => (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {crumb.href && index < all.length - 1 ? (
                <Link className="hover:text-primary" href={localizedHref(locale, crumb.href)}>
                  {crumb.label}
                </Link>
              ) : (
                <span className={index === all.length - 1 ? "text-foreground" : undefined}>{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            ...(crumb.href ? { item: `${site}${localizedHref(locale, crumb.href)}` } : {})
          }))
        }}
      />
    </>
  );
}
