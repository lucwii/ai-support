-- Migration: add Lemon Squeezy subscription fields to organizations

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS lemon_squeezy_customer_id    TEXT,
  ADD COLUMN IF NOT EXISTS lemon_squeezy_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status           TEXT,
  -- 'active' | 'past_due' | 'paused' | 'cancelled' | 'expired'
  ADD COLUMN IF NOT EXISTS subscription_plan             TEXT,
  -- e.g. 'starter' | 'pro'
  ADD COLUMN IF NOT EXISTS subscription_renews_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_ends_at          TIMESTAMPTZ;
