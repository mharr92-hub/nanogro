# Nano-Gro Publication Readiness Report

Date: 2026-06-14

Scope: 26 real imported case records from `lib/real-source-data.ts`. Demo starter cases in `lib/mock-data.ts` are not included.

This report is advisory only. It does not change publication status, UI, routing, schema, or business logic.

## Scoring Method

Publication score is a practical editorial readiness score calculated from the existing case data:

`publication_score = round(completeness * 0.40 + evidence_score * 0.35 + confidence_score * 0.25)`

Evidence score and confidence score use the current imported case values:

- Evidence A: 85
- Evidence B: 68
- Evidence C: 48
- Evidence D: 30
- Confidence: current imported confidence calculation, reduced when source extraction/conversion is pending

## Tier Rules

- Tier A: Original report, strong evidence, clear results, commercially publishable with normal disclaimer.
- Tier B: Good evidence, but missing some technical details. Publishable after technical/editorial review.
- Tier C: Weak or brief evidence, missing important data. Keep in draft until strengthened.
- Tier D: Insufficient structured evidence or source conversion pending. Do not publish.

## Executive Summary

| Action | Count | Meaning |
|---|---:|---|
| Ready To Publish | 4 | Strong original evidence and clear results |
| Needs Review | 6 | Good candidates after technical/editorial review |
| Needs Evidence | 8 | Keep in draft until more evidence or details are added |
| Do Not Publish | 8 | Insufficient structured evidence for public publication |

## Ready To Publish

| Case | Tier | Publication | Evidence | Confidence | Missing Information | Recommended Action |
|---|---|---:|---:|---:|---|---|
| real-003 - Common bean in El Salvador with 35.1% higher yield | A | 89 | 85 | 88 | Treatment dates, harvest dates, farm size confirmation, photo attachment if available | Publish with standard technical disclaimer and original report download |
| real-014 - Tobacco treated plants with 100% yield increase | A | 88 | 85 | 87 | Treatment dates, harvest dates, farm size, final technical signoff | Publish with standard technical disclaimer |
| real-016 - Tomato transplant recovery from Rhizoctonia | A | 87 | 85 | 86 | Farm size, treatment dates, harvest dates, ROI not calculated | Publish with standard technical disclaimer |
| real-011 - Papaya transplant survival and vigor | A | 86 | 85 | 84 | Farm size, dates, ROI not calculated, final source review | Publish with standard technical disclaimer |

## Needs Review

| Case | Tier | Publication | Evidence | Confidence | Missing Information | Recommended Action |
|---|---|---:|---:|---:|---|---|
| real-007 - Corn trials with ALBA Alimentos | B | 85 | 85 | 82 | Yield percentage, ROI, treatment dates, farm size, photo evidence attachment | Review tables and measurements, then publish if quantified result is confirmed |
| real-001 - Sugarcane in El Salvador under severe drought | B | 80 | 85 | 70 | Archive unpacking, quantified yield, ROI, farm size, dates, photos | Review attached archive and confirm result strength before publishing |
| real-004 - Banana in Guatemala biometric evaluation | B | 74 | 68 | 74 | Yield/ROI not calculated, dates, farm size, commercial result summary | Technical review of biometric measurements before publishing |
| real-002 - Pepper in El Salvador with harvest 25 days earlier | B | 71 | 68 | 70 | Dosage, farm size, yield/ROI calculation, photos, dates | Review protocol and confirm whether early harvest claim is publishable |
| real-012 - Guava recovery under nematode pressure | B | 70 | 68 | 69 | Quantified yield/ROI, dates, farm size, photo extraction/attachment | Attach field photos from original report and publish after review |
| real-015 - Corn testimonial in China | B | 69 | 68 | 62 | Legacy document conversion, dosage, dates, ROI, testimonial consent/status | Convert supporting file and verify testimonial permission before publishing |

## Needs Evidence

