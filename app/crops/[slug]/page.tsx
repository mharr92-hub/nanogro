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
  const { crops } = await getTaxonomy();
  const crop = localizeTaxonomy(crops, locale).find((item) => item.slug === slug);
  return {
    title: crop ? formatMessage(messages.crops.metadataTitle, { name: crop.name }) : messages.crops.metadataFallback,
    description: crop ? formatMessage(messages.crops.metadataDescription, { name: crop.name }) : undefined
  };
}

export default async function CropPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { crops } = await getTaxonomy();
  const crop = localizeTaxonomy(crops, locale).find((item) => item.slug === slug);
  if (!crop) notFound();
  const cases = localizeCases(await getCasesByTaxonomy("crop", slug), locale);
  return (
    <section className="section">
      <div className="container">
        <p className="text-sm font-black uppercase tracking-wide text-primary">{messages.crops.eyebrow}</p>
        <h1 className="mt-2 text-4xl font-black">{crop.name}</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cases.map((item) => <CaseCard key={item.id} item={item} locale={locale} messages={messages} />)}
        </div>
      </div>
    </section>
  );
}

