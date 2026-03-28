import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Sparkles, Shield, CheckCircle2, XCircle, Loader2, ArrowLeft, Crown, Infinity,
} from "lucide-react";
import { SubscriptionPlans, type SubscriptionTier } from "@/components/SubscriptionPlans";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

// ─── Platform detection ───────────────────────────────────────────────────────

type Platform = "ios" | "android" | "web";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "web";
}

// ─── Native IAP bridge stubs ──────────────────────────────────────────────────
// These call the native iOS/Android WebView bridge when available.
// On web, they return a stub receipt for backend stub validation.

interface NativePurchaseResult {
  receipt: string;
  transactionId: string;
  productId: string;
}

async function triggerNativePurchase(
  tier: "base" | "premium",
  platform: Platform
): Promise<NativePurchaseResult> {
  const productIds: Record<Platform, Record<"base" | "premium", string>> = {
    ios: {
      base:    "com.nailcheck.base.monthly",
      premium: "com.nailcheck.premium.monthly",
    },
    android: {
      base:    "nail_check_base_monthly",
      premium: "nail_check_premium_monthly",
    },
    web: {
      base:    "web_base_monthly",
      premium: "web_premium_monthly",
    },
  };

  const productId = productIds[platform][tier];

  // iOS WebView bridge
  if (platform === "ios" && (window as any).webkit?.messageHandlers?.purchase) {
    return new Promise((resolve, reject) => {
      (window as any)._purchaseCallback = (result: NativePurchaseResult) => resolve(result);
      (window as any)._purchaseError   = (err: string) => reject(new Error(err));
      (window as any).webkit.messageHandlers.purchase.postMessage({ productId, tier });
    });
  }

  // Android WebView bridge
  if (platform === "android" && (window as any).Android?.purchase) {
    return new Promise((resolve, reject) => {
      (window as any)._purchaseCallback = (result: NativePurchaseResult) => resolve(result);
      (window as any)._purchaseError   = (err: string) => reject(new Error(err));
      (window as any).Android.purchase(productId, tier);
    });
  }

  // Web fallback — stub receipt for testing; production only serves iOS/Android builds
  return {
    receipt:       `web_stub_receipt_${Date.now()}`,
    transactionId: `web_txn_${Date.now()}`,
    productId,
  };
}

// ─── API call ─────────────────────────────────────────────────────────────────

async function validatePurchase(payload: {
  platform: Platform;
  receipt: string;
  transactionId: string;
  productId: string;
}) {
  const res = await fetch("/api/subscriptions/validate-purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message ?? "Purchase validation failed");
  }
  return data;
}

// ─── Status types ─────────────────────────────────────────────────────────────

type FlowState =
  | { type: "idle" }
  | { type: "purchasing"; tier: "base" | "premium" }
  | { type: "validating" }
  | { type: "success"; tier: "base" | "premium" }
  | { type: "error"; message: string; tier: "base" | "premium" };

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel at any time through your App Store or Google Play subscription settings. You retain access until the end of your billing period.",
  },
  {
    q: "How does the 20/month limit work for Base?",
    a: "Your AI generation counter resets on the 1st of each calendar month. Unused generations do not roll over.",
  },
  {
    q: "Is my payment information secure?",
    a: "All billing is handled entirely by Apple App Store or Google Play. We never see your card number, billing address, or payment credentials.",
  },
  {
    q: "Can I switch from Base to Premium?",
    a: "Yes — tap 'Upgrade to Premium' on your Account page at any time. You'll only be charged the difference.",
  },
];

// ─── Page component ───────────────────────────────────────────────────────────

