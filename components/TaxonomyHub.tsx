import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EvidenceImage } from "@/components/EvidenceImage";
import { JsonLd } from "@/components/JsonLd";
import { EmptyState, EvidenceSheet, MetricStat } from "@/components/ui";
import { formatAggregate, getAggregateResults } from "@/lib/aggregate";
import { formatMessage, localizedHref, type Locale, type Messages } from "@/lib/i18n-shared";
import type { CaseStudy, TaxonomyItem } from "@/lib/types";

export type HubKind = "crop" | "country" | "problem";

/**
 * Hub de cultivo, pais o problema.
 *
 * La spec es tajante: "Each crop page should feel like a mini site, not a thin listing
 * page". Antes las tres paginas eran el MISMO listado fino copiado tres veces. Ahora son
 * un unico componente con estadisticas propias, mejores casos verificados, evidencia
 * visual, enlaces cruzados de SEO programatico y su formulario de consulta contextual.
 *
 * Los enlaces cruzados no son decorativos: son el patron de enlazado interno de la
 * seccion 14 (caso -> cultivo -> pais -> problema -> casos relacionados).
 */
export function TaxonomyHub({
  kind,
  term,
  cases,
  crossLinks,
  locale,
  messages
}: {
  kind: HubKind;
  term: TaxonomyItem;
  cases: CaseStudy[];
  crossLinks: { label: string; items: { name: string; href: string; count: number }[] }[];
  locale: Locale;
  messages: Messages;
}) {
  const aggregate = getAggregateResults(cases);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const indexHref = { crop: "/crops", country: "/countries", problem: "/problems" }[kind];
  const indexLabel = { crop: messages.nav.crops, country: messages.nav.countries, problem: messages.nav.problems }[
    kind
  ];

  const bestCases = [...cases]
    .sort((a, b) => (b.confidence_score ?? 0) - (a.confidence_score ?? 0))
    .slice(0, 6);

  const photos = cases
    .flatMap((item) => (item.evidence_assets ?? []).map((asset) => ({ item, asset })))
    .filter(({ asset }) => asset.asset_type === "photo")
    .slice(0, 4);

  const diagnosticHref = `${localizedHref(locale, "/diagnostico")}?${new URLSearchParams({
    [kind]: term.slug
  }).toString()}`;

  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs
          crumbs={[{ label: indexLabel, href: indexHref }, { label: term.name }]}
          locale={locale}
          messages={messages}
        />

        <header className="mt-4">
          <h1 className="text-h1 text-foreground md:text-display">{term.name}</h1>
          {term.description ? (
            <p className="mt-3 max-w-prose text-body-lg text-muted-foreground">{term.description}</p>
          ) : null}
        </header>

        {cases.length ? (
          <>
            <div className="mt-7 grid grid-cols-2 gap-6 border-y border-border py-6 md:grid-cols-4">
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
              <MetricStat
                label={messages.aggregate.positiveRate}
                value={formatAggregate(aggregate.positiveImprovementRate, "%", 0)}
                sampleSize={aggregate.positiveImprovementRate.sample}
                tone="data"
                messages={messages}
              />
            </div>
            <p className="mt-3 max-w-prose text-caption leading-5 text-muted-foreground">{messages.aggregate.note}</p>

            {crossLinks.map((group) =>
              group.items.length ? (
                <div key={group.label} className="mt-8">
                  <h2 className="text-h4 text-foreground">{group.label}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((link) => (
                      <Link
                        key={link.href}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-border bg-card px-4 text-body text-foreground hover:bg-muted"
                        href={link.href}
                      >
                        {link.name}
                        <span className="tabular text-caption text-muted-foreground">{link.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null
            )}

            <div className="mt-10">
              <h2 className="text-h2 text-foreground">{messages.hub.bestCases}</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {bestCases.map((item) => (
                  <EvidenceSheet key={item.id} item={item} locale={locale} messages={messages} />
                ))}
              </div>
              <Link
                className="btn btn-secondary mt-6"
                href={`${localizedHref(locale, "/cases")}?${kind}=${term.slug}`}
              >
                {formatMessage(messages.hub.allCases, { name: term.name })}
              </Link>
            </div>

            {photos.length ? (
              <div className="mt-10">
                <h2 className="text-h2 text-foreground">{messages.gallery.title}</h2>
                <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {photos.map(({ item, asset }) => (
                    <Link
                      key={asset.id}
                      className="card relative aspect-square overflow-hidden p-0"
                      href={localizedHref(locale, `/cases/${item.slug}`)}
                    >
                      <EvidenceImage
                        asset={asset}
                        locale={locale}
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="card mt-10 p-6">
              <h2 className="text-h3 text-foreground">
                {formatMessage(messages.hub.consultTitle, { name: term.name })}
              </h2>
              <p className="mt-2 max-w-prose text-body text-muted-foreground">{messages.hub.consultBody}</p>
              <Link className="btn btn-primary mt-4" href={diagnosticHref}>
                {messages.caseDetail.ctaButton}
              </Link>
            </div>
          </>
        ) : (
          <div className="mt-8">
            <EmptyState
              title={formatMessage(messages.hub.emptyTitle, { name: term.name })}
              body={messages.hub.emptyBody}
              action={
                <>
                  <Link className="btn btn-primary" href={localizedHref(locale, "/cases")}>
                    {messages.hub.emptyCta}
                  </Link>
                  <Link className="btn btn-secondary" href={diagnosticHref}>
                    {messages.caseDetail.ctaButton}
                  </Link>
                </>
              }
            />
          </div>
        )}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: term.name,
          url: `${site}${localizedHref(locale, `${indexHref}/${term.slug}`)}`,
          inLanguage: locale,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: cases.length,
            itemListElement: bestCases.map((item, index) => ({
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

/** Indice de taxonomia: los tres listados que antes eran el mismo markup copiado. */
export function TaxonomyIndex({
  title,
  items,
  basePath,
  cases,
  pick,
  locale,
  messages
}: {
  title: string;
  items: TaxonomyItem[];
  basePath: string;
  cases: CaseStudy[];
  pick: (item: CaseStudy) => string | undefined;
  locale: Locale;
  messages: Messages;
}) {
  const withCounts = items
    .map((term) => ({ term, count: cases.filter((item) => pick(item) === term.slug).length }))
    .sort((a, b) => b.count - a.count || a.term.name.localeCompare(b.term.name));

  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs crumbs={[{ label: title }]} locale={locale} messages={messages} />
        <h1 className="mt-3 text-h1 text-foreground">{title}</h1>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {withCounts.map(({ term, count }) => (
            <Link
              key={term.id}
              className="card flex min-h-[88px] items-center justify-between gap-4 p-5 hover:bg-muted"
              href={localizedHref(locale, `${basePath}/${term.slug}`)}
            >
              <span>
                <span className="block text-h4 text-foreground">{term.name}</span>
                <span className="mt-1 block text-caption text-muted-foreground">{messages.hub.casesPublished}</span>
              </span>
              <span className="tabular text-metric text-data">{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
