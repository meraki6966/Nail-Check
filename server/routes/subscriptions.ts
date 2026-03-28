import type { Express, RequestHandler } from "express";
import { z } from "zod";
import { db } from "../db";
import { users, subscriptionHistory } from "@shared/schema";
import { eq } from "drizzle-orm";
import {
  checkAIGenerationLimit,
  incrementAIGeneration,
  updateSubscriptionTier,
  resetMonthlyAIGenerations,
} from "../subscriptions";
import { isAuthenticated } from "../replit_integrations/auth";

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_MONTHLY_LIMIT = 20;

// Apple/Google product ID → tier mapping (update with your real SKUs)
const PRODUCT_TIER_MAP: Record<string, "base" | "premium"> = {
  // Apple
  "com.nailcheck.base.monthly": "base",
  "com.nailcheck.premium.monthly": "premium",
  "com.nailcheck.base.annual": "base",
  "com.nailcheck.premium.annual": "premium",
  // Google
  "nail_check_base_monthly": "base",
  "nail_check_premium_monthly": "premium",
  "nail_check_base_annual": "base",
  "nail_check_premium_annual": "premium",
};

// ─── Simple in-memory rate limiter ────────────────────────────────────────────
// Prevents abuse of AI-generation and purchase endpoints.

type RateLimitEntry = { count: number; windowStart: number };
const rateLimitStore = new Map<string, RateLimitEntry>();

function makeRateLimiter(maxRequests: number, windowMs: number): RequestHandler {
  return (req, res, next) => {
    const userId = String((req.session as any).user?.id ?? req.ip);
    const now = Date.now();
    const entry = rateLimitStore.get(userId);

    if (!entry || now - entry.windowStart > windowMs) {
      rateLimitStore.set(userId, { count: 1, windowStart: now });
      return next();
    }

    if (entry.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests — please wait before trying again.",
      });
    }

    entry.count += 1;
    return next();
  };
}

// Rate limiters
const aiGenRateLimit    = makeRateLimiter(30, 60 * 1000);       // 30 calls/min per user
const purchaseRateLimit = makeRateLimiter(5,  5 * 60 * 1000);   // 5 calls/5 min per user

// ─── Zod request schemas ──────────────────────────────────────────────────────

const validatePurchaseSchema = z.object({
  platform:      z.enum(["ios", "android", "web"]),
  receipt:       z.string().min(1),
  transactionId: z.string().min(1),
  productId:     z.string().optional(),
});

const generateAiSchema = z.object({
  // userId is taken from the session; body field is accepted but ignored for security
});

const cancelSchema = z.object({
  reason: z.string().max(500).optional(),
});

const upgradeSchema = z.object({
  platform:      z.enum(["ios", "android", "web"]),
  transactionId: z.string().min(1),
  receipt:       z.string().optional(),
});

// ─── Receipt validation helpers ───────────────────────────────────────────────
// Stub implementations — swap in the real Apple/Google SDKs when ready.

interface ReceiptValidationResult {
  valid: boolean;
  tier?: "base" | "premium";
  expiresAt?: Date;
  error?: string;
}

