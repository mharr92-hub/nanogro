import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";
import { getHubData } from "@/lib/hub";
import { HubView } from "@/components/HubView";
import { breadcrumbLd } from "@/lib/schema";
import { localizedName, localizedField, t } from "@/lib/format";
import { href } from "@/lib/nav";

export const revalidate = 600;

type Props = { params: Promise<{ lang: string; crop: string }> };

export async function generateStaticParams() {
  try {
    const crops = await prisma.crop.findMany({
      where: { cases: { some: { publicationStatus: "PUBLISHED" } } },
      select: { slug: true },
    });
    return crops.flatMap((c) => [{ lang: "en", crop: c.slug }, { lang: "es", crop: c.slug }]);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, crop } = await params;
  const row = await prisma.crop.findUnique({ where: { slug: crop } }).catch(() => null);
  if (!row || !isLocale(lang)) return {};
  const name = localizedName(row, lang);
  return { title: t({ en: "{name} case studies", es: "Casos de estudio de {name}" }[lang], { name }) };
}

export default async function CropHub({ params }: Props) {
  const { lang, crop } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const row = await prisma.crop.findUnique({ where: { slug: crop } });
  if (!row) notFound();

  const data = await getHubData({ cropId: row.id });
  if (data.count === 0) notFound(); // no thin/empty hub pages

  const name = localizedName(row, lang);
  const otherCrops = await prisma.crop.findMany({
    where: { slug: { not: crop }, cases: { some: { publicationStatus: "PUBLISHED" } } },
    take: 8,
  });

  return (
    <HubView
      lang={lang}
      dict={dict}
      title={name}
      intro={localizedField(row, "description", lang)}
      data={data}
      related={otherCrops.map((c) => ({ href: href(lang, `/crops/${c.slug}`), label: localizedName(c, lang) }))}
      jsonLd={[
        breadcrumbLd([
          { name: dict.hub.exploreCrops, url: href(lang, "/case-studies") },
          { name, url: href(lang, `/crops/${crop}`) },
        ]),
      ]}
    />
  );
}
