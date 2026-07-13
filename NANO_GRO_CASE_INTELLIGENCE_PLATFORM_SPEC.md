# Nano-Gro Case Intelligence Platform

## 1. Product Vision

### Mission
Build the global reference platform for documented Nano-Gro agricultural results: a searchable case-study database, lead-generation engine, agronomic diagnostic tool, and future AI advisory layer that turns real field evidence into qualified sales opportunities.

### Target Users
- Farmers evaluating ways to improve yield, quality, resilience, and ROI.
- Distributors looking for credible sales proof and regional opportunities.
- Agronomists and consultants comparing results across crops and conditions.
- Researchers reviewing structured, evidence-backed agricultural outcomes.
- Government and agro-industrial entities assessing scalable crop-performance solutions.
- Nano-Gro commercial teams managing leads, proof assets, and market intelligence.

### Unique Value Proposition
Nano-Gro Case Intelligence Platform transforms isolated case studies into a living, searchable, multilingual proof system. Each new case increases the platform's SEO footprint, diagnostic usefulness, commercial credibility, and sales-conversion power.

The platform should feel less like an agricultural blog and more like a "Google of Nano-Gro results": a farmer enters crop, country, problem, or farm condition and immediately finds real evidence from similar situations.

### Product Boundaries
The platform must stay tightly focused on proving Nano-Gro results and converting that proof into qualified leads, distributor opportunities, and technical consultations.

What is Nano-Gro:
- Case studies.
- Evidence library.
- Crops.
- Countries.
- Agricultural problems.
- Results.
- ROI.
- Diagnostic lead capture.
- Lead generation.
- Distributor qualification.
- Research and documented evidence.
- Case comparison.
- Global map.
- Future agronomic AI.

What is not Nano-Gro:
- Generic agricultural blog.
- Agricultural news site.
- Social community.
- Forum.
- Marketplace.
- Complex e-commerce platform.
- Courses.
- Events.
- Features unrelated to demonstrating documented Nano-Gro results.

Product rule:
- Organize discovery around the farmer's problem first, then crop, country, evidence, ROI, and finally product recommendation.

Core commercial flow:

```text
Problem
-> Evidence
-> Result
-> Diagnostic
-> Solution
```

This is intentionally different from the commodity input-company flow:

```text
Product
-> Benefits
-> Contact
```

The most valuable conversion path in the MVP should be:

```text
View case
-> View similar cases
-> View average ROI or result range
-> Request free crop diagnostic
```

This flow uses the asset Nano-Gro already has: documented field evidence.

### Competitive Advantages
- Proprietary database of real Nano-Gro outcomes across crops, regions, and conditions.
- Structured agricultural taxonomy designed for search, analytics, and AI matching.
- Programmatic SEO architecture that converts every case, crop, problem, and country into discoverable landing pages.
- Lead capture embedded into research, diagnosis, comparison, and consultation flows.
- Scientific credibility through verification levels, confidence scoring, lab reports, media, and agronomist notes.
- Scalable multilingual system for international expansion.

### Why Users Return
- Farmers return to compare similar crops, problems, regions, and expected ROI.
- Distributors return for sales evidence, localized case pages, and lead follow-up.
- Agronomists return for diagnosis, technical references, and benchmark data.
- Researchers return as the dataset grows and comparisons become richer.
- Internal teams return for lead intelligence, performance dashboards, and content planning.

## 2. User Personas

### Small Farmers
- Goals: Increase yield, reduce losses, improve crop quality, and make confident purchases.
- Problems: Limited technical support, constrained budget, high risk tolerance limits, uncertainty about product efficacy.
- Objections: "Will this work on my crop?", "Can I afford it?", "Is this proven locally?"
- Buying triggers: Similar crop success, low-risk trial offer, WhatsApp consultation, clear ROI example.

### Medium Farmers
- Goals: Improve profitability, standardize better practices, solve recurring agronomic issues.
- Problems: Inconsistent yields, disease pressure, input cost inflation, lack of reliable benchmarking.
- Objections: Need evidence, dosage clarity, compatibility with current products, expected payback.
- Buying triggers: Regional case studies, yield-increase ranges, distributor access, technical report.

### Large Commercial Farms
- Goals: Scale productivity, reduce risk across hectares, improve quality specs, document ROI.
- Problems: Operational complexity, procurement scrutiny, need for measurable impact.
- Objections: Trial design, data quality, supply reliability, integration with existing protocols.
- Buying triggers: Verified cases, control-group data, enterprise consultation, pilot protocol.

### Distributors
- Goals: Generate demand, close accounts, train sales teams, validate territory opportunity.
- Problems: Need credible proof, localized content, lead visibility, differentiation from competitors.
- Objections: Market demand, margin potential, product education burden, territory support.
- Buying triggers: Lead volume, distributor page, regional heat map, sales collateral library.

### Agronomists
- Goals: Recommend evidence-based treatments, compare protocols, improve farmer outcomes.
- Problems: Fragmented field data, limited access to comparable results, client skepticism.
- Objections: Scientific reliability, mechanism clarity, treatment specificity.
- Buying triggers: Agronomist notes, lab reports, crop-specific filters, diagnostic reports.

### Researchers
- Goals: Study patterns, compare outcomes, assess evidence quality, identify knowledge gaps.
- Problems: Inconsistent data, lack of metadata, limited verification context.
- Objections: Bias, incomplete methodology, missing controls.
- Buying triggers: structured schema, confidence scores, exportable datasets, verification metadata.

### Agricultural Consultants
- Goals: Diagnose client issues, recommend interventions, produce professional reports.
- Problems: Need fast evidence retrieval, localized recommendations, convincing visuals.
- Objections: Report credibility, case relevance, language availability.
- Buying triggers: Diagnostic tool, PDF exports, comparison views, consultant-friendly summaries.

### Government Entities
- Goals: Evaluate agricultural productivity programs, regional resilience, farmer-support solutions.
- Problems: Need scalable evidence, regional data, policy-friendly summaries.
- Objections: Scientific validation, public procurement standards, documentation depth.
- Buying triggers: country dashboards, verified outcomes, downloadable reports, pilot proposals.

### Agro-Industrial Companies
- Goals: Improve supply-chain yield and quality, reduce producer risk, standardize crop programs.
- Problems: Variable producer performance, quality penalties, inconsistent technical adoption.
- Objections: enterprise fit, data privacy, integration, scale economics.
- Buying triggers: enterprise reports, crop-cluster analytics, pilot design, ROI forecasts.

## 3. Information Architecture

