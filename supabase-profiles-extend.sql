-- Extend profiles with optional identity fields for admin login resolution
alter table if exists public.profiles add column if not exists username text;
alter table if exists public.profiles add column if not exists phone text;
alter table if exists public.profiles add column if not exists cpf text;
-- Optional unique constraints (soft): create unique indexes that ignore nulls
create unique index if not exists profiles_username_unique on public.profiles (username) where username is not null;
create unique index if not exists profiles_cpf_unique on public.profiles (cpf) where cpf is not null;
