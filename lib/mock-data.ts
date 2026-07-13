import type { CaseStudy, Country, EvidenceAsset, TaxonomyItem } from "@/lib/types";
import { realCases, realCountries, realCrops, realProblems } from "@/lib/real-source-data";

const starterCrops: TaxonomyItem[] = [
  { id: "crop-cacao", name: "Cacao", slug: "cacao", category: "plantation" },
  { id: "crop-banana", name: "Banana", slug: "banana", category: "fruit" },
  { id: "crop-coffee", name: "Coffee", slug: "coffee", category: "plantation" },
  { id: "crop-rice", name: "Rice", slug: "rice", category: "row_crop" }
];

const starterCountries: Country[] = [
  { id: "country-panama", name: "Panama", slug: "panama", iso_code: "PA", dominant_climate: "tropical" },
  { id: "country-colombia", name: "Colombia", slug: "colombia", iso_code: "CO", dominant_climate: "tropical" },
  { id: "country-peru", name: "Peru", slug: "peru", iso_code: "PE", dominant_climate: "mixed" }
];

const starterProblems: TaxonomyItem[] = [
  { id: "problem-low-production", name: "Low production", slug: "low-production", category: "yield" },
  { id: "problem-water-stress", name: "Water stress", slug: "water-stress", category: "stress" },
  { id: "problem-weak-rooting", name: "Weak rooting", slug: "weak-rooting", category: "roots" },
  { id: "problem-poor-flowering", name: "Poor flowering", slug: "poor-flowering", category: "flowering" }
];

export const mockCrops: TaxonomyItem[] = uniqueBySlug([...starterCrops, ...realCrops]);
export const mockCountries: Country[] = uniqueBySlug([...starterCountries, ...realCountries]);
export const mockProblems: TaxonomyItem[] = uniqueBySlug([...starterProblems, ...realProblems]);

export const mockEvidence: EvidenceAsset[] = [
  {
    id: "ev-1",
    case_id: "case-1",
    asset_type: "photo",
    evidence_stage: "after",
    file_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    storage_key: "mock/cacao-after.jpg",
    title: "After application",
    caption: "Field condition after treatment.",
    alt_text: "Healthy cacao field after Nano-Gro treatment",
    verification_status: "approved",
    consent_status: "approved",
    display_order: 1
  }
];

