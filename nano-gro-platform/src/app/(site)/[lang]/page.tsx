import Link from "next/link";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { Container, Stat, CtaLink, SectionTitle, Badge } from "@/components/ui";
import { CaseCard } from "@/components/CaseCard";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd } from "@/lib/schema";
import { caseCardSelect } from "@/lib/search";
import { href } from "@/lib/nav";
import { localizedName, formatPercent } from "@/lib/format";

export const revalidate = 3600;

type Props = { params: Promise<{ lang: string }> };

async function getHomeData(locale: Locale) {
  const published = { publicationStatus: "PUBLISHED" as const };
  const [caseCount, countryCount, cropCount, agg, featured, crops, countries] = await Promise.all([
    prisma.case.count({ where: published }),
    prisma.country.count({ where: { cases: { some: published } } }),
    prisma.crop.count({ where: { cases: { some: published } } }),
    prisma.case.aggregate({ where: published, _avg: { yieldIncreasePct: true } }),
    prisma.case.findMany({ where: { ...published, featured: true }, take: 3, orderBy: { confidenceScore: "desc" }, select: caseCardSelect }),
    prisma.crop.findMany({ where: { cases: { some: published } }, take: 8, orderBy: { nameEn: "asc" } }),
    prisma.country.findMany({ where: { cases: { some: published } }, take: 8, orderBy: { nameEn: "asc" } }),
  ]);
  let featuredCases = featured;
  if (featuredCases.length === 0) {
    featuredCases = await prisma.case.findMany({ where: published, take: 3, orderBy: { confidenceScore: "desc" }, select: caseCardSelect });
  }
  return { caseCount, countryCount, cropCount, avgYield: agg._avg.yieldIncreasePct, featuredCases, crops, countries };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const data = await getHomeData(lang);

  return (
    <>
      <JsonLd data={organizationLd()} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-light to-white">
        <Container className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-5 text-lg text-muted">{dict.home.heroSubtitle}</p>
            <form action={href(lang, "/case-studies")} method="get" className="mx-auto mt-8 flex max-w-xl gap-2">
              <input
                type="search"
                name="query"
                placeholder={dict.home.searchPlaceholder}
                className="flex-1 rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-brand"
              />
              <button type="submit" className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
                {dict.nav.cases}
              </button>
            </form>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CtaLink href={href(lang, "/diagnostic")}>{dict.home.ctaPrimary}</CtaLink>
              <CtaLink href={href(lang, "/case-studies")} variant="secondary">{dict.home.ctaSecondary}</CtaLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border bg-white p-8 sm:grid-cols-4">
          <Stat value={String(data.caseCount)} label={dict.home.statsCases} />
          <Stat value={String(data.countryCount)} label={dict.home.statsCountries} />
          <Stat value={String(data.cropCount)} label={dict.home.statsCrops} />
          <Stat value={formatPercent(data.avgYield, lang)} label={dict.home.statsAvgYield} />
        </div>
      </Container>

      {/* Featured */}
      {data.featuredCases.length > 0 && (
        <Container className="py-8">
          <SectionTitle>{dict.home.featured}</SectionTitle>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.featuredCases.map((c) => (
              <CaseCard key={c.id} c={c} locale={lang} dict={dict} />
            ))}
          </div>
        </Container>
      )}

      {/* Explore by crop / country */}
      <Container className="grid gap-10 py-12 sm:grid-cols-2">
        <div>
          <SectionTitle>{dict.home.byCrop}</SectionTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.crops.map((c) => (
              <Link key={c.slug} href={href(lang, `/crops/${c.slug}`)}>
                <Badge tone="brand">{localizedName(c, lang)}</Badge>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle>{dict.home.byCountry}</SectionTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.countries.map((c) => (
              <Link key={c.slug} href={href(lang, `/countries/${c.slug}`)}>
                <Badge>{localizedName(c, lang)}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
