import { db } from "./db";
import { users, subscriptionHistory } from "@shared/schema";
import { eq } from "drizzle-orm";

// Monthly generation limit for Base tier
const BASE_MONTHLY_LIMIT = 20;

// ─── checkAIGenerationLimit ───────────────────────────────────────────────────
// Returns true if the user is allowed to generate (has quota remaining).
// - free:    always false (no AI generations)
// - base:    true if aiGenerationsUsedThisMonth < 20 (resets monthly)
// - premium: always true (unlimited)

export async function checkAIGenerationLimit(userId: string): Promise<boolean> {
  const [user] = await db
    .select({
      subscriptionTier: users.subscriptionTier,
      subscriptionStatus: users.subscriptionStatus,
      aiGenerationsUsedThisMonth: users.aiGenerationsUsedThisMonth,
      aiGenerationsResetDate: users.aiGenerationsResetDate,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return false;

  // Free tier gets no AI generations
  if (user.subscriptionTier === "free") return false;

  // Only active/trial subscriptions get quota
  if (user.subscriptionStatus !== "active" && user.subscriptionStatus !== "trial") return false;

  // Premium is unlimited
  if (user.subscriptionTier === "premium") return true;

  // Base: check if the monthly counter has already been reset this month
  const now = new Date();
  const resetDate = user.aiGenerationsResetDate;

  if (resetDate) {
    const resetMonth = resetDate.getUTCMonth();
    const resetYear  = resetDate.getUTCFullYear();
    const nowMonth   = now.getUTCMonth();
    const nowYear    = now.getUTCFullYear();

    // If we're in a new month since the last reset, the quota is effectively 0 used
    if (nowYear > resetYear || nowMonth > resetMonth) {
      return true; // counter will be reset on next increment
    }
  }

  return user.aiGenerationsUsedThisMonth < BASE_MONTHLY_LIMIT;
}

// ─── incrementAIGeneration ────────────────────────────────────────────────────
// Increments aiGenerationsUsedThisMonth. Resets the counter first if a new
// calendar month has started since aiGenerationsResetDate.

export async function incrementAIGeneration(userId: string): Promise<void> {
  const [user] = await db
    .select({
      aiGenerationsUsedThisMonth: users.aiGenerationsUsedThisMonth,
      aiGenerationsResetDate: users.aiGenerationsResetDate,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return;

  const now = new Date();
  const resetDate = user.aiGenerationsResetDate;
  let currentCount = user.aiGenerationsUsedThisMonth;
  let needsReset = false;

  if (resetDate) {
    const isNewMonth =
      now.getUTCFullYear() > resetDate.getUTCFullYear() ||
      now.getUTCMonth() > resetDate.getUTCMonth();
    if (isNewMonth) {
      currentCount = 0;
      needsReset = true;
    }
  } else {
    // First generation ever — set the reset date
    needsReset = true;
  }

  await db
    .update(users)
    .set({
      aiGenerationsUsedThisMonth: currentCount + 1,
      ...(needsReset ? { aiGenerationsResetDate: now } : {}),
      updatedAt: now,
    })
    .where(eq(users.id, userId));
}

// ─── resetMonthlyAIGenerations ────────────────────────────────────────────────
// Explicitly resets the monthly generation counter for a user (e.g. called by
// a scheduled job at the start of each billing period).

export async function resetMonthlyAIGenerations(userId: string): Promise<void> {
  await db
    .update(users)
    .set({
      aiGenerationsUsedThisMonth: 0,
      aiGenerationsResetDate: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

// ─── updateSubscriptionTier ───────────────────────────────────────────────────
// Updates the user's subscription fields and appends a record to
// subscription_history for auditing.

export type SubscriptionTier    = "free" | "base" | "premium";
export type SubscriptionStatus  = "active" | "cancelled" | "expired" | "trial";
export type SubscriptionPlatform = "ios" | "android" | "web";

export interface UpdateSubscriptionOptions {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  platform: SubscriptionPlatform;
  startDate?: Date;
  endDate?: Date;
  transactionId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export async function updateSubscriptionTier(
  userId: string,
  opts: UpdateSubscriptionOptions
): Promise<void> {
  const now = new Date();

  // Derive history change status from current → new tier
  const [current] = await db
    .select({ subscriptionTier: users.subscriptionTier })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  type HistoryStatus = "started" | "upgraded" | "downgraded" | "cancelled" | "expired";

  let changeStatus: HistoryStatus = "started";
  if (opts.status === "cancelled") {
    changeStatus = "cancelled";
  } else if (opts.status === "expired") {
    changeStatus = "expired";
  } else if (current) {
    const tierRank: Record<SubscriptionTier, number> = { free: 0, base: 1, premium: 2 };
    const prev = tierRank[current.subscriptionTier];
    const next = tierRank[opts.tier];
    if (prev === 0 && next > 0)     changeStatus = "started";
    else if (next > prev)           changeStatus = "upgraded";
    else if (next < prev)           changeStatus = "downgraded";
    else                            changeStatus = "started";
  }

  // Update user row
  await db
    .update(users)
    .set({
      subscriptionTier: opts.tier,
      subscriptionStatus: opts.status,
      subscriptionStartDate: opts.startDate ?? now,
      subscriptionEndDate: opts.endDate ?? null,
      platform: opts.platform,
      updatedAt: now,
    })
    .where(eq(users.id, userId));

  // Only write history for paid tiers (base / premium) — skip free resets
  if (opts.tier !== "free" || changeStatus === "cancelled" || changeStatus === "expired") {
    const historyTier = (opts.tier === "free" ? current?.subscriptionTier : opts.tier) as
      | "base"
      | "premium"
      | undefined;

    if (historyTier && historyTier !== "free") {
      await db.insert(subscriptionHistory).values({
        userId,
        tier: historyTier,
        status: changeStatus,
        platform: opts.platform,
        transactionId: opts.transactionId ?? null,
        metadata: opts.metadata ?? null,
      });
    }
  }
}
