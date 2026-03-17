-- Migration: Settings features
-- Run this in Supabase SQL Editor

-- 1. Notification preferences on organizations
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS email_on_new_ticket BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_on_low_confidence BOOLEAN NOT NULL DEFAULT true;

-- 2. Email column on organization_members (for display without hitting auth.users)
ALTER TABLE organization_members
  ADD COLUMN IF NOT EXISTS email TEXT NULL,
  ADD COLUMN IF NOT EXISTS full_name TEXT NULL;

-- 3. Invite tracking table
CREATE TABLE IF NOT EXISTS organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('agent', 'admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, email)
);
