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
  glitter: "Glitter",
  pearl: "Pearl",
  satin: "Satin",
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
    // Fine sparkle dust + soft sheen
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

  if (texture === "glitter") {
    // Chunky multi-color glitter flakes
    const flakes = encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><g><polygon points='10,12 14,8 18,14 12,18' fill='white' opacity='0.95'/><polygon points='40,30 46,28 48,34 42,36' fill='gold' opacity='0.9'/><polygon points='62,10 66,8 70,14 64,16' fill='white' opacity='0.85'/><polygon points='22,52 26,48 30,54 24,58' fill='silver' opacity='0.8'/><polygon points='54,60 60,58 62,64 56,66' fill='white' opacity='0.95'/><polygon points='6,68 10,66 14,72 8,74' fill='gold' opacity='0.85'/><polygon points='70,40 74,38 76,44 72,46' fill='white' opacity='0.9'/><polygon points='34,8 38,6 40,12 36,14' fill='silver' opacity='0.75'/></g></svg>`
    );
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(150deg, rgba(255,255,255,0.35) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,${flakes}")`,
            backgroundSize: "80px 80px",
            mixBlendMode: "screen",
            opacity: 1,
          }}
        />
      </div>
    );
  }

  if (texture === "pearl") {
    // Iridescent shifting sheen — rainbow gradient + soft glow
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,200,220,0.45) 0%, rgba(200,220,255,0.45) 25%, rgba(220,255,220,0.45) 50%, rgba(255,255,200,0.45) 75%, rgba(255,200,220,0.45) 100%)",
            mixBlendMode: "screen",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.55) 0%, transparent 50%)",
          }}
        />
      </div>
    );
  }

  if (texture === "satin") {
    // Soft brushed silk — gentle horizontal sheen, lower contrast than glossy
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.12) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 4px)",
        }}
      />
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
