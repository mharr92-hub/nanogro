import Link from "next/link";
import { CaseCard } from "@/components/CaseCard";
import { SearchFilters } from "@/components/SearchFilters";
import { getPublishedCases, getTaxonomy } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";
import { trackEvent } from "@/lib/analytics";

export default async function HomePage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  await trackEvent("page_view", { page_path: "/" });
  const [taxonomy, rawCases] = await Promise.all([getTaxonomy(), getPublishedCases()]);
  const cases = localizeCases(rawCases, locale);
  const localizedTaxonomy = {
    crops: localizeTaxonomy(taxonomy.crops, locale),
    countries: localizeTaxonomy(taxonomy.countries, locale),
    problems: localizeTaxonomy(taxonomy.problems, locale)
  };
  const featured = cases.slice(0, 3);
  return (
    <>
      <section className="bg-accent py-16">
        <div className="container">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">{messages.home.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-foreground md:text-7xl">
            {messages.home.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-muted-foreground">
            {messages.home.lede}
          </p>
          <div className="mt-8">
            <SearchFilters {...localizedTaxonomy} locale={locale} messages={messages} />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-primary">{messages.home.publishedProof}</p>
              <h2 className="mt-2 text-3xl font-black">{messages.home.mostComplete}</h2>
            </div>
            <Link className="btn btn-secondary" href={localizedHref(locale, "/cases")}>{messages.home.allCases}</Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featured.map((item) => <CaseCard key={item.id} item={item} locale={locale} messages={messages} />)}
          </div>
        </div>
      </section>
    </>
  );
}