### Primary Navigation
- Home
- Problems
- Case Studies
- Crops
- Countries
- Before/After
- ROI Calculator
- Results
- Diagnostic Tool
- Knowledge Center
- Research
- Videos
- Product Information
- Become Distributor
- Contact

### Utility Navigation
- Search
- Compare Cases
- Saved Cases
- Language Selector
- WhatsApp Consultation
- Login

### Admin Navigation
- Dashboard
- Case Management
- Lead Management
- Media Library
- Taxonomies
- SEO Pages
- Diagnostic Rules
- AI Knowledge Base
- Analytics
- Users and Permissions
- Workflow Approvals

## 4. Sitemap

```text
/
/case-studies
/case-studies/[case-slug]
/case-studies/compare
/crops
/crops/[crop]
/crops/[crop]/[problem]
/countries
/countries/[country]
/countries/[country]/[crop]
/problems
/problems/[problem]
/before-after
/roi-calculator
/results
/results/yield-increase
/results/roi
/results/disease-reduction
/diagnostic
/diagnostic/report/[report-id]
/knowledge
/knowledge/articles/[slug]
/research
/research/documents/[slug]
/videos
/product
/become-distributor
/contact
/consultation
/admin
/admin/cases
/admin/leads
/admin/media
/admin/taxonomies
/admin/seo
/admin/diagnostics
/admin/analytics
```

## 5. Core Page Specifications

### Home
Purpose: Establish trust quickly and route visitors to cases, diagnosis, or consultation.

Key sections:
- Hero with searchable proof claim: "Find Nano-Gro results by crop, country, problem, and ROI."
- Problem-first search with crop, country, and symptom shortcuts.
- Featured verified cases.
- Results summary metrics.
- Before/after evidence preview.
- ROI calculator entry point.
- Global map preview.
- Diagnostic call-to-action.
- Distributor and consultation conversion blocks.

Primary conversion:
- Start diagnostic.
- Request consultation.
- Search case studies.

### Case Studies Listing
Purpose: Let users discover proof by precise agricultural context.

Features:
- Full-text search.
- Faceted filters.
- Sort by relevance, newest, yield increase, ROI, verification, confidence score.
- Case cards with crop, country, problem, result, verification level, and lead CTA.
- Save and compare cases.

### Case Detail
Purpose: Make one documented result credible, useful, and conversion-ready.

Sections:
- Summary result panel.
- Farm and regional context.
- Problem identified.
- Baseline conditions.
- Treatment protocol.
- Results and ROI.
- Before, during, and after media.
- Verification and case confidence score.
- Agronomist notes.
- Similar cases ranked by crop, country, problem, climate, soil, farm size, and application method.
- ROI calculator prefilled with case assumptions where enough data exists.
- Consultation CTA customized to crop and country.

### Crops Hub
Purpose: Own crop-specific SEO and guide users to relevant proof.

Features:
- Each crop page should feel like a mini site, not a thin listing page.
- Case count, countries, top problems, average results, and application notes.
- Crop-specific statistics, best verified cases, videos, before/after media, FAQs, and consultation form.
- Crop-problem programmatic pages.
- Recommended cases and diagnostic entry points.

### Countries Hub
Purpose: Own local search demand and distributor lead capture.

Features:
- Country case count.
- Crop distribution.
- Regional map.
- Local success metrics.
- Top crops, top problems, regional cases, before/after gallery, and distributor CTA.
- Country-specific consultation/distributor CTA.

### Problems Hub
Purpose: Capture intent around yield loss, diseases, deficiencies, pests, roots, stress, and quality.

Features:
- Problem-first navigation for users who do not know the product or protocol yet.
- Landing pages for low production, weak roots, water stress, poor flowering, poor fruit size, disease pressure, and post-transplant recovery.
- Problem taxonomy browsing.
- Problem-specific case results.
- Diagnostic prompts.
- Product/application guidance.

### Results Hub
Purpose: Convert evidence into commercial proof.

Features:
- Yield increase pages.
- ROI range pages.
- Disease reduction pages.
- Quality improvement pages.
- Interactive charts and downloadable summaries.

### Aggregate Results Index
Purpose: Convert individual evidence into collective proof.

The platform should calculate and display aggregate credibility metrics once enough cases are normalized and reviewed.

Example public metrics:

```text
128 published cases
23 crops
11 countries
Average ROI: 4.7x
Average production increase: 22%
89% of cases show positive improvement
```

Important guardrails:
- Only include published cases.
- Separate verified and unverified cases.
- Show sample size beside every aggregate claim.
- Avoid implying guaranteed results.
- Allow filtering aggregate metrics by crop, country, problem, evidence level, climate, and application method.

Recommended aggregate fields:
- Total published cases.
- Total crops.
- Total countries.
- Average ROI.
- Median ROI.
- Average yield or production increase.
- Median yield or production increase.
- Positive improvement rate.
- Case count by evidence level.
- Case count by crop.
- Case count by country.
- Case count by problem.

### Before/After Gallery
Purpose: Make visual proof a first-class discovery path because many visitors will trust images before reading long case narratives.

Features:
- Standalone visual gallery by crop, country, problem, and growth stage.
- Before, during, and after sequences.
- Filters for photo, video, lab report, testimonial, and verification status.
- Each image links back to the full case and its confidence score.
- Alt text, captions, date taken, and agronomist notes for credibility and SEO.

### ROI Calculator
Purpose: Translate agronomic results into the farmer's economic question: "How much money could I make or save?"

Inputs:
- Crop.
- Country or currency.
- Hectares.
- Current yield per hectare.
- Expected sale price.
- Current input cost where relevant.
- Nano-Gro program cost estimate.
- Expected improvement range from similar cases.

Outputs:
- Estimated additional production.
- Estimated additional revenue.
- Estimated program cost.
- Estimated gross benefit.
- Potential ROI range.
- Similar cases used for assumptions.
- Lead form with the calculator context attached automatically.

Guardrail:
- ROI output must be framed as an estimate based on comparable documented cases, not a guaranteed result.

### Diagnostic Tool
Purpose: Diagnose likely issues, match cases, and generate leads.

Positioning:
- Present this as "Free Crop Diagnostic" or "Diagnostico Gratuito de Cultivo", not as a generic contact form.
- The user should receive value immediately: similar cases, likely issue category, preliminary recommendation, and next-step CTA.
- The lead record should capture the diagnostic context automatically so the sales or agronomy team does not start from zero.

Flow:
1. Select country.
2. Select crop.
3. Enter hectares.
4. Select main problem.
5. Enter current production.
6. Select objective.
7. Add WhatsApp.
8. Add email.
9. Receive similar cases, preliminary recommendation, and consultation CTA.

