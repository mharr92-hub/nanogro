import Link from "next/link";
import { EvidenceImage } from "@/components/EvidenceImage";
import { HeroSearch } from "@/components/HeroSearch";
import { TeamCard } from "@/components/TeamCard";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Emoji, EvidenceSheet, IconBadge, MetricStat } from "@/components/ui";
import { formatAggregate, getAggregateResults } from "@/lib/aggregate";
import { trackEvent } from "@/lib/analytics";
import { getPublicTaxonomy, getPublishedCases } from "@/lib/data";
import { getFeaturedCases } from "@/lib/featured";
import { countryIcon, problemIcon } from "@/lib/icons";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n-shared";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";
import { team } from "@/lib/team";
import type { CaseStudy } from "@/lib/types";

export default async function HomePage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  await trackEvent("page_view", { page_path: "/" });

  const [taxonomy, rawCases] = await Promise.all([getPublicTaxonomy(), getPublishedCases()]);
  const cases = localizeCases(rawCases, locale);
  const aggregate = getAggregateResults(cases);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const localizedTaxonomy = {
    crops: localizeTaxonomy(taxonomy.crops, locale),
    countries: localizeTaxonomy(taxonomy.countries, locale),
    problems: localizeTaxonomy(taxonomy.problems, locale)
  };

  // No los tres primeros del listado: los tres mas creibles. Ver lib/featured.ts.
  const featured = getFeaturedCases(cases, 3);
  const casesWithPhotos = cases.filter((item) =>
    (item.evidence_assets ?? []).some((asset) => asset.asset_type === "photo")
  ).length;

  /*
   * Solo las metricas que la evidencia puede sostener. Las que no tienen muestra se caen
   * de la lista en vez de imprimir "Sin datos".
   */
  const availableMetrics = [
    { label: messages.aggregate.publishedCases, value: String(aggregate.publishedCases), sample: undefined },
    { label: messages.aggregate.crops, value: String(aggregate.crops), sample: undefined },
    { label: messages.aggregate.countries, value: String(aggregate.countries), sample: undefined },
    {
      label: messages.aggregate.averageYield,
      value: formatAggregate(aggregate.averageYieldIncrease, "%"),
      sample: aggregate.averageYieldIncrease.sample
    },
    {
      label: messages.aggregate.positiveRate,
      value: formatAggregate(aggregate.positiveImprovementRate, "%", 0),
      sample: aggregate.positiveImprovementRate.sample
    },
    {
      label: messages.aggregate.averageRoi,
      value: formatAggregate(aggregate.averageRoi, "x"),
      sample: aggregate.averageRoi.sample
    },
    // Cuando no hay ROI calculado, este hueco lo llena una metrica que si existe: cuantos
    // casos traen evidencia visual de campo. Es un dato real y es el que mas convence.
    {
      label: messages.aggregate.withPhotos,
      value: String(casesWithPhotos),
      sample: undefined
    }
  ].filter((metric): metric is { label: string; value: string; sample: number | undefined } => metric.value !== null);
  const galleryPreview = pickGalleryPhotos(cases, 4);
  const countriesWithCases = localizedTaxonomy.countries
    .map((country) => ({
      ...country,
      count: cases.filter((item) => item.country?.slug === country.slug).length
    }))
    .filter((country) => country.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <>
      {/* El buscador ES el hero. Sin banner decorativo delante. */}
      <section className="hero-field border-b border-border py-10 md:py-16">
        <div className="container">
          <p className="flex items-center gap-2 text-label font-semibold uppercase tracking-wide text-data">
            <Emoji symbol="🌱" className="text-h4" />
            {messages.aggregate.title}
          </p>
          <h1 className="mt-3 max-w-3xl text-display text-foreground md:text-display-lg">{messages.hero.title}</h1>
          <p className="mt-4 max-w-prose text-body-lg text-muted-foreground">{messages.hero.subtitle}</p>
          <div className="mt-7 max-w-4xl">
            {/* `combos` = las combinaciones cultivo+pais+problema que EXISTEN. El buscador
                no deja componer ninguna que no tenga casos. */}
            <HeroSearch
              {...localizedTaxonomy}
              combos={cases.map((item) => ({
                crop: item.crop?.slug,
                country: item.country?.slug,
                problem: item.primary_problem?.slug
              }))}
              locale={locale}
              messages={messages}
            />
          </div>
        </div>
      </section>

      {/* Franja de metricas agregadas. Cada cifra con su n. Guardrails de la spec. */}
      <section className="border-b border-border py-8">
        <div className="container">
          <h2 className="flex items-center gap-2 text-label font-semibold uppercase tracking-wide text-muted-foreground">
            <Emoji symbol="📊" className="text-h4" />
            {messages.aggregate.title}
          </h2>
          {/*
            Regla: una metrica que no se puede calcular NO se enseña.
            La franja mostraba "ROI promedio — Sin datos — n = 0", que es lo peor de los dos
            mundos: ocupa sitio y ademas confiesa un vacio. La alternativa NO es inventarse
            un ROI (seria un dato falso en la pagina que un agricultor usa para decidir una
            compra); es enseñar solo lo que la evidencia sostiene y llenar la franja con las
            metricas que SI existen. Si mañana se calculan ROIs, el recuadro aparece solo.
          */}
          <div className="mt-5 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {availableMetrics.map((metric) => (
              <MetricStat
                key={metric.label}
                label={metric.label}
                value={metric.value}
                sampleSize={metric.sample}
                tone="data"
                messages={messages}
              />
            ))}
          </div>
          <p className="mt-5 max-w-prose text-caption leading-5 text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatMessage(messages.aggregate.verifiedSplit, {
                verified: aggregate.verifiedCases,
                unverified: aggregate.unverifiedCases
              })}
              .
            </span>{" "}
            {messages.aggregate.verifiedExplainer} {messages.aggregate.note}
          </p>
        </div>
      </section>

      {/* Navegacion problema-primero: el agricultor no conoce el producto, conoce su problema. */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="flex items-center gap-3">
            <IconBadge symbol="🔎" />
            <h2 className="text-h2 text-foreground">{messages.problemFirst.title}</h2>
          </div>
          <p className="mt-2 max-w-prose text-body text-muted-foreground">{messages.problemFirst.subtitle}</p>

          {/* Tarjetas de problema con icono: se reconoce el sintoma antes de leerlo. */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {localizedTaxonomy.problems.map((problem) => {
              const count = cases.filter((item) => item.primary_problem?.slug === problem.slug).length;
              return (
                <Link
                  key={problem.id}
                  className="card flex min-h-[88px] items-center gap-4 p-5 hover:bg-muted"
                  href={localizedHref(locale, `/problems/${problem.slug}`)}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 flex-none place-items-center rounded-card bg-accent text-h2 leading-none"
                  >
                    {problemIcon(problem)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-h5 text-foreground">{problem.name}</span>
                  <span className="tabular text-h4 text-data">{count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section border-b border-border">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <IconBadge symbol="🧪" tone="data" />
              <div>
                <p className="text-label font-semibold uppercase tracking-wide text-data">
                  {messages.homeSections.featuredEyebrow}
                </p>
                <h2 className="mt-1 text-h2 text-foreground">{messages.homeSections.featuredTitle}</h2>
              </div>
            </div>
            <Link className="btn btn-secondary" href={localizedHref(locale, "/cases")}>
              {messages.homeSections.allCases}
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <EvidenceSheet key={item.id} item={item} locale={locale} messages={messages} />
            ))}
          </div>
        </div>
      </section>

      {galleryPreview.length ? (
        <section className="section border-b border-border">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-start gap-3">
                <IconBadge symbol="📸" tone="data" />
                <div>
                  <p className="text-label font-semibold uppercase tracking-wide text-data">
                    {messages.homeSections.galleryEyebrow}
                  </p>
                  <h2 className="mt-1 text-h2 text-foreground">{messages.homeSections.galleryTitle}</h2>
                  <p className="mt-2 max-w-prose text-body text-muted-foreground">
                    {messages.homeSections.galleryBody}
                  </p>
                </div>
              </div>
              <Link className="btn btn-secondary" href={localizedHref(locale, "/before-after")}>
                {messages.homeSections.galleryCta}
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {galleryPreview.map(({ item, asset }) => (
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
        </section>
      ) : null}

      <section className="section border-b border-border">
        <div className="container grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <IconBadge symbol="💰" tone="data" />
            <p className="mt-3 text-label font-semibold uppercase tracking-wide text-data">
              {messages.homeSections.roiEyebrow}
            </p>
            <h2 className="mt-1 text-h2 text-foreground">{messages.homeSections.roiTitle}</h2>
            <p className="mt-2 max-w-prose text-body text-muted-foreground">{messages.homeSections.roiBody}</p>
            <Link className="btn btn-primary mt-5" href={localizedHref(locale, "/roi-calculator")}>
              {messages.homeSections.roiCta}
            </Link>
          </div>

          <div className="card p-6">
            <IconBadge symbol="🌎" />
            <h2 className="mt-3 text-h2 text-foreground">{messages.homeSections.mapTitle}</h2>
            <p className="mt-2 max-w-prose text-body text-muted-foreground">{messages.homeSections.mapBody}</p>
            <ul className="mt-5 grid gap-2">
              {countriesWithCases.slice(0, 6).map((country) => (
                <li key={country.id}>
                  <Link
                    className="flex min-h-[44px] items-center justify-between gap-3 rounded border border-border px-3 hover:bg-muted"
                    href={localizedHref(locale, `/countries/${country.slug}`)}
                  >
                    <span className="flex items-center gap-2 text-body text-foreground">
                      <Emoji symbol={countryIcon(country)} className="text-h4" />
                      {country.name}
                    </span>
                    <span className="tabular text-caption text-muted-foreground">{country.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Banda de conversion primaria. Es la unica CTA grande de la home. */}
      <section className="bg-primary py-12 text-primary-foreground md:py-16">
        <div className="container">
          <p className="text-label font-semibold uppercase tracking-wide opacity-80">
            {messages.homeSections.diagnosticEyebrow}
          </p>
          <h2 className="mt-2 max-w-3xl text-display">{messages.homeSections.diagnosticTitle}</h2>
          <p className="mt-3 max-w-prose text-body-lg opacity-90">{messages.homeSections.diagnosticBody}</p>
          <Link
            className="btn btn-secondary mt-6 text-body-lg"
            href={localizedHref(locale, "/diagnostico")}
          >
            {messages.homeSections.diagnosticCta}
          </Link>
        </div>
      </section>

      {/* Quien firma la evidencia. El nombre y las credenciales, no un eslogan. */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="flex items-center gap-3">
            <IconBadge symbol="✍️" tone="data" />
            <div>
              <p className="text-label font-semibold uppercase tracking-wide text-data">{messages.team.eyebrow}</p>
              <h2 className="mt-1 text-h2 text-foreground">{messages.team.title}</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-5">
            {team.map((member) => (
              <TeamCard
                key={member.id}
                member={member}
                cases={cases}
                locale={locale}
                messages={messages}
                showCases={false}
              />
            ))}
          </div>
          <Link className="btn btn-secondary mt-6" href={localizedHref(locale, "/equipo")}>
            {messages.team.signedTitle}
          </Link>
        </div>
      </section>

      {/* Que producto genero esta evidencia: Nano-Gro y Tierra Fertil, con sus fichas. */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <IconBadge symbol="🧪" tone="data" />
              <div>
                <h2 className="text-h2 text-foreground">{messages.homeSections.productsTitle}</h2>
                <p className="mt-2 max-w-prose text-body text-muted-foreground">
                  {messages.homeSections.productsBody}
                </p>
              </div>
            </div>
            <Link className="btn btn-primary whitespace-nowrap" href={localizedHref(locale, "/fichas")}>
              {messages.homeSections.productsCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <IconBadge symbol="🤝" />
          <div>
            <p className="text-label font-semibold uppercase tracking-wide text-muted-foreground">
              {messages.homeSections.distributorEyebrow}
            </p>
            <h2 className="mt-1 text-h2 text-foreground">{messages.homeSections.distributorTitle}</h2>
            <p className="mt-2 max-w-prose text-body text-muted-foreground">
              {messages.homeSections.distributorBody}
            </p>
          </div>
        </div>
      </section>

      <WhatsAppFab message={messages.whatsapp.genericMessage} messages={messages} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: messages.common.product,
          url: site,
          description: messages.seo.defaultDescription
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: messages.seo.defaultTitle,
          description: messages.aggregate.note,
          url: `${site}${localizedHref(locale, "/cases")}`,
          variableMeasured: [
            { "@type": "PropertyValue", name: "publishedCases", value: aggregate.publishedCases },
            { "@type": "PropertyValue", name: "crops", value: aggregate.crops },
            { "@type": "PropertyValue", name: "countries", value: aggregate.countries }
          ]
        }}
      />
    </>
  );
}

/** Una foto por caso como maximo: una galeria de cuatro fotos del mismo caso no es una galeria. */
function pickGalleryPhotos(cases: CaseStudy[], limit: number) {
  const picked: { item: CaseStudy; asset: NonNullable<CaseStudy["evidence_assets"]>[number] }[] = [];
  for (const item of cases) {
    const photo = (item.evidence_assets ?? []).find((asset) => asset.asset_type === "photo");
    if (photo) picked.push({ item, asset: photo });
    if (picked.length === limit) break;
  }
  return picked;
}
