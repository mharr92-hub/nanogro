"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearAdminSession, setAdminSession } from "@/lib/auth";
import { generateCaseDataQuality } from "@/lib/case-report";
import { buildImportSlug, normalizeImportTerm, parseCsv, rowToCaseDraft, validateImportRows } from "@/lib/import";
import { getEvidenceProfile } from "@/lib/publication-quality";
import { buildCaseSlug, slugify } from "@/lib/slug";
import { calculateConfidenceScore, calculateLeadScore } from "@/lib/scoring";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { CaseStudy, EvidenceAsset } from "@/lib/types";

const caseSchema = z.object({
  title: z.string().min(2),
  public_id: z.string().min(1),
  slug: z.string().optional(),
  summary: z.string().optional(),
  crop_id: z.string().min(1),
  country_id: z.string().min(1),
  region_id: z.string().optional(),
  primary_problem_id: z.string().min(1),
  evidence_level: z.enum(["A", "B", "C", "D"]),
  nano_gro_application: z.string().optional(),
  dosage: z.string().optional(),
  application_frequency: z.string().optional(),
  farm_size_value: z.coerce.number().optional(),
  baseline_conditions: z.string().optional(),
  treatment_notes: z.string().optional(),
  results_summary: z.string().optional(),
  yield_increase_percent: z.coerce.number().optional(),
  quality_improvement_percent: z.coerce.number().optional(),
  disease_reduction_percent: z.coerce.number().optional(),
  roi_value: z.coerce.number().optional(),
  roi_notes: z.string().optional(),
  case_completeness_score: z.coerce.number().optional(),
  evidence_score: z.coerce.number().optional(),
  confidence_score: z.coerce.number().optional(),
  evidence_reference: z.string().optional(),
  source_folder: z.string().optional(),
  data_status: z.string().optional(),
  missing_fields_text: z.string().optional(),
  estimated_fields_text: z.string().optional(),
  inferred_fields_text: z.string().optional(),
  pending_confirmation_fields_text: z.string().optional(),
  technical_questions_text: z.string().optional(),
  internal_notes: z.string().optional(),
  public_data_disclaimer: z.string().optional(),
  field_status_json: z.string().optional(),
  source_full_text: z.string().optional(),
  source_extraction_json: z.string().optional(),
  extracted_variety: z.string().optional(),
  extracted_location: z.string().optional(),
  extracted_dates_text: z.string().optional(),
  extracted_observations_text: z.string().optional(),
  extracted_recommendations_text: z.string().optional(),
  extracted_results_text: z.string().optional(),
  extracted_metrics_json: z.string().optional(),
  technical_summary: z.string().optional(),
  executive_narrative: z.string().optional(),
  verification_status: z.string().default("unverified"),
  publication_status: z.enum(["draft", "review", "approved", "published", "archived"]),
  seo_title: z.string().optional(),
  seo_description: z.string().optional()
});

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password && password === process.env.ADMIN_PASSWORD) {
    await setAdminSession();
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/");
}

