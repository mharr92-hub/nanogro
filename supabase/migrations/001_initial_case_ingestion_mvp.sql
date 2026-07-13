create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table crops (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  category text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table countries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  iso_code text,
  dominant_climate text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table regions (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references countries(id) on delete cascade,
  name text not null,
  slug text not null,
  climate text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(country_id, slug)
);

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

create table application_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cases (
  id uuid primary key default gen_random_uuid(),
  public_id text unique not null,
  slug text unique not null,
  slug_locked boolean not null default false,
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

create table case_secondary_problems (
  case_id uuid not null references cases(id) on delete cascade,
  problem_id uuid not null references problems(id),
  primary key (case_id, problem_id)
);

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

create table import_batches (
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

create table import_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references import_batches(id) on delete cascade,
  row_number integer not null,
  raw_data jsonb not null,
  validation_errors jsonb,
  imported_case_id uuid references cases(id),
  status text not null default 'pending'
    check (status in ('pending', 'valid', 'invalid', 'imported')),
  created_at timestamptz not null default now()
);

create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  case_id uuid references cases(id),
  lead_id uuid references leads(id),
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index cases_publication_status_idx on cases(publication_status);
create index cases_slug_idx on cases(slug);
create index cases_crop_idx on cases(crop_id);
create index cases_country_idx on cases(country_id);
create index cases_primary_problem_idx on cases(primary_problem_id);
create index cases_evidence_level_idx on cases(evidence_level);
create index cases_completeness_idx on cases(case_completeness_score);
create index cases_yield_increase_idx on cases(yield_increase_percent);
create index cases_roi_idx on cases(roi_value);
create index evidence_assets_case_idx on evidence_assets(case_id);
create index leads_viewed_case_idx on leads(viewed_case_id);
create index leads_created_at_idx on leads(created_at);

create trigger crops_updated_at before update on crops for each row execute function set_updated_at();
create trigger countries_updated_at before update on countries for each row execute function set_updated_at();
create trigger regions_updated_at before update on regions for each row execute function set_updated_at();
create trigger problems_updated_at before update on problems for each row execute function set_updated_at();
create trigger application_methods_updated_at before update on application_methods for each row execute function set_updated_at();
create trigger cases_updated_at before update on cases for each row execute function set_updated_at();
create trigger evidence_assets_updated_at before update on evidence_assets for each row execute function set_updated_at();
create trigger leads_updated_at before update on leads for each row execute function set_updated_at();

create or replace function prevent_published_slug_change()
returns trigger as $$
begin
  if old.slug_locked = true and new.slug <> old.slug then
    raise exception 'Published case slugs are permanent. Create a redirect instead.';
  end if;
  if new.publication_status = 'published' then
    new.slug_locked = true;
    if new.published_at is null then
      new.published_at = now();
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger cases_slug_lock before update on cases for each row execute function prevent_published_slug_change();

insert into crops (name, slug, category) values
  ('Cacao', 'cacao', 'plantation'),
  ('Banana', 'banana', 'fruit'),
  ('Coffee', 'coffee', 'plantation'),
  ('Maize', 'maize', 'row_crop'),
  ('Rice', 'rice', 'row_crop'),
  ('Tomato', 'tomato', 'horticulture'),
  ('Melon', 'melon', 'fruit'),
  ('Watermelon', 'watermelon', 'fruit')
on conflict do nothing;

insert into countries (name, slug, iso_code, dominant_climate) values
  ('Panama', 'panama', 'PA', 'tropical'),
  ('Colombia', 'colombia', 'CO', 'tropical'),
  ('Peru', 'peru', 'PE', 'mixed'),
  ('Ecuador', 'ecuador', 'EC', 'tropical'),
  ('Mexico', 'mexico', 'MX', 'mixed'),
  ('Brazil', 'brazil', 'BR', 'mixed')
on conflict do nothing;

insert into problems (name, slug, category) values
  ('Low production', 'low-production', 'yield'),
  ('Water stress', 'water-stress', 'stress'),
  ('Poor flowering', 'poor-flowering', 'flowering'),
  ('Weak rooting', 'weak-rooting', 'roots'),
  ('Post-transplant recovery', 'post-transplant-recovery', 'recovery'),
  ('Small fruit', 'small-fruit', 'quality'),
  ('Low quality', 'low-quality', 'quality'),
  ('Climate stress', 'climate-stress', 'stress'),
  ('Disease pressure', 'disease-pressure', 'disease'),
  ('Poor germination', 'poor-germination', 'germination')
on conflict do nothing;

insert into application_methods (name, slug) values
  ('Foliar', 'foliar'),
  ('Seed treatment', 'seed-treatment'),
  ('Fertigation', 'fertigation'),
  ('Drench', 'drench'),
  ('Transplant', 'transplant')
on conflict do nothing;

alter table crops enable row level security;
alter table countries enable row level security;
alter table regions enable row level security;
alter table problems enable row level security;
alter table application_methods enable row level security;
alter table cases enable row level security;
alter table case_secondary_problems enable row level security;
alter table evidence_assets enable row level security;
alter table leads enable row level security;
alter table import_batches enable row level security;
alter table import_rows enable row level security;
alter table analytics_events enable row level security;

create policy "public read crops" on crops for select using (true);
create policy "public read countries" on countries for select using (true);
create policy "public read regions" on regions for select using (true);
create policy "public read problems" on problems for select using (true);
create policy "public read application methods" on application_methods for select using (true);
create policy "public read published cases" on cases for select using (publication_status = 'published');
create policy "public read approved evidence for published cases" on evidence_assets
  for select using (
    verification_status = 'approved'
    and consent_status = 'approved'
    and exists (
      select 1 from cases
      where cases.id = evidence_assets.case_id
        and cases.publication_status = 'published'
    )
  );
create policy "public insert leads" on leads for insert with check (consent = true);
create policy "public insert analytics" on analytics_events for insert with check (true);

create policy "service role all crops" on crops for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role all countries" on countries for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role all regions" on regions for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role all problems" on problems for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role all application methods" on application_methods for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role all cases" on cases for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role all secondary problems" on case_secondary_problems for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role all evidence" on evidence_assets for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role all leads" on leads for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role all import batches" on import_batches for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role all import rows" on import_rows for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role all analytics" on analytics_events for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', false)
on conflict (id) do nothing;
