import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/CaseCard";
import { getCasesByTaxonomy, getTaxonomy } from "@/lib/data";
import { formatMessage, getLocale, getMessages } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { countries } = await getTaxonomy();
  const country = localizeTaxonomy(countries, locale).find((item) => item.slug === slug);
  return {
    title: country ? formatMessage(messages.countries.metadataTitle, { name: country.name }) : messages.countries.metadataFallback,
    description: country ? formatMessage(messages.countries.metadataDescription, { name: country.name }) : undefined
  };
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { countries } = await getTaxonomy();
  const country = localizeTaxonomy(countries, locale).find((item) => item.slug === slug);
  if (!country) notFound();
  const cases = localizeCases(await getCasesByTaxonomy("country", slug), locale);
  return (
    <section className="section">
      <div className="container">
        <p className="text-sm font-black uppercase tracking-wide text-primary">{messages.countries.eyebrow}</p>
        <h1 className="mt-2 text-4xl font-black">{country.name}</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cases.map((item) => <CaseCard key={item.id} item={item} locale={locale} messages={messages} />)}
        </div>
      </div>
    </section>
  );
}

