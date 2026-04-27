import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<Size, { box: string; ring: string; dot: string }> = {
  sm: { box: "h-6 w-6", ring: "border-2", dot: "h-1 w-1" },
  md: { box: "h-10 w-10", ring: "border-[3px]", dot: "h-1.5 w-1.5" },
  lg: { box: "h-14 w-14", ring: "border-[3px]", dot: "h-2 w-2" },
  xl: { box: "h-20 w-20", ring: "border-4", dot: "h-2.5 w-2.5" },
};

interface BrandSpinnerProps {
  size?: Size;
  label?: string;
  className?: string;
}

/**
 * Branded loading spinner.
 * A conic gradient ring (pink → purple → cyan) with a soft glow.
 */
export function BrandSpinner({ size = "md", label, className }: BrandSpinnerProps) {
  const dims = SIZE_MAP[size];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className={cn("relative flex items-center justify-center", dims.box)}>
        {/* Soft outer glow */}
        <div className="absolute inset-0 rounded-full bg-brand-gradient blur-md opacity-40 animate-glow-pulse-pink" />
        {/* Spinning gradient ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full animate-spin-slow",
            dims.ring,
          )}
          style={{
            borderColor: "transparent",
            backgroundImage:
              "conic-gradient(from 0deg, var(--brand-pink), var(--brand-purple), var(--brand-cyan), var(--brand-pink))",
            WebkitMask:
              "radial-gradient(circle, transparent 55%, black 56%)",
            mask: "radial-gradient(circle, transparent 55%, black 56%)",
          }}
        />
        {/* Center dot */}
        <span className={cn("rounded-full bg-brand-gradient", dims.dot)} />
      </div>
      {label && (
        <p className="text-xs uppercase tracking-widest text-brand-gradient font-semibold">
          {label}
        </p>
      )}
    </div>
  );
}

/** Full-section loader (centered in a 50vh box). */
export function BrandSpinnerFull({ label }: { label?: string }) {
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <BrandSpinner size="xl" label={label} />
    </div>
  );
}