export async function saveCase(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) redirect("/admin/cases?missing_env=1");
  const id = String(formData.get("id") ?? "");
  const parsed = caseSchema.parse(Object.fromEntries(formData));
  const slug = parsed.slug ? slugify(parsed.slug) : buildCaseSlug({ title: parsed.title, publicId: parsed.public_id, result: parsed.yield_increase_percent });
  const payload = {
    ...parsed,
    slug,
    region_id: parsed.region_id || null,
    summary: parsed.summary || null,
    farm_size_value: parsed.farm_size_value || null,
    missing_fields: splitLines(parsed.missing_fields_text),
    estimated_fields: splitLines(parsed.estimated_fields_text),
    inferred_fields: splitLines(parsed.inferred_fields_text),
    pending_confirmation_fields: splitLines(parsed.pending_confirmation_fields_text),
    technical_questions: splitLines(parsed.technical_questions_text),
    field_status: parseJsonObject(parsed.field_status_json),
    source_full_text: parsed.source_full_text || null,
    source_extraction: parseJsonObject(parsed.source_extraction_json),
    extracted_dates: splitLines(parsed.extracted_dates_text),
    extracted_observations: splitLines(parsed.extracted_observations_text),
    extracted_recommendations: splitLines(parsed.extracted_recommendations_text),
    extracted_results: splitLines(parsed.extracted_results_text),
    extracted_metrics: parseJsonObject(parsed.extracted_metrics_json),
    seo_title: parsed.seo_title || parsed.title,
    seo_description: parsed.seo_description || parsed.summary || parsed.results_summary || null
  };
  delete payload.missing_fields_text;
  delete payload.estimated_fields_text;
  delete payload.inferred_fields_text;
  delete payload.pending_confirmation_fields_text;
  delete payload.technical_questions_text;
  delete payload.field_status_json;
  delete payload.source_extraction_json;
  delete payload.extracted_dates_text;
  delete payload.extracted_observations_text;
  delete payload.extracted_recommendations_text;
  delete payload.extracted_results_text;
  delete payload.extracted_metrics_json;
  if (parsed.publication_status === "published") {
    const eligible = await caseMeetsPublicationRequirements(id, payload as Partial<CaseStudy>);
    if (!eligible) {
      redirect(id ? `/admin/cases/${id}?publication_error=evidence_required` : "/admin/cases/new?publication_error=evidence_required");
    }
  }
  if (id) {
    await supabase.from("cases").update(payload).eq("id", id);
  } else {
    await supabase.from("cases").insert(payload);
  }
  revalidatePath("/admin/cases");
  revalidatePath("/cases");
  redirect("/admin/cases");
}

async function caseMeetsPublicationRequirements(id: string, payload: Partial<CaseStudy>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;
  const { data } = id
    ? await supabase.from("evidence_assets").select("*").eq("case_id", id)
    : { data: [] };
  const profile = getEvidenceProfile({
    id: id || "draft",
    public_id: payload.public_id || "",
    slug: payload.slug || "",
    title: payload.title || "",
    crop_id: payload.crop_id || "",
    country_id: payload.country_id || "",
    primary_problem_id: payload.primary_problem_id || "",
    evidence_level: payload.evidence_level || "D",
    publication_status: payload.publication_status || "draft",
    language: "es",
    featured: false,
    verification_status: payload.verification_status,
    evidence_reference: payload.evidence_reference,
    evidence_score: payload.evidence_score,
    field_status: payload.field_status as CaseStudy["field_status"],
    evidence_assets: (data ?? []) as EvidenceAsset[]
  });
  return profile.publicationEligible;
}

export async function saveTaxonomy(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) redirect("/admin/taxonomy?missing_env=1");
  const table = String(formData.get("table"));
  const name = String(formData.get("name"));
  const allowed = ["crops", "countries", "problems", "regions"];
  if (!allowed.includes(table)) throw new Error("Invalid taxonomy table");
  const payload: Record<string, string> = { name, slug: slugify(String(formData.get("slug") || name)) };
  if (table === "problems") payload.category = String(formData.get("category") || "general");
  if (table === "countries") payload.iso_code = String(formData.get("iso_code") || "");
  await supabase.from(table).insert(payload);
  revalidatePath("/admin/taxonomy");
  redirect("/admin/taxonomy");
}

