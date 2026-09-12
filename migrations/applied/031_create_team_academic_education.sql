-- Migration 031: Tabela de Formação Acadêmica
CREATE TABLE IF NOT EXISTS public.team_academic_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  period TEXT NOT NULL,
  institution TEXT NOT NULL,
  thesis_title TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_academic_education_member ON public.team_academic_education(member_id);
CREATE INDEX IF NOT EXISTS idx_team_academic_education_sort ON public.team_academic_education(member_id, sort_order);

ALTER TABLE public.team_academic_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_academic_education public read"
  ON public.team_academic_education
  FOR SELECT
  USING (true);

CREATE POLICY "team_academic_education auth insert"
  ON public.team_academic_education
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "team_academic_education auth update"
  ON public.team_academic_education
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "team_academic_education auth delete"
  ON public.team_academic_education
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
