# Nano-Gro 48-Hour Case Ingestion MVP

## Objective

Build the fastest production-ready path from incoming Nano-Gro case study to published, searchable, lead-generating proof page.

All non-essential platform features are frozen until the first 50+ cases are imported, reviewed, published, searchable, and connected to lead capture.

## Frozen Until After Launch

Do not build for this MVP:

- AI agronomist.
- Predictive models.
- Mobile apps.
- Forums.
- Communities.
- Marketplaces.
- Advanced maps.
- Courses.
- Events.
- Generic blog.
- Complex e-commerce.
- Distributor portal.
- Enterprise dashboards.

## Exact MVP Scope

Launch within days with only:

- Admin login.
- Case creation and editing.
- Bulk case upload from CSV/XLSX.
- Evidence upload and management.
- Taxonomy management.
- Case review workflow.
- Public case listing.
- Public case detail page.
- Search and filters.
- Related cases.
- Lead capture linked to case viewed.
- Basic analytics events.
- Production deployment with database, storage, and backups.

## Non-Negotiable Architecture Rules

### Permanent Slugs

Every published case must have a permanent human-readable URL.

Example:

```text
/cases/cacao-panama-baja-produccion-27pct
```

Rules:
- Do not expose database IDs in public URLs.
- Generate the slug from crop, country, problem, and result when possible.
- Once a case is published, do not change its slug.
- If a slug must change, create a redirect from the old slug.
- Use the canonical slug in SEO metadata and sitemap.

### Calculated Fields

Do not manually maintain values that can be reliably calculated.

Calculated or semi-calculated fields:
- ROI.
- Yield or production increase percentage.
- Case completeness score.
- Evidence score.
- Confidence score.
- Related case match score.
- Positive improvement flag.

Admin users may override calculated values only when a reason is stored in an audit note.

### Editorial Workflow

Cases must not publish directly from import.

Required statuses:

```text
draft
review
approved
published
archived
```

Workflow:

```text
Imported draft
-> editor completes fields
-> review
-> approved
-> published
-> archived if retired
```

### Evidence Separate From Cases

Evidence must stay in `evidence_assets`, not inside `cases`.

Reason:
- One case may eventually have 40 photos, 3 PDFs, 2 videos, and 1 lab report.
- Evidence needs its own consent, approval, captions, alt text, storage keys, ordering, and visibility rules.

### Automatic Landing Page Feeding

Each published case should automatically strengthen multiple public discovery paths.

Example case:

```text
Crop: Cacao
Country: Panama
Problem: Low production
```

Automatically feeds:

```text
/problems/low-production
/crops/cacao
/countries/panama
/search?problem=low-production
/search?crop=cacao
/search?country=panama
```

No manual landing-page editing should be required for launch.

## Database Schema

Recommended database: PostgreSQL.

Use UUID primary keys, `created_at`, `updated_at`, and soft publication states across core tables.

### cases

