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

type Props = { params: Promise<{ lang: string; problem: string }> };

export async function generateStaticParams() {
  try {
    const rows = await prisma.problem.findMany({
      where: { cases: { some: { publicationStatus: "PUBLISHED" } } },
      select: { slug: true },
    });
    return rows.flatMap((p) => [{ lang: "en", problem: p.slug }, { lang: "es", problem: p.slug }]);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, problem } = await params;
  const row = await prisma.problem.findUnique({ where: { slug: problem } }).catch(() => null);
  if (!row || !isLocale(lang)) return {};
  const name = localizedName(row, lang);
  return { title: t({ en: "Solving {name} with Nano-Gro", es: "Resolviendo {name} con Nano-Gro" }[lang], { name }) };
}

export default async function ProblemHub({ params }: Props) {
  const { lang, problem } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const row = await prisma.problem.findUnique({ where: { slug: problem } });
  if (!row) notFound();

  const data = await getHubData({ problems: { some: { id: row.id } } });
  if (data.count === 0) notFound();

  const name = localizedName(row, lang);
  const others = await prisma.problem.findMany({
    where: { slug: { not: problem }, cases: { some: { publicationStatus: "PUBLISHED" } } },
    take: 8,
  });

  return (
    <HubView
      lang={lang}
      dict={dict}
      title={name}
      intro={localizedField(row, "description", lang)}
      data={data}
      related={others.map((p) => ({ href: href(lang, `/problems/${p.slug}`), label: localizedName(p, lang) }))}
      jsonLd={[
        breadcrumbLd([
          { name: dict.hub.exploreProblems, url: href(lang, "/case-studies") },
          { name, url: href(lang, `/problems/${problem}`) },
        ]),
      ]}
    />
  );
}
