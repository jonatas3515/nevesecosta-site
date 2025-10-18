-- Migration to add style fields for the home warning configuration
-- Run after the base table exists

alter table public.site_settings
  add column if not exists title_align text check (title_align in ('left','center','right')) default 'left',
  add column if not exists title_size text check (title_size in ('sm','md','lg','xl','2xl','3xl')) default 'xl',
  add column if not exists title_color text default '#111827',
  add column if not exists body_align text check (body_align in ('left','center','right','justify')) default 'left';

-- Seed defaults on the default row
update public.site_settings
set title_align = coalesce(title_align, 'left'),
    title_size = coalesce(title_size, 'xl'),
    title_color = coalesce(title_color, '#111827'),
    body_align = coalesce(body_align, 'left')
where id = 'default';