```sql
create table cases (
  id uuid primary key default gen_random_uuid(),
  public_id text unique not null,
  slug text unique not null,
  title text not null,
  summary text,
  crop_id uuid not null references crops(id),
  country_id uuid not null references countries(id),
  region_id uuid references regions(id),
  primary_problem_id uuid not null references problems(id),
  evidence_level text not null check (evidence_level in ('A', 'B', 'C', 'D')),
  application_method_id uuid references application_methods(id),
  nano_gro_application text,
  dosage text,
  application_frequency text,
  farm_size_value numeric,
  farm_size_unit text default 'ha',
  baseline_conditions text,
  treatment_notes text,
  results_summary text,
  yield_increase_percent numeric,
  quality_improvement_percent numeric,
  disease_reduction_percent numeric,
  roi_value numeric,
  roi_notes text,
  case_completeness_score integer check (case_completeness_score between 0 and 100),
  evidence_score integer check (evidence_score between 0 and 100),
  confidence_score integer check (confidence_score between 0 and 100),
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'internal_review', 'agronomist_review', 'lab_supported', 'third_party')),
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'review', 'approved', 'published', 'archived')),
  language text not null default 'es',
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### case_completeness_score

Use this calculated score to rank the best cases first and identify weak drafts before publication.

| Element | Points |
| --- | ---: |
| Description | 10 |
| Result summary | 10 |
| ROI | 10 |
| Photos | 20 |
| Video | 20 |
| PDF/document | 10 |
| Testimonial | 10 |
| Technical validation | 10 |

Result:

```text
92 / 100
```

Usage:
- Sort strongest cases first in admin.
- Feature high-quality cases publicly.
- Flag incomplete imported cases.
- Prioritize evidence collection before launch.
- Use as a boost in related-case recommendations.

### case_secondary_problems

```sql
create table case_secondary_problems (
  case_id uuid not null references cases(id) on delete cascade,
  problem_id uuid not null references problems(id),
  primary key (case_id, problem_id)
);
```

### evidence_assets

```sql
create table evidence_assets (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  asset_type text not null check (asset_type in ('photo', 'video', 'pdf', 'document', 'lab_report', 'raw_data')),
  evidence_stage text check (evidence_stage in ('before', 'during', 'after', 'final', 'supporting')),
  file_url text not null,
  storage_key text not null,
  file_name text,
  mime_type text,
  file_size_bytes bigint,
  title text,
  caption text,
  alt_text text,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'approved', 'restricted')),
  consent_status text not null default 'unknown'
    check (consent_status in ('unknown', 'approved', 'restricted')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### crops

```sql
create table crops (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  category text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### countries

```sql
create table countries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  iso_code text,
  dominant_climate text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### regions

```sql
create table regions (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references countries(id) on delete cascade,
  name text not null,
  slug text not null,
  climate text,
  unique(country_id, slug)
);
```

### problems

```sql
create table problems (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  category text not null,
  description text,
  common_symptoms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### application_methods

```sql
create table application_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);
```

### leads

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  company text,
  country_id uuid references countries(id),
  crop_id uuid references crops(id),
  problem_id uuid references problems(id),
  hectares numeric,
  whatsapp text,
  email text,
  objective text,
  current_production text,
  urgency text,
  source_path text,
  viewed_case_id uuid references cases(id),
  recommended_case_ids uuid[],
  lead_score integer not null default 0,
  status text not null default 'new'
    check (status in ('new', 'qualified', 'contacted', 'consultation', 'trial', 'customer', 'closed')),
  consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### case_import_batches

```sql
create table case_import_batches (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  imported_by uuid,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'validating', 'validated', 'imported', 'failed')),
  total_rows integer default 0,
  valid_rows integer default 0,
  error_rows integer default 0,
  error_report_url text,
  created_at timestamptz not null default now()
);
```

### case_import_rows

```sql
create table case_import_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references case_import_batches(id) on delete cascade,
  row_number integer not null,
  raw_data jsonb not null,
  validation_errors jsonb,
  imported_case_id uuid references cases(id),
  status text not null default 'pending'
    check (status in ('pending', 'valid', 'invalid', 'imported')),
  created_at timestamptz not null default now()
);
```

### analytics_events

```sql
create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  case_id uuid references cases(id),
  lead_id uuid references leads(id),
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

## Indexes

```sql
create index cases_publication_status_idx on cases(publication_status);
create index cases_crop_idx on cases(crop_id);
create index cases_country_idx on cases(country_id);
create index cases_primary_problem_idx on cases(primary_problem_id);
create index cases_evidence_level_idx on cases(evidence_level);
create index cases_yield_increase_idx on cases(yield_increase_percent);
create index cases_roi_idx on cases(roi_value);
create index evidence_assets_case_idx on evidence_assets(case_id);
create index leads_viewed_case_idx on leads(viewed_case_id);
create index leads_created_at_idx on leads(created_at);
```

