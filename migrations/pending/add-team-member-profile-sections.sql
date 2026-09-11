-- =====================================================
-- SCRIPT: Adicionar seções de perfil à tabela team_members
-- Aplicar no SQL Editor do Supabase quando aprovado
-- =====================================================

ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS academic_education TEXT,
  ADD COLUMN IF NOT EXISTS complementary_training TEXT,
  ADD COLUMN IF NOT EXISTS professional_experience TEXT;
