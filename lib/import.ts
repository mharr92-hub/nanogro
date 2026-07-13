import { buildCaseSlug, slugify } from "@/lib/slug";
import type { ImportValidation } from "@/lib/types";

const requiredColumns = ["crop", "country"];

export function parseCsv(text: string) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = splitCsvLine(lines[0]).map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row = headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = values[index]?.trim() ?? "";
      return row;
    }, {});
    return normalizeImportRow(row);
  });
}

export function normalizeImportRow(row: Record<string, string>) {
  const normalized = { ...row };
  if (!normalized.primary_problem && normalized.problem) normalized.primary_problem = normalized.problem;
  if (!normalized.results_summary && normalized.result_summary) normalized.results_summary = normalized.result_summary;
  if (!normalized.results_summary && normalized.extracted_results) normalized.results_summary = firstListItem(normalized.extracted_results);
  if (!normalized.farm_size_value && normalized.farm_size) normalized.farm_size_value = normalized.farm_size;
  if (!normalized.evidence_folder_name && normalized.source_folder) normalized.evidence_folder_name = normalized.source_folder;
  if (!normalized.has_testimonial && normalized.testimonial) normalized.has_testimonial = "true";
  if (!normalized.source_full_text && normalized.full_text) normalized.source_full_text = normalized.full_text;
  if (!normalized.source_full_text && normalized.document_text) normalized.source_full_text = normalized.document_text;
  if (!normalized.source_full_text && normalized.raw_text) normalized.source_full_text = normalized.raw_text;
  if (!normalized.extracted_variety && normalized.variety) normalized.extracted_variety = normalized.variety;
  if (!normalized.extracted_location && normalized.location) normalized.extracted_location = normalized.location;
  if (!normalized.extracted_location && normalized.region) normalized.extracted_location = normalized.region;
  if (!normalized.extracted_dates && normalized.date) normalized.extracted_dates = normalized.date;
  if (!normalized.extracted_dates && normalized.dates) normalized.extracted_dates = normalized.dates;
  if (!normalized.extracted_observations && normalized.observations) normalized.extracted_observations = normalized.observations;
  if (!normalized.extracted_recommendations && normalized.recommendations) normalized.extracted_recommendations = normalized.recommendations;
  if (!normalized.extracted_metrics && normalized.metrics) normalized.extracted_metrics = normalized.metrics;
  if (!normalized.technical_summary && normalized.structured_technical_summary) normalized.technical_summary = normalized.structured_technical_summary;
  if (!normalized.executive_narrative && normalized.public_narrative) normalized.executive_narrative = normalized.public_narrative;
  if (!normalized.summary && normalized.executive_narrative) normalized.summary = normalized.executive_narrative;
  return normalized;
}

export function validateImportRows(rows: Record<string, string>[]): ImportValidation[] {
  return rows.map((row, index) => {
    const errors: string[] = [];
    requiredColumns.forEach((column) => {
      if (!row[column]) errors.push(`Missing ${column}`);
    });
    if (!row.title && !row.public_id) errors.push("Missing title or public_id for generated title");
    if (!row.primary_problem && !row.results_summary) errors.push("Missing primary_problem or results_summary");
    if (row.evidence_level && !["A", "B", "C", "D"].includes(row.evidence_level)) errors.push("Evidence level must be A, B, C, or D");
    ["yield_increase_percent", "quality_improvement_percent", "disease_reduction_percent", "roi_value", "confidence_score", "case_completeness_score", "evidence_score"].forEach((column) => {
      if (row[column] && Number.isNaN(Number(row[column]))) errors.push(`${column} must be numeric`);
    });
    return { rowNumber: index + 2, raw: row, errors };
  });
}

