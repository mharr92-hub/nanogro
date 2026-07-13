import Link from "next/link";
import { getAdminCases } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCase } from "@/lib/localized-content";
import { boolLabel, getEvidenceProfile } from "@/lib/publication-quality";

export default async function AdminCasesPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const cases = await getAdminCases();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">{messages.admin.cases}</h1>
        <Link className="btn btn-primary" href={localizedHref(locale, "/admin/cases/new")}>{messages.admin.newCase}</Link>
      </div>
      <div className="card mt-6 overflow-auto">
        <table className="w-full min-w-[1500px] text-left text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">{messages.caseForm.publicId}</th>
              <th className="p-3">{messages.caseForm.title}</th>
              <th className="p-3">{messages.common.crop}</th>
              <th className="p-3">{messages.common.country}</th>
              <th className="p-3">{messages.common.problem}</th>
              <th className="p-3">{messages.common.evidence}</th>
              <th className="p-3">{messages.cases.complete}</th>
              <th className="p-3">{messages.admin.hasOriginalReport}</th>
              <th className="p-3">{messages.admin.hasPhotos}</th>
              <th className="p-3">{messages.admin.hasVideo}</th>
              <th className="p-3">{messages.admin.hasPdf}</th>
              <th className="p-3">{messages.admin.hasTestimonial}</th>
              <th className="p-3">{messages.admin.hasTechnicalValidation}</th>
              <th className="p-3">{messages.admin.publicationEligibility}</th>
              <th className="p-3">{messages.admin.status}</th>
              <th className="p-3">{messages.admin.actions}</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((rawItem) => {
              const item = localizeCase(rawItem, locale);
              const profile = getEvidenceProfile(rawItem);
              const labels = { yes: messages.admin.yes, no: messages.admin.no };
              return (
                <tr className="border-t border-border" key={item.id}>
                  <td className="p-3">{item.public_id}</td>
                  <td className="p-3 font-bold">{item.title}</td>
                  <td className="p-3">{item.crop?.name}</td>
                  <td className="p-3">{item.country?.name}</td>
                  <td className="p-3">{item.primary_problem?.name}</td>
                  <td className="p-3">{messages.common.level} {item.evidence_level}</td>
                  <td className="p-3">{item.case_completeness_score ?? 0}/100</td>
                  <td className="p-3">{boolLabel(profile.hasOriginalReport, labels)}</td>
                  <td className="p-3">{boolLabel(profile.hasPhotos, labels)}</td>
                  <td className="p-3">{boolLabel(profile.hasVideo, labels)}</td>
                  <td className="p-3">{boolLabel(profile.hasPdf, labels)}</td>
                  <td className="p-3">{boolLabel(profile.hasTestimonial, labels)}</td>
                  <td className="p-3">{boolLabel(profile.hasTechnicalValidation, labels)}</td>
                  <td className="p-3 font-bold text-primary">{profile.publicationEligible ? messages.admin.eligible : messages.admin.notEligible}</td>
                  <td className="p-3">{item.publication_status}</td>
                  <td className="p-3"><Link className="font-bold text-primary" href={localizedHref(locale, `/admin/cases/${item.id}`)}>{messages.admin.editCase}</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

