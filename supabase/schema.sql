-- Create supabase/schema.sql
-- Relaxed relational system definitions for development, testing, and migration seeding

-- Drop existing tables to ensure a clean re-migration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.chapters CASCADE;
DROP TABLE IF EXISTS public.stories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. PROFILES Table
-- We use UUID PRIMARY KEY without a strict foreign key constraint to auth.users in development.
-- This allows us to insert seed/migration authors without admin auth.users privileges.
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. STORIES Table
CREATE TABLE public.stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'published'::text CHECK (status IN ('draft', 'published', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- 3. CHAPTERS Table
CREATE TABLE public.chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    sort_order INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_story_chapter_order UNIQUE (story_id, sort_order)
);

-- Enable Row Level Security
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;


--------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
--------------------------------------------------------------------------------

-- Public Read Access Policies (Everyone can view profiles, stories, and chapters)
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access to stories" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to chapters" ON public.chapters FOR SELECT USING (true);

-- Insert/Update Policies (Allow public insertion during development to enable seeder/migration routes)
CREATE POLICY "Allow all insertions to profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates to profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow all insertions to stories" ON public.stories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates to stories" ON public.stories FOR UPDATE USING (true);

CREATE POLICY "Allow all insertions to chapters" ON public.chapters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates to chapters" ON public.chapters FOR UPDATE USING (true);


--------------------------------------------------------------------------------
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP (for real production users)
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
        COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', 'Writer'),
        new.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