export function rowToCaseDraft(
  row: Record<string, string>,
  ids: {
    crop_id: string;
    country_id: string;
    primary_problem_id: string;
    region_id?: string | null;
    application_method_id?: string | null;
  },
  computed: {
    slug: string;
    case_completeness_score: number;
    evidence_score: number;
    confidence_score: number;
    import_batch_id?: string;
    import_row_id?: string;
  }
) {
  return {
    public_id: row.public_id || `IMPORT-${slugify(row.title).slice(0, 48)}`,
    title: row.title || generatedCaseTitle(row),
    slug: computed.slug,
    summary: row.summary || null,
    crop_id: ids.crop_id,
    country_id: ids.country_id,
    region_id: ids.region_id ?? null,
    primary_problem_id: ids.primary_problem_id,
    application_method_id: ids.application_method_id ?? null,
    evidence_level: row.evidence_level || "D",
    nano_gro_application: row.nano_gro_application || null,
    dosage: row.dosage || null,
    application_frequency: row.application_frequency || null,
    farm_size_value: row.farm_size_value ? Number(row.farm_size_value) : null,
    farm_size_unit: row.farm_size_unit || "ha",
    baseline_conditions: row.baseline_conditions || null,
    treatment_notes: row.treatment_notes || null,
    results_summary: row.results_summary || null,
    yield_increase_percent: row.yield_increase_percent ? Number(row.yield_increase_percent) : null,
    quality_improvement_percent: row.quality_improvement_percent ? Number(row.quality_improvement_percent) : null,
    disease_reduction_percent: row.disease_reduction_percent ? Number(row.disease_reduction_percent) : null,
    roi_value: row.roi_value ? Number(row.roi_value) : null,
    roi_notes: row.roi_notes || null,
    source_full_text: row.source_full_text || null,
    source_extraction: buildSourceExtraction(row),
    extracted_variety: row.extracted_variety || null,
    extracted_location: row.extracted_location || null,
    extracted_dates: splitList(row.extracted_dates),
    extracted_observations: splitList(row.extracted_observations),
    extracted_recommendations: splitList(row.extracted_recommendations),
    extracted_results: splitList(row.extracted_results || row.results_summary),
    extracted_metrics: parseJsonOrExtractMetrics(row.extracted_metrics || row.metrics || row.source_full_text || ""),
    technical_summary: row.technical_summary || null,
    executive_narrative: row.executive_narrative || null,
    case_completeness_score: computed.case_completeness_score,
    evidence_score: computed.evidence_score,
    confidence_score: computed.confidence_score,
    verification_status: row.verification_status || "unverified",
    language: row.language || "es",
    featured: row.featured === "true",
    seo_title: row.seo_title || row.title || generatedCaseTitle(row),
    seo_description: row.seo_description || row.summary || row.results_summary || null,
    evidence_reference: row.evidence_reference || row.evidence_folder_name || row.source_folder || null,
    source_folder: row.source_folder || row.evidence_folder_name || null,
    internal_notes: row.internal_notes || null,
    import_batch_id: computed.import_batch_id ?? null,
    import_row_id: computed.import_row_id ?? null,
    publication_status: "draft"
  };
}

export function buildImportSlug(row: Record<string, string>) {
  return buildCaseSlug({
    crop: row.crop,
    country: row.country,
    problem: row.primary_problem,
    result: row.yield_increase_percent ? Number(row.yield_increase_percent) : null,
    title: row.title || generatedCaseTitle(row),
    publicId: row.public_id || null
  });
}

function generatedCaseTitle(row: Record<string, string>) {
  return [row.crop, row.country, row.primary_problem || "documented result"].filter(Boolean).join(" - ");
}

export function normalizeImportTerm(value: string) {
  return slugify(value.trim());
}

function splitCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function buildSourceExtraction(row: Record<string, string>) {
  return {
    extraction_version: "full_source_v1",
    extracted_fields: {
      crop: row.crop || null,
      variety: row.extracted_variety || null,
      country: row.country || null,
      location: row.extracted_location || row.region || null,
      dates: splitList(row.extracted_dates),
      dosage: row.dosage || null,
      application_type: row.application_method || row.nano_gro_application || null,
      observations: splitList(row.extracted_observations),
      recommendations: splitList(row.extracted_recommendations),
      results: splitList(row.extracted_results || row.results_summary),
      metrics: parseJsonOrExtractMetrics(row.extracted_metrics || row.metrics || row.source_full_text || "")
    },
    source_text_available: Boolean(row.source_full_text?.trim()),
    source_text_length: row.source_full_text?.length ?? 0,
    retained_raw_columns: Object.keys(row).sort()
  };
}

function splitList(value?: string | null) {
  return (value ?? "")
    .split(/\r?\n|;|\|/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function firstListItem(value?: string | null) {
  return splitList(value)[0] ?? "";
}

function parseJsonOrExtractMetrics(value: string) {
  if (!value.trim()) return extractPercentMetrics(value);
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null ? parsed : { values: parsed };
  } catch {
    return extractPercentMetrics(value);
  }
}

function extractPercentMetrics(value: string) {
  const matches = [...value.matchAll(/([+-]?\d+(?:[.,]\d+)?)\s*%/g)];
  return {
    percentages: matches.map((match) => ({
      label: "percentage_metric",
      value: Number(match[1].replace(",", ".")),
      unit: "%",
      context: value.slice(Math.max(0, match.index - 80), (match.index ?? 0) + match[0].length + 80).trim()
    }))
  };
}
