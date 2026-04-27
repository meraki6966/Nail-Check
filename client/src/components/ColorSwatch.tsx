import { cn } from "@/lib/utils";
import type { Texture } from "@/lib/colorFromProduct";

interface ColorSwatchProps {
  hex: string;
  texture: Texture;
  label?: string;
  size?: "card" | "modal";
  showLabel?: boolean;
  className?: string;
}

const TEXTURE_LABEL: Record<Texture, string> = {
  glossy: "Glossy",
  matte: "Matte",
  shimmer: "Shimmer",
  chrome: "Chrome",
};

export function ColorSwatch({
  hex,
  texture,
  label,
  size = "card",
  showLabel = true,
  className,
}: ColorSwatchProps) {
  const isModal = size === "modal";

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden flex items-end justify-center",
        className
      )}
      style={{ backgroundColor: hex }}
    >
      {/* Base color body */}
      <div
        className="absolute inset-0"
        style={{
          background: hex,
        }}
      />

      {/* Texture overlay */}
      <TextureOverlay texture={texture} hex={hex} />

      {/* Texture chip — top-right */}
      <span
        className={cn(
          "absolute top-2 right-2 px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold rounded-full backdrop-blur-sm",
          isModal && "top-3 right-3 px-3 py-1 text-[9px]"
        )}
        style={{
          background: "rgba(255,255,255,0.85)",
          color: hex,
          textShadow: "0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        {TEXTURE_LABEL[texture]}
      </span>

      {/* Color name + hex label — bottom */}
      {showLabel && label && (
        <div
          className={cn(
            "relative z-10 w-full px-3 pb-3 pt-8 bg-gradient-to-t from-black/55 via-black/25 to-transparent",
            isModal && "px-5 pb-5 pt-12"
          )}
        >
          <p
            className={cn(
              "font-serif font-bold text-white drop-shadow-lg leading-tight",
              isModal ? "text-2xl md:text-3xl" : "text-base"
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "uppercase tracking-widest text-white/80 mt-0.5",
              isModal ? "text-[10px]" : "text-[8px]"
            )}
          >
            {hex.toUpperCase()}
          </p>
        </div>
      )}
    </div>
  );
}

function TextureOverlay({ texture, hex }: { texture: Texture; hex: string }) {
  if (texture === "matte") {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.18))`,
          mixBlendMode: "multiply",
        }}
      />
    );
  }

  if (texture === "chrome") {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.85) 0%, ${hex}66 25%, ${hex} 50%, rgba(0,0,0,0.4) 75%, rgba(255,255,255,0.6) 100%)`,
            mixBlendMode: "screen",
            opacity: 0.75,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)`,
          }}
        />
      </div>
    );
  }

  if (texture === "shimmer") {
    // Glittery dot pattern + soft sheen
    const dot = encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'><g fill='white' opacity='0.85'><circle cx='8' cy='10' r='1.2'/><circle cx='22' cy='34' r='0.9'/><circle cx='44' cy='12' r='1.4'/><circle cx='52' cy='48' r='1'/><circle cx='14' cy='52' r='1.1'/><circle cx='36' cy='26' r='0.8'/><circle cx='28' cy='6' r='0.7'/><circle cx='50' cy='30' r='0.9'/></g></svg>`
    );
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, rgba(255,255,255,0.45) 0%, transparent 45%, rgba(255,255,255,0.25) 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,${dot}")`,
            backgroundSize: "60px 60px",
            mixBlendMode: "screen",
            opacity: 0.9,
          }}
        />
      </div>
    );
  }

  // glossy — radial highlight + bottom shade
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.55) 0%, transparent 45%), linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.22) 100%)",
      }}
    />
  );
}
