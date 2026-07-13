alter table cases
  add column if not exists import_batch_id uuid references import_batches(id),
  add column if not exists import_row_id uuid references import_rows(id),
  add column if not exists evidence_reference text,
  add column if not exists source_folder text;

create unique index if not exists cases_import_row_unique_idx on cases(import_row_id) where import_row_id is not null;
create index if not exists cases_import_batch_idx on cases(import_batch_id);

alter table import_batches
  add column if not exists imported_rows integer default 0,
  add column if not exists skipped_rows integer default 0;

alter table import_rows
  drop constraint if exists import_rows_status_check;

alter table import_rows
  add constraint import_rows_status_check
  check (status in ('pending', 'valid', 'invalid', 'imported', 'skipped'));
