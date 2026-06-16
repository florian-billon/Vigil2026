-- Initial schema for VIGIL
-- Author: Florian Billon

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    invitation_code VARCHAR(32) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('observer', 'responder', 'manager')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Incidents
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    state VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (state IN ('open', 'acknowledged', 'escalated', 'resolved')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    assigned_to UUID REFERENCES users(id),
    linked_release_id UUID REFERENCES releases(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline Entries
CREATE TABLE timeline_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    edited_at TIMESTAMP WITH TIME ZONE
);

-- Releases
CREATE TABLE releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    state VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (state IN ('created', 'in_progress', 'completed', 'cancelled', 'blocked')),
    linked_incident_id UUID REFERENCES incidents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Release Steps
CREATE TABLE release_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID REFERENCES releases(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    validated BOOLEAN DEFAULT FALSE,
    validated_by UUID REFERENCES users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(release_id, "order")
);

-- Bans
CREATE TABLE bans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ban_type VARCHAR(20) NOT NULL CHECK (ban_type IN ('temporary', 'permanent')),
    until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Private Messages
CREATE TABLE private_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (sender_id != recipient_id)
);

-- Connected Services (Phase 2)
CREATE TABLE connected_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_name VARCHAR(50) NOT NULL,
    encrypted_token TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_name)
);

-- Rules (Phase 2)
CREATE TABLE rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    action_service VARCHAR(50) NOT NULL,
    action_event VARCHAR(100) NOT NULL,
    reaction_service VARCHAR(50) NOT NULL,
    reaction_action VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_incidents_team_id ON incidents(team_id);
CREATE INDEX idx_incidents_state ON incidents(state);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_timeline_entries_incident_id ON timeline_entries(incident_id);
CREATE INDEX idx_releases_team_id ON releases(team_id);
CREATE INDEX idx_releases_state ON releases(state);
CREATE INDEX idx_release_steps_release_id ON release_steps(release_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_private_messages_sender_id ON private_messages(sender_id);
CREATE INDEX idx_private_messages_recipient_id ON private_messages(recipient_id);
