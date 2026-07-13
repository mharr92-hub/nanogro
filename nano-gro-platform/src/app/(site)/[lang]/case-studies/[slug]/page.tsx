import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { Container, Badge, CtaLink } from "@/components/ui";
import { CaseCard } from "@/components/CaseCard";
import { ConfidenceBreakdown } from "@/components/Confidence";
import { LeadForm } from "@/components/LeadForm";
import { JsonLd } from "@/components/JsonLd";
import { caseStudyLd, breadcrumbLd } from "@/lib/schema";
import { caseCardSelect } from "@/lib/search";
import { computeConfidence } from "@/lib/confidence";
import { localizedName, formatPercent } from "@/lib/format";
import { href } from "@/lib/nav";

export const revalidate = 600;

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  try {
    const cases = await prisma.case.findMany({
      where: { publicationStatus: "PUBLISHED" },
      select: { slug: true },
    });
    return cases.flatMap((c) => [
      { lang: "en", slug: c.slug },
      { lang: "es", slug: c.slug },
    ]);
  } catch {
    return []; // DB unavailable at build → render on demand (ISR)
  }
}

async function getCase(slug: string) {
  return prisma.case.findFirst({
    where: { slug, publicationStatus: "PUBLISHED" },
    include: {
      crop: true,
      country: true,
      region: true,
      climate: true,
      soilType: true,
      problems: true,
      media: { orderBy: { order: "asc" } },
      testimonials: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCase(slug).catch(() => null);
  if (!c) return {};
  return {
    title: c.seoTitle ?? c.title,
    description: c.seoDescription ?? c.conclusions ?? undefined,
  };
}

export default async function CasePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const c = await getCase(slug);
  if (!c) notFound();

  const labCount = c.media.filter((m) => m.type === "LAB_REPORT").length;
  const photos = c.media.filter((m) => m.type.startsWith("PHOTO"));
  const before = c.media.find((m) => m.type === "PHOTO_BEFORE");
  const after = c.media.find((m) => m.type === "PHOTO_AFTER");
  const metricsPresent = [c.yieldIncreasePct, c.qualityImprovePct, c.diseaseReductPct, c.roiPct].filter(
    (x) => x != null,
  ).length;

  const confidence = computeConfidence({
    hasControlGroup: c.hasControlGroup,
    verificationStatus: c.verificationStatus,
    labReportCount: labCount,
    hasBeforeAfter: !!before && !!after,
    photoCount: photos.length,
    resultMetricsPresent: metricsPresent,
    multiSeason: false,
  });

  const similar = await prisma.case.findMany({
    where: {
      publicationStatus: "PUBLISHED",
      slug: { not: slug },
      OR: [{ cropId: c.cropId }, { problems: { some: { id: { in: c.problems.map((p) => p.id) } } } }],
    },
    take: 3,
    orderBy: { confidenceScore: "desc" },
    select: caseCardSelect,
  });

  const cropName = localizedName(c.crop, lang);
  const countryName = localizedName(c.country, lang);

  return (
    <>
      <JsonLd
        data={caseStudyLd({
          slug: c.slug,
          title: c.title,
          description: c.conclusions ?? c.title,
          cropName,
          countryName,
          yieldIncreasePct: c.yieldIncreasePct,
          publishedAt: c.publishedAt,
          imageUrl: after?.url ?? photos[0]?.url ?? null,
          locale: lang,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: dict.nav.cases, url: href(lang, "/case-studies") },
          { name: c.title, url: href(lang, `/case-studies/${c.slug}`) },
        ])}
      />

      <Container className="py-10">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted">
          <Badge tone="brand">{cropName}</Badge>
          <Badge>{countryName}</Badge>
          <Badge tone="blue">{dict.verification[c.verificationStatus]}</Badge>
          <Badge tone="amber">{dict.success[c.successLevel]}</Badge>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight">{c.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {c.publicId} · {c.farmName ?? ""}{c.farmSizeHa ? ` · ${c.farmSizeHa} ${dict.common.ha}` : ""}
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {/* Results */}
            <section>
              <h2 className="text-xl font-semibold">{dict.case.results}</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Metric label={dict.case.yieldIncrease} value={formatPercent(c.yieldIncreasePct, lang)} />
                <Metric label={dict.case.qualityImprovement} value={formatPercent(c.qualityImprovePct, lang)} />
                <Metric label={dict.case.diseaseReduction} value={formatPercent(c.diseaseReductPct, lang)} />
                <Metric label={dict.case.roi} value={formatPercent(c.roiPct, lang)} />
              </dl>
            </section>

            {/* Before / After */}
            {before && after && (
              <section>
                <h2 className="text-xl font-semibold">{dict.case.media}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <figure className="overflow-hidden rounded-lg border border-border">
                    <div className="relative aspect-video"><Image src={before.url} alt="before" fill className="object-cover" sizes="50vw" /></div>
                    <figcaption className="bg-gray-50 p-2 text-center text-xs text-muted">Before</figcaption>
                  </figure>
                  <figure className="overflow-hidden rounded-lg border border-border">
                    <div className="relative aspect-video"><Image src={after.url} alt="after" fill className="object-cover" sizes="50vw" /></div>
                    <figcaption className="bg-brand-light p-2 text-center text-xs text-brand-dark">After</figcaption>
                  </figure>
                </div>
              </section>
            )}

            {/* Treatment */}
            {c.treatment != null && (
              <section>
                <h2 className="text-xl font-semibold">{dict.case.treatment}</h2>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-gray-50 p-4 text-sm">
                  {JSON.stringify(c.treatment, null, 2)}
                </pre>
              </section>
            )}

            {c.conclusions && (
              <section>
                <h2 className="text-xl font-semibold">{dict.case.conclusions}</h2>
                <p className="mt-3 text-muted">{c.conclusions}</p>
              </section>
            )}

            {c.agronomistNotes && (
              <section>
                <h2 className="text-xl font-semibold">{dict.case.agronomistNotes}</h2>
                <p className="mt-3 text-muted">{c.agronomistNotes}</p>
              </section>
            )}

            {c.testimonials.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold">{dict.case.testimonial}</h2>
                {c.testimonials.map((tm) => (
                  <blockquote key={tm.id} className="mt-3 border-l-4 border-brand bg-brand-light/40 p-4 italic">
                    “{tm.quote}”
                    <footer className="mt-2 text-sm not-italic text-muted">— {tm.author}{tm.role ? `, ${tm.role}` : ""}</footer>
                  </blockquote>
                ))}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <ConfidenceBreakdown result={confidence} title={dict.case.confidenceBreakdown} />
            <div className="rounded-xl border border-brand bg-brand-light/50 p-5">
              <h3 className="font-semibold text-brand-dark">{dict.case.ctaTitle}</h3>
              <div className="mt-4">
                <LeadForm dict={dict} source="case" sourceRef={c.slug} defaults={{ crop: cropName, country: countryName }} compact />
              </div>
            </div>
          </aside>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-semibold">{dict.case.similar}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <CaseCard key={s.id} c={s} locale={lang} dict={dict} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 text-center">
      <div className="text-2xl font-bold text-brand-dark">{value}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}