export async function saveEvidence(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) redirect("/admin/evidence?missing_env=1");
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "evidence";
  const file = formData.get("file");
  const caseId = String(formData.get("case_id"));
  let fileUrl = String(formData.get("file_url") ?? "");
  let storageKey = String(formData.get("storage_key") ?? "");
  if (file instanceof File && file.size > 0) {
    storageKey = `${caseId}/${Date.now()}-${file.name}`;
    await supabase.storage.from(bucket).upload(storageKey, file, { upsert: false });
    const { data } = supabase.storage.from(bucket).getPublicUrl(storageKey);
    fileUrl = data.publicUrl;
  }
  await supabase.from("evidence_assets").insert({
    case_id: caseId,
    asset_type: String(formData.get("asset_type")),
    evidence_stage: String(formData.get("evidence_stage") || "supporting"),
    file_url: fileUrl,
    storage_key: storageKey || fileUrl,
    file_name: file instanceof File ? file.name : String(formData.get("file_name") || ""),
    title: String(formData.get("title") || ""),
    caption: String(formData.get("caption") || ""),
    alt_text: String(formData.get("alt_text") || ""),
    extracted_from_source: truthy(String(formData.get("extracted_from_source") || "")),
    visual_description: String(formData.get("visual_description") || "") || null,
    visual_findings: splitLines(String(formData.get("visual_findings_text") || "")),
    observable_evidence: String(formData.get("observable_evidence") || "") || null,
    vision_model: String(formData.get("vision_model") || "") || null,
    vision_confidence: formData.get("vision_confidence") ? Number(formData.get("vision_confidence")) : null,
    verification_status: String(formData.get("verification_status") || "pending"),
    consent_status: String(formData.get("consent_status") || "unknown")
  });
  revalidatePath("/admin/evidence");
  redirect("/admin/evidence");
}

export async function importCases(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) redirect("/admin/import?missing_env=1");
  const file = formData.get("file");
  if (!(file instanceof File)) redirect("/admin/import?error=no-file");
  const text = await file.text();
  const rows = parseCsv(text);
  const validation = validateImportRows(rows);
  const validRows = validation.filter((row) => row.errors.length === 0);
  const invalidRows = validation.filter((row) => row.errors.length > 0);
  const { data: batch } = await supabase
    .from("import_batches")
    .insert({
      file_name: file.name,
      status: "validated",
      total_rows: rows.length,
      valid_rows: validRows.length,
      error_rows: invalidRows.length,
      imported_rows: 0,
      skipped_rows: 0
    })
    .select("id")
    .single();
  if (batch) {
    await supabase.from("import_rows").insert(
      validation.map((row) => ({
        batch_id: batch.id,
        row_number: row.rowNumber,
        raw_data: row.raw,
        validation_errors: row.errors,
        status: row.errors.length ? "invalid" : "valid"
      }))
    );
  }
  redirect("/admin/import");
}

