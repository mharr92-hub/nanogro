import type { Metadata } from "next";
import { TaxonomyIndex } from "@/components/TaxonomyHub";
import { trackEvent } from "@/lib/analytics";
import { getPublishedCases, getTaxonomy } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: messages.countries.title,
    alternates: { canonical: `${site}${localizedHref(locale, "/countries")}` }
  };
}

export default async function CountriesPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  await trackEvent("page_view", { page_path: "/countries" });

  const [taxonomy, rawCases] = await Promise.all([getTaxonomy(), getPublishedCases()]);

  return (
    <TaxonomyIndex
      kind="country"
      title={messages.countries.title}
      items={localizeTaxonomy(taxonomy.countries, locale)}
      basePath="/countries"
      cases={localizeCases(rawCases, locale)}
      pick={(item) => item.country?.slug}
      locale={locale}
      messages={messages}
    />
  );
}
