import { CaseForm } from "@/components/CaseForm";
import { getTaxonomy } from "@/lib/data";
import { getLocale, getMessages } from "@/lib/i18n";
import { localizeTaxonomy } from "@/lib/localized-content";

export default async function NewCasePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const query = await searchParams;
  const taxonomy = await getTaxonomy();
  const localizedTaxonomy = {
    crops: localizeTaxonomy(taxonomy.crops, locale),
    countries: localizeTaxonomy(taxonomy.countries, locale),
    problems: localizeTaxonomy(taxonomy.problems, locale)
  };
  const warning = query.publication_error === "evidence_required" ? messages.admin.publicationWarning : null;
  return (
    <div>
      <h1 className="text-3xl font-black">{messages.admin.createCase}</h1>
      <div className="mt-6">
        <CaseForm {...localizedTaxonomy} messages={messages} publicationWarning={warning} />
      </div>
    </div>
  );
}

