create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email text not null,
  full_name text not null,
  mobile text not null,
  institute text,
  status text not null default 'pending_verification' check (status in ('pending_verification', 'active', 'disabled')),
  verification_method text check (verification_method in ('otp', 'link')),
  metadata_json jsonb not null default '{}'::jsonb,
  verified_at timestamptz,
  password_set_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop index if exists public.student_profiles_email_lower_uq;
alter table public.student_profiles
drop constraint if exists student_profiles_email_uq;
alter table public.student_profiles
add constraint student_profiles_email_uq unique (email);

alter table public.student_profiles enable row level security;

-- No public read access to profile data.

drop policy if exists "Anon can create pending student profile" on public.student_profiles;
create policy "Anon can create pending student profile"
on public.student_profiles
for insert
to anon
with check (true);

drop policy if exists "Student can read own profile" on public.student_profiles;
create policy "Student can read own profile"
on public.student_profiles
for select
to authenticated
using (auth_user_id = auth.uid());

drop policy if exists "Student can update own profile" on public.student_profiles;
create policy "Student can update own profile"
on public.student_profiles
for update
to authenticated
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

drop trigger if exists update_student_profiles_updated_at on public.student_profiles;
create trigger update_student_profiles_updated_at
before update on public.student_profiles
for each row
execute function public.update_updated_at_column();