export async function createDraftCasesFromImport(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) redirect("/admin/import?missing_env=1");
  const batchId = String(formData.get("batch_id") || "");
  if (!batchId) redirect("/admin/import?error=no-batch");

  const { data: rows } = await supabase
    .from("import_rows")
    .select("*")
    .eq("batch_id", batchId)
    .eq("status", "valid")
    .is("imported_case_id", null)
    .order("row_number");

  let imported = 0;
  let skipped = 0;

  for (const importRow of rows ?? []) {
    const row = (importRow.raw_data ?? {}) as Record<string, string>;
    const existing = await findExistingCase(row.public_id, importRow.id);
    if (existing) {
      await markImportRowSkipped(importRow.id, ["Duplicate case public_id or import row already created a case"]);
      skipped += 1;
      continue;
    }

    const resolved = await resolveImportTaxonomy(row);
    if (resolved.errors.length > 0) {
      await markImportRowSkipped(importRow.id, resolved.errors);
      skipped += 1;
      continue;
    }

    const baseSlug = buildImportSlug(row);
    const slug = await getUniqueCaseSlug(baseSlug);
    const case_completeness_score = calculateImportCompleteness(row);
    const evidence_score = calculateImportEvidenceScore(row);
    const confidence_score = calculateConfidenceScore({
      evidence_level: row.evidence_level || "D",
      case_completeness_score,
      evidence_score,
      verification_status: row.verification_status || "unverified"
    });
    const quality = generateCaseDataQuality({
      title: row.title,
      crop: row.crop,
      country: row.country,
      region: row.region,
      problem: row.primary_problem,
      farm_size_value: row.farm_size_value ? Number(row.farm_size_value) : null,
      dosage: row.dosage,
      application_method: row.application_method,
      application_frequency: row.application_frequency,
      baseline_conditions: row.baseline_conditions,
      results_summary: row.results_summary,
      yield_increase_percent: row.yield_increase_percent ? Number(row.yield_increase_percent) : null,
      roi_value: row.roi_value ? Number(row.roi_value) : null,
      source_full_text: row.source_full_text,
      technical_summary: row.technical_summary,
      executive_narrative: row.executive_narrative,
      extracted_observations: row.extracted_observations,
      extracted_recommendations: row.extracted_recommendations,
      extracted_results: row.extracted_results,
      extracted_metrics: row.extracted_metrics || row.metrics,
      hasPhotos: truthy(row.has_photos) || Boolean(row.photos || row.evidence_folder_name || row.source_folder),
      hasVideos: truthy(row.has_video) || Boolean(row.video || row.videos),
      hasLabReports: Boolean(row.lab_report),
      hasTestimonial: truthy(row.has_testimonial) || Boolean(row.testimonial),
      evidence_level: row.evidence_level || "D"
    });
    const payload = {
      ...rowToCaseDraft(
        row,
        {
          crop_id: resolved.crop_id!,
          country_id: resolved.country_id!,
          primary_problem_id: resolved.primary_problem_id!,
          region_id: resolved.region_id,
          application_method_id: resolved.application_method_id
        },
        {
          slug,
          case_completeness_score,
          evidence_score,
          confidence_score,
          import_batch_id: batchId,
          import_row_id: importRow.id
        }
      ),
      ...quality,
      publication_status: "draft"
    };

    const { data: created, error } = await supabase.from("cases").insert(payload).select("id").single();
    if (error || !created) {
      await markImportRowSkipped(importRow.id, [error?.message || "Case insert failed"]);
      skipped += 1;
      continue;
    }
    await supabase
      .from("import_rows")
      .update({ status: "imported", imported_case_id: created.id, validation_errors: [] })
      .eq("id", importRow.id);
    imported += 1;
  }

  await refreshBatchCounts(batchId);
  revalidatePath("/admin/import");
  revalidatePath("/admin/cases");
  revalidatePath("/admin/review");
  redirect(`/admin/import?batch=${batchId}&imported=${imported}&skipped=${skipped}`);
}