const starterCases: CaseStudy[] = [
  {
    id: "case-1",
    public_id: "NG-001",
    slug: "cacao-panama-low-production-27pct",
    title: "Cacao in Panama with 27% production increase",
    summary: "Documented field case for cacao under low-production conditions.",
    crop_id: "crop-cacao",
    country_id: "country-panama",
    primary_problem_id: "problem-low-production",
    evidence_level: "A",
    nano_gro_application: "Foliar application during vegetative and flowering stages.",
    dosage: "Protocol pending final technical review",
    results_summary: "Production increased 27% compared with baseline.",
    yield_increase_percent: 27,
    roi_value: 5.3,
    case_completeness_score: 92,
    evidence_score: 80,
    confidence_score: 87,
    missing_fields: ["dosage", "application_frequency", "treatment_dates", "harvest_dates"],
    estimated_fields: [],
    inferred_fields: [],
    pending_confirmation_fields: ["dosage", "application_frequency", "treatment_dates", "harvest_dates"],
    technical_questions: ["Confirm dosage, application frequency, treatment dates and harvest dates."],
    internal_notes: "Verified values are limited to the linked evidence. Missing commercial metrics remain pending technical confirmation.",
    public_data_disclaimer: "This report is based on documented field evidence. Some technical details not available in the original report were conservatively estimated by the technical team for guidance purposes and remain subject to confirmation.",
    field_status: {
      crop: "verified",
      country: "verified",
      problem: "verified",
      dosage: "pending_confirmation",
      application_frequency: "pending_confirmation",
      yield_increase_percent: "verified",
      roi_value: "verified",
      photos: "verified",
      treatment_dates: "pending_confirmation",
      harvest_dates: "pending_confirmation"
    },
    verification_status: "agronomist_review",
    publication_status: "published",
    language: "en",
    featured: true,
    seo_title: "Cacao Panama Nano-Gro Case Study",
    seo_description: "Nano-Gro case study for cacao in Panama with documented production increase.",
    crop: mockCrops[0],
    country: mockCountries[0],
    primary_problem: mockProblems[0],
    evidence_assets: mockEvidence
  },
  {
    id: "case-2",
    public_id: "NG-002",
    slug: "banana-colombia-water-stress-18pct",
    title: "Banana in Colombia under water stress",
    summary: "Field evidence for banana recovery under water stress.",
    crop_id: "crop-banana",
    country_id: "country-colombia",
    primary_problem_id: "problem-water-stress",
    evidence_level: "B",
    nano_gro_application: "Foliar application.",
    results_summary: "Improved field recovery and production stability.",
    yield_increase_percent: 18,
    roi_value: 3.8,
    case_completeness_score: 74,
    evidence_score: 55,
    confidence_score: 70,
    missing_fields: ["dosage", "application_frequency", "roi_value", "photos", "treatment_dates", "harvest_dates"],
    estimated_fields: [],
    inferred_fields: ["nano_gro_application"],
    pending_confirmation_fields: ["dosage", "application_frequency", "roi_value", "photos", "treatment_dates", "harvest_dates"],
    technical_questions: ["Confirm dosage, application frequency, ROI calculation, evidence assets and treatment dates."],
    internal_notes: "Estimated conservatively from available report context. Pending confirmation by technical field team.",
    public_data_disclaimer: "This report is based on documented field evidence. Some technical details not available in the original report were conservatively estimated by the technical team for guidance purposes and remain subject to confirmation.",
    field_status: {
      crop: "verified",
      country: "verified",
      problem: "verified",
      nano_gro_application: "inferred",
      dosage: "pending_confirmation",
      application_frequency: "pending_confirmation",
      yield_increase_percent: "verified",
      roi_value: "pending_confirmation",
      photos: "pending_confirmation",
      treatment_dates: "pending_confirmation",
      harvest_dates: "pending_confirmation"
    },
    verification_status: "internal_review",
    publication_status: "review",
    language: "en",
    featured: false,
    crop: mockCrops[1],
    country: mockCountries[1],
    primary_problem: mockProblems[1],
    evidence_assets: []
  },
  {
    id: "case-3",
    public_id: "NG-003",
    slug: "coffee-peru-poor-flowering-22pct",
    title: "Coffee in Peru with flowering improvement",
    summary: "Documented coffee case with measured improvement and some protocol details pending.",
    crop_id: "crop-coffee",
    country_id: "country-peru",
    primary_problem_id: "problem-poor-flowering",
    evidence_level: "B",
    nano_gro_application: "Application protocol pending technical confirmation.",
    results_summary: "Flowering uniformity improved and harvest volume increased.",
    yield_increase_percent: 22,
    roi_value: null,
    case_completeness_score: 68,
    evidence_score: 40,
    confidence_score: 61,
    verification_status: "internal_review",
    publication_status: "review",
    language: "en",
    featured: false,
    seo_title: "Coffee Peru Nano-Gro Flowering Case",
    seo_description: "Nano-Gro coffee case with documented flowering improvement and pending protocol confirmation.",
    crop: mockCrops[2],
    country: mockCountries[2],
    primary_problem: mockProblems[3],
    evidence_assets: [],
    pending_confirmation_fields: ["dosage", "application_frequency", "roi_value", "photos"],
    missing_fields: ["dosage", "application_frequency", "roi_value", "photos", "videos", "lab_reports"],
    technical_questions: [
      "What Nano-Gro dosage was used?",
      "How many applications were made?",
      "Can ROI be calculated from baseline yield, final yield, price, and treatment cost?",
      "Were there before/after photos?"
    ],
    public_data_disclaimer: "This report is based on documented field evidence. Some technical details not available in the original report were conservatively estimated by the technical team for guidance purposes and remain subject to confirmation.",
    internal_notes: "Estimated conservatively from available report context. Pending confirmation by technical field team.",
    field_status: {
      dosage: "pending_confirmation",
      application_frequency: "pending_confirmation",
      roi_value: "pending_confirmation",
      photos: "pending_confirmation"
    }
  }
];

export const mockCases: CaseStudy[] = [...realCases, ...starterCases];

function uniqueBySlug<T extends { slug: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}
