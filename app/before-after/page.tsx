import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EvidenceImage } from "@/components/EvidenceImage";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Badge, EmptyState } from "@/components/ui";
import { isVerified } from "@/lib/aggregate";
import { trackEvent } from "@/lib/analytics";
import { getPublicTaxonomy, getPublishedCases } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases, localizeTaxonomy } from "@/lib/localized-content";
import type { CaseStudy, EvidenceAsset } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const site = SITE_URL;
  return {
    title: messages.gallery.metadataTitle,
    description: messages.gallery.metadataDescription,
    alternates: {
      canonical: `${site}${localizedHref(locale, "/before-after")}`,
      languages: { en: `${site}/en/before-after`, es: `${site}/es/antes-despues` }
    }
  };
}

const STAGES = ["before", "during", "after", "final", "supporting"] as const;

/**
 * Galeria antes/despues (spec, seccion 5).
 *
 * "Many visitors will trust images before reading long case narratives." Por eso la
 * evidencia visual es una via de descubrimiento de primera clase y no un adorno dentro
 * del caso. Cada imagen enlaza a su caso completo y muestra su score de confianza, y
 * solo se publica lo que tiene consentimiento y verificacion aprobados (lo garantiza el
 * RLS de Supabase, que no devuelve otros assets al cliente publico).
 */
export default async function BeforeAfterPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const params = await searchParams;

  await trackEvent("page_view", { page_path: "/before-after", metadata: params });

  const [taxonomy, rawCases] = await Promise.all([getPublicTaxonomy(), getPublishedCases()]);
  const cases = localizeCases(rawCases, locale);

  /*
   * Esta galeria es de FOTOGRAFIA DE CAMPO, no de documentos.
   *
   * El informe de Cuba son siete paginas escaneadas guardadas como JPEG. Al filtrar solo por
   * asset_type === "photo", esas siete paginas se colaban aqui y llenaban la galeria de
   * escaneos de un papel, encima de un caso con 30/100 de confianza. Un escaneo no es una
   * foto de "antes y despues": es un documento, y su sitio es el bloque de descarga del caso.
   *
   * Se exigen las etapas de campo (antes / durante / despues). Los escaneos entran como
   * "final" o "supporting" y se quedan fuera.
   */
  const fieldStages = new Set(["before", "during", "after"]);

  const entries = cases
    .flatMap((item) => (item.evidence_assets ?? []).map((asset) => ({ item, asset })))
    .filter(({ asset }) => asset.asset_type === "photo" && fieldStages.has(asset.evidence_stage ?? ""))
    .filter(({ item, asset }) => {
      if (params.crop && item.crop?.slug !== params.crop) return false;
      if (params.country && item.country?.slug !== params.country) return false;
      if (params.problem && item.primary_problem?.slug !== params.problem) return false;
      if (params.stage && asset.evidence_stage !== params.stage) return false;
      if (params.verified === "1" && !isVerified(item)) return false;
      return true;
    });

  const localizedTaxonomy = {
    crops: localizeTaxonomy(taxonomy.crops, locale),
    countries: localizeTaxonomy(taxonomy.countries, locale),
    problems: localizeTaxonomy(taxonomy.problems, locale)
  };
  const site = SITE_URL;

  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs crumbs={[{ label: messages.nav.beforeAfter }]} locale={locale} messages={messages} />

        <p className="mt-3 text-label font-semibold uppercase tracking-wide text-data">{messages.gallery.eyebrow}</p>
        <h1 className="mt-1 text-h1 text-foreground">{messages.gallery.title}</h1>
        <p className="mt-3 max-w-prose text-body-lg text-muted-foreground">{messages.gallery.subtitle}</p>

        <form action={localizedHref(locale, "/before-after")} className="card mt-8 grid gap-4 p-5 lg:grid-cols-5">
          <label className="field-label">
            {messages.common.crop}
            <select className="input" name="crop" defaultValue={params.crop ?? ""}>
              <option value="">{messages.facets.any}</option>
              {localizedTaxonomy.crops.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            {messages.common.country}
            <select className="input" name="country" defaultValue={params.country ?? ""}>
              <option value="">{messages.facets.any}</option>
              {localizedTaxonomy.countries.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            {messages.common.problem}
            <select className="input" name="problem" defaultValue={params.problem ?? ""}>
              <option value="">{messages.facets.any}</option>
              {localizedTaxonomy.problems.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            {messages.gallery.stage}
            <select className="input" name="stage" defaultValue={params.stage ?? ""}>
              <option value="">{messages.facets.any}</option>
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {messages.gallery.stages[stage]}
                </option>
              ))}
            </select>
          </label>
          <div className="grid content-end gap-3">
            <label className="flex items-center gap-2 text-body">
              <input
                className="h-5 w-5"
                type="checkbox"
                name="verified"
                value="1"
                defaultChecked={params.verified === "1"}
              />
              <span>{messages.gallery.verifiedOnly}</span>
            </label>
            <button className="btn btn-primary" type="submit">
              {messages.facets.apply}
            </button>
          </div>
        </form>

        {entries.length ? (
          // Masonry por columnas CSS: respeta la altura real de cada foto sin JavaScript.
          <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {entries.map(({ item, asset }) => (
              <GalleryCard key={asset.id} item={item} asset={asset} locale={locale} messages={messages} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
              title={messages.gallery.emptyTitle}
              body={messages.gallery.emptyBody}
              action={
                <Link className="btn btn-primary" href={localizedHref(locale, "/cases")}>
                  {messages.homeSections.allCases}
                </Link>
              }
            />
          </div>
        )}
      </div>

      <WhatsAppFab message={messages.whatsapp.genericMessage} messages={messages} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: messages.gallery.title,
          url: `${site}${localizedHref(locale, "/before-after")}`,
          image: entries.slice(0, 20).map(({ asset }) => ({
            "@type": "ImageObject",
            contentUrl: asset.file_url,
            description: asset.alt_text ?? undefined
          }))
        }}
      />
    </section>
  );
}

function GalleryCard({
  item,
  asset,
  locale,
  messages
}: {
  item: CaseStudy;
  asset: EvidenceAsset;
  locale: Awaited<ReturnType<typeof getLocale>>;
  messages: Awaited<ReturnType<typeof getMessages>>;
}) {
  return (
    <Link
      className="card block break-inside-avoid overflow-hidden p-0"
      href={localizedHref(locale, `/cases/${item.slug}`)}
    >
      <div className="relative aspect-[4/3] w-full">
        <EvidenceImage
          asset={asset}
          locale={locale}
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {asset.evidence_stage ? (
            <Badge tone="data">{messages.gallery.stages[asset.evidence_stage]}</Badge>
          ) : null}
          <span className="tabular text-caption text-muted-foreground">
            {messages.sheet.confidence} {item.confidence_score ?? 0}/100
          </span>
        </div>
        <p className="mt-2 text-body font-semibold text-foreground">{item.title}</p>
        <p className="mt-1 text-caption text-muted-foreground">
          {item.crop?.name} · {item.country?.name}
        </p>
      </div>
    </Link>
  );
}
