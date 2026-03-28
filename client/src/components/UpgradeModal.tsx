import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Check, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user clicks "Upgrade Now" — navigate to /subscribe or open payment */
  onUpgrade: () => void;
  /** How many generations are left (0 when limit is hit) */
  generationsRemaining?: number;
}

// ─── Premium benefits shown in the modal ─────────────────────────────────────

const PREMIUM_BENEFITS = [
  { icon: Zap,      label: "Unlimited AI generations — no monthly cap" },
  { icon: Crown,    label: "Download images without watermark" },
  { icon: Sparkles, label: "Collaborative hub access" },
  { icon: Check,    label: "Exclusive store discounts" },
  { icon: Check,    label: "Priority support" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function UpgradeModal({
  isOpen,
  onClose,
  onUpgrade,
  generationsRemaining = 0,
}: UpgradeModalProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const limitHit = generationsRemaining === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Upgrade to Premium"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

              {/* ── Gradient hero ── */}
              <div className="relative bg-gradient-to-br from-[#9B5DE5] via-[#b87ee8] to-[#FF6B9D] px-6 pt-8 pb-10 text-white text-center overflow-hidden">
                {/* Background sparkle blobs */}
                <div className="absolute top-2 left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-2 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-white" />
                </button>

                {/* Icon */}
                <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Crown className="h-7 w-7 text-white" />
                </div>

                {/* Headline */}
                {limitHit ? (
                  <>
                    <h2 className="text-2xl font-serif uppercase tracking-wide mb-1">
                      You've hit your limit
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                      You've used all 20 AI generations this month.
                      Upgrade to Premium for unlimited creations.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-serif uppercase tracking-wide mb-1">
                      Upgrade to Premium
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {generationsRemaining === 1
                        ? "Only 1 generation left this month."
                        : `Only ${generationsRemaining} generations left this month.`}{" "}
                      Go unlimited with Premium.
                    </p>
                  </>
                )}

                {/* Price callout */}
                <div className="mt-4 inline-flex items-baseline gap-1 bg-white/20 px-4 py-2 rounded-2xl">
                  <span className="text-3xl font-bold">$19.99</span>
                  <span className="text-sm text-white/80">/month</span>
                </div>
              </div>

              {/* ── Benefits list ── */}
              <div className="px-6 pt-5 pb-2 space-y-2.5">
                {PREMIUM_BENEFITS.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9B5DE5]/10 flex items-center justify-center">
                      <Icon className="h-3 w-3 text-[#9B5DE5]" strokeWidth={2.5} />
                    </span>
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                ))}
              </div>

              {/* ── Actions ── */}
              <div className="px-6 pb-6 pt-4 space-y-2">
                <button
                  onClick={onUpgrade}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Upgrade Now
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {limitHit ? "Wait until next month" : "Not now"}
                </button>
              </div>

              {/* ── Fine print ── */}
              <p className="text-center text-[10px] text-gray-300 pb-4">
                Managed via App Store · Google Play · Cancel anytime
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
