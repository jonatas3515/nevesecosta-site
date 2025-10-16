-- Products table for Stripe-managed items
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_cents integer not null,
  promo_price_cents integer,
  image_url text,
  active boolean not null default true,
  stripe_product_id text,
  stripe_price_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'products_set_updated_at'
  ) then
    create trigger products_set_updated_at
    before update on public.products
    for each row execute function public.set_updated_at();
  end if;
end$$;

-- Minimal RLS: read for anon, write via service role only
alter table public.products enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'products' and policyname = 'products_read'
  ) then
    create policy products_read on public.products for select using (true);
  end if;
end$$;
-- For writes, rely on service_role key from server routes (no explicit policy needed for service role)
