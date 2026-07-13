import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState, EvidenceSheet } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { getPublishedCases, getTaxonomy } from "@/lib/data";
import { getPreliminaryRecommendation, matchCases } from "@/lib/diagnostic-match";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n-shared";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { robots: { index: false } };

/**
 * El diagnostico preliminar.
 *
 * Esta pagina es el cumplimiento de la regla central de la spec sobre el diagnostico:
 * "The user should receive value immediately: similar cases, likely issue category,
 * preliminary recommendation, and next-step CTA." Antes de este rediseno el usuario era
 * expulsado a WhatsApp nada mas enviar el formulario y no recibia absolutamente nada.
 *
 * El lead ya esta guardado cuando se llega aqui (lo hace submitLead). Esta pagina no
 * escribe en la base de datos: solo devuelve al agricultor lo que la evidencia dice.
 */
export default async function DiagnosticResultPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const params = await searchParams;

  await trackEvent("diagnostic_completed", { page_path: "/diagnostico/resultado", metadata: params });

  const [taxonomy, rawCases] = await Promise.all([getTaxonomy(), getPublishedCases()]);
  const cases = localizeCases(rawCases, locale);

  const problems = localizeTaxonomy(taxonomy.problems, locale);
  const problem = problems.find((item) => item.slug === params.problem);

  const matches = matchCases(
    { cropSlug: params.crop, countrySlug: params.country, problemSlug: params.problem },
    cases
  );
  const recommendation = getPreliminaryRecommendation(matches);

  const cropName = params.cropName ?? "";
  const countryName = params.countryName ?? "";
  const whatsappHref = buildWhatsAppUrl(
    formatMessage(messages.whatsapp.caseMessage, {
      title: problem?.name ?? messages.diagnosticFlow.title,
      crop: cropName,
      country: countryName
    })
  );

  return (
    <section className="section">
      <div className="container max-w-4xl">
        <Breadcrumbs
          crumbs={[
            { label: messages.diagnosticFlow.title, href: "/diagnostico" },
            { label: messages.diagnosticFlow.resultTitle }
          ]}
          locale={locale}
          messages={messages}
        />

        <h1 className="mt-3 text-h1 text-foreground">{messages.diagnosticFlow.resultTitle}</h1>
        <p className="mt-3 max-w-prose text-body-lg text-muted-foreground">{messages.diagnosticFlow.resultIntro}</p>

        {matches.length ? (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <section className="card p-5">
                <h2 className="text-h4 text-foreground">{messages.diagnosticFlow.probableCategory}</h2>
                <p className="mt-2 text-h3 text-data">{problem?.name ?? messages.sheet.notReported}</p>
                {problem?.description ? (
                  <p className="mt-2 text-body text-muted-foreground">{problem.description}</p>
                ) : null}
              </section>

              <section className="card p-5">
                <h2 className="text-h4 text-foreground">{messages.diagnosticFlow.recommendation}</h2>
                {recommendation.suggestedApplication ? (
                  <p className="mt-2 text-body text-foreground">
                    {formatMessage(messages.diagnosticFlow.recommendationApplication, {
                      application: recommendation.suggestedApplication
                    })}
                  </p>
                ) : null}
                {recommendation.observedImprovementLow !== null && recommendation.observedImprovementHigh !== null ? (
                  <p className="tabular mt-2 text-body text-muted-foreground">
                    {formatMessage(messages.diagnosticFlow.recommendationRange, {
                      low: recommendation.observedImprovementLow,
                      high: recommendation.observedImprovementHigh
                    })}{" "}
                    {formatMessage(messages.metrics.sample, { count: recommendation.sample })}
                  </p>
                ) : (
                  <p className="mt-2 text-body text-muted-foreground">
                    {messages.diagnosticFlow.recommendationNoData}
                  </p>
                )}
              </section>
            </div>

            <section className="mt-10">
              <h2 className="text-h2 text-foreground">{messages.diagnosticFlow.similarCases}</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((item) => (
                  <EvidenceSheet
                    key={item.id}
                    item={item}
                    locale={locale}
                    messages={messages}
                    reasons={item.reasonKeys.map((key) => messages.matchReasons[key])}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="mt-8">
            <EmptyState
              title={messages.diagnosticFlow.noMatchesTitle}
              body={messages.diagnosticFlow.noMatchesBody}
              action={
                <Link className="btn btn-secondary" href={localizedHref(locale, "/cases")}>
                  {messages.diagnosticFlow.browseCta}
                </Link>
              }
            />
          </div>
        )}

        {/* WhatsApp es el siguiente paso, no el primero: el usuario ya tiene su diagnostico. */}
        <div className="card mt-10 p-6">
          <h2 className="text-h3 text-foreground">{messages.caseDetail.ctaTitle}</h2>
          <p className="mt-2 max-w-prose text-body text-muted-foreground">{messages.diagnosticFlow.disclaimer}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {whatsappHref ? (
              <a className="btn btn-whatsapp" href={whatsappHref} rel="noopener noreferrer" target="_blank">
                {messages.diagnosticFlow.whatsappCta}
              </a>
            ) : null}
            <Link className="btn btn-secondary" href={localizedHref(locale, "/roi-calculator")}>
              {messages.homeSections.roiCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
