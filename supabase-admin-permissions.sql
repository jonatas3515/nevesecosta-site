-- Admin permissions for fine-grained access control
create table if not exists public.admin_permissions (
  user_id uuid primary key,
  is_admin boolean not null default false,
  can_posts boolean not null default false,
  can_categories boolean not null default false,
  can_reviews boolean not null default false,
  can_orders boolean not null default false,
  can_products boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.admin_permissions enable row level security;
-- Read allowed to authenticated; writes via service role API
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='admin_permissions' and policyname='admin_permissions_read'
  ) then
    create policy admin_permissions_read on public.admin_permissions for select using (auth.role() = 'authenticated');
  end if;
end$$;
