import Link from "next/link";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { EmptyState, EvidenceSheet, MetricStat } from "@/components/ui";
import { formatAggregate, getAggregateResults } from "@/lib/aggregate";
import { localizedHref, type Locale, type Messages } from "@/lib/i18n-shared";
import type { CaseStudy } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

/**
 * Paginas de SEO programatico de dos niveles (spec, seccion 14):
 * /crops/[crop]/[problem] y /countries/[country]/[crop].
 *
 * Es la interseccion de dos criterios, que es exactamente como busca un agricultor
 * ("cacao con baja produccion", "maiz en Guatemala"). Si el cruce no tiene casos, la
 * pagina lo dice y ofrece la evidencia de cada criterio por separado, en vez de dejar
 * una grilla en blanco.
 */
export function ComboListing({
  title,
  description,
  crumbs,
  canonicalPath,
  cases,
  fallbackLinks,
  locale,
  messages
}: {
  title: string;
  description: string;
  crumbs: Crumb[];
  canonicalPath: string;
  cases: CaseStudy[];
  fallbackLinks: { label: string; href: string }[];
  locale: Locale;
  messages: Messages;
}) {
  const aggregate = getAggregateResults(cases);
  const site = SITE_URL;

  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs crumbs={crumbs} locale={locale} messages={messages} />
        <h1 className="mt-3 text-h1 text-foreground">{title}</h1>
        <p className="mt-2 max-w-prose text-body-lg text-muted-foreground">{description}</p>

        {cases.length ? (
          <>
            <div className="mt-7 grid grid-cols-2 gap-6 border-y border-border py-6 md:grid-cols-3">
              <MetricStat
                label={messages.hub.casesPublished}
                value={String(aggregate.publishedCases)}
                tone="data"
                messages={messages}
              />
              <MetricStat
                label={messages.aggregate.averageYield}
                value={formatAggregate(aggregate.averageYieldIncrease, "%")}
                sampleSize={aggregate.averageYieldIncrease.sample}
                tone="data"
                messages={messages}
              />
              <MetricStat
                label={messages.aggregate.averageRoi}
                value={formatAggregate(aggregate.averageRoi, "x")}
                sampleSize={aggregate.averageRoi.sample}
                tone="data"
                messages={messages}
              />
            </div>
            <p className="mt-3 max-w-prose text-caption leading-5 text-muted-foreground">{messages.aggregate.note}</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cases.map((item) => (
                <EvidenceSheet key={item.id} item={item} locale={locale} messages={messages} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-8">
            <EmptyState
              title={messages.combo.emptyTitle}
              body={messages.combo.emptyBody}
              action={fallbackLinks.map((link) => (
                <Link key={link.href} className="btn btn-secondary" href={link.href}>
                  {link.label}
                </Link>
              ))}
            />
          </div>
        )}

        <div className="mt-10 border-t border-border pt-6">
          <Link className="btn btn-primary" href={localizedHref(locale, "/diagnostico")}>
            {messages.caseDetail.ctaButton}
          </Link>
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: `${site}${localizedHref(locale, canonicalPath)}`,
          inLanguage: locale,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: cases.length,
            itemListElement: cases.slice(0, 10).map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${site}${localizedHref(locale, `/cases/${item.slug}`)}`,
              name: item.title
            }))
          }
        }}
      />
    </section>
  );
}