export default function Subscribe() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const platform = detectPlatform();

  const [flowState, setFlowState] = useState<FlowState>({ type: "idle" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Fetch current subscription tier to pass to SubscriptionPlans
  const { data: statusData } = useQuery<{ tier: SubscriptionTier }>({
    queryKey: ["/api/subscriptions/status", user?.id],
    queryFn: async () => {
      if (!user?.id) return { tier: "free" as SubscriptionTier };
      const res = await fetch(`/api/subscriptions/status/${user.id}`, {
        credentials: "include",
      });
      if (!res.ok) return { tier: "free" as SubscriptionTier };
      return res.json();
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  });

  const currentTier: SubscriptionTier = statusData?.tier ?? "free";
  const isLoading = flowState.type === "purchasing" || flowState.type === "validating";

  const handleSubscribe = useCallback(
    async (tier: "base" | "premium") => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // Step 1: trigger native purchase sheet
        setFlowState({ type: "purchasing", tier });
        const purchaseResult = await triggerNativePurchase(tier, platform);

        // Step 2: validate receipt with backend
        setFlowState({ type: "validating" });
        await validatePurchase({
          platform,
          receipt:       purchaseResult.receipt,
          transactionId: purchaseResult.transactionId,
          productId:     purchaseResult.productId,
        });

        // Step 3: invalidate cached subscription status so components refresh
        queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/status", user.id] });
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });

        setFlowState({ type: "success", tier });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        const lastTier = flowState.type === "purchasing" || flowState.type === "validating"
          ? (flowState as any).tier ?? tier
          : tier;
        setFlowState({ type: "error", message, tier: lastTier });
      }
    },
    [user, platform, navigate, queryClient, flowState]
  );

  const handleRetry = () => {
    const tier = (flowState as { tier?: "base" | "premium" }).tier ?? "base";
    setFlowState({ type: "idle" });
    handleSubscribe(tier);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (flowState.type === "success") {
    const tier = flowState.tier;
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F0FF] to-white flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="space-y-5 max-w-sm"
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#9B5DE5] to-[#FF6B9D] flex items-center justify-center shadow-xl shadow-purple-200">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-serif uppercase tracking-widest bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] bg-clip-text text-transparent">
            You're in!
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {tier === "premium"
              ? "Welcome to Premium. Your AI generations are now unlimited — go create something stunning."
              : "Welcome to Base. You have 20 AI generations to use this month."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Open Design Lab
          </button>
          <button
            onClick={() => navigate("/portal")}
            className="w-full py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            View Account
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-b from-[#FFF5F8] via-[#F8F0FF] to-white px-4 py-16 overflow-hidden">
        <div className="absolute top-8 left-10 w-64 h-64 bg-[#FF6B9D]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-8 right-10 w-72 h-72 bg-[#9B5DE5]/8 rounded-full blur-3xl" />

        {/* Back link */}
        <div className="max-w-3xl mx-auto mb-6 relative z-10">
          <button
            onClick={() => navigate(-1 as any)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#FF6B9D]" />
              <span className="text-[10px] tracking-[0.8em] text-[#9B5DE5] uppercase font-medium">
                Membership
              </span>
              <Sparkles className="h-4 w-4 text-[#FF6B9D]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">
              Unlock AI-powered nail design generation, curated tutorials, and exclusive
              content — on one beautiful platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Loading/error overlays ── */}
      {(flowState.type === "purchasing" || flowState.type === "validating") && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 text-[#9B5DE5] animate-spin" />
          <p className="text-gray-700 font-medium">
            {flowState.type === "purchasing"
              ? "Opening payment sheet…"
              : "Activating your subscription…"}
          </p>
        </div>
      )}

      {flowState.type === "error" && (
        <div className="max-w-md mx-auto px-4 mb-2">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">Purchase failed</p>
              <p className="text-xs text-red-500 mt-0.5">{flowState.message}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleRetry}
                  className="text-xs font-bold text-red-600 underline underline-offset-2"
                >
                  Try again
                </button>
                <button
                  onClick={() => setFlowState({ type: "idle" })}
                  className="text-xs text-red-400 underline underline-offset-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Plans ── */}
      <section className="py-10 px-4">
        {currentTier === "premium" ? (
          /* Premium users: you're all set */
          <div className="max-w-md mx-auto text-center py-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#9B5DE5] to-[#7c3acd] flex items-center justify-center shadow-xl shadow-purple-200 mb-6">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-serif uppercase tracking-widest bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] bg-clip-text text-transparent mb-3">
              You're on Premium
            </h2>
            <p className="text-gray-500 mb-2">
              Unlimited AI generations ∞ — go create something stunning.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9B5DE5]/10 border border-[#9B5DE5]/20 mt-2">
              <span className="text-sm font-bold text-[#9B5DE5] uppercase tracking-widest">Unlimited AI ∞</span>
            </div>
          </div>
        ) : currentTier === "base" ? (
          /* Base users: show single upgrade card */
          <div className="max-w-sm mx-auto">
            <p className="text-center text-sm text-gray-500 mb-6">
              You're on <span className="font-semibold text-[#FF6B9D]">Base</span>. Upgrade to unlock unlimited AI generations.
            </p>
            <div className="relative rounded-2xl border border-[#9B5DE5]/25 bg-gradient-to-b from-[#F8F0FF] to-white shadow-lg p-6 text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white bg-gradient-to-r from-[#9B5DE5] to-[#7c3acd] shadow-sm">
                  <Sparkles className="h-2.5 w-2.5" />
                  Recommended
                </div>
              </div>
              <div className="flex items-center justify-center gap-2.5 mb-4 mt-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#9B5DE5] to-[#7c3acd]">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-gray-800">Upgrade to Premium</h3>
              </div>
              <div className="mb-1">
                <span className="text-4xl font-bold text-gray-900">$19.99</span>
                <span className="text-sm text-gray-400 font-medium">/month</span>
              </div>
              <p className="text-xs text-[#9B5DE5] font-semibold mb-5">Just $11/month more than your current plan</p>
              <ul className="space-y-2.5 text-left mb-6">
                {[
                  "UNLIMITED AI generations",
                  "Download without watermark",
                  "Collaborative hub access",
                  "Exclusive store discounts",
                  "Priority support",
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center bg-[#9B5DE5]/15">
                      <CheckCircle2 className="h-2.5 w-2.5 text-[#9B5DE5]" strokeWidth={3} />
                    </span>
                    <span className={`text-sm leading-snug ${feat.startsWith("UNLIMITED") ? "font-semibold text-gray-800" : "text-gray-600"}`}>{feat}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe("premium")}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#9B5DE5] to-[#7c3acd] text-white hover:opacity-90 hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Upgrade to Premium →"}
              </button>
            </div>
          </div>
        ) : (
          /* Not logged in or free tier: show both plans */
          <SubscriptionPlans
            currentTier={currentTier}
            loading={isLoading}
            onSubscribe={handleSubscribe}
          />
        )}
      </section>

      {/* ── Trust signals ── */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Shield, label: "Secure payments", sub: "Apple & Google handle all billing" },
            { icon: CheckCircle2, label: "Cancel anytime", sub: "No lock-ins, no hidden fees" },
            { icon: Sparkles, label: "Instant access", sub: "Activates immediately after purchase" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50">
              <Icon className="h-5 w-5 text-[#9B5DE5] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-10 px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif uppercase tracking-widest text-center text-gray-700 mb-6">
            FAQ
          </h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-800">{faq.q}</span>
                  <span
                    className={cn(
                      "ml-3 flex-shrink-0 text-gray-400 transition-transform duration-200",
                      openFaq === i && "rotate-45"
                    )}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
