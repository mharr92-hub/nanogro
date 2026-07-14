import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EvidenceImage } from "@/components/EvidenceImage";
import { JsonLd } from "@/components/JsonLd";
import { ReportReader } from "@/components/ReportReader";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { ConfidenceScore, Emoji, EmptyState, EvidenceSheet, IconBadge } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { buildPublicCaseReport } from "@/lib/case-report";
import { getCaseBySlug, getPublishedCases } from "@/lib/data";
import { publicContentText, publicEvidenceCaption, publicEvidenceLabel } from "@/lib/evidence-labels";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n-shared";
import { localizeCase } from "@/lib/localized-content";
import { getEvidenceProfile } from "@/lib/publication-quality";
import { getRelatedCases } from "@/lib/related";
import { signersOfCase } from "@/lib/team";
import type { EvidenceAsset } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const rawItem = await getCaseBySlug(slug);
  if (!rawItem) return {};
  const item = localizeCase(rawItem, locale);
  const site = SITE_URL;
  const title = publicContentText(item.seo_title || item.title, messages.sheet.untitledCase);
  const description = publicContentText(
    item.seo_description || item.summary || item.results_summary,
    messages.cases.summaryFallback
  );
  return {
    title,
    description,
    alternates: {
      canonical: `${site}${localizedHref(locale, `/cases/${item.slug}`)}`,
      languages: { en: `${site}/en/cases/${item.slug}`, es: `${site}/es/casos/${item.slug}` }
    },
    openGraph: { title, description, type: "article" }
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const rawItem = await getCaseBySlug(slug);
  if (!rawItem) notFound();

  await trackEvent("case_view", { page_path: `/cases/${slug}`, case_id: rawItem.id });

  const allCases = await getPublishedCases();
  const item = localizeCase(rawItem, locale);
  const related = getRelatedCases(rawItem, allCases).map((relatedCase) => ({
    ...localizeCase(relatedCase, locale),
    reasonKeys: relatedCase.reasonKeys
  }));

  const evidenceProfile = getEvidenceProfile(item);
  const report = buildPublicCaseReport(item, related.length, messages);
  const assets = item.evidence_assets ?? [];
  const photos = assets.filter((asset) => asset.asset_type === "photo");
  const documents = assets.filter((asset) => asset.asset_type !== "photo" && asset.asset_type !== "video");
  /*
   * Los archivos fuente del caso, SIEMPRE descargables.
   *
   * El informe de Cuba son siete paginas escaneadas en JPEG. El codigo las clasificaba como
   * "fotos", asi que ese caso se quedaba sin boton de descarga: su informe original existia,
   * se servia correctamente, pero no habia forma de llegar a el desde la pagina. Cuando un
   * caso no tiene ningun documento ofimatico, sus imagenes SON el informe, y hay que
   * ofrecerlas.
   */
  const sourceDocuments = documents.length ? documents : assets;
  // Quien firma o supervisa el informe original (lib/team.ts).
  const signers = signersOfCase(rawItem.id);
  const pair = findBeforeAfterPair(photos);
  const site = SITE_URL;

  const diagnosticHref = `${localizedHref(locale, "/diagnostico")}?${new URLSearchParams({
    ...(item.crop?.slug ? { crop: item.crop.slug } : {}),
    ...(item.country?.slug ? { country: item.country.slug } : {}),
    ...(item.primary_problem?.slug ? { problem: item.primary_problem.slug } : {})
  }).toString()}`;

  const roiHref = `${localizedHref(locale, "/roi-calculator")}${item.crop?.slug ? `?crop=${item.crop.slug}` : ""}`;

  // Una sola conversion primaria en la pagina: el diagnostico gratuito, contextualizado
  // con el cultivo y el pais de ESTE caso. WhatsApp es el canal alternativo, no un CTA rival.
  const cta = (
    <div className="card p-5">
      <IconBadge symbol="🩺" />
      <h2 className="mt-3 text-h4 text-foreground">{messages.caseDetail.ctaTitle}</h2>
      <p className="mt-2 text-body text-muted-foreground">
        {item.crop?.name && item.country?.name
          ? formatMessage(messages.caseDetail.ctaBodyContext, {
              crop: item.crop.name,
              country: item.country.name
            })
          : messages.caseDetail.ctaBody}
      </p>
      <Link className="btn btn-primary mt-4 w-full" href={diagnosticHref}>
        {messages.caseDetail.ctaButton}
      </Link>
      <Link className="btn btn-secondary mt-2 w-full" href={roiHref}>
        {messages.caseDetail.roiPrompt}
      </Link>
    </div>
  );

  return (
    <>
      <section className="section pb-28 lg:pb-16">
        <div className="container">
          <Breadcrumbs
            crumbs={[
              { label: messages.nav.cases, href: "/cases" },
              ...(item.crop ? [{ label: item.crop.name, href: `/crops/${item.crop.slug}` }] : []),
              { label: report.title }
            ]}
            locale={locale}
            messages={messages}
          />

          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
            <article className="min-w-0">
              {/* La Ficha de Evidencia a tamano completo, arriba del fold. */}
              <EvidenceSheet item={item} locale={locale} messages={messages} variant="full" headingLevel="h2" />

              {/*
                La fuente, siempre a la vista y arriba.
                Un sistema de evidencia que esconde el documento original al fondo de la
                pagina esta pidiendo que le crean por la cara. El informe de campo va justo
                debajo de la ficha, no enterrado tras la galeria.
              */}
              {sourceDocuments.length ? (
                <section className="card mt-4 flex flex-wrap items-center justify-between gap-4 border-2 border-data/30 p-5">
                  <div className="min-w-0">
                    <p className="text-label font-semibold uppercase tracking-wide text-data">
                      {messages.caseDetail.sourceTitle}
                    </p>
                    <p className="mt-1 break-words text-body text-foreground">
                      {sourceDocuments.map((asset) => asset.file_name || publicEvidenceLabel(asset, locale)).join(" · ")}
                    </p>
                  </div>
                  {/* Leer pesa mas que descargar: el boton fuerte lleva al informe, no al archivo. */}
                  <a className="btn btn-primary text-body-lg" href="#report">
                    {messages.caseDetail.readReportOpen}
                  </a>
                </section>
              ) : null}

              {/*
                Quien firma el informe. Es la pieza que convierte un PDF en evidencia: un
                agronomo o un distribuidor puede abrir el documento original y comprobar que
                el nombre coincide.
              */}
              {signers.length ? (
                <div className="card mt-4 flex flex-wrap items-center gap-3 p-4">
                  <Emoji symbol="✍️" className="text-h4" />
                  <p className="text-body text-muted-foreground">
                    <span className="font-semibold text-foreground">{messages.team.supervisedBy}:</span>{" "}
                    {signers.map((member) => member.name).join(" · ")}
                  </p>
                  <Link className="btn btn-ghost ml-auto" href={localizedHref(locale, "/equipo")}>
                    {messages.nav.team}
                  </Link>
                </div>
              ) : null}

              {report.disclaimer ? (
                <p className="card mt-4 border-warning/40 p-4 text-body text-warning">{report.disclaimer}</p>
              ) : null}

              {/* Los anclajes salen de las secciones que EXISTEN, no de una lista fija. */}
              {/*
                Producto aplicado y dosis.
                En todos los casos el producto aplicado es Nano-Gro: lo dice cada informe.
                La dosis se muestra SOLO si el informe la registro; cuando no, se remite a la
                dosis recomendada de la ficha tecnica y se pide confirmar con el equipo
                tecnico. No se afirma una dosis que el documento no respalda, ni se da por
                aplicado un producto que el informe no menciona.
              */}
              <section className="card mt-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-label font-semibold uppercase tracking-wide text-muted-foreground">
                      {messages.caseDetail.productTitle}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-h4 text-foreground">
                      <Emoji symbol="🧪" />
                      {messages.caseDetail.productName}
                    </p>
                    <p className="mt-2 max-w-prose text-body text-muted-foreground">
                      {item.dosage ? (
                        <>
                          <span className="font-semibold text-foreground">{messages.cases.dosage}:</span>{" "}
                          {item.dosage}
                        </>
                      ) : (
                        messages.caseDetail.dosageFromSheet
                      )}
                    </p>
                    <p className="mt-2 text-caption text-muted-foreground">{messages.caseDetail.confirmWithTeam}</p>
                  </div>
                  <Link className="btn btn-secondary" href={localizedHref(locale, "/fichas")}>
                    {messages.caseDetail.viewSheets}
                  </Link>
                </div>
              </section>

              <nav aria-label={messages.caseDetail.onThisPage} className="mt-6 flex flex-wrap gap-2">
                {[
                  ...report.sections.map((section) => ({
                    id: section.id,
                    label: section.title,
                    icon: SECTION_ICONS[section.id] ?? "📄"
                  })),
                  ...(photos.length ? [{ id: "media", label: messages.caseDetail.media, icon: "📸" }] : []),
                  ...(documents.length ? [{ id: "documents", label: messages.caseDetail.documents, icon: "📄" }] : []),
                  ...(sourceDocuments.length ? [{ id: "report", label: messages.caseDetail.readReportTitle, icon: "📖" }] : []),
                  ...(related.length ? [{ id: "related", label: messages.caseDetail.relatedTitle, icon: "🔗" }] : [])
                ].map((entry) => (
                  <a
                    key={entry.id}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-border px-4 text-body text-muted-foreground hover:bg-muted hover:text-foreground"
                    href={`#${entry.id}`}
                  >
                    <Emoji symbol={entry.icon} />
                    {entry.label}
                  </a>
                ))}
              </nav>

              <div className="mt-8 grid gap-6">
                {report.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24"
                    aria-labelledby={`${section.id}-heading`}
                  >
                    <h2 id={`${section.id}-heading`} className="text-h3 text-foreground">
                      {section.title}
                    </h2>
                    <p className="mt-2 max-w-prose text-body leading-7 text-muted-foreground">{section.body}</p>
                    {section.detail ? (
                      <p className="mt-2 max-w-prose text-caption text-muted-foreground">{section.detail}</p>
                    ) : null}
                  </section>
                ))}
              </div>

              {photos.length ? (
                <section id="media" className="mt-10 scroll-mt-24">
                  <h2 className="text-h3 text-foreground">{messages.caseDetail.media}</h2>

                  {pair ? (
                    <div className="mt-4">
                      <h3 className="text-h5 text-foreground">{messages.caseDetail.beforeAfterTitle}</h3>
                      <div className="mt-3 max-w-2xl">
                        <BeforeAfterSlider
                          before={pair.before}
                          after={pair.after}
                          beforeLabel={messages.caseDetail.before}
                          afterLabel={messages.caseDetail.after}
                          hint={messages.caseDetail.beforeAfterHint}
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {photos.map((asset) => (
                      <figure key={asset.id} className="card overflow-hidden p-0">
                        <div className="relative aspect-[4/3] w-full">
                          <EvidenceImage asset={asset} locale={locale} className="object-cover" />
                        </div>
                        <figcaption className="p-4">
                          <p className="text-body font-semibold text-foreground">
                            {publicEvidenceLabel(asset, locale)}
                          </p>
                          <p className="mt-1 text-caption text-muted-foreground">
                            {publicEvidenceCaption(asset, locale)}
                          </p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}

              {documents.length ? (
                <section id="documents" className="mt-10 scroll-mt-24">
                  <h2 className="text-h3 text-foreground">{messages.caseDetail.documents}</h2>
                  {evidenceProfile.originalReport ? (
                    <a
                      className="btn btn-download mt-4"
                      href={evidenceProfile.originalReport.file_url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {messages.cases.downloadOriginalReport}
                    </a>
                  ) : null}
                  <ul className="mt-4 grid gap-2">
                    {documents.map((asset) => (
                      <li key={asset.id}>
                        <a
                          className="flex min-h-[44px] items-center justify-between gap-3 rounded border border-border px-4 hover:bg-muted"
                          href={asset.file_url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="text-body text-foreground">{publicEvidenceLabel(asset, locale)}</span>
                          <span className="text-caption text-muted-foreground">
                            {publicEvidenceCaption(asset, locale)}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* El informe original, legible dentro de la web. */}
              <ReportReader assets={sourceDocuments} messages={messages} />

              <section id="related" className="mt-10 scroll-mt-24">
                <h2 className="text-h3 text-foreground">{messages.caseDetail.relatedTitle}</h2>
                <p className="mt-1 max-w-prose text-body text-muted-foreground">{messages.caseDetail.relatedBody}</p>

                {related.length ? (
                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    {related.map((relatedCase) => (
                      <EvidenceSheet
                        key={relatedCase.id}
                        item={relatedCase}
                        locale={locale}
                        messages={messages}
                        // La razon del match siempre visible: la spec lo exige.
                        reasons={relatedCase.reasonKeys.map((key) => messages.matchReasons[key])}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4">
                    <EmptyState
                      title={messages.caseDetail.relatedEmptyTitle}
                      body={messages.caseDetail.relatedEmptyBody}
                      action={
                        <Link className="btn btn-primary" href={localizedHref(locale, "/cases")}>
                          {messages.caseDetail.relatedEmptyCta}
                        </Link>
                      }
                    />
                  </div>
                )}
              </section>
            </article>

            <aside className="grid content-start gap-5 lg:sticky lg:top-24 lg:self-start">
              <ConfidenceScore item={item} messages={messages} />
              <div className="hidden lg:block">{cta}</div>
            </aside>
          </div>

          <div className="mt-8 lg:hidden">{cta}</div>
        </div>
      </section>

      {/* CTA fija en movil. Es la unica accion permanente en pantalla. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card p-3 lg:hidden">
        <Link className="btn btn-primary w-full" href={diagnosticHref}>
          {messages.caseDetail.stickyCta}
        </Link>
      </div>

      <WhatsAppFab
        message={formatMessage(messages.whatsapp.caseMessage, {
          title: report.title,
          crop: item.crop?.name ?? "",
          country: item.country?.name ?? ""
        })}
        messages={messages}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: report.title,
          description: publicContentText(item.summary || item.results_summary, messages.cases.summaryFallback),
          datePublished: item.published_at ?? undefined,
          dateModified: item.updated_at ?? undefined,
          url: `${site}${localizedHref(locale, `/cases/${item.slug}`)}`,
          inLanguage: locale,
          publisher: { "@type": "Organization", name: messages.common.product },
          image: photos.map((asset) => ({
            "@type": "ImageObject",
            contentUrl: asset.file_url,
            description: asset.alt_text?.trim() || publicEvidenceLabel(asset, locale)
          }))
        }}
      />
    </>
  );
}

const SECTION_ICONS: Record<string, string> = {
  context: "📍",
  location: "🗺️",
  problem: "⚠️",
  protocol: "🧪",
  results: "📈",
  evidence: "🗂️",
  notes: "📝"
};

/**
 * Par antes/despues para el comparador. Se emparejan por `display_order` cuando existe;
 * si no, se toma la primera foto de cada etapa. Sin par no se pinta el comparador: un
 * "antes" sin "despues" no compara nada.
 */
function findBeforeAfterPair(photos: EvidenceAsset[]) {
  const before = photos.find((asset) => asset.evidence_stage === "before");
  const after = photos.find((asset) => asset.evidence_stage === "after");
  if (!before || !after) return null;
  return { before, after };
}
