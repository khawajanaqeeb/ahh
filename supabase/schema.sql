-- ========================================================================
-- ⚡ COMPLETE SUPABASE SQL SCHEMA FOR AHH BROTHERS WEBSITE
-- Execute this entire file in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ========================================================================

-- 1. CREATE PUBLIC PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'accounts')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
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

-- Trigger firing whenever a new user is inserted into auth.users
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
    relative_name TEXT,
    cnic TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    block TEXT,
    payment_mode TEXT DEFAULT 'Cash',
    bank_name TEXT,
    token_expiry_date TEXT,
    plot_type TEXT NOT NULL,
    status TEXT NOT NULL,
    total_price NUMERIC NOT NULL,
    paid_amount NUMERIC NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Plots & Bookings
ALTER TABLE public.ahh_city_plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ahh_city_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Plots
DROP POLICY IF EXISTS "Allow public read access plots" ON public.ahh_city_plots;
CREATE POLICY "Allow public read access plots" ON public.ahh_city_plots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access plots" ON public.ahh_city_plots;
CREATE POLICY "Allow authenticated write access plots" ON public.ahh_city_plots FOR ALL USING (true);

-- RLS Policies for Bookings
DROP POLICY IF EXISTS "Allow public read bookings" ON public.ahh_city_bookings;
CREATE POLICY "Allow public read bookings" ON public.ahh_city_bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated write bookings" ON public.ahh_city_bookings;
CREATE POLICY "Allow authenticated write bookings" ON public.ahh_city_bookings FOR ALL USING (true);

-- 4. UNIFIED MASTER BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.master_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    cnic TEXT,
    phone TEXT,
    plot_no TEXT,
    block TEXT,
    nominee TEXT,
    booking_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_project_plot UNIQUE (project_name, plot_no)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_master_bookings_cnic ON public.master_bookings(cnic);
CREATE INDEX IF NOT EXISTS idx_master_bookings_project ON public.master_bookings(project_name);

-- Enable RLS for Master Bookings
ALTER TABLE public.master_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Master Bookings (Public read for CNIC plot search, public write for booking sync)
DROP POLICY IF EXISTS "Allow public read master_bookings" ON public.master_bookings;
CREATE POLICY "Allow public read master_bookings"
    ON public.master_bookings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public write master_bookings" ON public.master_bookings;
CREATE POLICY "Allow public write master_bookings"
    ON public.master_bookings FOR ALL
    USING (true);


-- Sync Trigger Function from ahh_city_bookings to master_bookings
CREATE OR REPLACE FUNCTION public.sync_ahh_booking_to_master()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.master_bookings (
        project_name,
        client_name,
        cnic,
        phone,
        plot_no,
        block,
        nominee,
        booking_date,
        created_at
    )
    VALUES (
        'AHH City',
        NEW.client_name,
        NEW.cnic,
        NEW.phone,
        NEW.plot_id,
        COALESCE(NEW.block, ''),
        COALESCE(NEW.relative_name, ''),
        NOW()::date,
        COALESCE(NEW.created_at, NOW())
    )
    ON CONFLICT (project_name, plot_no) DO UPDATE SET
        client_name = EXCLUDED.client_name,
        cnic = EXCLUDED.cnic,
        phone = EXCLUDED.phone,
        block = EXCLUDED.block,
        nominee = EXCLUDED.nominee;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_ahh_booking_saved ON public.ahh_city_bookings;
CREATE TRIGGER on_ahh_booking_saved
  AFTER INSERT OR UPDATE ON public.ahh_city_bookings
  FOR EACH ROW EXECUTE FUNCTION public.sync_ahh_booking_to_master();

-- ========================================================================
-- 8. CREATE USER ACTIVITY LOGS TABLE
-- ========================================================================
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

-- RLS Policy: Admins and Accounts can view all logs
DROP POLICY IF EXISTS "Admins can read activity logs" ON public.user_activity_logs;
CREATE POLICY "Admins can read activity logs"
  ON public.user_activity_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'accounts')
  ));

-- RLS Policy: Allow all inserts (logs come from server actions)
DROP POLICY IF EXISTS "Allow insert activity logs" ON public.user_activity_logs;
CREATE POLICY "Allow insert activity logs"
  ON public.user_activity_logs FOR INSERT
  WITH CHECK (true);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp  ON public.user_activity_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_role       ON public.user_activity_logs (user_role);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON public.user_activity_logs (event_type);

-- ========================================================================
-- To update existing profiles table constraint to allow 'accounts' role:
-- ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'accounts'));
--
-- To set an existing user as Admin or Accounts:
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID_HERE';
-- UPDATE public.profiles SET role = 'accounts' WHERE id = 'YOUR_USER_UUID_HERE';
-- ========================================================================
