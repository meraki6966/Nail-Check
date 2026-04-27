import { ColorSwatch } from "@/components/ColorSwatch";
import { ALL_TEXTURES, type Texture } from "@/lib/colorFromProduct";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TextureSelectorProps {
  value: Texture;
  onChange: (texture: Texture) => void;
  previewHex?: string; // base color used for the texture previews
  className?: string;
}

const TEXTURE_META: Record<Texture, { label: string; emoji: string; tagline: string }> = {
  glossy:  { label: "Glossy",  emoji: "✨", tagline: "Mirror-shine, classic" },
  matte:   { label: "Matte",   emoji: "🌫️", tagline: "Flat, no reflection" },
  shimmer: { label: "Shimmer", emoji: "✦", tagline: "Fine sparkle dust" },
  chrome:  { label: "Chrome",  emoji: "🪞", tagline: "Liquid metallic" },
  glitter: { label: "Glitter", emoji: "🎇", tagline: "Chunky sparkles" },
  pearl:   { label: "Pearl",   emoji: "🐚", tagline: "Iridescent shift" },
  satin:   { label: "Satin",   emoji: "🧵", tagline: "Soft brushed sheen" },
};

export function TextureSelector({
  value,
  onChange,
  previewHex = "#FF6B9D",
  className,
}: TextureSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {ALL_TEXTURES.map((t) => {
          const meta = TEXTURE_META[t];
          const isSelected = value === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={cn(
                "relative rounded-2xl overflow-hidden transition-all hover-sparkle",
                "border-2",
                isSelected
                  ? "border-[#9B5DE5] scale-[1.04] shadow-lg shadow-[#9B5DE5]/20"
                  : "border-gray-200 hover:border-[#9B5DE5]/50 hover:scale-[1.03]"
              )}
            >
              {/* Live texture preview */}
              <div className="aspect-square relative">
                <ColorSwatch hex={previewHex} texture={t} showLabel={false} />
                {isSelected && (
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#9B5DE5]" strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Label */}
              <div
                className={cn(
                  "px-2 py-2 text-center transition-colors",
                  isSelected ? "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] text-white" : "bg-white"
                )}
              >
                <p className={cn("text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1", !isSelected && "text-gray-700")}>
                  <span>{meta.emoji}</span>
                  <span>{meta.label}</span>
                </p>
                <p className={cn("text-[9px] mt-0.5 truncate", isSelected ? "text-white/90" : "text-gray-400")}>
                  {meta.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
