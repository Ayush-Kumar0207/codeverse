-- ==========================================
-- CLOUD SYNC: SNAPSHOT DATABASE INITIALIZATION
-- ==========================================

-- 1. Ensure UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Snapshots Table
CREATE TABLE IF NOT EXISTS public.setting_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_snapshots_user_id ON public.setting_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_user_created ON public.setting_snapshots(user_id, created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.setting_snapshots ENABLE ROW LEVEL SECURITY;

-- 5. Define RLS Policies
-- Allow users to view only their own snapshots
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'setting_snapshots' AND policyname = 'Users can view their own snapshots'
    ) THEN
        CREATE POLICY "Users can view their own snapshots" 
        ON public.setting_snapshots 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Allow users to insert their own snapshots
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'setting_snapshots' AND policyname = 'Users can insert their own snapshots'
    ) THEN
        CREATE POLICY "Users can insert their own snapshots" 
        ON public.setting_snapshots 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Allow users to delete their own snapshots (for pruning logic)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'setting_snapshots' AND policyname = 'Users can delete their own snapshots'
    ) THEN
        CREATE POLICY "Users can delete their own snapshots" 
        ON public.setting_snapshots 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- 6. Grant Permissions (Assuming 'authenticated' role is used by Supabase)
GRANT ALL ON public.setting_snapshots TO authenticated;
GRANT ALL ON public.setting_snapshots TO service_role;
