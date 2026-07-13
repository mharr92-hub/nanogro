import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Badge, Emoji, IconBadge } from "@/components/ui";
import { pick, technology } from "@/content/technology";
import { trackEvent } from "@/lib/analytics";
import { getPublishedCases } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const site = SITE_URL;
  return {
    title: messages.technology.metadataTitle,
    description: messages.technology.metadataDescription,
    alternates: {
      canonical: `${site}${localizedHref(locale, "/tecnologia")}`,
      languages: { es: `${site}/es/tecnologia`, en: `${site}/en/technology` }
    }
  };
}

/**
 * Pagina de Tecnologia y Producto.
 *
 * La regla de color del sistema de diseno hace aqui su trabajo mas importante:
 *
 *   VERDE  = lo que el fabricante AFIRMA. Es propuesta comercial.
 *   AZUL   = lo que se MIDIO en campo, con cultivo, lugar y cifra.
 *
 * Un visitante tiene que poder distinguir de un vistazo una cosa de la otra sin leer la
 * letra pequena. Por eso las afirmaciones y los resultados no comparten ni color ni forma, y
 * cada resultado enlaza al caso publicado donde esta su evidencia.
 */
export default async function TechnologyPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  await trackEvent("page_view", { page_path: "/tecnologia" });

  const cases = await getPublishedCases();
  const publishedSlugs = new Set(cases.map((item) => item.slug));
  const site = SITE_URL;

  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs crumbs={[{ label: messages.technology.title }]} locale={locale} messages={messages} />

        <p className="mt-3 text-label font-semibold uppercase tracking-wide text-data">
          {messages.technology.eyebrow}
        </p>
        <h1 className="mt-1 text-h1 text-foreground md:text-display">{messages.technology.title}</h1>

        {/* a) Que es */}
        <div className="mt-6 max-w-prose">
          <h2 className="text-h3 text-foreground">{pick(technology.intro.title, locale)}</h2>
          <p className="mt-3 text-body-lg leading-8 text-muted-foreground">{pick(technology.intro.body, locale)}</p>
          <p className="mt-4 border-l-2 border-border pl-4 text-caption leading-6 text-muted-foreground">
            {pick(technology.intro.classification, locale)}
          </p>
        </div>

        {/* b) Tres mecanismos */}
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {technology.mechanisms.map((mechanism) => (
            <div key={mechanism.icon} className="card p-5">
              <IconBadge symbol={mechanism.icon} />
              <h3 className="mt-3 text-h4 text-foreground">{pick(mechanism.title, locale)}</h3>
              <p className="mt-1 text-body text-muted-foreground">{pick(mechanism.body, locale)}</p>
            </div>
          ))}
        </div>

        {/* c) Afirmaciones del fabricante — VERDE */}
        <section className="mt-14">
          <div className="flex items-center gap-3">
            <IconBadge symbol="🌿" tone="leaf" />
            <div>
              <h2 className="text-h2 text-foreground">{messages.technology.claimsTitle}</h2>
              <p className="mt-1 max-w-prose text-body text-muted-foreground">{messages.technology.claimsNote}</p>
            </div>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {technology.claims.map((claim) => (
              <li
                key={pick(claim, "es")}
                className="flex items-start gap-2 rounded border border-primary/25 bg-accent px-4 py-3 text-body text-accent-foreground"
              >
                <Emoji symbol="•" />
                <span>{pick(claim, locale)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* d) Resultados medidos — AZUL */}
        <section className="mt-14">
          <div className="flex items-center gap-3">
            <IconBadge symbol="📐" tone="data" />
            <div>
              <h2 className="text-h2 text-foreground">{messages.technology.resultsTitle}</h2>
              <p className="mt-1 max-w-prose text-body text-muted-foreground">{messages.technology.resultsNote}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {technology.results.map((result) => {
              const hasCase = publishedSlugs.has(result.caseSlug);
              const body = (
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="tabular text-metric text-data">{pick(result.figure, locale)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-h5 text-foreground">
                      {pick(result.crop, locale)} · <span className="font-normal">{pick(result.place, locale)}</span>
                    </span>
                    <span className="mt-1 block text-body text-muted-foreground">{pick(result.note, locale)}</span>
                  </span>
                  {hasCase ? (
                    <span className="text-caption font-semibold text-primary">{messages.cases.viewCase} →</span>
                  ) : null}
                </div>
              );

              return hasCase ? (
                <Link
                  key={result.caseSlug}
                  className="card block p-5 transition-colors hover:bg-muted"
                  href={localizedHref(locale, `/cases/${result.caseSlug}`)}
                >
                  {body}
                </Link>
              ) : (
                <div key={result.caseSlug} className="card p-5">
                  {body}
                </div>
              );
            })}
          </div>

          <p className="mt-4 max-w-prose text-caption leading-5 text-muted-foreground">
            {messages.metrics.aggregateDisclaimer}
          </p>
        </section>

        {/* e) Validaciones institucionales */}
        <section className="mt-14">
          <h2 className="text-h2 text-foreground">{pick(technology.validations.title, locale)}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {technology.validations.institutions.map((institution) => (
              <Badge key={institution} tone="data">
                {institution}
              </Badge>
            ))}
          </div>
          <p className="mt-5 max-w-prose text-body leading-7 text-muted-foreground">
            {pick(technology.validations.keyFinding, locale)}
          </p>
          <p className="mt-3 max-w-prose text-body leading-7 text-muted-foreground">
            {pick(technology.validations.independent, locale)}
          </p>
        </section>

        {/* f) Certificaciones */}
        <section className="mt-14">
          <h2 className="text-h2 text-foreground">{messages.technology.certificationsTitle}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {technology.certifications.map((certification) => (
              <span
                key={pick(certification.name, "es")}
                title={pick(certification.note, locale)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-data/30 bg-data-tint px-4 text-body font-semibold text-data"
              >
                <Emoji symbol="✔" />
                {pick(certification.name, locale)}
              </span>
            ))}
          </div>
        </section>

        {/* g) Datos rapidos */}
        <section className="mt-14">
          <h2 className="text-h2 text-foreground">{messages.technology.factsTitle}</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technology.facts.map((fact) => (
              <div key={pick(fact.label, "es")} className="card p-5">
                <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  {pick(fact.label, locale)}
                </dt>
                <dd className="mt-1 text-body font-semibold text-foreground">{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 max-w-prose border-l-2 border-warning/50 pl-4 text-caption leading-6 text-warning">
            {pick(technology.doseWarning, locale)}
          </p>

          <a
            className="btn btn-download mt-6"
            href={technology.datasheetUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {messages.technology.downloadDatasheet}
          </a>
        </section>

        {/* h) Tierra Fertil */}
        <section className="mt-14">
          <div className="card p-6">
            <div className="flex items-start gap-3">
              <IconBadge symbol="🪨" />
              <div>
                <h2 className="text-h2 text-foreground">{pick(technology.tierraFertil.title, locale)}</h2>
                <p className="mt-2 max-w-prose text-body text-muted-foreground">
                  {pick(technology.tierraFertil.body, locale)}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-prose border-l-2 border-primary/40 pl-4 text-body-lg leading-7 text-foreground">
              {pick(technology.tierraFertil.system, locale)}
            </p>

            <h3 className="mt-8 text-h4 text-foreground">{pick(technology.tierraFertil.analysisTitle, locale)}</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {technology.tierraFertil.analysis.map((entry) => (
                <div key={pick(entry.label, "es")} className="rounded border border-border p-3">
                  <dt className="text-caption text-muted-foreground">{pick(entry.label, locale)}</dt>
                  <dd className="tabular mt-0.5 text-h5 text-data">{entry.value}</dd>
                </div>
              ))}
            </dl>

            <a
              className="btn btn-secondary mt-6"
              href={technology.tierraFertil.datasheetUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {messages.technology.downloadDatasheet}
            </a>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-14 flex flex-wrap gap-3 border-t border-border pt-8">
          <Link className="btn btn-primary" href={localizedHref(locale, "/diagnostico")}>
            {messages.caseDetail.ctaButton}
          </Link>
          <Link className="btn btn-secondary" href={localizedHref(locale, "/cases")}>
            {messages.homeSections.allCases}
          </Link>
        </div>
      </div>

      <WhatsAppFab message={messages.whatsapp.genericMessage} messages={messages} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Nano-Gro",
          description: pick(technology.intro.body, locale),
          manufacturer: { "@type": "Organization", name: "NG Caribbean" },
          category: locale === "es" ? "Bioestimulante agrícola" : "Agricultural biostimulant",
          url: `${site}${localizedHref(locale, "/tecnologia")}`
        }}
      />
    </section>
  );
}
