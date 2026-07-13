import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaxonomyHub } from "@/components/TaxonomyHub";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { trackEvent } from "@/lib/analytics";
import { getCasesByTaxonomy, getTaxonomy } from "@/lib/data";
import { countByTerm } from "@/lib/hub";
import { countryIconBySlug, problemIcon } from "@/lib/icons";
import { formatMessage, getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { crops } = await getTaxonomy();
  const crop = localizeTaxonomy(crops, locale).find((item) => item.slug === slug);
  const site = SITE_URL;
  if (!crop) return { title: messages.crops.metadataFallback };
  return {
    title: formatMessage(messages.crops.metadataTitle, { name: crop.name }),
    description: formatMessage(messages.crops.metadataDescription, { name: crop.name }),
    alternates: { canonical: `${site}${localizedHref(locale, `/crops/${crop.slug}`)}` }
  };
}

export default async function CropPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);

  const taxonomy = await getTaxonomy();
  const crop = localizeTaxonomy(taxonomy.crops, locale).find((item) => item.slug === slug);
  if (!crop) notFound();

  await trackEvent("page_view", { page_path: `/crops/${slug}` });
  const cases = localizeCases(await getCasesByTaxonomy("crop", slug), locale);

  // Enlazado interno de la seccion 14: cultivo -> problema (SEO programatico) y cultivo -> pais.
  const problems = countByTerm(cases, (item) => item.primary_problem).map((entry) => ({
    name: formatMessage(messages.hub.browseProblem, { problem: entry.name, crop: crop.name }),
    href: localizedHref(locale, `/crops/${slug}/${entry.slug}`),
    count: entry.count,
    icon: problemIcon(entry)
  }));
  const countries = countByTerm(cases, (item) => item.country).map((entry) => ({
    name: entry.name,
    href: localizedHref(locale, `/countries/${entry.slug}/${slug}`),
    count: entry.count,
    icon: countryIconBySlug(entry.slug, localizeTaxonomy(taxonomy.countries, locale))
  }));

  return (
    <>
      <TaxonomyHub
        kind="crop"
        term={crop}
        cases={cases}
        crossLinks={[
          { label: messages.hub.topProblems, items: problems },
          { label: messages.hub.topCountries, items: countries }
        ]}
        locale={locale}
        messages={messages}
      />
      <WhatsAppFab message={messages.whatsapp.genericMessage} messages={messages} />
    </>
  );
}
