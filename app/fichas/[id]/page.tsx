import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { getTechnicalSheetByRouteId, getTechnicalSheetRouteId } from "@/lib/technical-sheet-content";
import { technicalSheets } from "@/lib/real-source-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return technicalSheets.map((sheet) => ({ id: getTechnicalSheetRouteId(sheet) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const locale = await getLocale();
  const sheet = getTechnicalSheetByRouteId(id, locale);
  if (!sheet) return {};
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const routeId = getTechnicalSheetRouteId(sheet);
  return {
    title: sheet.title,
    description: sheet.summary,
    alternates: {
      canonical: `${site}${localizedHref(locale, `/fichas/${routeId}`)}`,
      languages: {
        en: `${site}/en/fichas/${routeId}`,
        es: `${site}/es/fichas/${routeId}`
      }
    }
  };
}

export default async function TechnicalSheetDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const sheet = getTechnicalSheetByRouteId(id, locale);
  if (!sheet) notFound();

  const steps = messages.technicalSheets.flowSteps;

  return (
    <section className="section">
      <div className="container">
        <Link className="text-sm font-bold text-primary" href={localizedHref(locale, "/fichas")}>
          {messages.technicalSheets.backToSheets}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div>
            {sheet.source.kind === "pdf" ? (
              <a className="btn btn-download mb-5 w-full sm:w-auto" href={sheet.source.publicPath} download>
                {messages.technicalSheets.downloadPdf}
              </a>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <span className="status-badge">{sheet.category}</span>
              <span className="status-badge">{sheet.source.kind.toUpperCase()}</span>
              <span className="status-badge">{messages.technicalSheets[sheet.source.extractionStatus]}</span>
            </div>
            <h1 className="mt-4 text-4xl font-black md:text-5xl">{sheet.title}</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{sheet.summary}</p>
            <p className="mt-6 text-xl font-bold leading-9">{sheet.promise}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {sheet.source.kind === "pdf" ? (
                <a className="btn btn-secondary" href={sheet.source.publicPath} target="_blank" rel="noreferrer">
                  {messages.technicalSheets.openFile}
                </a>
              ) : null}
            </div>
          </div>

          <div className="card p-5">
            <p className="text-sm font-black uppercase tracking-wide text-primary">{messages.technicalSheets.graphicTitle}</p>
            <div className="mt-5 grid gap-3">
              {sheet.howItWorks.map((item, index) => (
                <div className="rounded-lg border border-border bg-background/60 p-4" key={item}>
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-black">{steps[index]}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <InfoPanel title={messages.technicalSheets.howItWorks} items={sheet.howItWorks} />
          <InfoPanel title={messages.technicalSheets.whyImportant} items={sheet.whyItMatters} />
          <InfoPanel title={messages.technicalSheets.fieldUse} items={sheet.fieldUse} />
        </div>

        <div className="card mt-6 p-5">
          <p className="text-sm font-black uppercase tracking-wide text-primary">{messages.technicalSheets.evidenceNote}</p>
          <p className="mt-2 leading-7 text-muted-foreground">{sheet.proofNote}</p>
        </div>

        <div className="mt-8 rounded-lg border border-primary/30 bg-primary/10 p-6">
          <h2 className="text-2xl font-black">{messages.technicalSheets.salesUseTitle}</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{messages.technicalSheets.salesUseBody}</p>
          <Link className="btn mt-5" href={localizedHref(locale, "/diagnostico")}>
            {messages.cases.requestDiagnosis}
          </Link>
        </div>
      </div>
    </section>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="card p-5">
      <h2 className="text-xl font-black">{title}</h2>
      <ul className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li className="rounded-lg border border-border bg-background/50 p-3" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
