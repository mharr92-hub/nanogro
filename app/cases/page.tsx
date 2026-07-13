import type { Metadata } from "next";
import { CaseCard } from "@/components/CaseCard";
import { SearchFilters } from "@/components/SearchFilters";
import { getPublishedCases, getTaxonomy } from "@/lib/data";
import { formatMessage, getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";
import { trackEvent } from "@/lib/analytics";

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

export default async function CasesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const params = await searchParams;
  await trackEvent("page_view", { page_path: "/cases", metadata: params });
  if (Object.keys(params).length > 0) await trackEvent("filter_used", { page_path: "/cases", metadata: params });
  const [taxonomy, rawCases] = await Promise.all([getTaxonomy(), getPublishedCases(params)]);
  const cases = localizeCases(rawCases, locale);
  const localizedTaxonomy = {
    crops: localizeTaxonomy(taxonomy.crops, locale),
    countries: localizeTaxonomy(taxonomy.countries, locale),
    problems: localizeTaxonomy(taxonomy.problems, locale)
  };
  return (
    <section className="section">
      <div className="container">
        <h1 className="text-4xl font-black">{messages.cases.title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{messages.cases.description}</p>
        <div className="mt-8">
          <SearchFilters {...localizedTaxonomy} defaults={params} locale={locale} messages={messages} />
        </div>
        <p className="mt-6 text-sm font-bold text-muted-foreground">{formatMessage(messages.cases.found, { count: cases.length })}</p>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {cases.map((item) => <CaseCard key={item.id} item={item} locale={locale} messages={messages} />)}
        </div>
      </div>
    </section>
  );
}

