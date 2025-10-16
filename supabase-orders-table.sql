-- Tabela para armazenar pedidos de PDF
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  email text,
  status text not null default 'pending', -- pending | paid | canceled
  amount integer not null default 7500,
  payment_method text, -- card | pix
  calc_data jsonb not null,
  pdf_generated boolean default false,
  created_at timestamp with time zone default now(),
  paid_at timestamp with time zone
);

-- Index para buscar por session_id rapidamente
create index if not exists idx_orders_session_id on public.orders(session_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- RLS: apenas admins podem ver/gerenciar
alter table public.orders enable row level security;

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders"
on public.orders
for all
to authenticated
using (
  exists (
    select 1 from public.profiles p 
    where p.id = auth.uid() 
    and p.role in ('admin','editor')
  )
)
with check (
  exists (
    select 1 from public.profiles p 
    where p.id = auth.uid() 
    and p.role in ('admin','editor')
  )
);
