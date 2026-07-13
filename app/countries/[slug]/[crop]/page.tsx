import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComboListing } from "@/components/ComboListing";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { trackEvent } from "@/lib/analytics";
import { getPublishedCases, getTaxonomy } from "@/lib/data";
import { formatMessage, getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";
import { SITE_URL } from "@/lib/site";

type Params = Promise<{ slug: string; crop: string }>;

async function resolve(params: Params, locale: "en" | "es") {
  const { slug, crop } = await params;
  const taxonomy = await getTaxonomy();
  return {
    countrySlug: slug,
    cropSlug: crop,
    country: localizeTaxonomy(taxonomy.countries, locale).find((item) => item.slug === slug),
    crop: localizeTaxonomy(taxonomy.crops, locale).find((item) => item.slug === crop)
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { country, crop, countrySlug, cropSlug } = await resolve(params, locale);
  if (!country || !crop) return {};
  const site = SITE_URL;
  return {
    title: formatMessage(messages.combo.countryCrop, { crop: crop.name, country: country.name }),
    description: formatMessage(messages.combo.description, { a: crop.name, b: country.name }),
    alternates: { canonical: `${site}${localizedHref(locale, `/countries/${countrySlug}/${cropSlug}`)}` }
  };
}

export default async function CountryCropPage({ params }: { params: Params }) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { country, crop, countrySlug, cropSlug } = await resolve(params, locale);
  if (!country || !crop) notFound();

  await trackEvent("page_view", { page_path: `/countries/${countrySlug}/${cropSlug}` });

  const cases = localizeCases(await getPublishedCases(), locale).filter(
    (item) => item.country?.slug === countrySlug && item.crop?.slug === cropSlug
  );

  return (
    <>
      <ComboListing
        title={formatMessage(messages.combo.countryCrop, { crop: crop.name, country: country.name })}
        description={formatMessage(messages.combo.description, { a: crop.name, b: country.name })}
        crumbs={[
          { label: messages.nav.countries, href: "/countries" },
          { label: country.name, href: `/countries/${countrySlug}` },
          { label: crop.name }
        ]}
        canonicalPath={`/countries/${countrySlug}/${cropSlug}`}
        cases={cases}
        fallbackLinks={[
          { label: country.name, href: localizedHref(locale, `/countries/${countrySlug}`) },
          { label: crop.name, href: localizedHref(locale, `/crops/${cropSlug}`) }
        ]}
        locale={locale}
        messages={messages}
      />
      <WhatsAppFab message={messages.whatsapp.genericMessage} messages={messages} />
    </>
  );
}
