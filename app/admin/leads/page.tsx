import { getLeads } from "@/lib/data";
import { getMessages } from "@/lib/i18n";

export default async function LeadsPage() {
  const messages = await getMessages();
  const leads = await getLeads();
  return (
    <div>
      <h1 className="text-3xl font-black">{messages.leads.title}</h1>
      <div className="card mt-6 overflow-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">{messages.admin.name}</th><th className="p-3">{messages.leads.whatsapp}</th><th className="p-3">{messages.common.country}</th><th className="p-3">{messages.common.crop}</th><th className="p-3">{messages.diagnostic.area}</th><th className="p-3">{messages.common.problem}</th><th className="p-3">{messages.admin.score}</th><th className="p-3">{messages.leads.status}</th></tr>
          </thead>
          <tbody>
            {leads.map((item) => (
              <tr className="border-t border-border" key={item.id}>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.whatsapp}</td>
                <td className="p-3">{item.country?.name ?? item.country_text ?? "-"}</td>
                <td className="p-3">{item.crop?.name ?? item.crop_text ?? "-"}</td>
                <td className="p-3">{item.area_text ?? "-"}</td>
                <td className="p-3">{item.problem?.name ?? item.problem_text ?? "-"}</td>
                <td className="p-3">{item.lead_score}</td>
                <td className="p-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

