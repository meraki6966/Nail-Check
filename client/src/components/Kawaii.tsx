// Inline-SVG kawaii / anime-style mascot characters.
// Self-contained, no external assets. Customize via color and pose props.

import { cn } from "@/lib/utils";

type Pose = "wave" | "sparkle" | "celebrate" | "polish";

interface KawaiiPolishProps {
  pose?: Pose;
  color?: string; // body color
  size?: number;
  className?: string;
}

/** Anthropomorphic nail polish bottle with kawaii face. */
export function KawaiiPolish({
  pose = "wave",
  color = "#FF6B9D",
  size = 140,
  className,
}: KawaiiPolishProps) {
  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      className={cn("inline-block", className)}
      aria-hidden="true"
    >
      {/* Floating sparkles */}
      {(pose === "sparkle" || pose === "celebrate") && (
        <g className="animate-sparkle" style={{ transformOrigin: "center" }}>
          <text x="20" y="40" fontSize="22" fill="#FFD700">✦</text>
          <text x="160" y="50" fontSize="18" fill="#FF6B9D">✧</text>
          <text x="170" y="180" fontSize="22" fill="#9B5DE5">✦</text>
          <text x="14" y="190" fontSize="18" fill="#00D9FF">✧</text>
        </g>
      )}

      {/* Hearts on celebrate */}
      {pose === "celebrate" && (
        <g>
          <text x="40" y="80" fontSize="18" fill="#FF6B9D" className="animate-bounce-soft">♡</text>
          <text x="155" y="90" fontSize="16" fill="#9B5DE5" className="animate-bounce-soft" style={{ animationDelay: "0.3s" }}>♡</text>
        </g>
      )}

      {/* Cap (top) */}
      <rect x="76" y="32" width="48" height="34" rx="6" fill="#2A2A2A" />
      <rect x="80" y="40" width="40" height="6" rx="2" fill="#444" />
      <rect x="80" y="52" width="40" height="6" rx="2" fill="#444" />

      {/* Brush stick (visible only when polishing) */}
      {pose === "polish" && (
        <g>
          <rect x="96" y="6" width="8" height="28" fill="#2A2A2A" />
          <ellipse cx="100" cy="2" rx="5" ry="3" fill={color} />
        </g>
      )}

      {/* Bottle body */}
      <g>
        {/* Shadow */}
        <ellipse cx="100" cy="220" rx="55" ry="6" fill="#000" opacity="0.12" />

        {/* Body shape */}
        <path
          d="M60 80 Q60 70 70 70 L130 70 Q140 70 140 80 L140 200 Q140 215 125 215 L75 215 Q60 215 60 200 Z"
          fill={color}
        />
        {/* Glossy highlight */}
        <path
          d="M70 90 Q66 100 70 130 L80 130 Q76 100 80 90 Z"
          fill="white"
          opacity="0.45"
        />

        {/* Liquid inside (slightly darker) */}
        <path
          d="M65 110 Q65 108 70 108 L130 108 Q135 108 135 110 L135 200 Q135 210 125 210 L75 210 Q65 210 65 200 Z"
          fill="black"
          opacity="0.08"
        />

        {/* Cute face */}
        <g>
          {/* Eyes */}
          <ellipse cx="85" cy="148" rx="6" ry="8" fill="#1A1A1A" />
          <ellipse cx="115" cy="148" rx="6" ry="8" fill="#1A1A1A" />
          {/* Eye shines */}
          <circle cx="87" cy="145" r="2" fill="white" />
          <circle cx="117" cy="145" r="2" fill="white" />
          {/* Blush */}
          <ellipse cx="76" cy="165" rx="6" ry="3" fill="#FF6B9D" opacity="0.55" />
          <ellipse cx="124" cy="165" rx="6" ry="3" fill="#FF6B9D" opacity="0.55" />
          {/* Mouth */}
          {pose === "celebrate" ? (
            <path d="M92 168 Q100 178 108 168" stroke="#1A1A1A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          ) : pose === "polish" ? (
            <path d="M95 170 Q100 174 105 170" stroke="#1A1A1A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M93 168 Q100 174 107 168" stroke="#1A1A1A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          )}
        </g>

        {/* Label */}
        <rect x="68" y="180" width="64" height="20" rx="3" fill="white" opacity="0.85" />
        <text
          x="100"
          y="194"
          textAnchor="middle"
          fontSize="9"
          fontFamily="Syne, Arial Black, sans-serif"
          fontWeight="900"
          letterSpacing="2"
          fill={color}
        >
          NAIL CHECK
        </text>
      </g>

      {/* Waving arm */}
      {pose === "wave" && (
        <g
          style={{
            transformOrigin: "60px 130px",
            animation: "wiggle 1.4s ease-in-out infinite",
          }}
        >
          <rect x="38" y="118" width="20" height="8" rx="4" fill={color} />
          <circle cx="36" cy="122" r="9" fill={color} />
          <circle cx="34" cy="120" r="3" fill="white" opacity="0.5" />
        </g>
      )}

      {pose === "celebrate" && (
        <>
          <g style={{ transformOrigin: "60px 110px" }}>
            <rect x="40" y="100" width="22" height="8" rx="4" fill={color} transform="rotate(-25 51 104)" />
            <circle cx="34" cy="86" r="9" fill={color} />
          </g>
          <g style={{ transformOrigin: "140px 110px" }}>
            <rect x="138" y="100" width="22" height="8" rx="4" fill={color} transform="rotate(25 149 104)" />
            <circle cx="166" cy="86" r="9" fill={color} />
          </g>
        </>
      )}
    </svg>
  );
}

interface KawaiiHandProps {
  nailColor?: string;
  size?: number;
  className?: string;
}

/** Cute manicured hand — abstract chibi pose. */
export function KawaiiHand({ nailColor = "#FF6B9D", size = 140, className }: KawaiiHandProps) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={cn("inline-block", className)} aria-hidden="true">
      {/* Sparkles */}
      <g className="animate-sparkle">
        <text x="20" y="30" fontSize="20" fill="#FFD700">✦</text>
        <text x="160" y="40" fontSize="16" fill="#9B5DE5">✧</text>
        <text x="170" y="160" fontSize="20" fill="#00D9FF">✦</text>
      </g>

      {/* Wrist */}
      <rect x="60" y="135" width="80" height="55" rx="14" fill="#FFD3B5" />
      <rect x="60" y="180" width="80" height="10" rx="5" fill="#9B5DE5" opacity="0.9" />

      {/* Palm */}
      <path
        d="M55 80 Q55 65 70 65 L130 65 Q145 65 145 80 L145 145 Q145 160 130 160 L70 160 Q55 160 55 145 Z"
        fill="#FFD3B5"
      />

      {/* Fingers */}
      {[
        { x: 60, y: 25, w: 14, h: 50 },
        { x: 80, y: 12, w: 14, h: 60 },
        { x: 100, y: 8, w: 14, h: 64 },
        { x: 120, y: 18, w: 14, h: 55 },
      ].map((f, i) => (
        <g key={i}>
          <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="7" fill="#FFD3B5" />
          {/* Nail */}
          <ellipse cx={f.x + f.w / 2} cy={f.y + 6} rx={f.w / 2 - 1} ry="6" fill={nailColor} />
          <ellipse cx={f.x + f.w / 2} cy={f.y + 4} rx="2" ry="2" fill="white" opacity="0.65" />
        </g>
      ))}

      {/* Thumb */}
      <g>
        <rect x="138" y="50" width="14" height="46" rx="7" fill="#FFD3B5" transform="rotate(20 145 73)" />
        <ellipse cx="159" cy="44" rx="6" ry="6" fill={nailColor} transform="rotate(20 159 44)" />
      </g>

      {/* Heart sticker on palm */}
      <text x="100" y="118" fontSize="24" fill="#FF6B9D" textAnchor="middle">♡</text>
    </svg>
  );
}

