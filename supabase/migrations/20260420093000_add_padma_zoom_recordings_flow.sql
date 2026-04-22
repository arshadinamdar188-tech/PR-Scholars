-- Create private storage bucket for Padma Zoom recordings
insert into storage.buckets (id, name, public)
values ('padma-recorded-videos', 'padma-recorded-videos', false)
on conflict (id) do nothing;

-- Create metadata table for uploaded Zoom recordings
create table if not exists public.padma_zoom_recordings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  subject text not null,
  uploaded_by text not null,
  upload_date timestamptz not null default now(),
  storage_path text not null,
  duration text not null,
  thumbnail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.padma_zoom_recordings enable row level security;

-- Public app currently uses session storage login (no Supabase auth in Padma portal),
-- so policies are intentionally open for now.
drop policy if exists "Anyone can view padma zoom recordings" on public.padma_zoom_recordings;
create policy "Anyone can view padma zoom recordings"
on public.padma_zoom_recordings
for select
using (true);

drop policy if exists "Anyone can insert padma zoom recordings" on public.padma_zoom_recordings;
create policy "Anyone can insert padma zoom recordings"
on public.padma_zoom_recordings
for insert
with check (true);

drop policy if exists "Anyone can update padma zoom recordings" on public.padma_zoom_recordings;
create policy "Anyone can update padma zoom recordings"
on public.padma_zoom_recordings
for update
using (true)
with check (true);

drop policy if exists "Anyone can delete padma zoom recordings" on public.padma_zoom_recordings;
create policy "Anyone can delete padma zoom recordings"
on public.padma_zoom_recordings
for delete
using (true);

drop trigger if exists update_padma_zoom_recordings_updated_at on public.padma_zoom_recordings;
create trigger update_padma_zoom_recordings_updated_at
before update on public.padma_zoom_recordings
for each row
execute function public.update_updated_at_column();

-- Storage policies for private video bucket access.
drop policy if exists "Anyone can view padma recorded video objects" on storage.objects;
create policy "Anyone can view padma recorded video objects"
on storage.objects
for select
using (bucket_id = 'padma-recorded-videos');

drop policy if exists "Anyone can upload padma recorded video objects" on storage.objects;
create policy "Anyone can upload padma recorded video objects"
on storage.objects
for insert
with check (bucket_id = 'padma-recorded-videos');

drop policy if exists "Anyone can update padma recorded video objects" on storage.objects;
create policy "Anyone can update padma recorded video objects"
on storage.objects
for update
using (bucket_id = 'padma-recorded-videos');

drop policy if exists "Anyone can delete padma recorded video objects" on storage.objects;
create policy "Anyone can delete padma recorded video objects"
on storage.objects
for delete
using (bucket_id = 'padma-recorded-videos');
