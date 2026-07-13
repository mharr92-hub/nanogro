import { notFound } from "next/navigation";
import { CaseForm } from "@/components/CaseForm";
import { getAdminCaseById, getTaxonomy } from "@/lib/data";
import { getLocale, getMessages } from "@/lib/i18n";
import { localizeCase, localizeTaxonomy } from "@/lib/localized-content";

export default async function EditCasePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params;
  const query = await searchParams;
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const [item, taxonomy] = await Promise.all([getAdminCaseById(id), getTaxonomy()]);
  if (!item) notFound();
  const localizedItem = localizeCase(item, locale);
  const localizedTaxonomy = {
    crops: localizeTaxonomy(taxonomy.crops, locale),
    countries: localizeTaxonomy(taxonomy.countries, locale),
    problems: localizeTaxonomy(taxonomy.problems, locale)
  };
  const warning = query.publication_error === "evidence_required" ? messages.admin.publicationWarning : null;
  return (
    <div>
      <h1 className="text-3xl font-black">{messages.admin.editCase}</h1>
      <p className="mt-2 text-muted-foreground">{messages.admin.permanentSlug}: {item.slug}</p>
      <div className="mt-6">
        <CaseForm item={localizedItem} {...localizedTaxonomy} messages={messages} publicationWarning={warning} />
      </div>
    </div>
  );
}

