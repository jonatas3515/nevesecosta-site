-- Reviews table for public testimonials
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  comment_date date not null,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;
create policy reviews_read for select on public.reviews to anon using (true);
-- Writes will be done via service role from server routes
