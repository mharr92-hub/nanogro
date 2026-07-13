import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaxonomyHub } from "@/components/TaxonomyHub";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { trackEvent } from "@/lib/analytics";
import { getCasesByTaxonomy, getTaxonomy } from "@/lib/data";
import { countByTerm } from "@/lib/hub";
import { cropIcon, problemIcon } from "@/lib/icons";
import { formatMessage, getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { countries } = await getTaxonomy();
  const country = localizeTaxonomy(countries, locale).find((item) => item.slug === slug);
  const site = SITE_URL;
  if (!country) return { title: messages.countries.metadataFallback };
  return {
    title: formatMessage(messages.countries.metadataTitle, { name: country.name }),
    description: formatMessage(messages.countries.metadataDescription, { name: country.name }),
    alternates: { canonical: `${site}${localizedHref(locale, `/countries/${country.slug}`)}` }
  };
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);

  const { countries } = await getTaxonomy();
  const country = localizeTaxonomy(countries, locale).find((item) => item.slug === slug);
  if (!country) notFound();

  await trackEvent("page_view", { page_path: `/countries/${slug}` });
  const cases = localizeCases(await getCasesByTaxonomy("country", slug), locale);

  const crops = countByTerm(cases, (item) => item.crop).map((entry) => ({
    name: entry.name,
    href: localizedHref(locale, `/countries/${slug}/${entry.slug}`),
    count: entry.count,
    icon: cropIcon(entry)
  }));
  const problems = countByTerm(cases, (item) => item.primary_problem).map((entry) => ({
    name: entry.name,
    href: localizedHref(locale, `/problems/${entry.slug}`),
    count: entry.count,
    icon: problemIcon(entry)
  }));

  return (
    <>
      <TaxonomyHub
        kind="country"
        term={country}
        cases={cases}
        crossLinks={[
          { label: messages.hub.topCrops, items: crops },
          { label: messages.hub.topProblems, items: problems }
        ]}
        locale={locale}
        messages={messages}
      />
      <WhatsAppFab message={messages.whatsapp.genericMessage} messages={messages} />
    </>
  );
}
