import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/CaseCard";
import { getCasesByTaxonomy, getTaxonomy } from "@/lib/data";
import { formatMessage, getLocale, getMessages, type Locale, type Messages } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { problems } = await getTaxonomy();
  const problem = localizeTaxonomy(problems, locale).find((item) => item.slug === slug);
  return {
    title: problem ? formatMessage(messages.problems.metadataTitle, { name: problem.name }) : messages.problems.metadataFallback,
    description: problem ? formatMessage(messages.problems.metadataDescription, { name: problem.name }) : undefined
  };
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { problems } = await getTaxonomy();
  const problem = localizeTaxonomy(problems, locale).find((item) => item.slug === slug);
  if (!problem) notFound();
  const cases = localizeCases(await getCasesByTaxonomy("problem", slug), locale);
  return <TaxonomyCases title={problem.name} eyebrow={messages.problems.eyebrow} cases={cases} locale={locale} messages={messages} />;
}

function TaxonomyCases({ title, eyebrow, cases, locale, messages }: { title: string; eyebrow: string; cases: Awaited<ReturnType<typeof getCasesByTaxonomy>>; locale: Locale; messages: Messages }) {
  return (
    <section className="section">
      <div className="container">
        <p className="text-sm font-black uppercase tracking-wide text-primary">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-black">{title}</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cases.map((item) => <CaseCard key={item.id} item={item} locale={locale} messages={messages} />)}
        </div>
      </div>
    </section>
  );
}

