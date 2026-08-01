-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password TEXT,
    github_id TEXT,
    google_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upgrade existing users tables created before OAuth provider columns were added.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS github_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS google_id TEXT;

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    language TEXT NOT NULL,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    is_demo BOOLEAN DEFAULT FALSE,
    code TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files Table
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    language TEXT NOT NULL,
    content TEXT NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Code Versions Table
CREATE TABLE IF NOT EXISTS public.versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at
BEFORE UPDATE ON public.files
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Settings Snapshots Table (Temporal History)
CREATE TABLE IF NOT EXISTS public.setting_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EvidenceOS: tamper-evident causal history for each engineering workspace.
-- project_id remains TEXT so local/offline projects and cloud UUID projects share one contract.
CREATE TABLE IF NOT EXISTS public.engineering_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    sequence BIGINT NOT NULL,
    type TEXT NOT NULL,
    actor JSONB NOT NULL,
    summary TEXT NOT NULL,
    source TEXT NOT NULL,
    file_name TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::JSONB,
    caused_by TEXT,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    previous_hash TEXT NOT NULL,
    integrity_hash TEXT NOT NULL,
    UNIQUE(project_id, sequence)
);

CREATE TABLE IF NOT EXISTS public.evidence_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    requirement TEXT NOT NULL DEFAULT '',
    rationale TEXT NOT NULL DEFAULT '',
    rollback TEXT NOT NULL DEFAULT '',
    files JSONB NOT NULL DEFAULT '[]'::JSONB,
    checks JSONB NOT NULL DEFAULT '[]'::JSONB,
    score INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'needs-evidence',
    created_by JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.evidence_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT NOT NULL,
    requirement TEXT NOT NULL DEFAULT '',
    verdict TEXT NOT NULL,
    score INTEGER NOT NULL,
    agents JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.understanding_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    feedback JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS engineering_events_project_sequence_idx
    ON public.engineering_events(project_id, sequence);
CREATE INDEX IF NOT EXISTS evidence_packages_project_created_idx
    ON public.evidence_packages(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS evidence_reviews_project_created_idx
    ON public.evidence_reviews(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS understanding_verifications_project_created_idx
    ON public.understanding_verifications(project_id, created_at DESC);
