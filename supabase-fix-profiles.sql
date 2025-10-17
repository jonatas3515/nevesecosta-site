-- Fix profiles table step by step

-- 1. Add missing columns to profiles table
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'editor';
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS cpf text;
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for profiles (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS profiles_service_role_all ON public.profiles;
CREATE POLICY profiles_service_role_all ON public.profiles FOR ALL USING (auth.role() = 'service_role');

-- 4. Create unique indexes for optional fields (ignore nulls)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique ON public.profiles (username) WHERE username IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_cpf_unique ON public.profiles (cpf) WHERE cpf IS NOT NULL;

-- 5. Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'editor')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Create admin_permissions table if not exists
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  user_id uuid PRIMARY KEY,
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
DROP POLICY IF EXISTS admin_permissions_read ON public.admin_permissions;
CREATE POLICY admin_permissions_read ON public.admin_permissions FOR SELECT USING (auth.role() = 'authenticated');

-- 10. Clean up any existing empty strings
UPDATE public.profiles SET username = NULL WHERE username = '';
UPDATE public.profiles SET cpf = NULL WHERE cpf = '';

-- 11. Create profiles for existing auth users that don't have profiles
-- First, let's see what we're working with by updating existing profiles with email
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Get all auth users
    FOR user_record IN 
        SELECT id, email FROM auth.users
    LOOP
        -- Insert or update profile
        INSERT INTO public.profiles (id, email, role)
        VALUES (user_record.id, user_record.email, 'editor')
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            role = COALESCE(public.profiles.role, 'editor'),
            updated_at = now();
    END LOOP;
END$$;
