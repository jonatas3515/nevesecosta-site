-- Migration 032: Tabela de Experiência Profissional
CREATE TABLE IF NOT EXISTS public.team_professional_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  role_title TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_professional_experience_member ON public.team_professional_experience(member_id);
CREATE INDEX IF NOT EXISTS idx_team_professional_experience_sort ON public.team_professional_experience(member_id, sort_order);

ALTER TABLE public.team_professional_experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_professional_experience public read"
  ON public.team_professional_experience
  FOR SELECT
  USING (true);

CREATE POLICY "team_professional_experience auth insert"
  ON public.team_professional_experience
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "team_professional_experience auth update"
  ON public.team_professional_experience
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "team_professional_experience auth delete"
  ON public.team_professional_experience
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
