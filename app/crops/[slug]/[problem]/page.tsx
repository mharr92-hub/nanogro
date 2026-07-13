import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComboListing } from "@/components/ComboListing";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { trackEvent } from "@/lib/analytics";
import { getPublishedCases, getTaxonomy } from "@/lib/data";
import { formatMessage, getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";

type Params = Promise<{ slug: string; problem: string }>;

async function resolve(params: Params, locale: "en" | "es") {
  const { slug, problem } = await params;
  const taxonomy = await getTaxonomy();
  return {
    slug,
    problemSlug: problem,
    crop: localizeTaxonomy(taxonomy.crops, locale).find((item) => item.slug === slug),
    problem: localizeTaxonomy(taxonomy.problems, locale).find((item) => item.slug === problem)
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { crop, problem, slug, problemSlug } = await resolve(params, locale);
  if (!crop || !problem) return {};
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: formatMessage(messages.combo.cropProblem, { crop: crop.name, problem: problem.name }),
    description: formatMessage(messages.combo.description, { a: crop.name, b: problem.name }),
    alternates: { canonical: `${site}${localizedHref(locale, `/crops/${slug}/${problemSlug}`)}` }
  };
}

export default async function CropProblemPage({ params }: { params: Params }) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { crop, problem, slug, problemSlug } = await resolve(params, locale);
  if (!crop || !problem) notFound();

  await trackEvent("page_view", { page_path: `/crops/${slug}/${problemSlug}` });

  const cases = localizeCases(await getPublishedCases(), locale).filter(
    (item) => item.crop?.slug === slug && item.primary_problem?.slug === problemSlug
  );

  return (
    <>
      <ComboListing
        title={formatMessage(messages.combo.cropProblem, { crop: crop.name, problem: problem.name })}
        description={formatMessage(messages.combo.description, { a: crop.name, b: problem.name })}
        crumbs={[
          { label: messages.nav.crops, href: "/crops" },
          { label: crop.name, href: `/crops/${slug}` },
          { label: problem.name }
        ]}
        canonicalPath={`/crops/${slug}/${problemSlug}`}
        cases={cases}
        fallbackLinks={[
          { label: crop.name, href: localizedHref(locale, `/crops/${slug}`) },
          { label: problem.name, href: localizedHref(locale, `/problems/${problemSlug}`) }
        ]}
        locale={locale}
        messages={messages}
      />
      <WhatsAppFab message={messages.whatsapp.genericMessage} messages={messages} />
    </>
  );
}
