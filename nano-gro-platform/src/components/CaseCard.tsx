import Image from "next/image";
import { CtaLink, Badge } from "./ui";
import { localizedName, formatPercent } from "@/lib/format";
import { href } from "@/lib/nav";
import type { Locale } from "@/lib/i18n/config";
import type { CaseCard as CaseCardData } from "@/lib/search";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function CaseCard({
  c,
  locale,
  dict,
}: {
  c: CaseCardData;
  locale: Locale;
  dict: Dictionary;
}) {
  const img = c.media[0]?.url;
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="relative aspect-[16/10] bg-brand-light">
        {img ? (
          <Image src={img} alt={c.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-dark/40 text-4xl font-bold">
            {localizedName(c.crop, locale)}
          </div>
        )}
        {c.featured && (
          <span className="absolute left-3 top-3">
            <Badge tone="amber">★</Badge>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">{localizedName(c.crop, locale)}</Badge>
          <Badge>{localizedName(c.country, locale)}</Badge>
        </div>
        <h3 className="line-clamp-2 font-semibold leading-snug">{c.title}</h3>
        <dl className="mt-auto grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <dt className="text-muted">{dict.cases.yield}</dt>
            <dd className="font-bold text-brand-dark">{formatPercent(c.yieldIncreasePct, locale)}</dd>
          </div>
          <div>
            <dt className="text-muted">{dict.cases.roi}</dt>
            <dd className="font-bold text-brand-dark">{formatPercent(c.roiPct, locale)}</dd>
          </div>
          <div>
            <dt className="text-muted">{dict.cases.confidence}</dt>
            <dd className="font-bold text-brand-dark">{c.confidenceScore}</dd>
          </div>
        </dl>
        <CtaLink href={href(locale, `/case-studies/${c.slug}`)} variant="secondary" className="mt-1">
          {dict.cases.viewCase}
        </CtaLink>
      </div>
    </article>
  );
}
