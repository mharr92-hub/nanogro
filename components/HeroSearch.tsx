import { localizedHref, type Locale, type Messages } from "@/lib/i18n-shared";
import type { Country, TaxonomyItem } from "@/lib/types";

/**
 * El buscador ES el hero. No hay banner decorativo encima.
 *
 * La spec define la home como "problem-first search with crop, country, and symptom
 * shortcuts": lo primero que ve un agricultor no es una promesa de marca, es el campo
 * donde escribe su cultivo. Es un <form> GET nativo hacia /cases: funciona sin JavaScript
 * y es indexable.
 */
export function HeroSearch({
  crops,
  countries,
  problems,
  defaults,
  locale,
  messages,
  compact = false
}: {
  crops: TaxonomyItem[];
  countries: Country[];
  problems: TaxonomyItem[];
  defaults?: { q?: string; crop?: string; country?: string; problem?: string };
  locale: Locale;
  messages: Messages;
  compact?: boolean;
}) {
  return (
    <form action={localizedHref(locale, "/cases")} className={compact ? "grid gap-3" : "card grid gap-3 p-4 sm:p-5"}>
      <div className="grid gap-3 sm:grid-cols-3">
        <Select
          name="crop"
          label={messages.hero.crop}
          anyLabel={messages.hero.anyCrop}
          items={crops}
          defaultValue={defaults?.crop}
        />
        <Select
          name="country"
          label={messages.hero.country}
          anyLabel={messages.hero.anyCountry}
          items={countries}
          defaultValue={defaults?.country}
        />
        <Select
          name="problem"
          label={messages.hero.problem}
          anyLabel={messages.hero.anyProblem}
          items={problems}
          defaultValue={defaults?.problem}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="field-label">
          <span className="sr-only">{messages.hero.keyword}</span>
          <input
            className="input"
            name="q"
            type="search"
            placeholder={messages.hero.keyword}
            defaultValue={defaults?.q}
          />
        </label>
        <button className="btn btn-primary" type="submit">
          {messages.hero.search}
        </button>
      </div>
    </form>
  );
}

function Select({
  name,
  label,
  anyLabel,
  items,
  defaultValue
}: {
  name: string;
  label: string;
  anyLabel: string;
  items: TaxonomyItem[];
  defaultValue?: string;
}) {
  return (
    <label className="field-label">
      {label}
      <select className="input" name={name} defaultValue={defaultValue ?? ""}>
        <option value="">{anyLabel}</option>
        {items.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}