### Knowledge Center
Purpose: Educate users and build organic traffic.

Content types:
- Blog articles.
- Technical guides.
- FAQs.
- Application guides.
- Crop problem explainers.
- Whitepapers.
- Downloadable PDFs.

### Research
Purpose: Build scientific credibility.

Content types:
- Verified case reports.
- Lab reports.
- Methodology notes.
- Agronomist-authored documents.
- Dataset summaries.
- Confidence scoring methodology.

### Product Information
Purpose: Explain Nano-Gro clearly while routing proof-seeking users back to cases.

Sections:
- Product overview.
- Mechanism of action.
- Application methods.
- Safety and compatibility.
- Supported crops.
- Related case evidence.

### Become Distributor
Purpose: Capture high-value partner leads.

Sections:
- Territory opportunity.
- Proof assets.
- Distributor benefits.
- Requirements.
- Application form.
- Regional case evidence.

### Contact and Consultation
Purpose: Capture sales-ready leads.

Fields:
- Name, company, country, WhatsApp, phone, email.
- Crop, hectares, current problem, objective, urgency.
- Need product, distributor, trial, consultation, or technical assistance.

## 6. Case Study Database Structure

### MVP Data Model Principle
Before writing application code, validate the minimum data structure. If the schema is strong, the interface can change many times without destroying the platform's long-term value.

The MVP should start with five core entities:

1. Case Studies.
2. Problems.
3. Crops.
4. Countries.
5. Leads.

### MVP Entity Minimums

#### Case Studies
- ID.
- Title.
- Crop.
- Country.
- Region.
- Main problem.
- Secondary problems.
- Evidence level: A, B, C, or D.
- Nano-Gro application.
- Results.
- ROI.
- Photos.
- Videos.
- Publication status.

#### Problems
- ID.
- Name.
- Description.
- Category.
- Common symptoms.

Examples:
- Low production.
- Water stress.
- Poor flowering.
- Weak roots.
- Small fruit.
- Low quality.
- Climate stress.

#### Crops
- ID.
- Name.
- Slug.
- Category.
- Common problems.
- Published case count.

Examples:
- Cacao.
- Banana.
- Coffee.
- Rice.
- Maize.
- Tomato.
- Melon.
- Watermelon.

#### Countries
- ID.
- Country.
- Regions.
- Dominant climate.
- Published case count.

Examples:
- Panama.
- Colombia.
- Peru.
- Ecuador.
- Mexico.
- Brazil.

#### Leads
- ID.
- Contact details.
- Crop.
- Hectares.
- Problem.
- Diagnostic answers.
- Lead score.
- Recommended cases.
- Source page.
- Status.

### Entity Relationship Overview
```text
CaseStudy
  belongs to Country, Region, Crop, Language
  has many Treatments, Results, EvidenceAssets, MediaAssets, Documents, Testimonials, Tags
  has many CaseProblems through CaseStudyProblem
  has many TaxonomyTerms through CaseTaxonomy
  has one SeoMetadata
  has one VerificationRecord
  has one CaseStudyScore
  may have one FarmProfile
  may have one ControlGroup

Lead
  belongs to Country, Crop, Source
  may belong to DiagnosticSession
  may reference CaseStudy

DiagnosticSession
  belongs to Lead optionally
  has many DiagnosticAnswers
  returns many RecommendedCaseStudies

EvidenceAsset
  belongs to CaseStudy
  stores photos, videos, lab reports, PDFs, charts, testimonials, and raw supporting files

SimilarCaseMatch
  belongs to source CaseStudy and matched CaseStudy
  stores match reason, match score, and ranking signals
```

### CaseStudy Table
| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Internal primary key |
| case_id | Text | Public readable ID |
| slug | Text | Unique SEO URL |
| title | Text | Localized title |
| summary | Text | Short case summary |
| country_id | UUID | Required |
| region_id | UUID | Optional |
| gps_latitude | Decimal | Optional |
| gps_longitude | Decimal | Optional |
| farm_name | Text | Optional or anonymized |
| farmer_name | Text | Optional or anonymized |
| crop_id | UUID | Required |
| variety | Text | Optional |
| planting_date | Date | Optional |
| harvest_date | Date | Optional |
| climate_id | UUID | Optional |
| soil_type_id | UUID | Optional |
| farm_size_value | Decimal | Optional |
| farm_size_unit | Enum | hectares, acres, square meters |
| problem_identified | Text | Required narrative |
| baseline_conditions | Text | Required where available |
| treatment_summary | Text | Required |
| conclusions | Text | Required |
| language | Enum | en, es, pt, fr, future |
| publication_status | Enum | draft, review, published, archived |
| featured | Boolean | Default false |
| verification_status | Enum | unverified, internally_reviewed, agronomist_verified, lab_supported, third_party_verified |
| evidence_level | Enum | A, B, C, D |
| scientific_confidence_score | Integer | 0-100 |
| case_score_id | UUID | Links to detailed score breakdown |
| created_at | Timestamp | Audit |
| updated_at | Timestamp | Audit |
| published_at | Timestamp | SEO and freshness |

Each case should be structured so it can answer precise commercial and agronomic questions, for example:

```text
Crop: Cacao
Country: Panama
Problem: Low production
Area: 120 ha
Application: Foliar
Result: +27%
ROI: 5.3x
Evidence level: A
Confidence: High
```

The long-term advantage is not just owning many cases; it is owning structured evidence that can answer questions like: "Show all cacao cases in humid tropical climates with yield improvements above 20%."

### CaseStudyScore Table
| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| case_study_id | UUID | Required |
| data_quality_score | Integer | 0-100 |
| has_before_photos | Boolean | Visual evidence |
| has_during_photos | Boolean | Optional visual evidence |
| has_after_photos | Boolean | Visual evidence |
| has_video | Boolean | Video evidence |
| has_testimonial | Boolean | Farmer/agronomist/distributor testimony |
| has_productive_data | Boolean | Yield, quality, disease, root, or cost data |
| has_control_group | Boolean | Comparative control available |
| has_agronomist_validation | Boolean | Reviewed by agronomist |
| has_lab_report | Boolean | Lab or technical report available |
| evidence_level | Enum | A, B, C, D |
| verification_weight | Integer | Weight from verification status |
| confidence_score | Integer | Final 0-100 public score |
| score_notes | Text | Explains score limits and strengths |
| updated_at | Timestamp | Audit |

