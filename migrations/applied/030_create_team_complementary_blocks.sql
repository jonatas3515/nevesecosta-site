-- Migration 030: Tabela de blocos estruturados de Formação Complementar
CREATE TABLE IF NOT EXISTS public.team_complementary_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  category_title TEXT NOT NULL,
  courses_text TEXT NOT NULL,
  title_color TEXT DEFAULT '#fbbf24',
  text_color TEXT DEFAULT '#e2e8f0',
  text_align TEXT DEFAULT 'left' CHECK (text_align IN ('left', 'center', 'justify')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_complementary_blocks_member ON public.team_complementary_blocks(member_id);
CREATE INDEX IF NOT EXISTS idx_team_complementary_blocks_sort ON public.team_complementary_blocks(member_id, sort_order);

-- RLS: permitir leitura pública
ALTER TABLE public.team_complementary_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_complementary_blocks public read"
  ON public.team_complementary_blocks
  FOR SELECT
  USING (true);

-- RLS: permitir insert/update/delete apenas para auth.uid() com role adequada
CREATE POLICY "team_complementary_blocks auth insert"
  ON public.team_complementary_blocks
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "team_complementary_blocks auth update"
  ON public.team_complementary_blocks
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "team_complementary_blocks auth delete"
  ON public.team_complementary_blocks
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
