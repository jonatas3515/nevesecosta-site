-- Add PDF columns and helpful indexes
alter table public.orders
  add column if not exists pdf_path text,
  add column if not exists pdf_expires_at timestamp with time zone;

create index if not exists idx_orders_pdf_expires_at on public.orders(pdf_expires_at);
