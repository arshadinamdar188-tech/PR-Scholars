-- Student registration flow tables
create table if not exists public.registration_requests (
  id uuid primary key default gen_random_uuid(),
  institute text not null default 'padma',
  first_name text not null,
  last_name text,
  email text not null,
  mobile text not null,
  username text not null unique,
  setup_token text not null unique,
  status text not null default 'pending' check (status in ('pending', 'completed', 'expired')),
  expires_at timestamptz not null default (now() + interval '2 days'),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_accounts (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  institute text not null default 'padma',
  username text not null unique check (username ~ '^[A-Za-z0-9]{8}$'),
  first_name text not null,
  last_name text,
  email text not null,
  mobile text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_student_accounts_email_lower
  on public.student_accounts (lower(email));

create unique index if not exists idx_student_accounts_mobile_unique
  on public.student_accounts (mobile);

create index if not exists idx_registration_requests_lookup
  on public.registration_requests (status, expires_at, institute);

create index if not exists idx_registration_requests_email_lower
  on public.registration_requests (lower(email));

create index if not exists idx_registration_requests_mobile
  on public.registration_requests (mobile);

alter table public.registration_requests enable row level security;
alter table public.student_accounts enable row level security;

-- No direct client access. These tables are managed via edge functions/service role.
create policy "No direct select on registration requests"
  on public.registration_requests for select
  using (false);

create policy "No direct insert on registration requests"
  on public.registration_requests for insert
  with check (false);

create policy "No direct update on registration requests"
  on public.registration_requests for update
  using (false)
  with check (false);

create policy "No direct select on student accounts"
  on public.student_accounts for select
  using (false);

create policy "No direct insert on student accounts"
  on public.student_accounts for insert
  with check (false);

create policy "No direct update on student accounts"
  on public.student_accounts for update
  using (false)
  with check (false);
