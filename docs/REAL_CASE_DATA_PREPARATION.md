# Real Case Data Preparation

Use `sample-data/nano-gro-final-case-template.csv` as the final import template for the first real 50+ Nano-Gro cases.

## Required Fields

Minimum required to create a draft case:

- `title` or `public_id`
- `crop`
- `country`
- `problem` or `result_summary`

Imported cases always start as `draft`. They must be reviewed before publication.

## Optional Fields

Useful optional fields:

- `summary`
- `region`
- `evidence_level`
- `application_method`
- `nano_gro_application`
- `dosage`
- `application_frequency`
- `farm_size`
- `farm_size_unit`
- `yield_increase_percent`
- `quality_improvement_percent`
- `disease_reduction_percent`
- `roi_value`
- `roi_notes`
- `verification_status`
- `evidence_reference`
- `source_folder`
- `has_photos`
- `has_video`
- `has_pdf`
- `testimonial`
- `technical_validation`
- `lab_report`
- `internal_notes`

Unsupported-but-preserved fields:

- `treatment_area`
- `baseline_yield`
- `final_yield`

These are stored in the raw import row for manual review, but the current `cases` table does not have dedicated columns for them.

## Evidence Folder Naming

Use one folder per case. Match the folder name to `source_folder`.

Recommended format:

```text
pilot-crop-country-publicid
cacao-panama-ng-001
banana-colombia-ng-002
```

Inside each folder, use simple names:

```text
before-01.jpg
after-01.jpg
field-video-01.mp4
lab-report.pdf
technical-notes.pdf
```

Do not rename evidence in a way that claims more than the file proves.

## Missing Fields

Leave unknown values blank. Do not write `0` unless the value is truly zero.

Use `internal_notes` for context such as:

```text
Confirm dosage with agronomist.
Final yield not yet reported.
Photos received but not approved for publication.
```

## Avoid Fake Precision

Do not calculate or invent:

- yield increase
- ROI
- treatment area
- baseline yield
- final yield
- disease reduction
- quality improvement

If the case only has visual evidence, write:

```text
Visual improvement documented after treatment window.
```

If ROI cannot be calculated, write:

```text
ROI not calculated due to incomplete baseline data.
```

## Evidence Levels

Use conservative evidence levels:

- `A`: measured baseline and final result, photos, supporting document or technical validation
- `B`: partial measurements plus photos or testimonial
- `C`: qualitative field observation with limited evidence
- `D`: testimonial-only or anecdotal case

When unsure, choose the lower level.

## Incomplete But Useful Cases

Incomplete cases are allowed when they have enough context to become a draft:

- known crop
- known country
- known problem or result summary
- some evidence reference or internal note

They should remain draft until reviewed.

## Good Row Examples

Complete measured case:

```csv
NG-REAL-001,Cacao Panama production increase,Measured cacao case,Cacao,Panama,Bocas del Toro,Low production,Production increased after Nano-Gro foliar program,A,Foliar,Nano-Gro foliar program,1 ml/L,3 applications,120,ha,120 ha,840 kg/ha,1067 kg/ha,27,,,5.3,Calculated from reported yield and treatment cost,agronomist_review,en,true,Cacao Panama Nano-Gro case,Measured production case,folder:cacao-panama-ng-real-001,cacao-panama-ng-real-001,true,true,true,Producer reported stronger pod set,true,lab-report.pdf,
```

Incomplete but useful case:

```csv
NG-REAL-002,Rice Peru root observation,Visual rice root observation,Rice,Peru,Piura,Weak rooting,Visual root development improvement documented,C,Foliar,Nano-Gro protocol pending confirmation,,,30,ha,30 ha,,,,,,ROI not calculated due to incomplete baseline data,unverified,en,false,Rice Peru Nano-Gro observation,Incomplete case requiring review,folder:rice-peru-ng-real-002,rice-peru-ng-real-002,true,false,false,,false,,Confirm dosage and yield data.
```

## Rows That Should Be Rejected Or Reviewed

Reject before import:

- missing `crop`
- missing `country`
- missing both `title` and `public_id`
- missing both `problem` and `result_summary`
- invalid `evidence_level`
- non-numeric percentage or ROI fields

Send to review:

- missing dosage
- missing application frequency
- missing evidence files
- testimonial-only cases
- qualitative result without measured yield
- ROI claimed without baseline/final yield support

## Current Import Compatibility

Recognized directly or by alias:

- `problem` maps to `primary_problem`
- `result_summary` maps to `results_summary`
- `farm_size` maps to `farm_size_value`
- `source_folder` also fills `evidence_folder_name`
- `testimonial` marks `has_testimonial`

Safely preserved as raw import data but not mapped into case columns yet:

- `treatment_area`
- `baseline_yield`
- `final_yield`

These should be reviewed manually in `/admin/import` and transferred into structured fields later only if the schema is expanded.
