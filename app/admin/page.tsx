import Link from "next/link";
import { getAdminCases, getImportBatches, getLeads } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCase } from "@/lib/localized-content";

export default async function AdminDashboardPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const [cases, leads, imports] = await Promise.all([getAdminCases(), getLeads(), getImportBatches()]);
  const published = cases.filter((item) => item.publication_status === "published").length;
  const drafts = cases.filter((item) => item.publication_status === "draft").length;
  const review = cases.filter((item) => item.publication_status === "review").length;
  return (
    <div>
      <h1 className="text-3xl font-black">{messages.admin.launchDashboard}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Kpi label={messages.admin.published} value={published} />
        <Kpi label={messages.admin.drafts} value={drafts} />
        <Kpi label={messages.admin.review} value={review} />
        <Kpi label={messages.admin.leads} value={leads.length} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-xl font-black">{messages.admin.reviewQueue}</h2>
          <div className="mt-4 grid gap-2">
            {cases.filter((item) => item.publication_status === "review").slice(0, 8).map((rawItem) => {
              const item = localizeCase(rawItem, locale);
              return <Link className="rounded bg-muted p-3 font-semibold" href={localizedHref(locale, `/admin/cases/${item.id}`)} key={item.id}>{item.title}</Link>;
            })}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-xl font-black">{messages.admin.recentImportBatches}</h2>
          <div className="mt-4 grid gap-2 text-sm">
            {imports.slice(0, 8).map((item: { id: string; file_name: string; status: string; total_rows: number }) => (
              <p className="rounded bg-muted p-3" key={item.id}>{item.file_name} / {item.status} / {item.total_rows ?? 0} rows</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-4xl font-black">{value}</p>
    </div>
  );
}