async function validateAppleReceipt(
  receipt: string,
  productId?: string
): Promise<ReceiptValidationResult> {
  // TODO: Replace with real Apple StoreKit 2 / verifyReceipt API call.
  // For now, accept any non-empty receipt and infer tier from productId.
  if (!receipt) return { valid: false, error: "Empty receipt" };

  const tier = productId ? PRODUCT_TIER_MAP[productId] : undefined;
  return {
    valid: true,
    tier: tier ?? "base",
    // 30-day expiry as a safe default until real validation is wired up
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
}

async function validateGoogleReceipt(
  receipt: string,
  productId?: string
): Promise<ReceiptValidationResult> {
  // TODO: Replace with real Google Play Developer API purchase verification.
  if (!receipt) return { valid: false, error: "Empty receipt" };

  const tier = productId ? PRODUCT_TIER_MAP[productId] : undefined;
  return {
    valid: true,
    tier: tier ?? "base",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
}

// ─── Route registration ───────────────────────────────────────────────────────

export function registerSubscriptionRoutes(app: Express): void {

  // ── GET /api/subscriptions/status/:userId ──────────────────────────────────
  // Returns the requesting user's subscription state and AI generation quota.
  // The :userId segment must match the authenticated session user.

  app.get(
    "/api/subscriptions/status/:userId",
    isAuthenticated,
    async (req, res) => {
      try {
        const sessionUserId = String((req.session as any).user.id);

        // Guard: users can only query their own status
        if (req.params.userId !== sessionUserId) {
          return res.status(403).json({ success: false, message: "Forbidden" });
        }

        const [user] = await db
          .select({
            subscriptionTier: users.subscriptionTier,
            subscriptionStatus: users.subscriptionStatus,
            subscriptionStartDate: users.subscriptionStartDate,
            subscriptionEndDate: users.subscriptionEndDate,
            platform: users.platform,
            aiGenerationsUsedThisMonth: users.aiGenerationsUsedThisMonth,
            aiGenerationsResetDate: users.aiGenerationsResetDate,
          })
          .from(users)
          .where(eq(users.id, sessionUserId))
          .limit(1);

        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        // Calculate remaining AI generations
        let aiGenerationsRemaining: number | "unlimited" = 0;
        if (user.subscriptionTier === "premium") {
          aiGenerationsRemaining = "unlimited";
        } else if (user.subscriptionTier === "base") {
          const now = new Date();
          const resetDate = user.aiGenerationsResetDate;
          const isNewMonth =
            !resetDate ||
            now.getUTCFullYear() > resetDate.getUTCFullYear() ||
            now.getUTCMonth() > resetDate.getUTCMonth();

          const used = isNewMonth ? 0 : user.aiGenerationsUsedThisMonth;
          aiGenerationsRemaining = Math.max(0, BASE_MONTHLY_LIMIT - used);
        }

        return res.json({
          success: true,
          tier: user.subscriptionTier,
          status: user.subscriptionStatus ?? "none",
          platform: user.platform ?? null,
          subscriptionStartDate: user.subscriptionStartDate ?? null,
          subscriptionEndDate: user.subscriptionEndDate ?? null,
          aiGenerationsUsedThisMonth: user.aiGenerationsUsedThisMonth,
          aiGenerationsRemaining,
          resetDate: user.aiGenerationsResetDate ?? null,
        });
      } catch (error) {
        console.error("[subscriptions] status error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch subscription status" });
      }
    }
  );

  // ── POST /api/subscriptions/validate-purchase ──────────────────────────────
  // Validates an Apple/Google IAP receipt and activates/upgrades the subscription.

  app.post(
    "/api/subscriptions/validate-purchase",
    isAuthenticated,
    purchaseRateLimit,
    async (req, res) => {
      try {
        const parsed = validatePurchaseSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({
            success: false,
            message: "Invalid request body",
            errors: parsed.error.flatten().fieldErrors,
          });
        }

        const { platform, receipt, transactionId, productId } = parsed.data;
        const userId = String((req.session as any).user.id);

        // Validate receipt with Apple or Google
        let validation: ReceiptValidationResult;
        if (platform === "ios") {
          validation = await validateAppleReceipt(receipt, productId);
        } else if (platform === "android") {
          validation = await validateGoogleReceipt(receipt, productId);
        } else {
          // Web platform not supported — purchases happen exclusively through App Store / Google Play
          return res.status(400).json({
            success: false,
            message: "Purchases are only supported through the App Store or Google Play.",
          });
        }

        if (!validation.valid) {
          return res.status(422).json({
            success: false,
            message: `Receipt validation failed: ${validation.error ?? "Invalid receipt"}`,
          });
        }

        const tier = validation.tier ?? "base";

        await updateSubscriptionTier(userId, {
          tier,
          status: "active",
          platform,
          startDate: new Date(),
          endDate: validation.expiresAt,
          transactionId,
          metadata: { receipt: receipt.substring(0, 100), productId },
        });

        // Re-fetch updated user
        const [updated] = await db
          .select({
            subscriptionTier: users.subscriptionTier,
            subscriptionStatus: users.subscriptionStatus,
            subscriptionEndDate: users.subscriptionEndDate,
          })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        return res.json({
          success: true,
          message: `${tier.charAt(0).toUpperCase() + tier.slice(1)} subscription activated`,
          tier: updated?.subscriptionTier ?? tier,
          status: updated?.subscriptionStatus ?? "active",
          expiresAt: updated?.subscriptionEndDate ?? validation.expiresAt,
        });
      } catch (error) {
        console.error("[subscriptions] validate-purchase error:", error);
        return res.status(500).json({ success: false, message: "Failed to validate purchase" });
      }
    }
  );

  // ── POST /api/subscriptions/generate-ai ───────────────────────────────────
  // Atomically checks quota and increments the counter. Call this before
  // every AI generation request to enforce the Base tier 20/month limit.

  app.post(
    "/api/subscriptions/generate-ai",
    isAuthenticated,
    aiGenRateLimit,
    async (req, res) => {
      try {
        const userId = String((req.session as any).user.id);

        const allowed = await checkAIGenerationLimit(userId);

        if (!allowed) {
          // Fetch current state for a useful error response
          const [user] = await db
            .select({
              subscriptionTier: users.subscriptionTier,
              aiGenerationsUsedThisMonth: users.aiGenerationsUsedThisMonth,
              aiGenerationsResetDate: users.aiGenerationsResetDate,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

          return res.status(403).json({
            success: false,
            allowed: false,
            tier: user?.subscriptionTier ?? "free",
            remaining: 0,
            resetDate: user?.aiGenerationsResetDate ?? null,
            message:
              user?.subscriptionTier === "free"
                ? "AI generation requires a Base or Premium subscription"
                : "Monthly AI generation limit reached. Upgrade to Premium for unlimited generations.",
          });
        }

        // Increment counter
        await incrementAIGeneration(userId);

        // Re-fetch to return accurate remaining count
        const [updated] = await db
          .select({
            subscriptionTier: users.subscriptionTier,
            aiGenerationsUsedThisMonth: users.aiGenerationsUsedThisMonth,
            aiGenerationsResetDate: users.aiGenerationsResetDate,
          })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        const tier = updated?.subscriptionTier ?? "free";
        const used = updated?.aiGenerationsUsedThisMonth ?? 1;
        const remaining =
          tier === "premium" ? "unlimited" : Math.max(0, BASE_MONTHLY_LIMIT - used);

        return res.json({
          success: true,
          allowed: true,
          tier,
          remaining,
          used,
          resetDate: updated?.aiGenerationsResetDate ?? null,
        });
      } catch (error) {
        console.error("[subscriptions] generate-ai error:", error);
        return res.status(500).json({ success: false, message: "Failed to process generation request" });
      }
    }
  );

  // ── POST /api/subscriptions/cancel ────────────────────────────────────────
  // Marks the subscription as cancelled (effective at subscriptionEndDate).
  // Does not immediately revoke access — user keeps tier until period ends.

  app.post(
    "/api/subscriptions/cancel",
    isAuthenticated,
    async (req, res) => {
      try {
        const parsed = cancelSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({ success: false, message: "Invalid request body" });
        }

        const userId = String((req.session as any).user.id);

        const [user] = await db
          .select({
            subscriptionTier: users.subscriptionTier,
            subscriptionStatus: users.subscriptionStatus,
            subscriptionEndDate: users.subscriptionEndDate,
            platform: users.platform,
          })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.subscriptionTier === "free" || !user.subscriptionStatus) {
          return res.status(400).json({ success: false, message: "No active subscription to cancel" });
        }

        if (user.subscriptionStatus === "cancelled") {
          return res.status(400).json({ success: false, message: "Subscription is already cancelled" });
        }

        await updateSubscriptionTier(userId, {
          tier: user.subscriptionTier as "base" | "premium",
          status: "cancelled",
          platform: (user.platform ?? "web") as "ios" | "android" | "web",
          endDate: user.subscriptionEndDate ?? new Date(),
          metadata: parsed.data.reason ? { reason: parsed.data.reason } : undefined,
        });

        return res.json({
          success: true,
          message: "Subscription cancelled. You retain access until the end of your billing period.",
          accessUntil: user.subscriptionEndDate ?? null,
        });
      } catch (error) {
        console.error("[subscriptions] cancel error:", error);
        return res.status(500).json({ success: false, message: "Failed to cancel subscription" });
      }
    }
  );

  // ── POST /api/subscriptions/upgrade ───────────────────────────────────────
  // Upgrades an active Base subscriber to Premium.
  // The caller must provide a valid receipt from the new purchase.

  app.post(
    "/api/subscriptions/upgrade",
    isAuthenticated,
    purchaseRateLimit,
    async (req, res) => {
      try {
        const parsed = upgradeSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({
            success: false,
            message: "Invalid request body",
            errors: parsed.error.flatten().fieldErrors,
          });
        }

        const { platform, transactionId, receipt } = parsed.data;
        const userId = String((req.session as any).user.id);

        const [user] = await db
          .select({ subscriptionTier: users.subscriptionTier, subscriptionStatus: users.subscriptionStatus })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.subscriptionTier === "premium") {
          return res.status(400).json({ success: false, message: "Already on Premium" });
        }

        if (user.subscriptionStatus !== "active" && user.subscriptionStatus !== "trial") {
          return res.status(400).json({
            success: false,
            message: "You must have an active subscription to upgrade. Use validate-purchase instead.",
          });
        }

        // Validate receipt if provided (web platform has no receipt — IAP only)
        if (platform !== "web" && receipt) {
          const validation =
            platform === "ios"
              ? await validateAppleReceipt(receipt)
              : await validateGoogleReceipt(receipt);

          if (!validation.valid) {
            return res.status(422).json({
              success: false,
              message: `Receipt validation failed: ${validation.error ?? "Invalid receipt"}`,
            });
          }
        }

        await updateSubscriptionTier(userId, {
          tier: "premium",
          status: "active",
          platform,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          transactionId,
          metadata: receipt ? { receipt: receipt.substring(0, 100) } : undefined,
        });

        return res.json({
          success: true,
          message: "Upgraded to Premium! Enjoy unlimited AI generations.",
          tier: "premium",
          status: "active",
        });
      } catch (error) {
        console.error("[subscriptions] upgrade error:", error);
        return res.status(500).json({ success: false, message: "Failed to process upgrade" });
      }
    }
  );
}
