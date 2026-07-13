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
    title: messages.crops.title,
    alternates: { canonical: `${site}${localizedHref(locale, "/crops")}` }
  };
}

export default async function CropsPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  await trackEvent("page_view", { page_path: "/crops" });

  const [taxonomy, rawCases] = await Promise.all([getTaxonomy(), getPublishedCases()]);

  return (
    <TaxonomyIndex
      kind="crop"
      title={messages.crops.title}
      items={localizeTaxonomy(taxonomy.crops, locale)}
      basePath="/crops"
      cases={localizeCases(rawCases, locale)}
      pick={(item) => item.crop?.slug}
      locale={locale}
      messages={messages}
    />
  );
}
