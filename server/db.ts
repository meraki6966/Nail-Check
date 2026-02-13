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
        title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

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
    `);
    
    console.log("✅ Database tables initialized successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}