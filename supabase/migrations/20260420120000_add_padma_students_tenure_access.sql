-- ============================================================
-- Padma Students with Tenure-Based Access Control
-- Run in Supabase SQL Editor for project ujmgtefbhzlftavujqyy
-- ============================================================

-- Create the padma_students table
create table if not exists public.padma_students (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  access_code      text not null,          -- plain-text password set by admin
  grade            text,                   -- e.g. "Class 9", "Class 10"
  board            text,                   -- e.g. "CBSE", "ICSE"
  access_start_date date not null,         -- first day access is valid
  access_end_date   date not null,         -- last day access is valid (tenure)
  is_active        boolean not null default true,
  notes            text,                   -- optional admin notes
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_padma_students_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_padma_students_updated_at on public.padma_students;
create trigger trg_padma_students_updated_at
  before update on public.padma_students
  for each row execute function public.set_padma_students_updated_at();

-- Enable RLS (app uses sessionStorage auth, not Supabase auth, so we allow all)
alter table public.padma_students enable row level security;

drop policy if exists "Allow all padma_students operations" on public.padma_students;
create policy "Allow all padma_students operations"
  on public.padma_students for all
  using (true)
  with check (true);

-- Optional: seed one demo student so the system is immediately testable
-- Admin can delete/modify this via the admin portal
insert into public.padma_students (name, access_code, grade, board, access_start_date, access_end_date, is_active, notes)
values (
  'DemoStudent',
  'demo123',
  'Class 10',
  'CBSE',
  current_date,
  current_date + interval '90 days',
  true,
  'Demo student created at setup. Admin can remove this.'
)
on conflict do nothing;