Evidence levels:
- Level A: Complete productive data, before/after photos, measurements, and agronomist or technical validation.
- Level B: Partial productive data plus visual evidence.
- Level C: Documented testimonial with some supporting context.
- Level D: Anecdotal case or early field note; useful internally but weaker as public proof.

Example confidence calculation:
- Data quality: 25 points.
- Productive data: 15 points.
- Before/after photos: 15 points.
- Video: 5 points.
- Testimonial: 10 points.
- Control comparison: 15 points.
- Agronomist validation: 10 points.
- Lab report or document support: 5 points.

The public case page should display the final score and the evidence checklist so users understand why a case is strong or incomplete.

### Treatment Table
| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| case_study_id | UUID | Required |
| product_name | Text | Nano-Gro product variant |
| dosage_value | Decimal | Structured dosage |
| dosage_unit | Text | ml/L, g/ha, etc. |
| application_method_id | UUID | Foliar, seed, irrigation, etc. |
| application_frequency | Text | Narrative or normalized |
| growth_stage_id | UUID | Optional |
| start_date | Date | Optional |
| end_date | Date | Optional |
| notes | Text | Optional |

### ControlGroup Table
| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| case_study_id | UUID | Required |
| exists | Boolean | Whether control exists |
| description | Text | Control design |
| baseline_yield | Decimal | Optional |
| treated_yield | Decimal | Optional |
| comparison_notes | Text | Optional |

### Results Table
| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| case_study_id | UUID | Required |
| yield_increase_percent | Decimal | Optional |
| quality_improvement_percent | Decimal | Optional |
| disease_reduction_percent | Decimal | Optional |
| root_development_score | Decimal | Optional standardized metric |
| plant_height_change_percent | Decimal | Optional |
| cost_savings_value | Decimal | Optional |
| cost_savings_currency | Text | ISO currency |
| roi_value | Decimal | Ratio or percentage |
| roi_range_id | UUID | For filtering |
| result_notes | Text | Required narrative |

### EvidenceAsset Table
| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| case_study_id | UUID | Required |
| type | Enum | photo_before, photo_during, photo_after, video, lab_report, pdf_report, chart, testimonial_audio, raw_data, other |
| url | Text | CDN object URL |
| storage_key | Text | Internal object-storage key |
| alt_text | Text | SEO/accessibility |
| caption | Text | Optional |
| date_taken | Date | Optional |
| evidence_stage | Enum | before, during, after, final, supporting |
| verification_status | Enum | pending, approved, restricted |
| consent_status | Enum | pending, approved, restricted |
| display_order | Integer | Sorting |

### MediaAsset Table
MediaAsset can remain as a public presentation view over EvidenceAsset. The canonical long-term asset library should be EvidenceAsset, because photos, videos, PDFs, lab reports, raw data, and testimonials will become one of the company's most valuable proprietary assets.

### Document Table
| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| case_study_id | UUID | Required |
| type | Enum | lab_report, pdf_case_report, certificate, methodology, other |
| title | Text | Required |
| url | Text | Storage URL |
| language | Enum | en, es, pt, fr |
| verification_relevance | Text | Optional |

### Testimonial Table
| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| case_study_id | UUID | Required |
| person_name | Text | Optional/anonymized |
| role | Text | Farmer, agronomist, distributor |
| quote | Text | Required |
| language | Enum | Required |
| consent_status | Enum | pending, approved, restricted |

### SeoMetadata Table
| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| entity_type | Enum | case, crop, country, problem, article |
| entity_id | UUID | Polymorphic reference |
| meta_title | Text | Required |
| meta_description | Text | Required |
| canonical_url | Text | Required |
| og_title | Text | Optional |
| og_description | Text | Optional |
| og_image_url | Text | Optional |
| schema_json | JSONB | Structured data |
| index_status | Enum | index, noindex |

### SimilarCaseMatch Table
| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| source_case_study_id | UUID | Case being viewed |
| matched_case_study_id | UUID | Recommended similar case |
| match_score | Integer | 0-100 |
| same_crop | Boolean | Match signal |
| same_country | Boolean | Match signal |
| same_region | Boolean | Match signal |
| same_problem | Boolean | Match signal |
| similar_climate | Boolean | Match signal |
| similar_soil | Boolean | Match signal |
| similar_farm_size | Boolean | Match signal |
| same_application_method | Boolean | Match signal |
| match_reason | Text | Human-readable explanation |

### ROICalculationSession Table
| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| lead_id | UUID | Optional until user submits contact |
| crop_id | UUID | Required |
| country_id | UUID | Optional |
| hectares | Decimal | User input |
| current_yield_per_hectare | Decimal | User input |
| sale_price_per_unit | Decimal | User input |
| currency | Text | ISO currency |
| estimated_yield_increase_low | Decimal | From comparable cases |
| estimated_yield_increase_high | Decimal | From comparable cases |
| estimated_additional_revenue | Decimal | Calculated |
| estimated_program_cost | Decimal | Calculated or manually configured |
| estimated_roi_low | Decimal | Calculated |
| estimated_roi_high | Decimal | Calculated |
| comparable_case_ids | JSONB | Cases used for assumptions |
| disclaimer_acknowledged | Boolean | Required before lead submission |

## 7. Classification Taxonomy

### Primary Taxonomies
- Crop: maize, rice, soybean, coffee, banana, tomato, potato, sugarcane, citrus, berries, vegetables, ornamentals, and future crops.
- Country: ISO country model with multilingual names.
- Region: State/province/department plus optional geo hierarchy.
- Climate: tropical, subtropical, arid, semi-arid, temperate, highland, humid, dry.
- Soil type: sandy, clay, loam, silt, volcanic, calcareous, saline, degraded, organic.
- Problem: low yield, weak roots, disease pressure, pest stress, poor germination, transplant shock, drought stress, salinity, quality defects, poor fruit set.
- Pest: aphids, mites, whitefly, nematodes, caterpillars, beetles, crop-specific pests.
- Disease: fungal, bacterial, viral, root rot, mildew, blight, rust, wilt, crop-specific diseases.
- Deficiency: nitrogen, phosphorus, potassium, calcium, magnesium, boron, zinc, iron, manganese.
- Production goal: yield, quality, root mass, resilience, flowering, fruit set, disease tolerance, input efficiency.
- Farm size: small, medium, large, enterprise.
- Application type: seed treatment, foliar, fertigation, drench, transplant, irrigation, nursery.
- Yield improvement: 0-5%, 5-10%, 10-20%, 20-40%, 40%+.
- ROI range: unknown, under 2x, 2-5x, 5-10x, 10x+.
- Growth stage: seed, germination, vegetative, flowering, fruiting, maturation, post-stress recovery.
- Season: wet, dry, winter, spring, summer, fall, local crop season.
- Language: English, Spanish, Portuguese, French, future.
- Market segment: smallholder, commercial farm, distributor, government, agro-industrial, research.
- Industry: row crops, horticulture, plantation crops, protected agriculture, nursery, export agriculture.
- Difficulty level: simple, moderate, advanced.
- Success level: inconclusive, positive, strong, exceptional.
- Verification level: self-reported, distributor-reviewed, agronomist-reviewed, lab-supported, third-party verified.

