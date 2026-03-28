import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, pgEnum, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const subscriptionTierEnum = pgEnum("subscription_tier", ["free", "base", "premium"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "cancelled", "expired", "trial"]);
export const platformEnum = pgEnum("platform_type", ["ios", "android", "web"]);

// ─── Sessions ─────────────────────────────────────────────────────────────────

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),

  // Legacy credit system (kept for backward compat)
  credits: integer("credits").default(1).notNull(),
  generationsUsed: integer("generations_used").default(0).notNull(),
  isPaidMember: boolean("is_paid_member").default(false).notNull(),

  // ── Subscription tier & status ──────────────────────────────────────────
  subscriptionTier: subscriptionTierEnum("subscription_tier").default("free").notNull(),
  // NULL means no active subscription (free users). Populated once a
  // subscription event occurs.
  subscriptionStatus: subscriptionStatusEnum("subscription_status"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  // Platform the subscription was purchased on (Apple / Google / Web)
  platform: platformEnum("platform"),

  // ── AI generation quota ─────────────────────────────────────────────────
  // Base: 20/month. Premium: unlimited (limit not enforced).
  aiGenerationsUsedThisMonth: integer("ai_generations_used_this_month").default(0).notNull(),
  // Date when the monthly counter last reset (or will reset next)
  aiGenerationsResetDate: timestamp("ai_generations_reset_date"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