interface SpeechBubbleProps {
  children: React.ReactNode;
  side?: "left" | "right";
  variant?: "pink" | "purple" | "cyan";
  className?: string;
}

/** Manga-style speech bubble with a tail. */
export function SpeechBubble({
  children,
  side = "right",
  variant = "pink",
  className,
}: SpeechBubbleProps) {
  const bg =
    variant === "pink"   ? "from-[#FFF0F5] to-[#FFE4EC]"
    : variant === "purple" ? "from-[#F8F0FF] to-[#EFE6FF]"
    :                       "from-[#F0FBFF] to-[#E0F7FF]";
  const border =
    variant === "pink" ? "border-[#FF6B9D]" : variant === "purple" ? "border-[#9B5DE5]" : "border-[#00D9FF]";

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        className={cn(
          "relative px-4 py-3 rounded-2xl border-2 bg-gradient-to-br shadow-md",
          bg,
          border
        )}
      >
        {children}
        {/* Tail */}
        <div
          className={cn(
            "absolute w-4 h-4 rotate-45 border-2 bg-gradient-to-br",
            bg,
            border,
            side === "left"
              ? "-left-2 bottom-4 border-r-0 border-t-0"
              : "-right-2 bottom-4 border-l-0 border-b-0"
          )}
        />
      </div>
    </div>
  );
}
