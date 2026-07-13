import type { Metadata } from "next";
import Link from "next/link";
import { technicalSheets } from "@/lib/real-source-data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { getLocalizedTechnicalSheet, getTechnicalSheetRouteId } from "@/lib/technical-sheet-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: messages.technicalSheets.metadataTitle,
    description: messages.technicalSheets.metadataDescription,
    alternates: {
      canonical: `${site}${localizedHref(locale, "/fichas")}`,
      languages: { en: `${site}/en/fichas`, es: `${site}/es/fichas` }
    }
  };
}

export default async function TechnicalSheetsPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-wide text-primary">{messages.technicalSheets.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black">{messages.technicalSheets.title}</h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground">{messages.technicalSheets.description}</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {technicalSheets.map((sheet) => {
            const localized = getLocalizedTechnicalSheet(sheet, locale);
            const detailHref = localizedHref(locale, `/fichas/${getTechnicalSheetRouteId(sheet)}`);
            return (
            <article className="card p-5" key={sheet.id}>
              {sheet.source.kind === "pdf" ? (
                <a className="btn btn-download mb-4 w-full" href={sheet.source.publicPath} download>
                  {messages.technicalSheets.downloadPdf}
                </a>
              ) : null}
              <Link className="block" href={detailHref}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="status-badge">{sheet.category}</span>
                  <span className="status-badge">{sheet.source.kind.toUpperCase()}</span>
                  <span className="status-badge">{messages.technicalSheets[sheet.source.extractionStatus]}</span>
                </div>
                <h2 className="mt-4 text-2xl font-black">{localized.title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{localized.summary}</p>
              </Link>
              <div className="mt-5">
                <Link className="btn btn-secondary w-full" href={detailHref}>
                  {messages.technicalSheets.viewSheet}
                </Link>
              </div>
            </article>
          );})}
        </div>
      </div>
    </section>
  );
}
