create table if not exists public.padma_teachers (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  display_name text not null,
  password text not null,
  is_active boolean not null default true,
  zoom_personal_meeting_id text,
  zoom_join_url text,
  zoom_passcode text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.padma_teachers enable row level security;

-- Current Padma teacher portal uses session-storage login and no Supabase auth token,
-- so select policy remains open to keep existing flow stable.
drop policy if exists "Anyone can read padma teachers" on public.padma_teachers;
create policy "Anyone can read padma teachers"
on public.padma_teachers
for select
using (true);

drop policy if exists "Anyone can insert padma teachers" on public.padma_teachers;
create policy "Anyone can insert padma teachers"
on public.padma_teachers
for insert
with check (true);

drop policy if exists "Anyone can update padma teachers" on public.padma_teachers;
create policy "Anyone can update padma teachers"
on public.padma_teachers
for update
using (true)
with check (true);

drop trigger if exists update_padma_teachers_updated_at on public.padma_teachers;
create trigger update_padma_teachers_updated_at
before update on public.padma_teachers
for each row
execute function public.update_updated_at_column();

insert into public.padma_teachers (
  username,
  display_name,
  password,
  is_active,
  zoom_personal_meeting_id,
  zoom_join_url,
  zoom_passcode,
  metadata_json
)
values (
  'Teacher',
  'Teacher',
  'password1',
  true,
  '3693945085',
  'https://us04web.zoom.us/j/3693945085?pwd=HgWaomMcXRE29FnpctaPMmiHXbwAa8.1',
  'HgWaomMcXRE29FnpctaPMmiHXbwAa8.1',
  jsonb_build_object('seeded_by', 'migration_20260421103000')
)
on conflict (username) do update
set
  display_name = excluded.display_name,
  is_active = excluded.is_active,
  zoom_personal_meeting_id = excluded.zoom_personal_meeting_id,
  zoom_join_url = excluded.zoom_join_url,
  zoom_passcode = excluded.zoom_passcode,
  updated_at = now();