## 8. Advanced Search Engine

### Search Capabilities
- Keyword search across title, summary, problem, crop, country, tags, agronomist notes, documents, and transcript text.
- Faceted filters with instant counts.
- Multi-select filters and saved searches.
- Sort by relevance, newest, crop match, country match, result strength, confidence, verification, ROI.
- Synonym support for multilingual agricultural terms.
- Fuzzy matching for crop and disease spellings.
- Geo search by country, region, radius, and map bounds.
- Problem-first search for users who start with symptoms rather than crop science.
- Similar-case recommendations on every case, crop, country, problem, diagnostic, and ROI calculator result.

### Similar Cases Engine
This is a core product capability, not a nice-to-have. It should answer: "What happened on farms similar to mine?"

MVP matching weights:
- Same crop: high weight.
- Same problem: high weight.
- Same country or region: high weight.
- Similar climate and soil: medium weight.
- Similar farm size: medium weight.
- Same application method or growth stage: medium weight.
- Strong confidence score: ranking boost.
- Freshness and media completeness: ranking boost.

User-facing copy example:
"Farmers with similar conditions achieved these documented results."

The engine should always show why each case is recommended: same crop, same region, same problem, similar climate, or similar application method.

### Filters
- Crop
- Country
- Region
- Problem
- Expected result
- Yield increase range
- ROI range
- Climate
- Soil type
- Farm size
- Application method
- Growth stage
- Language
- Publication date
- Case score
- Verification status
- Keywords
- Tags
- Diseases
- Pests
- Nutritional deficiencies
- Photos/videos available
- Control group available
- Lab reports available

### Recommended Search Stack
- PostgreSQL for canonical data.
- Meilisearch or Typesense for fast MVP faceted search.
- OpenSearch or Elasticsearch when analytics and large-scale multilingual indexing become more complex.
- Vector search via pgvector or a managed vector DB for semantic case matching and AI recommendations.

## 9. Interactive Maps

### Global Map Features
- Case markers by location or approximate region.
- Country-level clustering when exact GPS is unavailable.
- Crop concentration overlays.
- Success concentration heat maps.
- Yield increase and ROI map layers.
- Regional performance comparisons.
- Lead opportunity layer comparing traffic, leads, distributor coverage, and case density.

### Map Interactions
- Filter map by crop, problem, result, and verification.
- Click country to open country dashboard.
- Click case marker to preview case.
- Switch between case density, crop density, ROI, and lead opportunity.
- Admin-only view for unpublished cases and market gaps.

## 10. Data Visualization

### Public Dashboards
- Average yield improvement by crop.
- Average ROI by crop and country.
- Disease reduction by problem category.
- Quality improvement by crop.
- Before/after visual comparisons.
- Success rate by application method.
- Verified case growth over time.

### Internal Dashboards
- Case coverage by country, crop, and language.
- Lead conversion by source and page.
- SEO performance by programmatic page type.
- Diagnostic completion and conversion.
- Distributor pipeline by territory.
- AI query topics and unanswered questions.

## 11. Lead Generation System

### Lead Capture Fields
- Name
- Company
- Country
- WhatsApp
- Phone
- Email
- Crop
- Hectares
- Current problems
- Current yield
- Main objective
- Current products used
- Budget
- Urgency
- Need technical assistance
- Need distributor
- Need product
- Need trial
- Need consultation
- ROI calculator inputs
- Similar case viewed
- Source page
- Referenced case study
- Diagnostic report ID
- Language
- Consent and marketing permissions

### Lead Sources
- Case detail CTA.
- Diagnostic report unlock.
- Consultation form.
- Distributor form.
- ROI calculator.
- Downloadable PDF.
- WhatsApp click.
- Product page.
- Country and crop landing pages.
- Webinar/video registration.

### Lead Scoring Model
Score leads on a 0-100 scale.

| Factor | Points |
| --- | ---: |
| Farm size above priority threshold | 0-15 |
| Commercial crop or strategic crop | 0-10 |
| Clear urgent problem | 0-15 |
| Requests product, trial, or consultation | 0-15 |
| Provides WhatsApp and email | 0-10 |
| Budget indicated | 0-10 |
| Located in active distributor territory | 0-10 |
| Similar verified case exists | 0-10 |
| ROI calculator completed | 0-10 |
| High-intent page source | 0-5 |

Lead categories:
- 80-100: Sales-ready.
- 60-79: Qualified technical consultation.
- 40-59: Nurture and educate.
- 0-39: Low priority or incomplete.

### Routing Rules
- Sales-ready leads go to CRM and WhatsApp alert.
- Distributor leads go to partner-development pipeline.
- Technical leads go to agronomist queue.
- Low-score leads enter email/WhatsApp nurture sequence.
- Country without distributor triggers market opportunity flag.

### Distributor Lead Fields
- Name.
- Company.
- Country.
- Region.
- WhatsApp.
- Email.
- Years of agricultural sales experience.
- Product categories currently sold.
- Active farmer or retailer clients.
- Crop segments served.
- Territory coverage.
- Logistics capacity.
- Technical team available.
- Current brands represented.
- Monthly sales capacity estimate.
- Interest level and timeline.

### Distributor Lead Scoring
Distributor leads should use a separate 0-100 model:

| Factor | Points |
| --- | ---: |
| Relevant agricultural sales experience | 0-20 |
| Active client base | 0-20 |
| Strategic country or uncovered region | 0-15 |
| Logistics capacity | 0-15 |
| Technical support capacity | 0-10 |
| Complementary product portfolio | 0-10 |
| Immediate timeline | 0-10 |

## 12. Agronomic Diagnostic Tool

### Diagnostic Inputs
- Country.
- Crop and optional variety.
- Hectares.
- Main problem.
- Current production.
- Objective.
- WhatsApp.
- Email.
- Optional region.
- Optional climate, soil type, irrigation, and growth stage.
- Growth stage and planting date.
- Symptoms observed.
- Pest/disease/deficiency indicators.
- Current yield and expected yield.
- Products currently used.
- Photos optional.
- Urgency and budget.
- Desired outcome.

