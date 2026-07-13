import { saveEvidence } from "@/lib/actions";
import { getAdminCases } from "@/lib/data";
import { publicEvidenceLabel } from "@/lib/evidence-labels";
import { getLocale, getMessages } from "@/lib/i18n";
import { localizeCase } from "@/lib/localized-content";

export default async function EvidenceAdminPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const cases = (await getAdminCases()).map((item) => localizeCase(item, locale));
  const assets = cases.flatMap((item) => item.evidence_assets ?? []);
  return (
    <div>
      <h1 className="text-3xl font-black">{messages.admin.evidenceLibrary}</h1>
      <form action={saveEvidence} className="card mt-6 grid gap-3 p-5">
        <h2 className="text-xl font-black">{messages.admin.attachEvidence}</h2>
        <select className="input" name="case_id" required>
          <option value="">{messages.admin.cases}</option>
          {cases.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
        <div className="grid gap-3 md:grid-cols-3">
          <select className="input" name="asset_type" defaultValue="photo">
            {["photo", "video", "pdf", "document", "lab_report", "raw_data"].map((type) => <option key={type}>{type}</option>)}
          </select>
          <select className="input" name="evidence_stage" defaultValue="supporting">
            {["before", "during", "after", "final", "supporting"].map((stage) => <option key={stage}>{stage}</option>)}
          </select>
          <input className="input" name="title" placeholder="Title" />
        </div>
        <input className="input" name="file_url" placeholder="Existing file URL, or upload below" />
        <input className="input" name="storage_key" placeholder="Storage key for existing file" />
        <input className="input" name="file" type="file" />
        <textarea className="input" name="caption" placeholder="Caption" />
        <input className="input" name="alt_text" placeholder="Alt text" />
        <div className="grid gap-3 md:grid-cols-2">
          <select className="input" name="verification_status" defaultValue="pending">
            {["pending", "approved", "restricted"].map((status) => <option key={status}>{status}</option>)}
          </select>
          <select className="input" name="consent_status" defaultValue="unknown">
            {["unknown", "approved", "restricted"].map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" type="submit">{messages.admin.attachEvidence}</button>
      </form>
      <div className="mt-8 grid gap-3">
        {assets.map((asset) => (
          <div className="card grid gap-1 p-3 text-sm" key={asset.id}>
            <p className="font-bold">{publicEvidenceLabel(asset, locale)}</p>
            <p className="text-muted-foreground">Original source reference: {asset.title || asset.file_name || asset.file_url}</p>
            <p className="text-muted-foreground">Internal type: {asset.asset_type} / status: {asset.verification_status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

