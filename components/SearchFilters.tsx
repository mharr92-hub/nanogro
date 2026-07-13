import type { Country, TaxonomyItem } from "@/lib/types";
import type { Locale, Messages } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n";

export function SearchFilters({
  crops,
  countries,
  problems,
  defaults,
  messages,
  locale
}: {
  crops: TaxonomyItem[];
  countries: Country[];
  problems: TaxonomyItem[];
  defaults?: Record<string, string | undefined>;
  messages: Messages;
  locale: Locale;
}) {
  return (
    <form className="card grid gap-3 p-4 md:grid-cols-6" action={localizedHref(locale, "/cases")}>
      <input className="input md:col-span-2" name="q" placeholder={messages.cases.searchPlaceholder} defaultValue={defaults?.q} />
      <Select name="problem" label={messages.common.problem} items={problems} value={defaults?.problem} />
      <Select name="crop" label={messages.common.crop} items={crops} value={defaults?.crop} />
      <Select name="country" label={messages.common.country} items={countries} value={defaults?.country} />
      <select className="input" name="evidence" defaultValue={defaults?.evidence ?? ""}>
        <option value="">{messages.common.evidence}</option>
        {["A", "B", "C", "D"].map((level) => <option key={level} value={level}>{messages.common.level} {level}</option>)}
      </select>
      <select className="input" name="minCompleteness" defaultValue={defaults?.minCompleteness ?? ""}>
        <option value="">{messages.common.completeness}</option>
        <option value="80">80+</option>
        <option value="60">60+</option>
        <option value="40">40+</option>
      </select>
      <button className="btn btn-primary md:col-span-6" type="submit">{messages.cases.searchButton}</button>
    </form>
  );
}

function Select({ name, label, items, value }: { name: string; label: string; items: TaxonomyItem[]; value?: string }) {
  return (
    <select className="input" name={name} defaultValue={value ?? ""}>
      <option value="">{label}</option>
      {items.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
    </select>
  );
}