### Diagnostic Outputs
- Probable issue categories.
- Possible agronomic causes.
- Relevant Nano-Gro case studies ranked by similarity.
- Recommended application methods.
- Suggested next steps.
- Consultation CTA.
- Downloadable report.
- Lead record with scoring.
- Lead score calculated automatically.
- Similar cases shown immediately after submission.

### Matching Logic
- Rule-based matching for MVP using crop, problem, climate, soil, growth stage, and country.
- Weighted similarity scoring across cases.
- Later AI semantic matching against case narratives, agronomist notes, and reports.
- Human-reviewed recommendations for high-risk claims.

## 13. AI Recommendation Engine

### Core AI Functions
- Match user inputs to similar case studies.
- Answer user questions using the verified case knowledge base.
- Suggest likely improvements based on comparable cases.
- Explain application methods in user language.
- Generate case summaries for farmers, agronomists, distributors, and researchers.
- Identify missing information needed for better diagnosis.

### AI Timing
Do not make AI a Phase 1 dependency. Phase 1 should prove the evidence database, search, filters, case pages, SEO, lead capture, and admin workflow. AI becomes valuable only after the case data, taxonomy, evidence library, and diagnostic inputs are structured enough to retrieve reliable source material.

### Architecture
- Retrieval-augmented generation over approved case content, product docs, FAQs, and agronomist notes.
- Strict source citation in AI answers.
- Confidence thresholds and fallback to human consultation.
- Admin interface for reviewing unanswered questions and improving content.
- Guardrails for medical, regulatory, and overclaim language.

### AI Readiness Requirements
- Clean structured schema.
- Normalized taxonomy.
- Verified source documents.
- Multilingual content fields.
- Embeddings for cases, articles, diagnostics, and documents.
- Feedback loop from user clicks, lead conversions, and expert review.

## 14. SEO Strategy

### Programmatic SEO Page Types
- `/case-studies/[crop]-[country]-[problem]-[case-id]`
- `/crops/[crop]`
- `/crops/[crop]/[problem]`
- `/countries/[country]`
- `/countries/[country]/[crop]`
- `/problems/[problem]`
- `/problems/[problem]/[crop]`
- `/results/yield-increase/[crop]`
- `/results/roi/[crop]`
- `/diseases/[disease]`
- `/pests/[pest]`
- `/deficiencies/[deficiency]`
- `/before-after/[crop]`
- `/before-after/[crop]/[problem]`
- `/roi-calculator/[crop]`

### SEO Pillars
- Country SEO: "Nano-Gro case studies in Colombia", "crop yield improvement Panama".
- Crop SEO: "Nano-Gro in rice", "corn yield increase case study".
- Problem SEO: "improve root development in tomato", "reduce crop stress".
- Disease SEO: disease-specific educational pages with relevant cases.
- Pest SEO: pest-stress support pages where evidence exists.
- Deficiency SEO: nutrient-stress pages tied to crop outcomes.
- Case Study SEO: rich, evidence-based pages with images, data, and schema.
- Knowledge Base SEO: educational evergreen content.
- Multi-language SEO: hreflang, localized slugs, translated metadata.

### Schema Markup
- Article
- Dataset
- FAQPage
- VideoObject
- ImageObject
- BreadcrumbList
- Organization
- Product
- Review or Testimonial where compliant
- LocalBusiness or distributor schema where applicable

### Internal Linking
- Case pages link to crop, country, problem, result, and related cases.
- Crop pages link to top countries, problems, and verified cases.
- Country pages link to crops, distributors, and regional cases.
- Before/after galleries link to full cases, crop pages, problem pages, and diagnostic forms.
- ROI calculator result pages link to comparable cases and consultation forms.
- Articles link to diagnostic tool and relevant cases.
- Diagnostic reports link to cases and consultation.

## 15. Content Strategy

### Content Systems
- Blog: timely educational and commercial content.
- Knowledge Center: evergreen agronomic education.
- Research Center: scientific and technical credibility.
- FAQ: product, application, purchasing, distributor, and diagnostic questions.
- Success Stories: narrative versions of structured cases.
- Technical Documents: protocols, reports, application sheets.
- Videos: farmer testimonials, agronomist explanations, field evidence.
- Downloads: whitepapers, PDF case summaries, crop guides.

### Content Priorities
1. Convert existing 50+ cases into structured case pages.
2. Create crop hub pages for all represented crops.
3. Create country hub pages for all represented countries.
4. Publish high-intent problem pages tied to documented evidence.
5. Publish the before/after evidence gallery.
6. Launch diagnostic form and ROI calculator as lead-generation tools.
7. Add technical guides and whitepapers for lead capture.

## 16. Conversion Funnels

### Visitor to Lead
Traffic source -> programmatic page -> relevant case evidence -> CTA -> lead form or diagnostic.

### Lead to Consultation
Lead submitted -> score and route -> WhatsApp/email response -> agronomist or sales consultation.

### Consultation to Trial
Consultation -> farm context captured -> recommended protocol -> trial proposal -> follow-up schedule.

### Trial to Customer
Trial design -> product application -> results capture -> ROI report -> purchase offer.

### Customer to Distributor
Successful customer -> territory discussion -> distributor qualification -> onboarding.

### Distributor to Partner
Distributor sales performance -> training -> territory expansion -> co-marketing.

### Partner to Ambassador
Verified repeated success -> testimonials -> events -> public case features.

## 17. Admin System

### Core Modules
- Case management: create, edit, translate, verify, publish, archive.
- Lead management: view, score, assign, update status, export, sync to CRM.
- Media library: upload, tag, caption, approve, transform images.
- Country management: regions, languages, distributor coverage.
- Crop management: varieties, growth stages, crop-specific fields.
- Diagnostic management: questions, rules, recommendations, report templates.
- SEO management: metadata, slugs, schema, index status, redirects.
- Analytics: traffic, conversions, search queries, case performance.
- Users and permissions: role-based access.
- Workflow approvals: draft, technical review, legal review, publish.

### Admin Roles
- Super Admin: full access.
- Content Manager: cases, media, SEO, articles.
- Agronomist Reviewer: technical notes, verification, confidence scoring.
- Sales Manager: leads, routing, CRM.
- Distributor Manager: distributor leads and country pages.
- Analyst: dashboards and exports.
- Translator: localized content only.

## 18. Reporting System

