-- Complete setup for user management system

-- 1. Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  role text DEFAULT 'editor',
  username text,
  phone text,
  cpf text,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for profiles
DO $$
BEGIN
  -- Allow users to read their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_select_own'
  ) THEN
    CREATE POLICY profiles_select_own ON public.profiles FOR SELECT USING (auth.uid() = id);
  END IF;

  -- Allow users to update their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_update_own'
  ) THEN
    CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;

  -- Allow service role to do everything (for admin operations)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_service_role_all'
  ) THEN
    CREATE POLICY profiles_service_role_all ON public.profiles FOR ALL USING (auth.role() = 'service_role');
  END IF;
END$$;

-- 4. Create unique indexes for optional fields (ignore nulls)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique ON public.profiles (username) WHERE username IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_cpf_unique ON public.profiles (cpf) WHERE cpf IS NOT NULL;

-- 5. Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'editor');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Create admin_permissions table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin boolean NOT NULL DEFAULT false,
  can_posts boolean NOT NULL DEFAULT false,
  can_reviews boolean NOT NULL DEFAULT false,
  can_orders boolean NOT NULL DEFAULT false,
  can_products boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. Enable RLS on admin_permissions
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- 9. Create policy for admin_permissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_permissions' AND policyname='admin_permissions_read'
  ) THEN
    CREATE POLICY admin_permissions_read ON public.admin_permissions FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END$$;

-- 10. Clean up any existing empty strings that could cause unique constraint violations
UPDATE public.profiles SET username = NULL WHERE username = '';
UPDATE public.profiles SET cpf = NULL WHERE cpf = '';

-- 11. Create profiles for existing auth users that don't have profiles
INSERT INTO public.profiles (id, email, role)
SELECT u.id, u.email, 'editor'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
