-- Migration: Add onboarding fields to organizations table
-- Run this in Supabase SQL Editor

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS industry TEXT NOT NULL DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS primary_language TEXT NOT NULL DEFAULT 'english',
  ADD COLUMN IF NOT EXISTS team_size TEXT NULL,
  ADD COLUMN IF NOT EXISTS monthly_tickets TEXT NULL,
  ADD COLUMN IF NOT EXISTS website TEXT NULL;

-- Add check constraints for enum values
ALTER TABLE organizations
  ADD CONSTRAINT chk_industry
    CHECK (industry IN ('saas', 'ecommerce', 'healthcare', 'fintech', 'education', 'other')),
  ADD CONSTRAINT chk_primary_language
    CHECK (primary_language IN ('english', 'bschr', 'german', 'french', 'spanish', 'other')),
  ADD CONSTRAINT chk_team_size
    CHECK (team_size IS NULL OR team_size IN ('1-10', '11-50', '51-200', '201-500', '500+')),
  ADD CONSTRAINT chk_monthly_tickets
    CHECK (monthly_tickets IS NULL OR monthly_tickets IN ('<100', '100-500', '500-2000', '2000+'));

-- After migration, remove defaults (new rows must explicitly provide these values)
ALTER TABLE organizations
  ALTER COLUMN industry DROP DEFAULT,
  ALTER COLUMN primary_language DROP DEFAULT;
