# Pilot Import Checklist

Use this checklist before importing the full 50+ case batch.

## Pilot Selection

- [ ] Pick 5 representative cases.
- [ ] Include 2 complete cases.
- [ ] Include 2 incomplete cases.
- [ ] Include 1 weak/testimonial-only case.
- [ ] Confirm each row has `public_id`, `title`, `crop`, `country`, and either `problem` or `result_summary`.

## CSV Validation

- [ ] Use `sample-data/nano-gro-pilot-5-cases.csv` as the structure.
- [ ] Validate the CSV in `/admin/import`.
- [ ] Confirm valid rows are accepted.
- [ ] Confirm no row is published automatically.
- [ ] Confirm invalid rows show clear errors if any appear.

## Draft Creation

- [ ] Click `Create draft cases`.
- [ ] Confirm all valid pilot rows become draft cases.
- [ ] Confirm duplicates are not created if the same import row is processed again.
- [ ] Confirm draft cases appear in `/admin/cases`.

## Review

- [ ] Open incomplete cases in `/admin/review`.
- [ ] Confirm missing fields are visible.
- [ ] Confirm pending confirmations are visible.
- [ ] Confirm technical questions are generated.
- [ ] Confirm evidence reference/source folder appears in the case editor.

## Evidence

- [ ] Create matching evidence folders.
- [ ] Attach photos where available.
- [ ] Attach videos where available.
- [ ] Attach PDFs/lab reports where available.
- [ ] Keep testimonial-only cases as draft or review until evidence is approved.

## Publishing

- [ ] Publish 2 complete cases only.
- [ ] Confirm `/cases` shows only published cases.
- [ ] Confirm `/cases/[slug]` pages render professional reports.
- [ ] Confirm incomplete data does not create blank public sections.
- [ ] Confirm responsible disclaimers appear where needed.

## Lead Flow

- [ ] Open `/diagnostico`.
- [ ] Submit one test lead.
- [ ] Confirm lead score is calculated.
- [ ] Confirm source page/viewed case context is stored when applicable.
- [ ] Confirm lead appears in `/admin/leads`.

## Go / No-Go

- [ ] Pilot import completed without duplicate drafts.
- [ ] Evidence can be attached manually.
- [ ] Review queue identifies incomplete/weak cases.
- [ ] 2 published cases look safe and professional.
- [ ] Diagnostic lead flow works.
- [ ] Team agrees to import the full 50+ case batch.
