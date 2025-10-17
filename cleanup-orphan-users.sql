-- SCRIPT DE LIMPEZA DE USUÁRIOS ÓRFÃOS
-- Execute no Supabase SQL Editor

-- 1. Ver usuários que existem no auth mas não em profiles
SELECT 
  u.id,
  u.email,
  u.created_at,
  CASE 
    WHEN p.id IS NULL THEN 'Órfão (sem profile)'
    ELSE 'OK'
  END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email NOT LIKE '%jonatascosta.adv@gmail.com%'
ORDER BY u.created_at DESC;

-- 2. Deletar usuários específicos problemáticos
-- ATENÇÃO: Só execute se tiver certeza!

-- Deletar jopejoje@gmail.com
DELETE FROM admin_permissions WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jopejoje@gmail.com');
DELETE FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'jopejoje@gmail.com');
-- Nota: Não conseguimos deletar diretamente de auth.users via SQL, precisa usar a API

-- Deletar teste@teste.com
DELETE FROM admin_permissions WHERE user_id = (SELECT id FROM auth.users WHERE email = 'teste@teste.com');
DELETE FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'teste@teste.com');

-- 3. Ver quantos usuários restam
SELECT 
  COUNT(*) as total_auth_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  (SELECT COUNT(*) FROM admin_permissions) as total_permissions
FROM auth.users;

-- 4. Listar todos os usuários ativos
SELECT 
  u.id,
  u.email,
  p.role,
  p.full_name,
  p.username
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
