import { localizedHref, type Locale, type Messages } from "@/lib/i18n-shared";
import type { Country, TaxonomyItem } from "@/lib/types";

export type CaseFilters = {
  q?: string;
  crop?: string;
  country?: string;
  problem?: string;
  evidence?: string;
  minImprovement?: string;
  minRoi?: string;
  media?: string;
  sort?: string;
};

export type FacetCounts = {
  crops: Record<string, number>;
  countries: Record<string, number>;
  problems: Record<string, number>;
  evidence: Record<string, number>;
};

/**
 * Panel de filtros facetados con contadores (spec, seccion 8: "faceted filters with
 * instant counts").
 *
 * Es un <form> GET nativo, no un widget de cliente: cada filtro deja una URL compartible
 * e indexable, y funciona en un telefono con JavaScript lento o caido. En movil el panel
 * se colapsa dentro de un <details>, que es un drawer sin una sola linea de JS.
 */
export function CaseFacets({
  crops,
  countries,
  problems,
  counts,
  filters,
  locale,
  messages
}: {
  crops: TaxonomyItem[];
  countries: Country[];
  problems: TaxonomyItem[];
  counts: FacetCounts;
  filters: CaseFilters;
  locale: Locale;
  messages: Messages;
}) {
  const fields = (
    <div className="grid gap-4">
      <label className="field-label">
        {messages.hero.keyword}
        <input className="input" name="q" type="search" defaultValue={filters.q ?? ""} />
      </label>

      <FacetSelect
        name="crop"
        label={messages.common.crop}
        anyLabel={messages.facets.any}
        items={crops}
        counts={counts.crops}
        value={filters.crop}
      />
      <FacetSelect
        name="country"
        label={messages.common.country}
        anyLabel={messages.facets.any}
        items={countries}
        counts={counts.countries}
        value={filters.country}
      />
      <FacetSelect
        name="problem"
        label={messages.common.problem}
        anyLabel={messages.facets.any}
        items={problems}
        counts={counts.problems}
        value={filters.problem}
      />

      <label className="field-label">
        {messages.facets.evidenceLevel}
        <select className="input" name="evidence" defaultValue={filters.evidence ?? ""}>
          <option value="">{messages.facets.any}</option>
          {(["A", "B", "C", "D"] as const).map((level) => (
            <option key={level} value={level}>
              {messages.evidenceLevels.short.replace("{level}", level)} ({counts.evidence[level] ?? 0})
            </option>
          ))}
        </select>
      </label>

      <label className="field-label">
        {messages.facets.minImprovement}
        <select className="input" name="minImprovement" defaultValue={filters.minImprovement ?? ""}>
          <option value="">{messages.facets.any}</option>
          {["5", "10", "20", "40"].map((value) => (
            <option key={value} value={value}>
              +{value}%
            </option>
          ))}
        </select>
      </label>

      <label className="field-label">
        {messages.facets.minRoi}
        <select className="input" name="minRoi" defaultValue={filters.minRoi ?? ""}>
          <option value="">{messages.facets.any}</option>
          {["2", "5", "10"].map((value) => (
            <option key={value} value={value}>
              {value}x
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-start gap-3 text-body">
        <input
          className="mt-1 h-5 w-5"
          type="checkbox"
          name="media"
          value="1"
          defaultChecked={filters.media === "1"}
        />
        <span>{messages.facets.hasMediaLabel}</span>
      </label>

      <label className="field-label">
        {messages.facets.sortBy}
        <select className="input" name="sort" defaultValue={filters.sort ?? "relevance"}>
          <option value="relevance">{messages.facets.sortRelevance}</option>
          <option value="newest">{messages.facets.sortNewest}</option>
          <option value="improvement">{messages.facets.sortImprovement}</option>
          <option value="roi">{messages.facets.sortRoi}</option>
          <option value="confidence">{messages.facets.sortConfidence}</option>
        </select>
      </label>

      <button className="btn btn-primary" type="submit">
        {messages.facets.apply}
      </button>
      <a className="btn btn-ghost" href={localizedHref(locale, "/cases")}>
        {messages.facets.clear}
      </a>
    </div>
  );

  return (
    <form action={localizedHref(locale, "/cases")}>
      {/* Movil: drawer nativo con <details>. Escritorio: panel siempre abierto. */}
      <details className="card p-4 lg:hidden" open={hasActiveFilters(filters)}>
        <summary className="cursor-pointer text-body font-semibold text-foreground">
          {messages.facets.openFilters}
        </summary>
        <div className="mt-4">{fields}</div>
      </details>
      <div className="card hidden p-5 lg:block">
        <h2 className="mb-4 text-h4 text-foreground">{messages.facets.title}</h2>
        {fields}
      </div>
    </form>
  );
}

function FacetSelect({
  name,
  label,
  anyLabel,
  items,
  counts,
  value
}: {
  name: string;
  label: string;
  anyLabel: string;
  items: TaxonomyItem[];
  counts: Record<string, number>;
  value?: string;
}) {
  return (
    <label className="field-label">
      {label}
      <select className="input" name={name} defaultValue={value ?? ""}>
        <option value="">{anyLabel}</option>
        {items.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name} ({counts[item.slug] ?? 0})
          </option>
        ))}
      </select>
    </label>
  );
}

function hasActiveFilters(filters: CaseFilters) {
  return Boolean(
    filters.q ||
      filters.crop ||
      filters.country ||
      filters.problem ||
      filters.evidence ||
      filters.minImprovement ||
      filters.minRoi ||
      filters.media
  );
}
