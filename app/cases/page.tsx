import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CaseFacets, type CaseFilters } from "@/components/CaseFacets";
import { CompareToggle, CompareTray } from "@/components/Compare";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { EmptyState, EvidenceSheet } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { applyCaseFilters, getFacetCounts } from "@/lib/case-filters";
import { getPublishedCases, getTaxonomy } from "@/lib/data";
import { formatMessage, getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: messages.cases.metadataTitle,
    description: messages.cases.metadataDescription,
    alternates: {
      canonical: `${site}${localizedHref(locale, "/cases")}`,
      languages: { en: `${site}/en/cases`, es: `${site}/es/casos` }
    }
  };
}

export default async function CasesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const params = await searchParams;
  const filters: CaseFilters = params;

  await trackEvent("page_view", { page_path: "/cases", metadata: params });
  if (Object.keys(params).length > 0) await trackEvent("filter_used", { page_path: "/cases", metadata: params });

  const [taxonomy, rawCases] = await Promise.all([getTaxonomy(), getPublishedCases()]);
  const allCases = localizeCases(rawCases, locale);
  const cases = applyCaseFilters(allCases, filters);
  const counts = getFacetCounts(allCases, filters);

  const localizedTaxonomy = {
    crops: localizeTaxonomy(taxonomy.crops, locale),
    countries: localizeTaxonomy(taxonomy.countries, locale),
    problems: localizeTaxonomy(taxonomy.problems, locale)
  };

  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs crumbs={[{ label: messages.nav.cases }]} locale={locale} messages={messages} />
        <h1 className="mt-3 text-h1 text-foreground">{messages.cases.title}</h1>
        <p className="mt-2 max-w-prose text-body text-muted-foreground">{messages.cases.description}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside>
            <CaseFacets
              {...localizedTaxonomy}
              counts={counts}
              filters={filters}
              locale={locale}
              messages={messages}
            />
          </aside>

          <div>
            <p className="tabular text-body font-semibold text-foreground">
              {formatMessage(messages.facets.resultsCount, { count: cases.length })}
            </p>

            {cases.length ? (
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {cases.map((item) => (
                  <div key={item.id} className="flex flex-col gap-2">
                    <EvidenceSheet item={item} locale={locale} messages={messages} />
                    <CompareToggle id={item.id} messages={messages} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  title={messages.errors.emptyCases}
                  body={messages.gallery.emptyBody}
                  action={
                    <Link className="btn btn-primary" href={localizedHref(locale, "/cases")}>
                      {messages.facets.clear}
                    </Link>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <CompareTray locale={locale} messages={messages} />
      <WhatsAppFab message={messages.whatsapp.genericMessage} messages={messages} />
    </section>
  );
}
