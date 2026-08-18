-- ========================================================================
-- ⚡ COMPLETE SUPABASE SQL SCHEMA FOR AHH BROTHERS WEBSITE
-- Execute this entire file in your Supabase SQL Editor:
-- (https://supabase.com/dashboard/project/_/sql)
-- ========================================================================

-- 1. CREATE PUBLIC PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    cnic TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'accounts')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- 2. AUTOMATIC PROFILE CREATION TRIGGER ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN LOWER(new.email) IN ('ahhbrothers.developers@gmail.com', 'naqeebkns@gmail.com') THEN 'admin'
      ELSE 'user'
    END
  )
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role WHERE LOWER(EXCLUDED.role) = 'admin';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. CREATE PLOTS & BOOKINGS TABLES FOR AHH CITY
CREATE TABLE IF NOT EXISTS public.ahh_city_plots (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    coords JSONB NOT NULL,
    raw_coords TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ahh_city_bookings (
    plot_id TEXT PRIMARY KEY REFERENCES public.ahh_city_plots(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    father_name TEXT,
    relative_name TEXT,
    cnic TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    block TEXT,
    plot_dimensions TEXT,
    payment_mode TEXT DEFAULT 'Cash',
    bank_name TEXT,
    token_expiry_date TEXT,
    plot_type TEXT NOT NULL,
    status TEXT NOT NULL,
    payment_status TEXT,
    total_price NUMERIC NOT NULL,
    total_payable NUMERIC DEFAULT 0,
    paid_amount NUMERIC NOT NULL,
    amount_received NUMERIC DEFAULT 0,
    cost_of_land NUMERIC DEFAULT 0,
    extra_charges NUMERIC DEFAULT 0,
    processing_charges NUMERIC DEFAULT 0,
    development_charges NUMERIC DEFAULT 0,
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ahh_city_plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ahh_city_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access plots" ON public.ahh_city_plots;
CREATE POLICY "Allow public read access plots" ON public.ahh_city_plots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access plots" ON public.ahh_city_plots;
CREATE POLICY "Allow authenticated write access plots" ON public.ahh_city_plots FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read bookings" ON public.ahh_city_bookings;
CREATE POLICY "Allow public read bookings" ON public.ahh_city_bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated write bookings" ON public.ahh_city_bookings;
CREATE POLICY "Allow authenticated write bookings" ON public.ahh_city_bookings FOR ALL USING (true);


-- 4. UNIFIED MASTER BOOKINGS TABLE & RECENT FIELD UPDATES
CREATE TABLE IF NOT EXISTS public.master_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    father_name TEXT,
    cnic TEXT,
    phone TEXT,
    plot_no TEXT,
    block TEXT,
    plot_dimensions TEXT,
    nominee TEXT,
    booking_date TEXT,
    token_expiry_date DATE,
    development_charges NUMERIC DEFAULT 0,
    total_payable NUMERIC DEFAULT 0,
    amount_received NUMERIC DEFAULT 0,
    payment_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_project_plot UNIQUE (project_name, plot_no)
);

-- Ensure all columns exist if master_bookings already exists
ALTER TABLE public.master_bookings
  ADD COLUMN IF NOT EXISTS block TEXT,
  ADD COLUMN IF NOT EXISTS plot_dimensions TEXT,
  ADD COLUMN IF NOT EXISTS father_name TEXT,
  ADD COLUMN IF NOT EXISTS token_expiry_date DATE,
  ADD COLUMN IF NOT EXISTS development_charges NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_payable NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS amount_received NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_status TEXT;

CREATE INDEX IF NOT EXISTS idx_master_bookings_cnic ON public.master_bookings(cnic);
CREATE INDEX IF NOT EXISTS idx_master_bookings_project ON public.master_bookings(project_name);

ALTER TABLE public.master_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read master_bookings" ON public.master_bookings;
CREATE POLICY "Allow public read master_bookings"
    ON public.master_bookings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public write master_bookings" ON public.master_bookings;
CREATE POLICY "Allow public write master_bookings"
    ON public.master_bookings FOR ALL
    USING (true);


-- 5. PROJECT REFERENCE TABLES (BLOCKS & DIMENSIONS)
CREATE TABLE IF NOT EXISTS public.project_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  block_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.project_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  dimension_label TEXT NOT NULL
);

ALTER TABLE public.project_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_dimensions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read project_blocks" ON public.project_blocks;
CREATE POLICY "Allow public read project_blocks" ON public.project_blocks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read project_dimensions" ON public.project_dimensions;
CREATE POLICY "Allow public read project_dimensions" ON public.project_dimensions FOR SELECT USING (true);


-- 6. USER ACTIVITY LOGS TABLE & SECURITY DEFINER FUNCTIONS
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL DEFAULT 'Unknown',
  user_role TEXT NOT NULL DEFAULT 'user',
  event_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read activity logs" ON public.user_activity_logs;
CREATE POLICY "Admins can read activity logs"
  ON public.user_activity_logs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert activity logs" ON public.user_activity_logs;
CREATE POLICY "Allow insert activity logs"
  ON public.user_activity_logs FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp  ON public.user_activity_logs (timestamp DESC);

-- RPC helper function to bypass RLS and fetch all activity logs
CREATE OR REPLACE FUNCTION public.get_all_activity_logs()
RETURNS SETOF public.user_activity_logs
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.user_activity_logs ORDER BY timestamp DESC;
$$;

-- RPC helper function to bypass RLS and insert activity log
CREATE OR REPLACE FUNCTION public.insert_activity_log(
  p_user_id UUID,
  p_user_email TEXT,
  p_user_role TEXT,
  p_event_type TEXT,
  p_ip_address TEXT,
  p_user_agent TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_activity_logs (user_id, user_email, user_role, event_type, ip_address, user_agent, timestamp)
  VALUES (p_user_id, p_user_email, p_user_role, p_event_type, p_ip_address, p_user_agent, NOW());
END;
$$;

-- RPC helper function to check role bypassing profiles RLS
CREATE OR REPLACE FUNCTION public.get_user_role(lookup_user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = lookup_user_id LIMIT 1;
$$;
