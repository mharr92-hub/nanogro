import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaxonomyHub } from "@/components/TaxonomyHub";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { trackEvent } from "@/lib/analytics";
import { getCasesByTaxonomy, getTaxonomy } from "@/lib/data";
import { countByTerm } from "@/lib/hub";
import { formatMessage, getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { problems } = await getTaxonomy();
  const problem = localizeTaxonomy(problems, locale).find((item) => item.slug === slug);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (!problem) return { title: messages.problems.metadataFallback };
  return {
    title: formatMessage(messages.problems.metadataTitle, { name: problem.name }),
    description: formatMessage(messages.problems.metadataDescription, { name: problem.name }),
    alternates: { canonical: `${site}${localizedHref(locale, `/problems/${problem.slug}`)}` }
  };
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);

  const { problems } = await getTaxonomy();
  const problem = localizeTaxonomy(problems, locale).find((item) => item.slug === slug);
  if (!problem) notFound();

  await trackEvent("page_view", { page_path: `/problems/${slug}` });
  const cases = localizeCases(await getCasesByTaxonomy("problem", slug), locale);

  const crops = countByTerm(cases, (item) => item.crop).map((entry) => ({
    name: entry.name,
    href: localizedHref(locale, `/crops/${entry.slug}/${slug}`),
    count: entry.count
  }));
  const countries = countByTerm(cases, (item) => item.country).map((entry) => ({
    name: entry.name,
    href: localizedHref(locale, `/countries/${entry.slug}`),
    count: entry.count
  }));

  return (
    <>
      <TaxonomyHub
        kind="problem"
        term={problem}
        cases={cases}
        crossLinks={[
          { label: messages.hub.topCrops, items: crops },
          { label: messages.hub.topCountries, items: countries }
        ]}
        locale={locale}
        messages={messages}
      />
      <WhatsAppFab message={messages.whatsapp.genericMessage} messages={messages} />
    </>
  );
}
