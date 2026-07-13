import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";
import { Container, SectionTitle, CtaLink } from "@/components/ui";
import { CaseCard } from "@/components/CaseCard";
import { searchCases, suggestNearest, type CaseFilters } from "@/lib/search";
import { localizedName, t } from "@/lib/format";
import { href } from "@/lib/nav";

export const revalidate = 600;

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const one = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;
const num = (v: string | string[] | undefined): number | undefined => {
  const s = one(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

export default async function CaseStudiesPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const sp = await searchParams;

  const filters: CaseFilters = {
    query: one(sp.query),
    crop: one(sp.crop),
    country: one(sp.country),
    climate: one(sp.climate),
    problem: one(sp.problem),
    verification: one(sp.verification),
    success: one(sp.success),
    minYield: num(sp.minYield),
    minRoi: num(sp.minRoi),
    minConfidence: num(sp.minConfidence),
    sort: (one(sp.sort) as CaseFilters["sort"]) ?? "relevance",
    page: num(sp.page) ?? 1,
  };

  const result = await searchCases(filters);
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const basePath = href(lang, "/case-studies");

  // Preserve current filters when building a page link.
  const pageHref = (p: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      const val = one(v);
      if (val && k !== "page") qs.set(k, val);
    }
    qs.set("page", String(p));
    return `${basePath}?${qs.toString()}`;
  };

  const sel = (current: string | undefined, value: string) =>
    current === value ? "selected" : undefined;

  return (
    <Container className="py-10">
      <SectionTitle>{dict.cases.title}</SectionTitle>
      <p className="mt-2 text-sm text-muted">{t(dict.cases.resultsCount, { count: result.total })}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters (GET form, no client JS) */}
        <aside>
          <form method="get" action={basePath} className="space-y-4 rounded-xl border border-border bg-white p-4 text-sm">
            <h2 className="font-semibold">{dict.cases.filters}</h2>
            {filters.query && <input type="hidden" name="query" defaultValue={filters.query} />}

            <Field label={dict.cases.crop}>
              <select name="crop" defaultValue={filters.crop ?? ""} className="filter-select">
                <option value="">—</option>
                {result.facets.crops.map((f) => (
                  <option key={f.slug} value={f.slug}>{localizedName(f, lang)} ({f.count})</option>
                ))}
              </select>
            </Field>
            <Field label={dict.cases.country}>
              <select name="country" defaultValue={filters.country ?? ""} className="filter-select">
                <option value="">—</option>
                {result.facets.countries.map((f) => (
                  <option key={f.slug} value={f.slug}>{localizedName(f, lang)} ({f.count})</option>
                ))}
              </select>
            </Field>
            <Field label={dict.cases.climate}>
              <select name="climate" defaultValue={filters.climate ?? ""} className="filter-select">
                <option value="">—</option>
                {result.facets.climates.map((f) => (
                  <option key={f.slug} value={f.slug}>{localizedName(f, lang)} ({f.count})</option>
                ))}
              </select>
            </Field>
            <Field label={dict.cases.problem}>
              <select name="problem" defaultValue={filters.problem ?? ""} className="filter-select">
                <option value="">—</option>
                {result.facets.problems.map((f) => (
                  <option key={f.slug} value={f.slug}>{localizedName(f, lang)} ({f.count})</option>
                ))}
              </select>
            </Field>
            <Field label={dict.cases.verification}>
              <select name="verification" defaultValue={filters.verification ?? ""} className="filter-select">
                <option value="">—</option>
                {(["LAB_VERIFIED", "AGRONOMIST_VERIFIED", "DISTRIBUTOR_VERIFIED", "SELF_REPORTED"] as const).map((v) => (
                  <option key={v} value={v} {...(sel(filters.verification, v) ? { selected: true } : {})}>
                    {dict.verification[v]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={dict.cases.minYield}>
              <input type="number" name="minYield" min={0} defaultValue={filters.minYield ?? ""} className="filter-select" />
            </Field>
            <Field label={dict.cases.minRoi}>
              <input type="number" name="minRoi" min={0} defaultValue={filters.minRoi ?? ""} className="filter-select" />
            </Field>
            <Field label={dict.cases.minConfidence}>
              <input type="number" name="minConfidence" min={0} max={100} defaultValue={filters.minConfidence ?? ""} className="filter-select" />
            </Field>

            <Field label={dict.cases.sort}>
              <select name="sort" defaultValue={filters.sort} className="filter-select">
                <option value="relevance">{dict.cases.sortRelevance}</option>
                <option value="confidence">{dict.cases.sortConfidence}</option>
                <option value="yield">{dict.cases.sortYield}</option>
                <option value="roi">{dict.cases.sortRoi}</option>
                <option value="recent">{dict.cases.sortRecent}</option>
              </select>
            </Field>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 rounded-lg bg-brand px-3 py-2 font-semibold text-white hover:bg-brand-dark">
                {dict.cases.filters}
              </button>
              <Link href={basePath} className="rounded-lg border border-border px-3 py-2 text-center hover:bg-gray-50">
                {dict.cases.clear}
              </Link>
            </div>
          </form>
        </aside>

        {/* Results */}
        <div>
          {result.cases.length === 0 ? (
            <ZeroResults lang={lang} dict={dict} filters={filters} />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {result.cases.map((c) => (
                  <CaseCard key={c.id} c={c} locale={lang} dict={dict} />
                ))}
              </div>
              {totalPages > 1 && (
                <nav className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={pageHref(p)}
                      className={p === result.page ? "rounded bg-brand px-3 py-1.5 text-sm text-white" : "rounded border border-border px-3 py-1.5 text-sm hover:bg-gray-50"}
                    >
                      {p}
                    </Link>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`.filter-select{width:100%;border:1px solid var(--border);border-radius:0.5rem;padding:0.4rem 0.5rem;background:#fff}`}</style>
    </Container>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

async function ZeroResults({
  lang,
  dict,
  filters,
}: {
  lang: "en" | "es";
  dict: Awaited<ReturnType<typeof getDictionary>>;
  filters: CaseFilters;
}) {
  const nearest = await suggestNearest(filters);
  return (
    <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center">
      <p className="font-semibold">{dict.cases.noResults}</p>
      <p className="mt-1 text-sm text-muted">{dict.cases.noResultsHint}</p>
      <div className="mt-4">
        <CtaLink href={href(lang, "/diagnostic")}>{dict.nav.diagnostic}</CtaLink>
      </div>
      {nearest.length > 0 && (
        <div className="mt-8 grid gap-6 text-left sm:grid-cols-2 xl:grid-cols-3">
          {nearest.map((c) => (
            <CaseCard key={c.id} c={c} locale={lang} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