For MVP text search, use PostgreSQL `tsvector` or simple `ILIKE` search. Add Meilisearch/Typesense only if PostgreSQL search becomes insufficient after launch.

## Admin Panel First

### Admin Navigation

```text
Admin
├── Dashboard
├── Cases
│   ├── All Cases
│   ├── Create Case
│   ├── Bulk Upload
│   └── Review Queue
├── Evidence Library
├── Taxonomy
│   ├── Problems
│   ├── Crops
│   ├── Countries
│   ├── Regions
│   ├── Application Methods
│   └── Evidence Levels
├── Leads
├── Analytics
└── Settings
```

### Dashboard Wireframe

```text
[Cases Published] [Drafts] [Needs Review] [Leads]

Recent Import Batches
- File
- Rows
- Valid
- Errors
- Status

Review Queue
- Case title
- Crop
- Country
- Problem
- Evidence level
- Missing fields
- Open

Launch Readiness
- Cases with photos
- Cases with ROI
- Cases with SEO metadata
- Cases ready to publish
```

### Cases List Wireframe

```text
Search: [title, crop, country, problem]
Filters: [status] [crop] [country] [problem] [evidence level]

Table:
- Public ID
- Title
- Crop
- Country
- Problem
- Evidence Level
- Assets
- ROI
- Status
- Updated
- Actions: Edit / Preview / Publish / Archive
```

### Case Editor Wireframe

```text
Left rail:
- Basics
- Classification
- Application
- Results
- Evidence
- SEO
- Review

Basics:
- Title
- Public ID
- Slug
- Summary
- Language

Classification:
- Crop
- Country
- Region
- Main problem
- Secondary problems
- Evidence level

Application:
- Application method
- Dosage
- Frequency
- Notes

Results:
- Results summary
- Yield increase %
- Quality improvement %
- Disease reduction %
- ROI
- ROI notes
- Confidence score
- Verification status

Evidence:
- Upload photos/videos/PDF/documents
- Mark before/during/after/supporting
- Captions
- Alt text
- Consent status
- Approval status

SEO:
- SEO title
- SEO description
- Featured image

Review:
- Missing required fields
- Preview public page
- Save draft
- Send to review
- Publish
```

### Bulk Upload Wireframe

```text
Step 1: Download template
Step 2: Upload CSV/XLSX
Step 3: Map columns
Step 4: Validate rows
Step 5: Review errors
Step 6: Import valid rows as drafts
Step 7: Attach evidence files
Step 8: Publish individually or in batch
```

## Case Ingestion Workflow

### Fast Path

```text
Receive case files
-> Normalize into import template
-> Upload CSV/XLSX
-> Validate rows
-> Import valid rows as drafts
-> Upload evidence assets
-> Attach assets to cases
-> Review required fields
-> Preview public case
-> Publish
-> Case becomes searchable
-> Lead form tracks viewed case
```

### Required Fields Before Publish

- Title.
- Permanent slug.
- Crop.
- Country.
- Primary problem.
- Evidence level.
- Results summary.
- Publication status must pass through review and approval.
- At least one result metric or qualitative result.
- SEO title.
- SEO description.

### Recommended Fields Before Publish

- Region.
- Before photo.
- After photo.
- ROI.
- Yield increase percentage.
- Application method.
- Dosage.
- Testimonial or agronomist note.
- Case completeness score above launch threshold.

### Import Template Columns

```text
public_id
title
summary
crop
country
region
primary_problem
secondary_problems
evidence_level
application_method
nano_gro_application
dosage
application_frequency
farm_size_value
farm_size_unit
baseline_conditions
treatment_notes
results_summary
yield_increase_percent
quality_improvement_percent
disease_reduction_percent
roi_value
roi_notes
confidence_score
verification_status
language
featured
seo_title
seo_description
publication_status
evidence_folder_name
```

## Bulk Upload Capability

### MVP Bulk Upload

