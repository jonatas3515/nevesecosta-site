-- Migration 034: Seed inicial de Áreas de Especialização para Jonatas Costa
-- Substituir <MEMBER_ID> pelo UUID real do membro

INSERT INTO public.team_specialization_areas (member_id, area_title, topics_list, sort_order)
VALUES
  ('<MEMBER_ID>', 'Direito Civil', 'Contratos em geral
Cobranças judiciais
Indenizações
Direito das obrigações', 0),
  ('<MEMBER_ID>', 'Direito do Consumidor', 'Defesa do consumidor
Cobranças indevidas
Compras online
Falhas em serviços', 1),
  ('<MEMBER_ID>', 'Direito Trabalhista', 'Direitos do trabalhador
Rescisões contratuais
Verbas não pagas
Horas extras', 2)
ON CONFLICT DO NOTHING;
