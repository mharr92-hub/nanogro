import Link from "next/link";
import { publicContentText } from "@/lib/evidence-labels";
import { localizedHref, type Locale, type Messages } from "@/lib/i18n";
import type { CaseStudy } from "@/lib/types";

export function CaseCard({ item, reasons, messages, locale }: { item: CaseStudy; reasons?: string[]; messages: Messages; locale: Locale }) {
  return (
    <article className="card p-5">
      <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-primary">
        <span>{item.crop?.name ?? messages.common.crop}</span>
        <span>{item.country?.name ?? messages.common.country}</span>
        <span>{messages.common.level} {item.evidence_level}</span>
      </div>
      <h3 className="mt-3 text-xl font-black text-foreground">
        <Link href={localizedHref(locale, `/cases/${item.slug}`)}>{publicContentText(item.title, "Nano-Gro case report")}</Link>
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{publicContentText(item.summary || item.results_summary, messages.caseReport.summaryFallback)}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <Metric label={messages.cases.yield} value={item.yield_increase_percent ? `+${item.yield_increase_percent}%` : messages.caseReport.yieldNotReported} />
        <Metric label={messages.cases.roi} value={item.roi_value ? `${item.roi_value}x` : messages.caseReport.roiNotCalculated} />
        <Metric label={messages.cases.complete} value={`${item.case_completeness_score ?? 0}/100`} />
      </div>
      {reasons && reasons.length > 0 ? (
        <p className="mt-4 text-xs font-semibold text-muted-foreground">{messages.cases.matchedBy}: {reasons.join(", ")}</p>
      ) : null}
      <Link className="btn btn-secondary mt-5 w-full" href={localizedHref(locale, `/cases/${item.slug}`)}>
        {messages.cases.viewCase}
      </Link>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-muted p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-black text-foreground">{value}</p>
    </div>
  );
}

