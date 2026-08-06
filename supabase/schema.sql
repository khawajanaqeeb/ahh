-- AHH Brothers - Supabase Auth & RBAC Schema
-- Run this entire script in your Supabase SQL Editor

-- 1. Create the Profiles Table
-- This table is linked 1-to-1 with auth.users
CREATE TABLE public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text default 'user' check (role in ('admin', 'employee', 'user')),
  full_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Setup Triggers for Automatic Profile Creation
-- When a user signs up, automatically create a row in public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    'user' -- Default role for new signups
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after a user is inserted into auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 3. Row Level Security (RLS) Policies for Profiles
-- A user can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Admins can update any profile (e.g., to change someone's role)
CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Users can update their own profile (except for role changes, which should be guarded at API level or via stricter triggers)
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- 4. Set up an initial Admin user (OPTIONAL - Manual step)
-- After you create your account via the app, run this command manually in the SQL editor 
-- to make yourself an admin, replacing the UUID with your actual user ID:
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR-AUTH-UUID';
