-- Site settings for home warning modal and contact info
-- Run this in Supabase SQL editor (Project -> SQL -> New query)

create table if not exists public.site_settings (
  id text primary key default 'default',
  warning_enabled boolean not null default false,
  warning_title text,
  warning_body text,
  warning_type text not null default 'text' check (warning_type in ('text','video')),
  video_url text,
  phone text,
  email text,
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.site_settings enable row level security;

-- Allow anyone to read settings (so the homepage can render the warning)
drop policy if exists site_settings_select_anon on public.site_settings;
create policy site_settings_select_anon on public.site_settings
for select
to public
using (true);

-- Allow authenticated users to insert/update (admin UI)
drop policy if exists site_settings_write_auth on public.site_settings;
create policy site_settings_write_auth on public.site_settings
for all
to authenticated
using (true)
with check (true);

-- Ensure default row exists
insert into public.site_settings (id, warning_enabled, warning_title, warning_body, warning_type, phone, email)
values (
  'default',
  false,
  'Atenção!',
  'Exemplo de aviso ao usuário. Personalize este texto no painel do administrador.',
  'text',
  '(73) 99934-8552',
  'contato@nevesecosta.com.br'
)
on conflict (id) do nothing;
