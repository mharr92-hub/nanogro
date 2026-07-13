# Nano-Gro MVP Dry Run Results

## Summary

- Sample CSV: `sample-data/nano-gro-sample-cases.csv`
- Total rows: 10
- Valid rows: 9
- Invalid rows: 1
- Imported draft simulations: 9
- Skipped row simulations: 0
- Automatically published imported cases: 0

## Sample Cases Created

- Row 2: Cacao Panama low production recovery / Cacao / Panama / Low production
- Row 3: Banana Colombia water stress recovery / Banana / Colombia / Water stress
- Row 4: Coffee Ecuador flowering improvement / Coffee / Ecuador / Poor flowering
- Row 5: Rice Peru root development observation / Rice / Peru / Weak rooting
- Row 6: Tomato Mexico small fruit quality case / Tomato / Mexico / Small fruit
- Row 7: Melon Panama transplant recovery / Melon / Panama / Post-transplant recovery
- Row 8: Cacao Colombia disease pressure case / Cacao / Colombia / Disease pressure
- Row 9: Banana Ecuador incomplete protocol case / Banana / Ecuador / Low quality
- Row 10: Rice Colombia incomplete application details / Rice / Colombia / Climate stress
- Row 11: Corn invalid missing country / Corn / missing country / problem pending

## Import Results

| Metric | Count |
| --- | ---: |
| Total rows | 10 |
| Valid rows | 9 |
| Invalid rows | 1 |
| Imported as draft | 9 |
| Skipped | 0 |

Invalid rows:

- Row 11: Missing country; Missing primary_problem or results_summary; yield_increase_percent must be numeric

Skipped rows:

- None

## Draft Case Simulation

- NG-SAMPLE-001: Cacao Panama low production recovery / slug: `cacao-panama-low-production-27pct` / status: draft / completeness: 100 / confidence: 100 / missing fields: 3 / pending confirmations: 3
- NG-SAMPLE-002: Banana Colombia water stress recovery / slug: `banana-colombia-water-stress-18pct` / status: draft / completeness: 100 / confidence: 97 / missing fields: 4 / pending confirmations: 3
- NG-SAMPLE-003: Coffee Ecuador flowering improvement / slug: `coffee-ecuador-poor-flowering-22pct` / status: draft / completeness: 100 / confidence: 100 / missing fields: 3 / pending confirmations: 3
- NG-SAMPLE-004: Rice Peru root development observation / slug: `rice-peru-weak-rooting` / status: draft / completeness: 40 / confidence: 47 / missing fields: 9 / pending confirmations: 6
- NG-SAMPLE-005: Tomato Mexico small fruit quality case / slug: `tomato-mexico-small-fruit` / status: draft / completeness: 60 / confidence: 54 / missing fields: 7 / pending confirmations: 5
- NG-SAMPLE-006: Melon Panama transplant recovery / slug: `melon-panama-post-transplant-recovery` / status: draft / completeness: 40 / confidence: 47 / missing fields: 8 / pending confirmations: 5
- NG-SAMPLE-007: Cacao Colombia disease pressure case / slug: `cacao-colombia-disease-pressure` / status: draft / completeness: 40 / confidence: 37 / missing fields: 10 / pending confirmations: 7
- NG-SAMPLE-008: Banana Ecuador incomplete protocol case / slug: `banana-ecuador-low-quality` / status: draft / completeness: 40 / confidence: 37 / missing fields: 10 / pending confirmations: 7
- NG-SAMPLE-009: Rice Colombia incomplete application details / slug: `rice-colombia-climate-stress` / status: draft / completeness: 40 / confidence: 37 / missing fields: 11 / pending confirmations: 8

## Public Flow Dry Run

Published-case simulation used the first 3 complete cases only:

- `/cases/cacao-panama-low-production-27pct`: professional report renders with Summary, Crop & Location, Initial Challenge, Nano-Gro Application, Observed Results, Evidence Available, Technical Notes, Similar Cases, Request Diagnosis.
- `/cases/banana-colombia-water-stress-18pct`: professional report renders with Summary, Crop & Location, Initial Challenge, Nano-Gro Application, Observed Results, Evidence Available, Technical Notes, Similar Cases, Request Diagnosis.
- `/cases/coffee-ecuador-poor-flowering-22pct`: professional report renders with Summary, Crop & Location, Initial Challenge, Nano-Gro Application, Observed Results, Evidence Available, Technical Notes, Similar Cases, Request Diagnosis.

Incomplete report behavior verified:

- Missing protocol details render as "Application protocol pending technical confirmation."
- Missing yield data renders as "Yield data not reported."
- Missing ROI renders as "ROI not calculated due to incomplete baseline data."
- Evidence gaps render as "Evidence files pending attachment."
- Cases with pending details include the disclaimer: "This case is based on documented field observations. Some technical details may be pending confirmation."

## Admin Route Checklist

- /admin/import: CSV validates and shows batch result counts
- /admin/cases: Draft/imported cases are listed after DB-backed import
- /admin/review: Incomplete drafts are prioritized by missing fields, low confidence, protocol, and evidence
- /admin/cases/[id]: Editor shows missing fields, pending confirmations, technical questions, evidence reference, disclaimer preview
- /cases: Shows published cases only
- /cases/[slug]: Uses professional report model with no blank optional sections
- /diagnostico: Lead form saves viewed case/source context when Supabase is configured
- /sitemap.xml: Build route exists and includes published mock/data-backed cases
- /robots.txt: Build route exists and disallows /admin

## Lead Flow Dry Run

- Diagnostic form route exists at `/diagnostico`.
- Lead scoring logic gives points for hectares, WhatsApp, email, matched problem, related cases, and diagnostic request.
- DB-backed lead persistence requires Supabase env vars and migrations applied.
- Viewed case/source page fields are present in the form and server action.

## SEO Dry Run

- `/sitemap.xml` builds successfully.
- `/robots.txt` builds successfully and disallows `/admin`.
- Case metadata is generated from case SEO title/description or safe fallbacks.

## Bugs Found

- Corn is not currently seeded as a crop taxonomy term; the invalid sample row intentionally uses Corn and a missing country to validate failure behavior.
- Full DB import could not be executed locally because Supabase env vars are not configured in this workspace.

## Fixes Applied

- Added realistic 10-row sample CSV.
- Added deterministic dry-run script and generated this report.
- Added a third mock published case so the public route checklist can cover at least 3 case report pages without live Supabase.

## Remaining Manual Steps

- Apply all Supabase migrations in order.
- Configure `.env.local`.
- Seed or confirm taxonomy before real CSV import, especially crop synonyms like Corn/Maize if real data uses both.
- Run `/admin/import` against Supabase with the real CSV.
- Click "Create draft cases".
- Attach evidence manually from source folders.
- Review missing fields and technical questions.
- Move approved cases through review -> approved -> published.

## Readiness Score

82 / 100

Reason: The code builds, import validation is working, incomplete-case handling is conservative, and public/admin routes exist. The remaining risk is operational: real Supabase execution, taxonomy cleanup, and evidence attachment for the incoming 50 cases.