export async function submitLead(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const name = String(formData.get("name") || "").trim();
  const countryText = String(formData.get("country_text") || "").trim();
  const cropText = String(formData.get("crop_text") || "").trim();
  const areaText = String(formData.get("area_text") || "").trim();
  const problemText = String(formData.get("problem_text") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const comments = String(formData.get("comments") || "").trim();
  // Campos aditivos: el formulario antiguo no los enviaba y siguen resolviendo a "".
  const email = String(formData.get("email") || "").trim();
  const currentProduction = String(formData.get("current_production") || "").trim();
  const objective = String(formData.get("objective") || "").trim();
  const cropSlug = String(formData.get("crop_slug") || "").trim();
  const countrySlug = String(formData.get("country_slug") || "").trim();
  const problemSlug = String(formData.get("problem_slug") || "").trim();
  const hectares = parseAreaNumber(areaText);
  const recommended = String(formData.get("recommended_case_ids") || "")
    .split(",")
    .filter(Boolean);
  const score = calculateLeadScore({
    hectares: hectares || 0,
    whatsapp,
    email,
    problemMatchesPublishedCase: Boolean(problemText),
    relatedViewedCount: recommended.length,
    requestedDiagnostic: true
  });
  const whatsappMessage = `Hola equipo Nano-Gro,

Solicito una recomendación para mi cultivo.

Nombre: ${name}
País: ${countryText}
Cultivo: ${cropText}
Área: ${areaText}
Problema principal: ${problemText}

Información adicional:
${comments}

Me gustaría conocer casos similares y una posible recomendación.

Gracias.`;

  if (supabase) {
    await supabase.from("leads").insert({
      name,
      company: null,
      country_id: null,
      crop_id: null,
      problem_id: null,
      country_text: countryText,
      crop_text: cropText,
      area_text: areaText,
      problem_text: problemText,
      comments,
      hectares,
      whatsapp,
      email,
      current_production: currentProduction,
      objective: objective || "WhatsApp recommendation request",
      urgency: "whatsapp",
      viewed_case_id: String(formData.get("viewed_case_id") || "") || null,
      source_path: String(formData.get("source_path") || ""),
      recommended_case_ids: recommended,
      lead_score: score,
      consent: true,
      whatsapp_message: whatsappMessage
    });
  }

  /*
   * El lead ya esta guardado. Antes de este cambio la accion hacia redirect() a wa.me y
   * el usuario salia del sitio sin recibir nada, incumpliendo la regla de la spec de que
   * "the user should receive value immediately: similar cases, likely issue category,
   * preliminary recommendation". Ahora aterriza en su diagnostico preliminar, con el
   * boton de WhatsApp (mismo mensaje pre-rellenado) a un toque de distancia.
   */
  const params = new URLSearchParams();
  if (cropSlug) params.set("crop", cropSlug);
  if (countrySlug) params.set("country", countrySlug);
  if (problemSlug) params.set("problem", problemSlug);
  if (cropText) params.set("cropName", cropText);
  if (countryText) params.set("countryName", countryText);
  if (problemText) params.set("problemName", problemText);
  if (hectares) params.set("hectares", String(hectares));

  redirect(`/diagnostico/resultado?${params.toString()}`);
}

async function findExistingCase(publicId?: string, importRowId?: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  if (importRowId) {
    const { data } = await supabase.from("cases").select("id").eq("import_row_id", importRowId).limit(1);
    if (data?.[0]) return data[0];
  }
  if (publicId) {
    const { data } = await supabase.from("cases").select("id").eq("public_id", publicId).limit(1);
    if (data?.[0]) return data[0];
  }
  return null;
}

async function resolveImportTaxonomy(row: Record<string, string>) {
  const supabase = getSupabaseAdmin();
  const errors: string[] = [];
  if (!supabase) return { errors };

  const [crop, country, problem] = await Promise.all([
    findTerm("crops", row.crop),
    findTerm("countries", row.country),
    row.primary_problem ? findTerm("problems", row.primary_problem) : findTerm("problems", "Pending problem classification")
  ]);
  if (!crop) errors.push(`Unknown crop: ${row.crop}`);
  if (!country) errors.push(`Unknown country: ${row.country}`);
  if (!problem) errors.push(`Unknown primary_problem: ${row.primary_problem || "Pending problem classification"}`);

  let region_id: string | null = null;
  if (row.region && country) {
    const region = await findRegion(country.id, row.region);
    if (region) region_id = region.id;
  }

  let application_method_id: string | null = null;
  if (row.application_method) {
    const method = await findTerm("application_methods", row.application_method);
    if (method) application_method_id = method.id;
  }

  return {
    errors,
    crop_id: crop?.id,
    country_id: country?.id,
    primary_problem_id: problem?.id,
    region_id,
    application_method_id
  };
}

async function findTerm(table: "crops" | "countries" | "problems" | "application_methods", value?: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !value) return null;
  const slug = normalizeImportTerm(value);
  const slugMatch = await supabase.from(table).select("id, name, slug").eq("slug", slug).limit(1);
  if (slugMatch.data?.[0]) return slugMatch.data[0];
  const nameMatch = await supabase.from(table).select("id, name, slug").ilike("name", value).limit(1);
  return nameMatch.data?.[0] ?? null;
}

