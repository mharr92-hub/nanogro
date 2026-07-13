import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/CaseCard";
import { LeadForm } from "@/components/LeadForm";
import { buildPublicCaseReport } from "@/lib/case-report";
import { getCaseBySlug, getPublishedCases, getTaxonomy } from "@/lib/data";
import { publicContentText, publicEvidenceCaption, publicEvidenceLabel } from "@/lib/evidence-labels";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCase, localizeTaxonomy } from "@/lib/localized-content";
import { getEvidenceProfile } from "@/lib/publication-quality";
import { getRelatedCases } from "@/lib/related";
import { trackEvent } from "@/lib/analytics";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const rawItem = await getCaseBySlug(slug);
  if (!rawItem) return {};
  const item = localizeCase(rawItem, locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: publicContentText(item.seo_title || item.title, "Nano-Gro case report"),
    description: publicContentText(item.seo_description || item.summary || item.results_summary, "Documented Nano-Gro case study."),
    alternates: {
      canonical: `${site}${localizedHref(locale, `/cases/${item.slug}`)}`,
      languages: {
        en: `${site}/en/cases/${item.slug}`,
        es: `${site}/es/casos/${item.slug}`
      }
    },
    openGraph: {
      title: publicContentText(item.seo_title || item.title, "Nano-Gro case report"),
      description: publicContentText(item.seo_description || item.summary, "Documented Nano-Gro case study."),
      type: "article"
    }
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const rawItem = await getCaseBySlug(slug);
  if (!rawItem) notFound();
  await trackEvent("case_view", { page_path: `/cases/${slug}`, case_id: rawItem.id });
  const [taxonomy, allCases] = await Promise.all([getTaxonomy(), getPublishedCases()]);
  const item = localizeCase(rawItem, locale);
  const related = getRelatedCases(rawItem, allCases).map((relatedCase) => ({
    ...localizeCase(relatedCase, locale),
    reasons: relatedCase.reasons.map((reason) => localizeReason(reason, locale))
  }));
  const localizedTaxonomy = {
    crops: localizeTaxonomy(taxonomy.crops, locale),
    countries: localizeTaxonomy(taxonomy.countries, locale),
    problems: localizeTaxonomy(taxonomy.problems, locale)
  };
  const evidenceProfile = getEvidenceProfile(item);
  const report = buildPublicCaseReport(item, related.length, messages);
  return (
    <section className="section">
      <div className="container grid gap-8 lg:grid-cols-[1fr_380px]">
        <article>
          <div className="flex flex-wrap gap-2 text-sm font-black uppercase tracking-wide text-primary">
            <span>{item.crop?.name}</span>
            <span>{item.country?.name}</span>
            <span>{item.primary_problem?.name}</span>
            <span>{messages.common.evidence} {item.evidence_level}</span>
          </div>
          <h1 className="mt-4 text-5xl font-black leading-tight">{report.title}</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted-foreground">{report.sections[0].body}</p>
          {report.disclaimer ? (
            <div className="card mt-6 border-warning/40 bg-accent p-4 text-sm font-semibold text-warning">
              {report.disclaimer}
            </div>
          ) : null}
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {report.metrics.map((metric) => <Metric key={metric.label} label={metric.label} value={metric.value} />)}
          </div>
          <div className="mt-8 grid gap-5">
            {report.sections.slice(1, 7).map((section) => (
              <div className="card p-6" key={section.title}>
                <h2 className="text-2xl font-black">{section.title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{section.body}</p>
                {section.detail ? <p className="mt-2 text-sm text-muted-foreground">{section.detail}</p> : null}
              </div>
            ))}
          </div>
          {(item.evidence_assets ?? []).length ? (
          <div className="mt-8">
            <h2 className="text-2xl font-black">{messages.cases.evidenceTitle}</h2>
            {evidenceProfile.originalReport ? (
              <a
                className="btn btn-primary mt-4"
                href={evidenceProfile.originalReport.file_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {messages.cases.downloadOriginalReport}
              </a>
            ) : null}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {(item.evidence_assets ?? []).map((asset) => (
                <a className="card block overflow-hidden" href={asset.file_url} key={asset.id}>
                  {asset.asset_type === "photo" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={publicEvidenceLabel(asset, locale)} className="h-56 w-full object-cover" src={asset.file_url} />
                  ) : (
                    <div className="grid h-56 place-items-center bg-accent px-4 text-center font-black uppercase text-primary">{publicEvidenceLabel(asset, locale)}</div>
                  )}
                  <div className="p-4">
                    <p className="font-bold">{publicEvidenceLabel(asset, locale)}</p>
                    <p className="text-sm text-muted-foreground">{publicEvidenceCaption(asset, locale)}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          ) : null}
          <div className="mt-10">
            <h2 className="text-2xl font-black">{messages.cases.related}</h2>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {related.map((relatedCase) => (
                <CaseCard key={relatedCase.id} item={relatedCase} reasons={relatedCase.reasons} locale={locale} messages={messages} />
              ))}
            </div>
          </div>
        </article>
        <aside>
          <LeadForm {...localizedTaxonomy} viewedCase={item} relatedCases={related} messages={messages} />
        </aside>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function localizeReason(reason: string, locale: "en" | "es") {
  if (locale === "en") return reason;
  const map: Record<string, string> = {
    "Same crop": "Mismo cultivo",
    "Same problem": "Mismo problema",
    "Same country": "Mismo pais",
    "Same region": "Misma region",
    "Similar application": "Aplicacion similar",
    "High evidence level": "Alto nivel de evidencia",
    "Complete case": "Caso completo"
  };
  return map[reason] ?? reason;
}