| Case | Tier | Publication | Evidence | Confidence | Missing Information | Recommended Action |
|---|---|---:|---:|---:|---|---|
| real-005 - Common bean germination protocol in El Salvador | C | 67 | 68 | 64 | Quantified outcome, dosage confirmation, photos, dates, ROI not applicable/unclear | Keep draft; add outcome evidence or convert to protocol/technical note |
| real-006 - Loroco production protocol in El Salvador | C | 66 | 68 | 62 | Quantified production result, dosage, farm size, dates, photos | Keep draft until agronomic normalization is complete |
| real-008 - Foliar maize application in El Salvador | C | 66 | 68 | 63 | Quantified result, dosage, dates, farm size, photo extraction/attachment | Keep draft; attach field images and confirm measurable result |
| real-009 - Maize seed treatment in El Salvador | C | 66 | 68 | 63 | Quantified establishment result, dosage, dates, farm size, photos | Keep draft; add measured germination or establishment data |
| real-013 - Cabbage seed protocol in El Salvador | C | 64 | 68 | 59 | Quantified result, dosage, dates, farm size, photos | Keep draft; use as protocol support unless results are verified |
| real-010 - M. Hernandez maize observation | C | 52 | 48 | 51 | Brief evidence, missing quantified result, dosage, dates, photos/tables | Keep draft; request stronger documentation before publication |
| real-018 - Bean nutrition and value report from ENA El Salvador | C | 36 | 30 | 32 | PDF conversion, quantified fields, dosage, dates, evidence review | Keep draft; strong institutional source candidate, but needs extraction/review |
| real-019 - Ixil Guatemala Nano-Gro presentation | C | 35 | 30 | 30 | PDF conversion, crop split, quantified fields, dosage, dates, photos | Keep draft; extract presentation and split into specific cases if evidence supports it |

## Do Not Publish

| Case | Tier | Publication | Evidence | Confidence | Missing Information | Recommended Action |
|---|---|---:|---:|---:|---|---|
| real-020 - Mexico final Nano-Gro report | D | 34 | 30 | 30 | PDF conversion, crop, protocol, quantified results, dates | Do not publish until extracted and converted into specific cases |
| real-021 - Nigeria pepper results 2009 | D | 33 | 30 | 30 | Legacy document conversion, protocol, quantified result verification, dates | Do not publish until conversion and technical review are complete |
| real-017 - Ecuador results report | D | 32 | 30 | 30 | PDF conversion, crop, protocol, quantified result, dates | Do not publish; extract source first |
| real-022 - Poland tomato results | D | 32 | 30 | 30 | PDF conversion, protocol, quantified fields, dates | Do not publish until source is extracted and verified |
| real-024 - Cuba results image report | D | 32 | 30 | 30 | Image review, crop split, protocol, quantified metrics, dates | Do not publish until image packet is reviewed and structured |
| real-025 - Vegetable protocol source | D | 32 | 30 | 30 | Legacy document conversion, crop-specific cases, results, dates | Do not publish; use only as internal source material |
| real-023 - Jamaican treated plants | D | 31 | 30 | 30 | Legacy document conversion, crop split, quantified metrics, dates | Do not publish until structured evidence is available |
| real-026 - Hybrid evaluation protocol with and without Nano-Gro | D | 31 | 30 | 30 | Protocol only, no case result, no outcome evidence | Do not publish as a case; keep as technical protocol material |

## Publication Safety Notes

- Cases with estimated or inferred data must keep the public disclaimer visible.
- Estimated or inferred fields must remain tracked internally in `estimated_fields`, `inferred_fields`, and `field_status`.
- Cases without credible evidence assets, original reports, approved testimonials, or technical validation should not be published.
- ROI should not be calculated unless baseline yield, final yield, price, and treatment cost are available.
- Yield increase should not be invented when baseline and final yield are missing.
- Raw source names and informal evidence labels should remain admin/internal only.

## Recommended Next Steps

1. Publish the four Tier A cases after final editorial review.
2. Prioritize Tier B extraction/review for ALBA maize, sugarcane, banana, pepper, guava, and China corn.
3. Keep Tier C cases, including the ENA bean report, in draft until photos, quantified outcomes, or stronger technical details are attached.
4. Keep Tier D cases unpublished until source conversion or case splitting creates credible structured reports.
