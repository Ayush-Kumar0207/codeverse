-- Distributed collaboration state. Apply with the Supabase SQL editor or CLI.
-- These tables are server-only because CodeVerse uses its own signed session.

CREATE TABLE IF NOT EXISTS public.collaboration_rooms (
    room_id TEXT PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    organizer_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    organizer_username TEXT NOT NULL DEFAULT '',
    collaborators_can_edit BOOLEAN NOT NULL DEFAULT TRUE,
    files JSONB NOT NULL DEFAULT '{}'::JSONB,
    active_file TEXT NOT NULL DEFAULT '',
    crdt_state TEXT NOT NULL DEFAULT '',
    revision BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.collaboration_members (
    room_id TEXT NOT NULL REFERENCES public.collaboration_rooms(room_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('organizer', 'editor', 'viewer')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (room_id, user_id)
);

CREATE INDEX IF NOT EXISTS collaboration_rooms_project_idx
    ON public.collaboration_rooms(project_id);
CREATE INDEX IF NOT EXISTS collaboration_members_user_idx
    ON public.collaboration_members(user_id, active);

ALTER TABLE public.collaboration_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_members ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.collaboration_rooms FROM anon, authenticated;
REVOKE ALL ON public.collaboration_members FROM anon, authenticated;
GRANT ALL ON public.collaboration_rooms TO service_role;
GRANT ALL ON public.collaboration_members TO service_role;
