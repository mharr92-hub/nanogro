import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { getPublishedCases, getTaxonomy } from "@/lib/data";
import { publicContentText } from "@/lib/evidence-labels";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";
import { trackEvent } from "@/lib/analytics";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: messages.diagnostic.metadataTitle,
    description: messages.diagnostic.description,
    alternates: {
      canonical: `${site}${localizedHref(locale, "/diagnostico")}`,
      languages: { en: `${site}/en/diagnostic`, es: `${site}/es/diagnostico` }
    }
  };
}

export default async function DiagnosticPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const params = await searchParams;
  await trackEvent("diagnostic_started", { page_path: "/diagnostico" });
  const [taxonomy, rawCases] = await Promise.all([getTaxonomy(), getPublishedCases()]);
  const cases = localizeCases(rawCases, locale);
  const localizedTaxonomy = {
    crops: localizeTaxonomy(taxonomy.crops, locale),
    countries: localizeTaxonomy(taxonomy.countries, locale),
    problems: localizeTaxonomy(taxonomy.problems, locale)
  };
  const submitted = params.submitted;
  return (
    <section className="section">
      <div className="container grid gap-8 lg:grid-cols-[0.85fr_1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-primary">{messages.diagnostic.eyebrow}</p>
          <h1 className="mt-2 text-5xl font-black">{messages.diagnostic.title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {messages.diagnostic.description}
          </p>
          {submitted ? (
            <div className="card mt-6 border-primary/30 bg-accent p-5">
              <p className="text-xl font-black">{messages.diagnostic.submittedTitle}</p>
              <p className="mt-2 text-muted-foreground">{messages.diagnostic.submittedText}</p>
              <Link className="btn btn-primary mt-4" href={localizedHref(locale, "/cases")}>{messages.home.allCases}</Link>
            </div>
          ) : null}
          <div className="mt-8 grid gap-4">
            {cases.slice(0, 3).map((item) => (
              <Link className="card block p-4" key={item.id} href={localizedHref(locale, `/cases/${item.slug}`)}>
                <p className="font-black">{publicContentText(item.title, "Nano-Gro case report")}</p>
                <p className="text-sm text-muted-foreground">{item.crop?.name} / {item.primary_problem?.name}</p>
              </Link>
            ))}
          </div>
        </div>
        <LeadForm {...localizedTaxonomy} relatedCases={cases.slice(0, 3)} messages={messages} />
      </div>
    </section>
  );
}

