import { cache } from "react";
import { getSupabaseAdmin, getSupabasePublic } from "@/lib/supabase/server";
import { mockCases, mockCountries, mockCrops, mockProblems } from "@/lib/mock-data";
import { canPublishCase } from "@/lib/publication-quality";
import type { CaseStudy, Country, Lead, TaxonomyItem } from "@/lib/types";

const caseSelect = `
  *,
  crop:crops(*),
  country:countries(*),
  region:regions(*),
  primary_problem:problems(*),
  evidence_assets(*)
`;

export const getTaxonomy = cache(async () => {
  const supabase = getSupabasePublic();
  if (!supabase) {
    return { crops: mockCrops, countries: mockCountries, problems: mockProblems };
  }
  const [crops, countries, problems] = await Promise.all([
    supabase.from("crops").select("*").order("name"),
    supabase.from("countries").select("*").order("name"),
    supabase.from("problems").select("*").order("name")
  ]);
  return {
    crops: (crops.data ?? []) as TaxonomyItem[],
    countries: (countries.data ?? []) as Country[],
    problems: (problems.data ?? []) as TaxonomyItem[]
  };
});

export const getPublishedCases = cache(async (filters?: {
  q?: string;
  crop?: string;
  country?: string;
  problem?: string;
  evidence?: string;
  minCompleteness?: string;
}) => {
  const supabase = getSupabasePublic();
  if (!supabase) return filterCases(mockCases.filter(canPublishCase), filters);

  let query = supabase
    .from("cases")
    .select(caseSelect)
    .eq("publication_status", "published")
    .order("case_completeness_score", { ascending: false });

  if (filters?.evidence) query = query.eq("evidence_level", filters.evidence);
  if (filters?.minCompleteness) query = query.gte("case_completeness_score", Number(filters.minCompleteness));

  const { data } = await query;
  return filterCases(((data ?? []) as CaseStudy[]).filter(canPublishCase), filters);
});

export const getAdminCases = cache(async () => {
  const supabase = getSupabaseAdmin();
  if (!supabase) return mockCases;
  const { data } = await supabase.from("cases").select(caseSelect).order("updated_at", { ascending: false });
  return (data ?? []) as CaseStudy[];
});

export async function getCaseBySlug(slug: string) {
  const supabase = getSupabasePublic();
  if (!supabase) {
    const item = mockCases.find((caseItem) => caseItem.slug === slug && caseItem.publication_status === "published") ?? null;
    return item && canPublishCase(item) ? item : null;
  }
  const { data } = await supabase
    .from("cases")
    .select(caseSelect)
    .eq("slug", slug)
    .eq("publication_status", "published")
    .maybeSingle();
  const item = (data as CaseStudy | null) ?? null;
  return item && canPublishCase(item) ? item : null;
}

export async function getAdminCaseById(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return mockCases.find((item) => item.id === id) ?? null;
  const { data } = await supabase.from("cases").select(caseSelect).eq("id", id).maybeSingle();
  return (data as CaseStudy | null) ?? null;
}

export async function getCasesByTaxonomy(type: "crop" | "country" | "problem", slug: string) {
  const cases = await getPublishedCases();
  if (type === "problem") return cases.filter((item) => item.primary_problem?.slug === slug);
  if (type === "crop") return cases.filter((item) => item.crop?.slug === slug);
  return cases.filter((item) => item.country?.slug === slug);
}

export async function getLeads() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [] as Lead[];
  const { data } = await supabase
    .from("leads")
    .select("*, crop:crops(*), country:countries(*), problem:problems(*)")
    .order("created_at", { ascending: false });
  return (data ?? []) as Lead[];
}

export async function getImportBatches() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase.from("import_batches").select("*, import_rows(*)").order("created_at", { ascending: false });
  return data ?? [];
}

function filterCases(cases: CaseStudy[], filters?: Parameters<typeof getPublishedCases>[0]) {
  return cases.filter((item) => {
    const q = filters?.q?.trim().toLowerCase();
    const text = [item.title, item.summary, item.results_summary, item.crop?.name, item.country?.name, item.primary_problem?.name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (q && !text.includes(q)) return false;
    if (filters?.crop && item.crop?.slug !== filters.crop) return false;
    if (filters?.country && item.country?.slug !== filters.country) return false;
    if (filters?.problem && item.primary_problem?.slug !== filters.problem) return false;
    if (filters?.evidence && item.evidence_level !== filters.evidence) return false;
    if (filters?.minCompleteness && (item.case_completeness_score ?? 0) < Number(filters.minCompleteness)) return false;
    return true;
  }).sort(sortCasesByInformation);
}

function sortCasesByInformation(a: CaseStudy, b: CaseStudy) {
  return (
    (b.case_completeness_score ?? 0) - (a.case_completeness_score ?? 0) ||
    (b.evidence_score ?? 0) - (a.evidence_score ?? 0) ||
    (b.confidence_score ?? 0) - (a.confidence_score ?? 0) ||
    a.title.localeCompare(b.title)
  );
}