- Accept CSV first.
- XLSX optional if fast to implement.
- Validate required columns.
- Auto-create missing taxonomy terms only if admin confirms.
- Import rows as drafts by default.
- Generate downloadable error report.
- Allow re-upload after correction.
- Support `evidence_folder_name` to match assets later.

### Validation Rules

- `public_id` unique.
- `slug` generated from title and public ID.
- Crop must exist or be approved for creation.
- Country must exist or be approved for creation.
- Primary problem must exist or be approved for creation.
- Evidence level must be A, B, C, or D.
- Percent fields must be numeric.
- ROI must be numeric.
- Publication status must be draft, review, approved, published, or archived.
- Imported rows always become drafts unless an admin explicitly moves them into review.
- Permanent slugs must be unique.

## Evidence Management

### Storage

Use object storage:

- Supabase Storage for fastest MVP if using Supabase.
- S3-compatible storage if deploying outside Supabase.

### Evidence Types

- Photos.
- Videos.
- PDFs.
- Documents.
- Lab reports.
- Raw data.

### Evidence Workflow

```text
Upload file
-> Select case
-> Select evidence type
-> Select stage: before/during/after/final/supporting
-> Add caption
-> Add alt text
-> Set consent status
-> Set approval status
-> Save
```

### Evidence Rules

- Files are private until approved.
- Public pages show only approved evidence.
- Restricted consent assets stay internal.
- Every public image needs alt text.
- Every file should retain original file name and storage key.

## Taxonomy

### Problems

Minimum launch problems:

- Low production.
- Water stress.
- Poor flowering.
- Weak rooting.
- Post-transplant recovery.
- Small fruit.
- Low quality.
- Climate stress.
- Disease pressure.
- Poor germination.

Fields:
- Name.
- Slug.
- Category.
- Description.
- Common symptoms.

### Crops

Minimum launch crops should match the first 50+ cases. Seed likely options:

- Cacao.
- Banana.
- Coffee.
- Maize.
- Rice.
- Tomato.
- Melon.
- Watermelon.

Fields:
- Name.
- Slug.
- Category.
- Description.

### Countries

Minimum launch countries should match the first 50+ cases. Seed likely options:

- Panama.
- Colombia.
- Peru.
- Ecuador.
- Mexico.
- Brazil.

Fields:
- Name.
- Slug.
- ISO code.
- Dominant climate.

### Evidence Levels

- Level A: Complete data, photos, measurements, and technical validation.
- Level B: Partial data plus photos.
- Level C: Documented testimonial with supporting context.
- Level D: Anecdotal case or early field note.

## Public Search And Filtering

### Case Listing Page

URL: `/case-studies`

Search:
- Title.
- Crop.
- Country.
- Problem.
- Results summary.

Filters:
- Problem.
- Crop.
- Country.
- Region.
- Evidence level.
- Case completeness score.
- Application method.
- Yield increase range.
- ROI range.
- Has photos.
- Has video.
- Has PDF/document.

Sort:
- Most relevant.
- Newest.
- Most complete.
- Highest evidence level.
- Highest ROI.
- Highest yield increase.

Case card:
- Title.
- Crop.
- Country.
- Problem.
- Result highlight.
- ROI if available.
- Evidence level.
- Photo count.
- CTA: View case.

### Case Detail Page

URL: `/case-studies/[slug]`

Sections:
- Title and summary.
- Crop, country, region, problem.
- Evidence level and confidence score.
- Results summary.
- Nano-Gro application.
- ROI.
- Evidence gallery.
- Documents.
- Related cases.
- Free crop diagnostic lead form.

## Related Case Recommendations

### MVP Rule-Based Matching

Score related cases by:

- Same crop: +30.
- Same primary problem: +30.
- Same country: +20.
- Same region: +10.
- Same application method: +10.
- Same evidence level or higher: +10.
- Case completeness score above 80: +10.
- Similar ROI or result range: +5.

Show 3-6 related cases on each case detail page.

Display match reasons:

- Same crop.
- Same problem.
- Same country.
- Similar application.
- High evidence level.

