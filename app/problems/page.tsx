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
    title: messages.problems.title,
    alternates: { canonical: `${site}${localizedHref(locale, "/problems")}` }
  };
}

export default async function ProblemsPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  await trackEvent("page_view", { page_path: "/problems" });

  const [taxonomy, rawCases] = await Promise.all([getTaxonomy(), getPublishedCases()]);

  return (
    <TaxonomyIndex
      title={messages.problems.title}
      items={localizeTaxonomy(taxonomy.problems, locale)}
      basePath="/problems"
      cases={localizeCases(rawCases, locale)}
      pick={(item) => item.primary_problem?.slug}
      locale={locale}
      messages={messages}
    />
  );
}