### Dashboards
- Leads: volume, score, source, country, crop, stage.
- Conversions: page-to-lead, diagnostic-to-lead, lead-to-consultation.
- Countries: traffic, cases, leads, distributors, conversion rates.
- Crops: case count, average results, lead demand.
- Case performance: views, saves, comparisons, leads, conversions.
- SEO: impressions, clicks, rankings, indexed pages, page type performance.
- Traffic: channel, geography, language, returning users.
- User behavior: searches, filters, map interactions, drop-offs.
- AI usage: questions, satisfaction, unanswered topics, conversion influence.
- Revenue attribution: lead source to sale, distributor territory, campaign ROI.

## 19. Technical Architecture

### Frontend
Recommendation: Next.js with TypeScript.

Why:
- Strong SEO with server rendering and static generation.
- Scales well for programmatic pages.
- Supports multilingual routing.
- Excellent ecosystem for analytics, forms, and admin interfaces.

### Backend
Recommendation: Node.js/NestJS or Next.js API routes for MVP, evolving to a dedicated NestJS service as complexity grows.

Why:
- TypeScript end to end.
- Clean service architecture for cases, leads, diagnostics, search, and AI.
- Good integration with CRMs, storage, and queues.

### Database
Recommendation: PostgreSQL with JSONB and pgvector.

Why:
- Reliable relational model for structured agricultural data.
- JSONB supports flexible case metadata.
- pgvector supports semantic search and AI recommendations.
- Strong reporting and data integrity.

### Search Engine
Recommendation:
- MVP: Meilisearch or Typesense.
- Scale phase: OpenSearch or Elasticsearch.

Why:
- Fast faceted search is core to product value.
- Search filters must remain responsive with thousands of cases.
- Later OpenSearch supports heavier analytics and multilingual indexing.

### Hosting
Recommendation:
- Vercel for frontend MVP.
- Render, Railway, Fly.io, AWS, or GCP for backend services.
- AWS/GCP for scale and enterprise requirements.

Why:
- Fast deployment for MVP.
- Scalable migration path.
- Strong CDN and regional performance.

### Storage and CDN
Recommendation: S3-compatible object storage plus CloudFront, Cloudflare, or managed CDN.

Why:
- Case studies will include many photos, videos, PDFs, and lab reports.
- CDN improves global page speed and SEO.

### Analytics
Recommendation:
- GA4 and Google Search Console for SEO.
- PostHog or Plausible for product behavior.
- CRM attribution reporting in HubSpot or similar.

Why:
- Need both acquisition metrics and in-product conversion behavior.

### CRM
Recommendation: HubSpot for MVP; Salesforce only if enterprise sales complexity requires it.

Why:
- HubSpot handles forms, lead scoring, marketing automation, sales pipeline, and WhatsApp integrations through partners.

### Email and WhatsApp
Recommendation:
- Email: SendGrid, Resend, or HubSpot.
- WhatsApp: WhatsApp Business Platform via Twilio, 360dialog, or HubSpot integration.

Why:
- WhatsApp is likely critical for international agricultural sales.

### AI
Recommendation:
- RAG architecture using OpenAI or another enterprise-grade model provider.
- Embeddings stored in pgvector.
- Human-reviewed agronomic answer policy.

Why:
- AI should answer from verified Nano-Gro evidence, not from uncontrolled general claims.

### Security
Requirements:
- Role-based access control.
- Audit logs for case edits and verification changes.
- Data privacy controls for farmer names, farm names, and GPS.
- Consent management for testimonials and marketing.
- Secure file upload scanning.
- Admin MFA.
- Rate limiting on forms and AI endpoints.

### Scalability
Requirements:
- Queue background jobs for indexing, translation, media processing, and AI embeddings.
- Cache public pages and API results.
- Separate read-heavy search from canonical database.
- Use event tracking from day one.
- Design all taxonomies for multilingual expansion.

## 20. Monetization Opportunities

- Product sales: convert leads into Nano-Gro purchases.
- Distributor memberships: paid territory tools, leads, and sales collateral.
- Premium research: paid reports and crop/country intelligence.
- Consulting: agronomic assessments and trial design.
- Certification programs: distributor, agronomist, and application training.
- AI advisory: paid advanced agronomic assistant or enterprise advisory tier.
- Enterprise licenses: agro-industrial dashboards and private case portals.
- Data intelligence: anonymized market insights by crop, region, and problem.

## 21. Multi-Language Expansion

### Initial Languages
- English
- Spanish
- Portuguese
- French

### Language Architecture
- Localized slugs.
- hreflang support.
- Language-specific metadata.
- Translation workflow in admin.
- Field-level translation for titles, summaries, notes, SEO, and reports.
- Taxonomy terms stored with locale-specific labels.
- AI answers constrained to the user's selected language.

### Expansion Priorities
1. Spanish and English for initial Latin America and international sales.
2. Portuguese for Brazil.
3. French for Africa, Europe, and parts of the Caribbean.
4. Additional languages based on traffic, distributor strategy, and case inventory.

## 22. MVP Roadmap

### MVP Goal
Launch a credible, searchable, SEO-ready case-study platform using the existing 50+ cases while capturing qualified leads.

### MVP Scope
- Public home page.
- Case study listing and detail pages.
- Problem, crop, and country landing pages.
- Basic faceted search.
- Similar cases module using rule-based matching.
- Evidence library foundation for photos, videos, documents, and testimonials.
- Case confidence score with public evidence checklist.
- Lead forms and WhatsApp CTAs.
- Free crop diagnostic form.
- Admin case manager.
- Media uploads.
- SEO metadata management.
- Basic analytics.
- English and Spanish support if content is available.
- Manual verification status and confidence score.

### MVP Exclusions
- Full AI assistant.
- Complex agronomic chatbot.
- AI prediction.
- Advanced diagnostic engine.
- Enterprise dashboards.
- Distributor portal.
- Automated multilingual translation.
- Complex revenue attribution.
- Advanced maps.
- Predictive results modeling.
- Complex e-commerce.
- Generic blog, news, courses, community, forum, or events.
- Marketplace.
- Mobile app.

### MVP Timeline
- Week 1: Content audit, taxonomy setup, evidence scoring model, data import template.
- Week 2: Schema finalization, UX flows, case/crop/country/problem wireframes.
- Week 3: Public pages, admin case import, evidence library foundation.
- Week 4: Search, filters, similar cases, forms, analytics, SEO, launch QA.

## 23. Phase 2 Roadmap

### Goal
Turn the platform into a diagnostic and conversion system.

Scope:
- Agronomic diagnostic tool.
- Downloadable diagnostic reports.
- Case comparison tool.
- Interactive global map.
- ROI calculator.
- Before/after gallery expansion.
- Distributor qualification funnel.
- Lead scoring and routing.
- CRM integration.
- PDF case exports.
- Knowledge center and FAQ.
- Programmatic SEO expansion.
- Portuguese and French foundations.