async function findRegion(countryId: string, value: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const slug = normalizeImportTerm(value);
  const slugMatch = await supabase
    .from("regions")
    .select("id, name, slug")
    .eq("country_id", countryId)
    .eq("slug", slug)
    .limit(1);
  if (slugMatch.data?.[0]) return slugMatch.data[0];
  const nameMatch = await supabase
    .from("regions")
    .select("id, name, slug")
    .eq("country_id", countryId)
    .ilike("name", value)
    .limit(1);
  return nameMatch.data?.[0] ?? null;
}

async function getUniqueCaseSlug(baseSlug: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return baseSlug;
  let candidate = baseSlug;
  let suffix = 2;
  while (true) {
    const { data } = await supabase.from("cases").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

async function markImportRowSkipped(id: string, errors: string[]) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase.from("import_rows").update({ status: "skipped", validation_errors: errors }).eq("id", id);
}

async function refreshBatchCounts(batchId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  const { data } = await supabase.from("import_rows").select("status").eq("batch_id", batchId);
  const rows = data ?? [];
  const counts = {
    valid_rows: rows.filter((row) => row.status === "valid").length,
    error_rows: rows.filter((row) => row.status === "invalid").length,
    imported_rows: rows.filter((row) => row.status === "imported").length,
    skipped_rows: rows.filter((row) => row.status === "skipped").length
  };
  await supabase
    .from("import_batches")
    .update({ ...counts, status: counts.valid_rows > 0 ? "validated" : "imported" })
    .eq("id", batchId);
}

function calculateImportCompleteness(row: Record<string, string>) {
  let score = 0;
  if (row.summary || row.description) score += 10;
  if (row.results_summary) score += 10;
  if (row.source_full_text && row.source_full_text.length > 1000) score += 15;
  if (row.technical_summary) score += 10;
  if (row.executive_narrative) score += 10;
  if (row.extracted_observations) score += 8;
  if (row.extracted_recommendations) score += 6;
  if (row.extracted_results) score += 8;
  if (row.extracted_metrics || row.metrics) score += 8;
  if (row.extracted_variety) score += 4;
  if (row.extracted_location) score += 4;
  if (row.extracted_dates) score += 4;
  if (row.roi_value) score += 10;
  if (truthy(row.has_photos) || row.photos || row.evidence_folder_name || row.source_folder) score += 20;
  if (truthy(row.has_video) || row.video || row.videos) score += 20;
  if (truthy(row.has_pdf) || row.pdf || row.documents || row.lab_report) score += 10;
  if (truthy(row.has_testimonial) || row.testimonial) score += 10;
  if (truthy(row.technical_validation) || ["agronomist_review", "lab_supported", "third_party"].includes(row.verification_status || "")) score += 10;
  return Math.min(score, 100);
}

function calculateImportEvidenceScore(row: Record<string, string>) {
  let score = 0;
  if (row.source_full_text && row.source_full_text.length > 1000) score += 20;
  if (row.technical_summary || row.source_extraction) score += 10;
  if (row.extracted_metrics || row.metrics) score += 10;
  if (row.evidence_folder_name || row.source_folder || row.photos || truthy(row.has_photos)) score += 40;
  if (row.extracted_images || row.image_analysis || row.visual_findings) score += 15;
  if (row.video || row.videos || truthy(row.has_video)) score += 20;
  if (row.pdf || row.documents || truthy(row.has_pdf)) score += 15;
  if (row.lab_report) score += 15;
  if (row.evidence_level === "A") score += 10;
  return Math.min(score, 100);
}

function truthy(value?: string) {
  return ["true", "yes", "si", "1", "x"].includes((value ?? "").trim().toLowerCase());
}

function parseAreaNumber(value: string) {
  const match = value.replace(",", ".").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function splitLines(value?: string) {
  return (value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJsonObject(value?: string) {
  if (!value?.trim()) return {};
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
