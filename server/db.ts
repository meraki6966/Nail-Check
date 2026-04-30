import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Auto-create tables on startup
export async function initializeDatabase() {
  console.log("🔧 Initializing database tables...");
  
  try {
    await pool.query(`
      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR UNIQUE,
        first_name VARCHAR,
        last_name VARCHAR,
        profile_image_url VARCHAR,
        credits INTEGER DEFAULT 1 NOT NULL,
        generations_used INTEGER DEFAULT 0 NOT NULL,
        is_paid_member BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create sessions table
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

      -- Create conversations table
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      -- Backfill column for existing deployments
      ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_id TEXT;
      CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);

      -- Create messages table
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      -- Create tutorials table
      CREATE TABLE IF NOT EXISTS tutorials (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        image_source TEXT NOT NULL,
        style_category TEXT NOT NULL,
        difficulty_level TEXT NOT NULL,
        tools_required TEXT[] NOT NULL,
        tutorial_content TEXT NOT NULL,
        creator_credit TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Create saved_designs table (FIRE VAULT)
      CREATE TABLE IF NOT EXISTS saved_designs (
        id SERIAL PRIMARY KEY,
        user_id TEXT,
        image_url TEXT NOT NULL,
        prompt TEXT NOT NULL,
        canvas_image_url TEXT,
        tags TEXT[],
        is_favorite BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_saved_designs_user_id ON saved_designs(user_id);

      -- Create seasonal_designs table (SEASONAL VAULT)
      CREATE TABLE IF NOT EXISTS seasonal_designs (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        season TEXT NOT NULL,
        category TEXT,
        description TEXT,
        tags TEXT[],
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_seasonal_designs_season ON seasonal_designs(season);
      CREATE INDEX IF NOT EXISTS idx_seasonal_designs_featured ON seasonal_designs(featured);

      -- Create supply_products table (SUPPLY SUITE)
      CREATE TABLE IF NOT EXISTS supply_products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        product_url TEXT,
        price TEXT,
        utility TEXT,
        tags TEXT[],
        featured BOOLEAN DEFAULT false,
        member_only BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_supply_products_category ON supply_products(category);
      CREATE INDEX IF NOT EXISTS idx_supply_products_brand ON supply_products(brand);
      CREATE INDEX IF NOT EXISTS idx_supply_products_featured ON supply_products(featured);

      -- ── Subscription tier enums ──────────────────────────────────────────────
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

      -- ── nail_techs ownership column ───────────────────────────────────────
      ALTER TABLE nail_techs ADD COLUMN IF NOT EXISTS owner_user_id TEXT;
      CREATE INDEX IF NOT EXISTS idx_nail_techs_owner_user_id ON nail_techs(owner_user_id);

      -- ── New columns on users ─────────────────────────────────────────────────
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS subscription_tier subscription_tier NOT NULL DEFAULT 'free',
        ADD COLUMN IF NOT EXISTS subscription_status subscription_status,
        ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP,
        ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP,
        ADD COLUMN IF NOT EXISTS platform platform_type,
        ADD COLUMN IF NOT EXISTS ai_generations_used_this_month INTEGER NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS ai_generations_reset_date TIMESTAMP;

      -- ── subscription_history table ───────────────────────────────────────────
      CREATE TABLE IF NOT EXISTS subscription_history (
        id             VARCHAR   PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id        VARCHAR   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tier           subscription_history_tier NOT NULL,
        status         subscription_change_status NOT NULL,
        platform       TEXT      NOT NULL,
        transaction_id TEXT,
        created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
        metadata       JSONB
      );

      CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id    ON subscription_history(user_id);
      CREATE INDEX IF NOT EXISTS idx_subscription_history_created_at ON subscription_history(created_at);
    `);

    // Fix broken Unsplash image URLs in seasonal_designs table
    await pool.query(`
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Chrome.png'
        WHERE title = 'Icy Blue Glitter' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Cat-eye.png'
        WHERE title = 'Snowflake Chrome' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Matte-Sugar.png'
        WHERE title = 'Burgundy Velvet' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Bridal-1.png'
        WHERE title = 'Pastel Garden' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Editorial.png'
        WHERE title = 'Cherry Blossom' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Glass-Nails.png'
        WHERE title = 'Mint Fresh' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Vacation.jpg'
        WHERE title = 'Tropical Sunset' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Cat-eye.png'
        WHERE title = 'Ocean Wave' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Birthday.png'
        WHERE title = 'Neon Coral' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Junk.png'
        WHERE title = 'Pumpkin Spice' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Editorial.png'
        WHERE title = 'Maple Leaf Gold' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Matte-Sugar.png'
        WHERE title = 'Mocha Matte' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Bridal-1.png'
        WHERE title = 'Valentine Hearts' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/3D-Character.png'
        WHERE title = 'Halloween Spooky' AND image_url LIKE '%unsplash%';
      UPDATE seasonal_designs SET image_url = 'http://nail-check.com/wp-content/uploads/2026/02/Chrome.png'
        WHERE title = 'New Year Sparkle' AND image_url LIKE '%unsplash%';
    `);
    
    console.log("✅ Database tables initialized successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}