-- Run once in the Supabase SQL editor for existing CodeVerse databases.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS github_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS google_id TEXT;

NOTIFY pgrst, 'reload schema';
