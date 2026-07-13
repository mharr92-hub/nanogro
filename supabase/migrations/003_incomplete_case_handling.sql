alter table cases
  add column if not exists data_status text not null default 'incomplete',
  add column if not exists missing_fields text[] not null default '{}',
  add column if not exists estimated_fields text[] not null default '{}',
  add column if not exists inferred_fields text[] not null default '{}',
  add column if not exists pending_confirmation_fields text[] not null default '{}',
  add column if not exists technical_questions text[] not null default '{}',
  add column if not exists internal_notes text,
  add column if not exists public_data_disclaimer text,
  add column if not exists field_status jsonb not null default '{}'::jsonb;

create index if not exists cases_data_status_idx on cases(data_status);
create index if not exists cases_pending_confirmation_idx on cases using gin(pending_confirmation_fields);
create index if not exists cases_missing_fields_idx on cases using gin(missing_fields);

insert into problems (name, slug, category, description)
values (
  'Pending problem classification',
  'pending-problem-classification',
  'pending_review',
  'Temporary classification used when a case has results but the main problem needs technical confirmation.'
)
on conflict do nothing;
