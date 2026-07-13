import { submitLead } from "@/lib/actions";
import type { Messages } from "@/lib/i18n";
import type { CaseStudy, Country, TaxonomyItem } from "@/lib/types";

export function LeadForm({
  viewedCase,
  relatedCases = [],
  messages
}: {
  crops: TaxonomyItem[];
  countries: Country[];
  problems: TaxonomyItem[];
  viewedCase?: CaseStudy | null;
  relatedCases?: CaseStudy[];
  messages: Messages;
}) {
  return (
    <form action={submitLead} className="card grid gap-3 p-5">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-primary">{messages.diagnostic.formEyebrow}</p>
        <h2 className="mt-1 text-2xl font-black">{messages.diagnostic.formTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{messages.diagnostic.formSubtitle}</p>
      </div>
      <input type="hidden" name="viewed_case_id" value={viewedCase?.id ?? ""} />
      <input type="hidden" name="source_path" value={viewedCase ? `/cases/${viewedCase.slug}` : "/diagnostico"} />
      <input type="hidden" name="recommended_case_ids" value={relatedCases.map((item) => item.id).join(",")} />
      <label className="field-label">
        {messages.diagnostic.name}
        <input className="input" name="name" placeholder={messages.diagnostic.name} required />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="field-label">
          {messages.common.country}
          <input className="input" name="country_text" placeholder={messages.common.country} required />
        </label>
        <label className="field-label">
          {messages.common.crop}
          <input className="input" name="crop_text" placeholder={messages.common.crop} defaultValue={viewedCase?.crop?.name ?? ""} required />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="field-label">
          {messages.diagnostic.area}
          <input className="input" name="area_text" placeholder={messages.diagnostic.area} required />
        </label>
        <label className="field-label">
          {messages.diagnostic.whatsapp}
          <input className="input" name="whatsapp" placeholder={messages.diagnostic.whatsapp} required />
        </label>
      </div>
      <label className="field-label">
        {messages.diagnostic.currentProblem}
        <select className="input" name="problem_text" defaultValue={viewedCase?.primary_problem?.name ?? ""} required>
          <option value="">{messages.diagnostic.currentProblem}</option>
          {messages.diagnostic.problemOptions.map((problem) => <option key={problem} value={problem}>{problem}</option>)}
        </select>
      </label>
      <label className="field-label">
        {messages.diagnostic.comments}
        <textarea className="input min-h-24" name="comments" placeholder={messages.diagnostic.comments} />
      </label>
      <button className="btn btn-primary" type="submit">{messages.diagnostic.submit}</button>
    </form>
  );
}

