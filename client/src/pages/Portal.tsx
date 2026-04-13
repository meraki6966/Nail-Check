import { useEffect, useState } from "react";
import { Crown, Smartphone, Infinity, BarChart2, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const BASE_MONTHLY_LIMIT = 20;

interface SubStatus {
  tier: "free" | "base" | "premium";
  status: string;
  email?: string;
  aiGenerationsUsedThisMonth: number;
  aiGenerationsRemaining: number | "unlimited";
}

export default function Portal() {
  const { user } = useAuth();
  const [sub, setSub] = useState<SubStatus | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/subscriptions/status/${user.id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setSub(data))
      .catch(() => {});
  }, [user?.id]);

  const tier = sub?.tier ?? "free";
  const isPremium = tier === "premium";
  const isBase = tier === "base";
  const used = sub?.aiGenerationsUsedThisMonth ?? 0;
  const remaining = sub?.aiGenerationsRemaining ?? 0;

  const tierLabel = isPremium ? "Premium" : isBase ? "Base" : "Free";
  const tierPrice = isPremium ? "$19.99/mo" : isBase ? "$8.99/mo" : "Free";
  const tierColor = isPremium
    ? "from-[#9B5DE5] to-[#FF6B9D]"
    : isBase
    ? "from-[#FF6B9D] to-[#FF8A5B]"
    : "from-gray-400 to-gray-500";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <div className={cn(
          "inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br mb-4",
          tierColor
        )}>
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-sm text-muted-foreground">
          {user?.email ?? "Not signed in"}
        </p>
      </div>

      {/* Subscription tier card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Current Plan</p>
            <div className={cn(
              "inline-block px-4 py-1.5 rounded-full text-white text-sm font-bold bg-gradient-to-r",
              tierColor
            )}>
              {tierLabel} — {tierPrice}
            </div>
          </div>
          <ShieldCheck className={cn(
            "h-8 w-8",
            isPremium ? "text-[#9B5DE5]" : isBase ? "text-[#FF6B9D]" : "text-muted-foreground"
          )} />
        </div>

        {/* AI usage */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">AI Usage This Month</p>
          </div>

          {isPremium ? (
            <div className="flex items-center gap-2">
              <Infinity className="h-5 w-5 text-[#9B5DE5]" />
              <span className="text-lg font-bold text-[#9B5DE5]">Unlimited generations</span>
            </div>
          ) : isBase ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{used} used</span>
                <span className="font-medium">{remaining} remaining of {BASE_MONTHLY_LIMIT}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B] transition-all"
                  style={{ width: `${Math.min(100, (used / BASE_MONTHLY_LIMIT) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No AI access on Free plan.</p>
          )}
        </div>
      </div>

      {/* IAP notice */}
      <div className="rounded-2xl border border-border bg-muted/40 p-6 space-y-3 text-center">
        <Smartphone className="h-8 w-8 mx-auto text-muted-foreground" />
        <p className="font-semibold text-sm">Subscriptions are managed through the App Store or Google Play</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          To upgrade, downgrade, or cancel your subscription, please use the platform where you originally subscribed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90",
              "bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5]"
            )}
          >
            Manage on App Store
          </a>
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors border border-border hover:bg-accent"
            )}
          >
            Manage on Google Play
          </a>
        </div>
      </div>

      {/* Email */}
      {user?.email && (
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-3">
          <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">Account Email</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </div>
      )}

    </div>
  );
}
