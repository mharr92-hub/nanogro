alter table leads
  add column if not exists country_text text,
  add column if not exists crop_text text,
  add column if not exists area_text text,
  add column if not exists problem_text text,
  add column if not exists comments text,
  add column if not exists whatsapp_message text;

create index if not exists leads_problem_text_idx on leads (problem_text);
