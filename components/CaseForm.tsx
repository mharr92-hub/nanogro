import { saveCase } from "@/lib/actions";
import type { Messages } from "@/lib/i18n";
import { getEvidenceProfile } from "@/lib/publication-quality";
import type { CaseStudy, Country, TaxonomyItem } from "@/lib/types";

export function CaseForm({
  item,
  crops,
  countries,
  problems,
  messages,
  publicationWarning
}: {
  item?: CaseStudy | null;
  crops: TaxonomyItem[];
  countries: Country[];
  problems: TaxonomyItem[];
  messages: Messages;
  publicationWarning?: string | null;
}) {
  const profile = item ? getEvidenceProfile(item) : null;
  return (
    <form action={saveCase} className="grid gap-5">
      {publicationWarning || (profile && !profile.publicationEligible) ? (
        <div className="card border-warning/50 bg-accent p-4 text-sm font-semibold text-warning">
          {publicationWarning || messages.admin.publicationWarning}
        </div>
      ) : null}
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <Section title={messages.caseForm.basics}>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" name="title" placeholder={messages.caseForm.title} defaultValue={item?.title} required />
          <input className="input" name="public_id" placeholder={messages.caseForm.publicId} defaultValue={item?.public_id} required />
        </div>
        <input className="input" name="slug" placeholder={messages.caseForm.permanentSlug} defaultValue={item?.slug} />
        <textarea className="input min-h-24" name="summary" placeholder={messages.caseForm.summary} defaultValue={item?.summary ?? ""} />
      </Section>
      <Section title={messages.caseForm.classification}>
        <div className="grid gap-3 md:grid-cols-4">
          <Select name="crop_id" label={messages.common.crop} items={crops} value={item?.crop_id} />
          <Select name="country_id" label={messages.common.country} items={countries} value={item?.country_id} />
          <Select name="primary_problem_id" label={messages.caseForm.mainProblem} items={problems} value={item?.primary_problem_id} />
          <select className="input" name="evidence_level" defaultValue={item?.evidence_level ?? "D"}>
            {["A", "B", "C", "D"].map((level) => <option key={level} value={level}>{messages.common.evidence} {level}</option>)}
          </select>
        </div>
      </Section>
      <Section title={messages.caseForm.application}>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="input" name="nano_gro_application" placeholder={messages.caseForm.nanoApplication} defaultValue={item?.nano_gro_application ?? ""} />
          <input className="input" name="dosage" placeholder={messages.caseForm.dosage} defaultValue={item?.dosage ?? ""} />
          <input className="input" name="application_frequency" placeholder={messages.caseForm.frequency} defaultValue={item?.application_frequency ?? ""} />
        </div>
        <textarea className="input min-h-24" name="baseline_conditions" placeholder={messages.caseForm.baseline} defaultValue={item?.baseline_conditions ?? ""} />
        <textarea className="input min-h-24" name="treatment_notes" placeholder={messages.caseForm.treatmentNotes} defaultValue={item?.treatment_notes ?? ""} />
      </Section>
      <Section title={messages.caseForm.evidencePreparation}>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" name="source_folder" placeholder={messages.caseForm.sourceFolder} defaultValue={item?.source_folder ?? ""} />
          <input className="input" name="evidence_reference" placeholder={messages.caseForm.evidenceReference} defaultValue={item?.evidence_reference ?? ""} />
        </div>
        <p className="text-sm text-muted-foreground">
          {messages.caseForm.manualEvidenceNote}
        </p>
      </Section>
      <Section title={messages.caseForm.results}>
        <textarea className="input min-h-24" name="results_summary" placeholder={messages.caseForm.resultsSummary} defaultValue={item?.results_summary ?? ""} />
        <div className="grid gap-3 md:grid-cols-5">
          <input className="input" name="yield_increase_percent" type="number" step="0.01" placeholder={messages.caseForm.yieldPercent} defaultValue={item?.yield_increase_percent ?? ""} />
          <input className="input" name="quality_improvement_percent" type="number" step="0.01" placeholder={messages.caseForm.qualityPercent} defaultValue={item?.quality_improvement_percent ?? ""} />
          <input className="input" name="disease_reduction_percent" type="number" step="0.01" placeholder={messages.caseForm.diseasePercent} defaultValue={item?.disease_reduction_percent ?? ""} />
          <input className="input" name="roi_value" type="number" step="0.01" placeholder="ROI" defaultValue={item?.roi_value ?? ""} />
          <input className="input" name="case_completeness_score" type="number" placeholder={messages.caseForm.completeScore} defaultValue={item?.case_completeness_score ?? ""} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="input" name="evidence_score" type="number" placeholder={messages.caseForm.evidenceScore} defaultValue={item?.evidence_score ?? ""} />
          <input className="input" name="confidence_score" type="number" placeholder={messages.caseForm.confidenceScore} defaultValue={item?.confidence_score ?? ""} />
          <select className="input" name="verification_status" defaultValue={item?.verification_status ?? "unverified"}>
            {["unverified", "internal_review", "agronomist_review", "lab_supported", "third_party"].map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
      </Section>
      <Section title={messages.caseForm.dataQuality}>
        {item ? <FieldStatusSummary item={item} /> : null}
        <div className="grid gap-3 md:grid-cols-4">
          <input className="input" name="data_status" placeholder={messages.caseForm.dataStatus} defaultValue={item?.data_status ?? "incomplete"} />
          <input className="input" readOnly value={`${messages.common.completeness} ${item?.case_completeness_score ?? 0}/100`} />
          <input className="input" readOnly value={`${messages.common.evidence} ${item?.evidence_score ?? 0}/100`} />
          <input className="input" readOnly value={`Confidence ${item?.confidence_score ?? 0}/100`} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <textarea className="input min-h-28" name="missing_fields_text" placeholder={messages.caseForm.missingFields} defaultValue={(item?.missing_fields ?? []).join("\n")} />
          <textarea className="input min-h-28" name="pending_confirmation_fields_text" placeholder={messages.caseForm.pendingFields} defaultValue={(item?.pending_confirmation_fields ?? []).join("\n")} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <textarea className="input min-h-24" name="estimated_fields_text" placeholder={messages.caseForm.estimatedFields} defaultValue={(item?.estimated_fields ?? []).join("\n")} />
          <textarea className="input min-h-24" name="inferred_fields_text" placeholder={messages.caseForm.inferredFields} defaultValue={(item?.inferred_fields ?? []).join("\n")} />
        </div>
        <textarea className="input min-h-32" name="technical_questions_text" placeholder={messages.caseForm.technicalQuestions} defaultValue={(item?.technical_questions ?? []).join("\n")} />
        <textarea className="input min-h-28" name="field_status_json" placeholder={messages.caseForm.fieldStatusJson} defaultValue={JSON.stringify(item?.field_status ?? {}, null, 2)} />
        <textarea className="input min-h-24" name="internal_notes" placeholder={messages.caseForm.internalNotes} defaultValue={item?.internal_notes ?? ""} />
        <textarea
          className="input min-h-20"
          name="public_data_disclaimer"
          placeholder={messages.caseForm.publicDisclaimer}
          defaultValue={item?.public_data_disclaimer ?? "This report is based on documented field evidence. Some technical details not available in the original report were conservatively estimated by the technical team for guidance purposes and remain subject to confirmation."}
        />
      </Section>
      <Section title={messages.caseForm.seoStatus}>
        <input className="input" name="seo_title" placeholder={messages.caseForm.seoTitle} defaultValue={item?.seo_title ?? ""} />
        <textarea className="input min-h-20" name="seo_description" placeholder={messages.caseForm.seoDescription} defaultValue={item?.seo_description ?? ""} />
        <select className="input" name="publication_status" defaultValue={item?.publication_status ?? "draft"}>
          {["draft", "review", "approved", "published", "archived"].map((status) => <option key={status}>{status}</option>)}
        </select>
        {profile ? (
          <p className="text-sm font-semibold text-muted-foreground">
            {messages.admin.publicationEligibility}: {profile.publicationEligible ? messages.admin.eligible : messages.admin.notEligible}
          </p>
        ) : null}
      </Section>
      <button className="btn btn-primary" type="submit">{messages.caseForm.save}</button>
    </form>
  );
}

function FieldStatusSummary({ item }: { item: CaseStudy }) {
  const entries = Object.entries(item.field_status ?? {});
  const group = (status: string) => entries.filter(([, value]) => value === status).map(([field]) => field);
  const groups = [
    ["Verified fields", group("verified")],
    ["Estimated fields", item.estimated_fields ?? group("estimated")],
    ["Inferred fields", item.inferred_fields ?? group("inferred")],
    ["Pending confirmation fields", item.pending_confirmation_fields ?? group("pending_confirmation")]
  ] as const;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {groups.map(([label, fields]) => (
        <div className="rounded border border-border bg-muted p-3" key={label}>
          <p className="text-xs font-black uppercase text-muted-foreground">{label}</p>
          <p className="mt-2 text-sm font-semibold">{fields.length ? fields.join(", ") : "None"}</p>
        </div>
      ))}
      <div className="rounded border border-border bg-muted p-3">
        <p className="text-xs font-black uppercase text-muted-foreground">Original evidence source reference</p>
        <p className="mt-2 text-sm font-semibold">{item.evidence_reference || item.source_folder || "None"}</p>
      </div>
      <div className="rounded border border-border bg-muted p-3">
        <p className="text-xs font-black uppercase text-muted-foreground">Public evidence label</p>
        <p className="mt-2 text-sm font-semibold">{(item.evidence_assets ?? []).length ? "Generated from evidence asset type" : "Pending evidence asset"}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card grid gap-3 p-5"><h2 className="text-xl font-black">{title}</h2>{children}</section>;
}

function Select({ name, label, items, value }: { name: string; label: string; items: TaxonomyItem[]; value?: string }) {
  return (
    <select className="input" name={name} defaultValue={value ?? ""} required>
      <option value="">{label}</option>
      {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
    </select>
  );
}

