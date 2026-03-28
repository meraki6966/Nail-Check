import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Zap, Crown, RefreshCw, ExternalLink, ArrowUpRight, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubscriptionStatusData {
  success: boolean;
  tier: "free" | "base" | "premium";
  status: string;
  platform: "ios" | "android" | "web" | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  aiGenerationsUsedThisMonth: number;
  aiGenerationsRemaining: number | "unlimited";
  resetDate: string | null;
}

interface SubscriptionStatusProps {
  onUpgradeClick?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatResetDate(iso: string | null): string {
  if (!iso) return "next month";
  const d = new Date(iso);
  const next = new Date(d.getUTCFullYear(), d.getUTCMonth() + 1, 1);
  return next.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function manageSubscriptionUrl(platform: "ios" | "android" | "web" | null): string {
  if (platform === "ios") return "https://apps.apple.com/account/subscriptions";
  if (platform === "android") return "https://play.google.com/store/account/subscriptions";
  return "/portal";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SubscriptionStatus({ onUpgradeClick }: SubscriptionStatusProps) {
  const { user } = useAuth();

  const { data, isLoading, isError, refetch, isFetching } = useQuery<SubscriptionStatusData>({
    queryKey: ["/api/subscriptions/status", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      const res = await fetch(`/api/subscriptions/status/${user.id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch subscription status");
      return res.json();
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3 animate-pulse">
        <div className="h-4 w-28 bg-gray-100 rounded-full" />
        <div className="h-8 w-36 bg-gray-100 rounded-full" />
        <div className="h-2 w-full bg-gray-100 rounded-full" />
        <div className="h-4 w-48 bg-gray-100 rounded-full" />
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-700">Could not load subscription status</p>
          <button
            onClick={() => refetch()}
            className="mt-1.5 text-xs text-red-500 underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const { tier, status, platform, aiGenerationsUsedThisMonth, aiGenerationsRemaining, resetDate, subscriptionEndDate } = data;

  const isFree    = tier === "free";
  const isBase    = tier === "base";
  const isPremium = tier === "premium";
  const isCancelled = status === "cancelled";

  const used      = aiGenerationsUsedThisMonth;
  const limit     = 20;
  const progress  = isBase ? Math.min(100, (used / limit) * 100) : 0;
  const nearLimit = isBase && typeof aiGenerationsRemaining === "number" && aiGenerationsRemaining <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border p-5 space-y-4",
        isPremium
          ? "bg-gradient-to-br from-[#F8F0FF] to-white border-[#9B5DE5]/20"
          : isBase
          ? "bg-gradient-to-br from-[#FFF5F8] to-white border-[#FF6B9D]/20"
          : "bg-white border-gray-100"
      )}
    >
      {/* ── Header row ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isPremium ? (
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#9B5DE5] to-[#7c3acd]">
              <Crown className="h-4 w-4 text-white" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#e0528a]">
              <Zap className="h-4 w-4 text-white" />
            </div>
          )}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium leading-none mb-0.5">
              Current Plan
            </p>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-semibold text-gray-800 capitalize">
                {isPremium ? "Premium" : isBase ? "Base" : "Free"}
              </span>
              {isCancelled && (
                <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                  Cancelling
                </span>
              )}
              {status === "active" && (
                <span
                  className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide",
                    isPremium
                      ? "bg-[#9B5DE5]/10 text-[#9B5DE5]"
                      : "bg-[#FF6B9D]/10 text-[#FF6B9D]"
                  )}
                >
                  Active
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Refresh */}
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Refresh status"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
        </button>
      </div>

      {/* ── AI Generations quota ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 font-medium">AI Generations</span>
          {isPremium ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#9B5DE5]/10 text-[#9B5DE5] font-bold text-[10px] uppercase tracking-widest">
              <Crown className="h-2.5 w-2.5" />
              Unlimited
            </span>
          ) : isBase ? (
            <span className={cn("font-semibold", nearLimit ? "text-orange-500" : "text-gray-700")}>
              {used} / {limit} used
            </span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>

        {/* Progress bar — base only */}
        {isBase && (
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full",
                nearLimit
                  ? "bg-gradient-to-r from-orange-400 to-red-400"
                  : "bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5]"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        )}

        {/* Remaining / reset info */}
        {isBase && (
          <p className={cn("text-xs", nearLimit ? "text-orange-500 font-medium" : "text-gray-400")}>
            {typeof aiGenerationsRemaining === "number" && aiGenerationsRemaining === 0
              ? "Limit reached — resets " + formatResetDate(resetDate)
              : nearLimit
              ? `Only ${aiGenerationsRemaining} left — resets ${formatResetDate(resetDate)}`
              : `${aiGenerationsRemaining} remaining · resets ${formatResetDate(resetDate)}`}
          </p>
        )}

        {isFree && (
          <p className="text-xs text-gray-400">
            Subscribe to unlock AI design generation
          </p>
        )}
      </div>

      {/* ── Cancellation notice ── */}
      {isCancelled && subscriptionEndDate && (
        <div className="px-3 py-2.5 rounded-xl bg-orange-50 border border-orange-100">
          <p className="text-xs text-orange-700 font-medium">
            Access continues until{" "}
            {new Date(subscriptionEndDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Upgrade: free users or base users */}
        {(isFree || isBase) && !isCancelled && (
          <button
            onClick={onUpgradeClick}
            className={cn(
              "w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]",
              isBase
                ? "bg-gradient-to-r from-[#9B5DE5] to-[#7c3acd]"
                : "bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5]"
            )}
          >
            {isBase ? "Upgrade to Premium" : "Subscribe"}
          </button>
        )}

        {/* Manage subscription — for active paid users */}
        {!isFree && (
          <a
            href={manageSubscriptionUrl(platform)}
            target={platform && platform !== "web" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="w-full py-2 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
          >
            Manage Subscription
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}

        {/* Upgrade via Subscribe page */}
        {isFree && (
          <Link
            href="/subscribe"
            className="w-full py-2 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
          >
            View Plans
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
