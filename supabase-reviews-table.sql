-- Reviews table for public testimonials
create extension if not exists pgcrypto;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  comment_date date not null,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;
-- Allow read for anyone (including anon)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'reviews' and policyname = 'reviews_read'
  ) then
    create policy reviews_read on public.reviews for select using (true);
  end if;
end$$;
-- Writes will be performed via service role from server routes
