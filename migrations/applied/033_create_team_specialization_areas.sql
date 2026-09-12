-- Migration 033: Tabela de Áreas de Especialização
CREATE TABLE IF NOT EXISTS public.team_specialization_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  area_title TEXT NOT NULL,
  topics_list TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_specialization_areas_member ON public.team_specialization_areas(member_id);
CREATE INDEX IF NOT EXISTS idx_team_specialization_areas_sort ON public.team_specialization_areas(member_id, sort_order);

ALTER TABLE public.team_specialization_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_specialization_areas public read"
  ON public.team_specialization_areas
  FOR SELECT
  USING (true);

CREATE POLICY "team_specialization_areas auth insert"
  ON public.team_specialization_areas
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "team_specialization_areas auth update"
  ON public.team_specialization_areas
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "team_specialization_areas auth delete"
  ON public.team_specialization_areas
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
