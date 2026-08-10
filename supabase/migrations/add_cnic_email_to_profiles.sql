-- ========================================================================
-- MIGRATION: Add email & cnic columns to public.profiles
-- Root cause fix: signup() upsert was failing because these columns
-- did not exist in the profiles table, causing a Postgres column error.
-- Run this in: Supabase Dashboard → SQL Editor
-- ========================================================================

-- Add email column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Add cnic column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cnic TEXT;

-- Add unique index on cnic (optional — helps with lookup & duplicate prevention)
CREATE INDEX IF NOT EXISTS idx_profiles_cnic ON public.profiles (cnic)
  WHERE cnic IS NOT NULL AND cnic != '';

-- Update the trigger function to also sync email and cnic from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, cnic, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'cnic', ''),
    CASE
      WHEN LOWER(new.email) IN ('ahhbrothers.developers@gmail.com', 'naqeebkns@gmail.com') THEN 'admin'
      ELSE 'user'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email    = EXCLUDED.email,
    cnic     = EXCLUDED.cnic,
    phone    = EXCLUDED.phone,
    full_name = EXCLUDED.full_name,
    role     = CASE
                 WHEN LOWER(EXCLUDED.email) IN ('ahhbrothers.developers@gmail.com', 'naqeebkns@gmail.com') THEN 'admin'
                 ELSE public.profiles.role  -- preserve existing role on conflict
               END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================================
-- ALSO: Disable email confirmation in Supabase Dashboard manually:
--   Authentication → Providers → Email → "Confirm email" → OFF
-- ========================================================================
