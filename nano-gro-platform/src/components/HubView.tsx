import Link from "next/link";
import { Container, SectionTitle, Stat, Badge } from "./ui";
import { CaseCard } from "./CaseCard";
import { JsonLd } from "./JsonLd";
import { formatPercent, t } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { CaseCard as CaseCardData } from "@/lib/search";

export interface HubViewProps {
  lang: Locale;
  dict: Dictionary;
  title: string;
  intro?: string | null;
  data: { count: number; avgYield: number | null; avgRoi: number | null; cases: CaseCardData[] };
  related?: { href: string; label: string }[];
  jsonLd?: unknown[];
}

export function HubView({ lang, dict, title, intro, data, related, jsonLd }: HubViewProps) {
  return (
    <>
      {jsonLd?.map((d, i) => <JsonLd key={i} data={d} />)}
      <Container className="py-10">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}

        <div className="mt-8 grid grid-cols-3 gap-6 rounded-2xl border border-border bg-white p-6">
          <Stat value={String(data.count)} label={dict.hub.caseCount} />
          <Stat value={formatPercent(data.avgYield, lang)} label={dict.hub.avgYield} />
          <Stat value={formatPercent(data.avgRoi, lang)} label={dict.hub.avgRoi} />
        </div>

        <div className="mt-10">
          <SectionTitle>{t(dict.hub.casesIn, { name: title })}</SectionTitle>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.cases.map((c) => (
              <CaseCard key={c.id} c={c} locale={lang} dict={dict} />
            ))}
          </div>
        </div>

        {related && related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{dict.hub.related}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link key={r.href} href={r.href}>
                  <Badge tone="brand">{r.label}</Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
