-- Migration: 0001_subscription_tiers
-- Adds tiered subscription support to users table and creates subscription_history audit log.

-- ─── Enum Types ───────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('free', 'base', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE platform_type AS ENUM ('ios', 'android', 'web');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_history_tier AS ENUM ('base', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_change_status AS ENUM ('started', 'upgraded', 'downgraded', 'cancelled', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Alter users table ────────────────────────────────────────────────────────

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS subscription_tier     subscription_tier    NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status   subscription_status,
  ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP,
  ADD COLUMN IF NOT EXISTS subscription_end_date   TIMESTAMP,
  ADD COLUMN IF NOT EXISTS platform              platform_type,
  ADD COLUMN IF NOT EXISTS ai_generations_used_this_month INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_generations_reset_date TIMESTAMP;

-- ─── subscription_history table ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscription_history (
  id                VARCHAR    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           VARCHAR    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier              subscription_history_tier NOT NULL,
  status            subscription_change_status NOT NULL,
  platform          TEXT       NOT NULL,
  transaction_id    TEXT,
  created_at        TIMESTAMP  NOT NULL DEFAULT NOW(),
  metadata          JSONB
);

CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id   ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_created_at ON subscription_history(created_at);
