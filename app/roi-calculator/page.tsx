import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RoiCalculator } from "@/components/RoiCalculator";
import { trackEvent } from "@/lib/analytics";
import { getPublicTaxonomy, getPublishedCases } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const site = SITE_URL;
  return {
    title: messages.roi.metadataTitle,
    description: messages.roi.metadataDescription,
    alternates: {
      canonical: `${site}${localizedHref(locale, "/roi-calculator")}`,
      languages: { en: `${site}/en/roi-calculator`, es: `${site}/es/calculadora-roi` }
    }
  };
}

export default async function RoiCalculatorPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const params = await searchParams;

  await trackEvent("page_view", { page_path: "/roi-calculator", metadata: params });

  const [taxonomy, rawCases] = await Promise.all([getPublicTaxonomy(), getPublishedCases()]);

  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs crumbs={[{ label: messages.nav.roiCalculator }]} locale={locale} messages={messages} />

        <p className="mt-3 text-label font-semibold uppercase tracking-wide text-data">{messages.roi.eyebrow}</p>
        <h1 className="mt-1 text-h1 text-foreground">{messages.roi.title}</h1>
        <p className="mt-3 max-w-prose text-body-lg text-muted-foreground">{messages.roi.subtitle}</p>

        <div className="mt-8">
          <RoiCalculator
            cases={localizeCases(rawCases, locale)}
            crops={localizeTaxonomy(taxonomy.crops, locale)}
            countries={localizeTaxonomy(taxonomy.countries, locale)}
            defaultCrop={params.crop}
            locale={locale}
            messages={messages}
          />
        </div>
      </div>
    </section>
  );
}
