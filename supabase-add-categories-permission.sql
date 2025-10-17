-- Add can_categories permission to existing admin_permissions table
ALTER TABLE public.admin_permissions ADD COLUMN IF NOT EXISTS can_categories boolean NOT NULL DEFAULT false;
