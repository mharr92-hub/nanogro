import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";
import { getHubData } from "@/lib/hub";
import { HubView } from "@/components/HubView";
import { breadcrumbLd } from "@/lib/schema";
import { localizedName, t } from "@/lib/format";
import { href } from "@/lib/nav";

export const revalidate = 600;

type Props = { params: Promise<{ lang: string; country: string }> };

export async function generateStaticParams() {
  try {
    const rows = await prisma.country.findMany({
      where: { cases: { some: { publicationStatus: "PUBLISHED" } } },
      select: { slug: true },
    });
    return rows.flatMap((c) => [{ lang: "en", country: c.slug }, { lang: "es", country: c.slug }]);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, country } = await params;
  const row = await prisma.country.findUnique({ where: { slug: country } }).catch(() => null);
  if (!row || !isLocale(lang)) return {};
  const name = localizedName(row, lang);
  return { title: t({ en: "Nano-Gro results in {name}", es: "Resultados Nano-Gro en {name}" }[lang], { name }) };
}

export default async function CountryHub({ params }: Props) {
  const { lang, country } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const row = await prisma.country.findUnique({ where: { slug: country } });
  if (!row) notFound();

  const data = await getHubData({ countryId: row.id });
  if (data.count === 0) notFound();

  const name = localizedName(row, lang);
  const others = await prisma.country.findMany({
    where: { slug: { not: country }, cases: { some: { publicationStatus: "PUBLISHED" } } },
    take: 8,
  });

  return (
    <HubView
      lang={lang}
      dict={dict}
      title={name}
      data={data}
      related={others.map((c) => ({ href: href(lang, `/countries/${c.slug}`), label: localizedName(c, lang) }))}
      jsonLd={[
        breadcrumbLd([
          { name: dict.hub.exploreCountries, url: href(lang, "/case-studies") },
          { name, url: href(lang, `/countries/${country}`) },
        ]),
      ]}
    />
  );
}
