import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DiagnosticWizard } from "@/components/DiagnosticWizard";
import { trackEvent } from "@/lib/analytics";
import { getPublicTaxonomy } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeTaxonomy } from "@/lib/localized-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: messages.diagnosticFlow.metadataTitle,
    description: messages.diagnosticFlow.metadataDescription,
    alternates: {
      canonical: `${site}${localizedHref(locale, "/diagnostico")}`,
      languages: { en: `${site}/en/diagnostic`, es: `${site}/es/diagnostico` }
    }
  };
}

export default async function DiagnosticPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const params = await searchParams;

  await trackEvent("diagnostic_started", { page_path: "/diagnostico", metadata: params });

  const taxonomy = await getPublicTaxonomy();

  return (
    <section className="section">
      <div className="container max-w-3xl">
        <Breadcrumbs crumbs={[{ label: messages.diagnosticFlow.title }]} locale={locale} messages={messages} />

        <p className="mt-3 text-label font-semibold uppercase tracking-wide text-data">
          {messages.diagnosticFlow.eyebrow}
        </p>
        <h1 className="mt-1 text-h1 text-foreground">{messages.diagnosticFlow.title}</h1>
        <p className="mt-3 max-w-prose text-body-lg text-muted-foreground">{messages.diagnosticFlow.subtitle}</p>

        <div className="mt-8">
          <DiagnosticWizard
            crops={localizeTaxonomy(taxonomy.crops, locale)}
            countries={localizeTaxonomy(taxonomy.countries, locale)}
            problems={localizeTaxonomy(taxonomy.problems, locale)}
            // Prellenado cuando el usuario llega desde un caso o un hub: no le volvemos a
            // preguntar lo que ya sabemos de el.
            defaults={{ crop: params.crop, country: params.country, problem: params.problem }}
            messages={messages}
          />
        </div>

        <p className="mt-6 max-w-prose text-caption leading-5 text-muted-foreground">
          {messages.diagnosticFlow.disclaimer}
        </p>
      </div>
    </section>
  );
}