Timeline:
- 3-4 months after MVP launch.

## 24. Phase 3 Roadmap

### Goal
Become an AI-powered agronomic intelligence and partner-growth platform.

Scope:
- AI recommendation assistant.
- Semantic case matching.
- Distributor portal.
- Enterprise dashboards.
- Advanced revenue attribution.
- Private research reports.
- Certification program support.
- Automated content gap analysis.
- AI-assisted translation workflow.
- Evidence-based prediction ranges with strict disclaimers.

Timeline:
- 4-6 months after Phase 2, depending on data readiness and sales traction.

## 25. Priority Order of Implementation

1. Audit and normalize the 50+ existing case studies.
2. Define case confidence score and evidence completeness rules.
3. Define final taxonomy and data model.
4. Build evidence library foundation.
5. Build case admin and import workflow.
6. Build public case listing and detail pages.
7. Add problem, crop, and country landing pages.
8. Implement faceted search and similar cases.
9. Add free crop diagnostic form, WhatsApp CTAs, and lead scoring.
10. Add SEO metadata, schema, sitemap, and internal linking.
11. Launch MVP with analytics and Search Console.
12. Add ROI calculator and before/after gallery expansion.
13. Add advanced diagnostic reports.
14. Add interactive map and public dashboards.
15. Integrate CRM and marketing automation.
16. Add AI recommendation engine.
17. Expand distributor and enterprise modules.

## 26. Wireframe Descriptions

### Home Wireframe
- Top nav with search, language, and consultation CTA.
- Hero search module with crop, country, problem inputs.
- Metrics strip: cases, countries, crops, average yield increase where defensible.
- Featured verified cases grid.
- Problem-first navigation strip: low production, weak roots, water stress, poor flowering, poor fruit size, post-transplant recovery.
- Before/after gallery preview.
- ROI calculator preview.
- Map preview.
- Crop and country entry points.
- Diagnostic CTA band.
- Footer with product, company, resources, and contact links.

### Case Listing Wireframe
- Left filter panel on desktop, drawer filters on mobile.
- Search bar across top.
- Result count and sorting.
- Case cards in dense list/grid.
- Each card shows crop, country, problem, result, verification, and CTA.

### Case Detail Wireframe
- Header with case title, crop, country, verification badge.
- Summary metrics panel.
- Confidence score card with evidence checklist.
- Main content tabs: Overview, Protocol, Results, Media, Documents, Notes.
- Right rail CTA on desktop; sticky CTA on mobile.
- Similar cases module with match reasons.
- ROI calculator CTA using the case as reference.
- Internal links near bottom.

### Crop Page Wireframe
- Crop hero with case count, countries, average result ranges, and primary CTA.
- Crop-specific search/filter bar.
- Top documented problems for that crop.
- Best verified cases.
- Before/after media for the crop.
- Crop ROI prompt.
- FAQs and application notes.
- Consultation form tied to the crop.

### Country Page Wireframe
- Country hero with case count, crop mix, regions, and distributor CTA.
- Regional case map or list.
- Top crops and top problems.
- Best verified cases in that country.
- Country-specific before/after media.
- Local consultation/distributor form.

### Before/After Gallery Wireframe
- Masonry or grid gallery with stable filters.
- Filter by crop, country, problem, growth stage, and verification.
- Each asset shows case title, crop, country, evidence stage, and confidence score.
- Click opens full case or media detail.

### ROI Calculator Wireframe
- Compact calculator form for hectares, crop, yield, price, and country.
- Result panel with additional production, additional revenue, program cost, and ROI range.
- Comparable cases panel.
- Lead form attached to the calculation.

### Diagnostic Tool Wireframe
- Stepper interface.
- One agricultural question group per step.
- Progress indicator.
- Optional photo upload.
- Result preview.
- Lead gate for full report and consultation.

### Admin Case Editor Wireframe
- Left navigation for case sections.
- Main form area grouped by farm, crop, problem, treatment, results, media, SEO, verification.
- Status panel with workflow, language, confidence score, and publish controls.
- Preview button.

### Analytics Wireframe
- KPI cards at top.
- Filter by date, country, crop, and language.
- Charts for traffic, leads, conversions, case views, diagnostic completions.
- Tables for top cases, top queries, and lead quality.

## 27. Data Import Template

Every existing case should be migrated into a structured spreadsheet or admin import file with these minimum launch columns:

- case_id
- title
- country
- region
- crop
- variety
- farm_size
- problem
- baseline_conditions
- treatment_applied
- dosage
- application_method
- application_frequency
- control_group_available
- has_before_photos
- has_after_photos
- has_video
- has_testimonial
- has_lab_report
- yield_increase_percent
- quality_improvement_percent
- disease_reduction_percent
- cost_savings
- roi
- result_summary
- farmer_testimonial
- agronomist_notes
- verification_status
- data_quality_score
- scientific_confidence_score
- confidence_score_notes
- media_links
- document_links
- tags
- language
- seo_title
- seo_description
- publication_status

## 28. Success Metrics

### North Star Metric
The primary metric is not visits, page views, or time on site. The primary metric is the commercial diagnostic funnel:

```text
Diagnostics started
-> Diagnostics completed
-> Qualified leads
-> Sales
```

Secondary high-intent metric:

```text
Related cases viewed per session
```

If a farmer views 5-10 cases related to the same crop, country, or problem, the session should be treated as high commercial intent.

### Product Metrics
- Case views.
- Similar cases viewed.
- Related cases viewed per session.
- Search usage.
- Filter usage.
- Case saves and comparisons.
- Diagnostic starts and completions.
- PDF downloads.
- AI questions answered.

### Growth Metrics
- Organic impressions.
- Organic clicks.
- Indexed pages.
- Ranking pages by crop, country, and problem.
- Returning users.
- Language-specific traffic.

### Sales Metrics
- Leads captured.
- Diagnostics started.
- Diagnostics completed.
- Lead score distribution.
- Qualified leads.
- Consultation bookings.
- WhatsApp conversations.
- Trial requests.
- Distributor applications.
- Lead-to-customer conversion.
- Revenue attribution by case, crop, country, and source.

## 29. Guiding Product Principle

Every case study should become a compound asset:

- A proof point for trust.
- A searchable page for SEO.
- A diagnostic match for farmers.
- A sales enablement asset for distributors.
- A data point for dashboards.
- A source for AI recommendations.
- A conversion path into consultation, trial, product purchase, or partnership.