## Lead Capture Linked To Viewed Cases

### Lead Form Placement

- Case detail right rail.
- Sticky mobile CTA.
- After related cases.
- Diagnostic page.

### Minimum Lead Fields

- Name.
- WhatsApp.
- Email.
- Country.
- Crop.
- Hectares.
- Main problem.
- Objective.
- Consent.

### Hidden Context Fields

- Viewed case ID.
- Viewed case crop.
- Viewed case country.
- Viewed case problem.
- Related cases shown.
- Source path.
- UTM parameters if available.

### Lead Score MVP

```text
Base score: 0
+15 if hectares provided
+15 if WhatsApp provided
+10 if email provided
+15 if problem matches a published case
+15 if crop has 3+ published cases
+10 if viewed 2+ related cases
+10 if requested diagnostic
+10 if country has distributor interest
```

## Public User Flow

```text
Home
-> Search by problem/crop/country
-> Case listing
-> Case detail
-> Related cases
-> Free crop diagnostic
-> Lead captured with viewed case context
-> Confirmation with recommended cases
```

Alternative:

```text
Google/search result
-> Case detail
-> Evidence and ROI
-> Related cases
-> Diagnostic form
-> Lead
```

## Minimum Production Architecture

### Recommended Stack

- Frontend: Next.js.
- Backend: Next.js server actions/API routes for MVP.
- Database: Supabase Postgres.
- Storage: Supabase Storage.
- Auth: Supabase Auth or simple protected admin auth.
- Hosting: Vercel.
- Analytics: database-backed events plus Google Search Console.
- Email notifications: Resend or Supabase edge function later if needed.

### Why This Stack

- Fastest path to production.
- Built-in Postgres and storage.
- Simple admin + public app in one codebase.
- Good SEO for case pages.
- Easy migration path later.

### Production Requirements

- Admin routes protected.
- Public case pages only show `publication_status = published`.
- Evidence only shown when approved.
- Storage bucket policies reviewed.
- Daily database backup.
- Environment variables configured.
- Error logging enabled.
- Basic rate limiting on lead forms.
- Privacy and consent copy on forms.

## Implementation Order

### Day 1

1. Provision Supabase.
2. Create schema.
3. Configure storage buckets and policies.
4. Configure auth.
5. Build admin layout.
6. Seed core taxonomy.

### Day 2

7. Build case CRUD.
8. Build evidence CRUD.
9. Build taxonomy CRUD.
10. Add editorial workflow: draft, review, approved, published, archived.
11. Add permanent slug generation and lock after publish.

### Day 3

12. Build CSV/XLSX importer.
13. Build import validation.
14. Build import error report.
15. Build image/evidence importer.
16. Add evidence folder matching.

### Day 4

17. Build public case detail page.
18. Build public case listing.
19. Build search.
20. Build filters.
21. Build automatic crop, country, and problem landing pages from published cases.

### Day 5

22. Build related case recommendations.
23. Build lead form linked to viewed case.
24. Store hidden context: viewed case, related cases shown, source path.
25. Build lead admin list.

### Day 6

26. Add analytics events.
27. Add SEO metadata.
28. Generate sitemap.
29. Add canonical URLs.
30. Add production privacy and consent copy.

### Day 7

31. Bulk load the 50+ cases.
32. Attach evidence.
33. Review completeness scores.
34. Approve and publish launch-ready cases.
35. QA search, filters, related cases, leads, sitemap, and public pages.
36. Deploy production.

## Launch Checklist

- 50+ cases imported as drafts.
- Taxonomy normalized.
- Evidence uploaded and attached.
- Public pages show only published cases.
- Search returns expected cases.
- Filters work for problem, crop, country, evidence level, ROI.
- Related cases appear on case detail pages.
- Lead form stores viewed case ID.
- Admin can publish/unpublish cases.
- SEO title and description present.
- Storage permissions verified.
- Database backup enabled.
- Privacy and consent copy visible.
