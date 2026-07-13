import Link from "next/link";
import { getAdminCases } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCase } from "@/lib/localized-content";
import { getEvidenceProfile } from "@/lib/publication-quality";
import type { CaseStudy } from "@/lib/types";

export default async function ReviewPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const cases = await getAdminCases();
  const queue = cases
    .filter((item) => ["draft", "review", "approved"].includes(item.publication_status))
    .map((item) => ({ item, priority: reviewPriority(item), reasons: reviewReasons(item) }))
    .sort((a, b) => b.priority - a.priority);
  return (
    <div>
      <h1 className="text-3xl font-black">{messages.review.title}</h1>
      <div className="mt-6 grid gap-3">
        {queue.map(({ item: rawItem, priority, reasons }) => {
          const item = localizeCase(rawItem, locale);
          return (
          <Link className="card grid gap-1 p-4" href={localizedHref(locale, `/admin/cases/${item.id}`)} key={item.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-black">{item.title}</p>
              <span className="rounded bg-accent px-2 py-1 text-xs font-black text-primary">{messages.review.priority} {priority}</span>
            </div>
            <p className="text-sm text-muted-foreground">{item.publication_status} / {messages.common.level} {item.evidence_level} / {messages.cases.complete} {item.case_completeness_score ?? 0}/100 / Confidence {item.confidence_score ?? 0}/100</p>
            {reasons.length ? <p className="text-sm font-semibold text-warning">{messages.review.needs}: {reasons.join(", ")}</p> : null}
          </Link>
        );})}
      </div>
    </div>
  );
}

function reviewPriority(item: CaseStudy) {
  let score = 0;
  if ((item.pending_confirmation_fields ?? []).some((field) => ["roi_value", "yield_increase_percent", "dosage", "application_method", "application_frequency"].includes(field))) score += 30;
  if ((item.confidence_score ?? 0) < 60) score += 25;
  if (!item.nano_gro_application || !item.dosage || !item.application_frequency) score += 20;
  if (!getEvidenceProfile(item).publicationEligible || (item.evidence_score ?? 0) < 40) score += 15;
  if ((item.pending_confirmation_fields ?? []).length) score += 10;
  return score;
}

function reviewReasons(item: CaseStudy) {
  const reasons: string[] = [];
  if ((item.pending_confirmation_fields ?? []).some((field) => ["roi_value", "yield_increase_percent"].includes(field))) reasons.push("commercial result fields");
  if ((item.confidence_score ?? 0) < 60) reasons.push("low confidence");
  if (!item.nano_gro_application || !item.dosage || !item.application_frequency) reasons.push("incomplete protocol");
  if (!getEvidenceProfile(item).publicationEligible || (item.evidence_score ?? 0) < 40) reasons.push("missing evidence");
  if ((item.pending_confirmation_fields ?? []).length) reasons.push("pending confirmations");
  return reasons;
}

