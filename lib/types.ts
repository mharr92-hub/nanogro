export type EditorialStatus = "draft" | "review" | "approved" | "published" | "archived";
export type EvidenceLevel = "A" | "B" | "C" | "D";
export type FieldStatus = "verified" | "estimated" | "inferred" | "pending_confirmation" | "unavailable" | "not_applicable";
export type ExtractedMetric = {
  label: string;
  value?: number | string | null;
  unit?: string | null;
  context?: string | null;
  confidence?: number | null;
};

export type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  description?: string | null;
};

export type Country = TaxonomyItem & {
  iso_code?: string | null;
  dominant_climate?: string | null;
};

export type Region = {
  id: string;
  country_id: string;
  name: string;
  slug: string;
  climate?: string | null;
};

export type CaseStudy = {
  id: string;
  public_id: string;
  slug: string;
  slug_locked?: boolean;
  title: string;
  summary?: string | null;
  crop_id: string;
  country_id: string;
  region_id?: string | null;
  primary_problem_id: string;
  evidence_level: EvidenceLevel;
  application_method_id?: string | null;
  nano_gro_application?: string | null;
  dosage?: string | null;
  application_frequency?: string | null;
  farm_size_value?: number | null;
  farm_size_unit?: string | null;
  baseline_conditions?: string | null;
  treatment_notes?: string | null;
  results_summary?: string | null;
  yield_increase_percent?: number | null;
  quality_improvement_percent?: number | null;
  disease_reduction_percent?: number | null;
  roi_value?: number | null;
  roi_notes?: string | null;
  case_completeness_score?: number | null;
  evidence_score?: number | null;
  confidence_score?: number | null;
  import_batch_id?: string | null;
  import_row_id?: string | null;
  evidence_reference?: string | null;
  source_folder?: string | null;
  data_status?: string | null;
  missing_fields?: string[] | null;
  estimated_fields?: string[] | null;
  inferred_fields?: string[] | null;
  pending_confirmation_fields?: string[] | null;
  technical_questions?: string[] | null;
  internal_notes?: string | null;
  public_data_disclaimer?: string | null;
  field_status?: Record<string, FieldStatus> | null;
  source_full_text?: string | null;
  source_extraction?: Record<string, unknown> | null;
  extracted_variety?: string | null;
  extracted_location?: string | null;
  extracted_dates?: string[] | null;
  extracted_observations?: string[] | null;
  extracted_recommendations?: string[] | null;
  extracted_results?: string[] | null;
  extracted_metrics?: Record<string, ExtractedMetric[] | unknown> | null;
  technical_summary?: string | null;
  executive_narrative?: string | null;
  verification_status?: string | null;
  publication_status: EditorialStatus;
  language: string;
  featured: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  crop?: TaxonomyItem | null;
  country?: Country | null;
  region?: Region | null;
  primary_problem?: TaxonomyItem | null;
  evidence_assets?: EvidenceAsset[];
};

export type EvidenceAsset = {
  id: string;
  case_id: string;
  asset_type: "photo" | "video" | "pdf" | "document" | "lab_report" | "raw_data";
  evidence_stage?: "before" | "during" | "after" | "final" | "supporting" | null;
  file_url: string;
  storage_key: string;
  file_name?: string | null;
  mime_type?: string | null;
  file_size_bytes?: number | null;
  title?: string | null;
  caption?: string | null;
  alt_text?: string | null;
  verification_status: "pending" | "approved" | "restricted";
  consent_status: "unknown" | "approved" | "restricted";
  display_order: number;
  source_document_id?: string | null;
  extracted_from_source?: boolean;
  visual_description?: string | null;
  visual_findings?: string[] | null;
  observable_evidence?: string | null;
  vision_model?: string | null;
  vision_confidence?: number | null;
};

export type Lead = {
  id: string;
  name?: string | null;
  company?: string | null;
  country_text?: string | null;
  crop_text?: string | null;
  area_text?: string | null;
  problem_text?: string | null;
  comments?: string | null;
  whatsapp_message?: string | null;
  hectares?: number | null;
  whatsapp?: string | null;
  email?: string | null;
  objective?: string | null;
  current_production?: string | null;
  urgency?: string | null;
  source_path?: string | null;
  viewed_case_id?: string | null;
  recommended_case_ids?: string[] | null;
  lead_score: number;
  status: string;
  created_at?: string;
  crop?: TaxonomyItem | null;
  country?: Country | null;
  problem?: TaxonomyItem | null;
};

export type ImportValidation = {
  rowNumber: number;
  raw: Record<string, string>;
  errors: string[];
};
