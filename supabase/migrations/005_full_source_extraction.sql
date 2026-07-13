alter table cases
  add column if not exists source_full_text text,
  add column if not exists source_extraction jsonb not null default '{}'::jsonb,
  add column if not exists extracted_variety text,
  add column if not exists extracted_location text,
  add column if not exists extracted_dates text[] not null default '{}',
  add column if not exists extracted_observations text[] not null default '{}',
  add column if not exists extracted_recommendations text[] not null default '{}',
  add column if not exists extracted_results text[] not null default '{}',
  add column if not exists extracted_metrics jsonb not null default '{}'::jsonb,
  add column if not exists technical_summary text,
  add column if not exists executive_narrative text;

alter table evidence_assets
  add column if not exists source_document_id uuid,
  add column if not exists extracted_from_source boolean not null default false,
  add column if not exists visual_description text,
  add column if not exists visual_findings text[] not null default '{}',
  add column if not exists observable_evidence text,
  add column if not exists vision_model text,
  add column if not exists vision_confidence numeric check (vision_confidence is null or (vision_confidence >= 0 and vision_confidence <= 1));

create index if not exists cases_source_extraction_idx on cases using gin(source_extraction);
create index if not exists cases_extracted_dates_idx on cases using gin(extracted_dates);
create index if not exists cases_extracted_metrics_idx on cases using gin(extracted_metrics);
create index if not exists evidence_assets_visual_findings_idx on evidence_assets using gin(visual_findings);
