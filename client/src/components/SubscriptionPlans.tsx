import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubscriptionTier = "free" | "base" | "premium";
export type Platform = "ios" | "android" | "web";

interface SubscriptionPlansProps {
  currentTier?: SubscriptionTier;
  loading?: boolean;
  onSubscribe: (tier: "base" | "premium") => void;
}

// ─── Plan data ────────────────────────────────────────────────────────────────

const PLANS = [
  {
    tier: "base" as const,
    name: "Base",
    price: "$8.99",
    period: "/month",
    tagline: "Everything you need to get started",
    color: "pink",
    gradient: "from-[#FF6B9D] to-[#e0528a]",
    gradientBg: "from-[#FFF5F8] to-white",
    accent: "#FF6B9D",
    border: "border-[#FF6B9D]/25",
    ring: "ring-[#FF6B9D]",
    icon: Zap,
    features: [
      "Full app access",
      "20 AI generations / month",
      "Save favorite designs (Fire Vault)",
      "Access to all tutorials",
      "Supply Hub browsing",
      "Seasonal Vault collections",
    ],
    buttonLabel: "Get Base",
    upgradeLabel: "Current Plan",
    popular: false,
  },
  {
    tier: "premium" as const,
    name: "Premium",
    price: "$19.99",
    period: "/month",
    tagline: "For serious nail artists who want it all",
    color: "purple",
    gradient: "from-[#9B5DE5] to-[#7c3acd]",
    gradientBg: "from-[#F8F0FF] to-white",
    accent: "#9B5DE5",
    border: "border-[#9B5DE5]/25",
    ring: "ring-[#9B5DE5]",
    icon: Crown,
    features: [
      "Everything in Base",
      "UNLIMITED AI generations",
      "Download your images (no watermark)",
      "Collaborative hub access",
      "Exclusive store discounts",
      "Priority support",
    ],
    buttonLabel: "Get Premium",
    upgradeLabel: "Upgrade to Premium",
    popular: true,
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function SubscriptionPlans({
  currentTier = "free",
  loading = false,
  onSubscribe,
}: SubscriptionPlansProps) {
  const [hoveredTier, setHoveredTier] = useState<"base" | "premium" | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {PLANS.map((plan, i) => {
          const isCurrent = currentTier === plan.tier;
          const isUpgrade =
            (currentTier === "base" && plan.tier === "premium") ||
            (currentTier === "free");
          const isHovered = hoveredTier === plan.tier;

          return (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onMouseEnter={() => setHoveredTier(plan.tier)}
              onMouseLeave={() => setHoveredTier(null)}
              className={cn(
                "relative rounded-2xl border transition-all duration-300",
                plan.border,
                isCurrent
                  ? `bg-gradient-to-b ${plan.gradientBg} ring-2 ${plan.ring}`
                  : `bg-white hover:shadow-xl hover:shadow-${plan.color}-100/40 hover:-translate-y-0.5`,
                plan.popular && !isCurrent && "shadow-lg"
              )}
            >
              {/* Most Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white bg-gradient-to-r ${plan.gradient} shadow-sm`}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={`p-2 rounded-xl bg-gradient-to-br ${plan.gradient}`}
                  >
                    <plan.icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-gray-800">
                    {plan.name}
                  </h3>
                  {isCurrent && (
                    <span
                      className="ml-auto text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{
                        background: `${plan.accent}18`,
                        color: plan.accent,
                      }}
                    >
                      Active
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mt-4 mb-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-400 font-medium">
                    {plan.period}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-5">{plan.tagline}</p>

                {/* CTA Button */}
                <button
                  onClick={() => !isCurrent && onSubscribe(plan.tier)}
                  disabled={isCurrent || loading}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                    isCurrent
                      ? "bg-gray-100 text-gray-400 cursor-default"
                      : `bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 hover:shadow-md active:scale-[0.98]`,
                    loading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {loading
                    ? "Processing..."
                    : isCurrent
                    ? plan.upgradeLabel
                    : currentTier !== "free" && plan.tier === "premium"
                    ? "Upgrade to Premium"
                    : plan.buttonLabel}
                </button>

                {/* Divider */}
                <div className="my-5 border-t border-gray-100" />

                {/* Feature list */}
                <ul className="space-y-2.5">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: `${plan.accent}18` }}
                      >
                        <Check
                          className="h-2.5 w-2.5"
                          style={{ color: plan.accent }}
                          strokeWidth={3}
                        />
                      </span>
                      <span
                        className={cn(
                          "text-sm leading-snug",
                          feat.startsWith("UNLIMITED")
                            ? "font-semibold text-gray-800"
                            : "text-gray-600"
                        )}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footnote */}
      <p className="mt-4 text-center text-xs text-gray-400">
        Billed monthly · Cancel anytime · Managed via App Store / Google Play
      </p>
    </div>
  );
}
