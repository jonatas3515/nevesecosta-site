-- Products table for Stripe-managed items
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

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- Minimal RLS: read for anon, write via service role only
alter table public.products enable row level security;
create policy products_read for select on public.products to anon using (true);
-- For writes, rely on service_role key from server routes (no explicit policy needed for service role)
