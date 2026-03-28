import { sql } from "drizzle-orm";
import { index, jsonb, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./auth";

// ─── Enums (scoped to subscription_history) ───────────────────────────────────

export const subscriptionHistoryTierEnum = pgEnum("subscription_history_tier", ["base", "premium"]);
export const subscriptionChangeStatusEnum = pgEnum("subscription_change_status", [
  "started",
  "upgraded",
  "downgraded",
  "cancelled",
  "expired",
]);

// ─── Subscription History ─────────────────────────────────────────────────────
// Immutable audit log of every subscription state change per user.

export const subscriptionHistory = pgTable(
  "subscription_history",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

    // FK → users.id  (cascade delete so history is cleaned up with the account)
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    tier: subscriptionHistoryTierEnum("tier").notNull(),
    status: subscriptionChangeStatusEnum("status").notNull(),

    // Platform the purchase was made on
    platform: text("platform").notNull(), // 'ios' | 'android' | 'web'

    // Apple / Google receipt / transaction identifier
    transactionId: text("transaction_id"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    // Arbitrary extra data (receipt payload, renewal info, etc.)
    metadata: jsonb("metadata"),
  },
  (table) => [
    index("idx_subscription_history_user_id").on(table.userId),
    index("idx_subscription_history_created_at").on(table.createdAt),
  ]
);

export const insertSubscriptionHistorySchema = createInsertSchema(subscriptionHistory).omit({
  id: true,
  createdAt: true,
});

export type SubscriptionHistory = typeof subscriptionHistory.$inferSelect;
export type InsertSubscriptionHistory = z.infer<typeof insertSubscriptionHistorySchema>;
