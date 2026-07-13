import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState, EvidenceSheet } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { getPublishedCases } from "@/lib/data";
import { getEvidenceChecklist } from "@/lib/evidence-checklist";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases } from "@/lib/localized-content";

export const metadata: Metadata = { robots: { index: false } };

/**
 * Comparador de casos, hasta tres (spec, seccion 5: "Save and compare cases").
 *
 * La seleccion llega por query string (`?ids=`), no por sesion: asi la comparacion es una
 * URL que un agricultor puede mandarle a su agronomo por WhatsApp.
 */
export default async function ComparePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const params = await searchParams;

  await trackEvent("case_compare", { page_path: "/compare", metadata: params });

  const ids = (params.ids ?? "").split(",").filter(Boolean).slice(0, 3);
  const allCases = localizeCases(await getPublishedCases(), locale);
  const cases = ids.map((id) => allCases.find((item) => item.id === id)).filter((item) => item !== undefined);

  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs crumbs={[{ label: messages.compare.title }]} locale={locale} messages={messages} />
        <h1 className="mt-3 text-h1 text-foreground">{messages.compare.title}</h1>
        <p className="mt-2 max-w-prose text-body text-muted-foreground">{messages.compare.subtitle}</p>

        {cases.length ? (
          <>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((item) => (
                <EvidenceSheet key={item.id} item={item} locale={locale} messages={messages} />
              ))}
            </div>

            {/* La comparacion util no es de titulares, es de evidencia: que tiene cada caso
                y que le falta. Esta tabla es el checklist puesto en columnas. */}
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-body">
                <caption className="sr-only">{messages.confidence.title}</caption>
                <thead>
                  <tr className="border-b border-border text-left">
                    <th scope="col" className="py-3 pr-4 text-caption font-semibold uppercase text-muted-foreground">
                      {messages.confidence.title}
                    </th>
                    {cases.map((item) => (
                      <th key={item.id} scope="col" className="py-3 pr-4 text-h5 text-foreground">
                        {item.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getEvidenceChecklist(cases[0]).map((entry, rowIndex) => (
                    <tr key={entry.key} className="border-b border-border">
                      <th scope="row" className="py-3 pr-4 text-left font-normal text-muted-foreground">
                        {messages.confidence.checklist[entry.key]}
                      </th>
                      {cases.map((item) => {
                        const met = getEvidenceChecklist(item)[rowIndex].met;
                        return (
                          <td key={item.id} className="py-3 pr-4">
                            <span className={met ? "text-primary" : "text-muted-foreground"}>
                              {met ? "✓" : "—"}
                              <span className="sr-only">
                                {met ? messages.confidence.met : messages.confidence.missing}
                              </span>
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="mt-8">
            <EmptyState
              title={messages.compare.emptyTitle}
              body={messages.compare.emptyBody}
              action={
                <Link className="btn btn-primary" href={localizedHref(locale, "/cases")}>
                  {messages.compare.emptyCta}
                </Link>
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}
