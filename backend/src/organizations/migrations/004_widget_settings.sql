-- Migration: Widget settings
-- Run this in Supabase SQL Editor

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS widget_accent_color TEXT NOT NULL DEFAULT '#6366F1',
  ADD COLUMN IF NOT EXISTS widget_position TEXT NOT NULL DEFAULT 'bottom-right',
  ADD COLUMN IF NOT EXISTS widget_placeholder_text TEXT NOT NULL DEFAULT 'How can we help you today?',
  ADD COLUMN IF NOT EXISTS widget_button_text TEXT NOT NULL DEFAULT 'Send message';
