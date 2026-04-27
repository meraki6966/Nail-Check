import { useMemo, useState } from "react";
import { COLOR_FAMILIES, ALL_NAMED_COLORS, nameForHex, type NamedColor } from "@/lib/colorPalette";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorWheelPickerProps {
  value?: string; // hex
  onChange: (color: NamedColor) => void;
  showHueWheel?: boolean;
  className?: string;
}

export function ColorWheelPicker({
  value,
  onChange,
  showHueWheel = true,
  className,
}: ColorWheelPickerProps) {
  const [activeFamily, setActiveFamily] = useState<string>(COLOR_FAMILIES[0].id);
  const [customHex, setCustomHex] = useState<string>(value ?? "#FF6B9D");

  const family = useMemo(
    () => COLOR_FAMILIES.find((f) => f.id === activeFamily) ?? COLOR_FAMILIES[0],
    [activeFamily]
  );

  const selectedHex = (value ?? customHex).toLowerCase();
  const selectedName = nameForHex(selectedHex) ?? "Custom";

  const handlePick = (c: NamedColor) => {
    setCustomHex(c.hex);
    onChange(c);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected preview */}
      <div
        className="flex items-center gap-4 rounded-2xl p-4 border-2 transition-all"
        style={{
          background: `linear-gradient(135deg, ${selectedHex}18, ${selectedHex}06)`,
          borderColor: `${selectedHex}55`,
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl shadow-lg ring-2 ring-white flex-shrink-0"
          style={{
            background: `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.5), ${selectedHex} 60%)`,
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[9px] uppercase tracking-widest text-gray-400">Selected color</p>
          <p className="text-xl font-bold truncate" style={{ color: selectedHex }}>
            {selectedName}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
            {selectedHex.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Family tabs */}
      <div className="flex flex-wrap gap-2">
        {COLOR_FAMILIES.map((f) => {
          const isActive = activeFamily === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFamily(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all hover-sparkle",
                isActive
                  ? "text-white shadow-md scale-105"
                  : "bg-white text-gray-600 hover:scale-105 border border-gray-200"
              )}
              style={isActive ? { background: f.accent } : undefined}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                style={{ background: f.accent }}
              />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Family swatch grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {family.colors.map((c) => {
          const isSelected = c.hex.toLowerCase() === selectedHex;
          return (
            <button
              key={c.hex}
              type="button"
              onClick={() => handlePick(c)}
              title={`${c.name} — ${c.hex}`}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden ring-2 transition-all hover:scale-110 active:scale-95 group",
                isSelected ? "ring-[#9B5DE5] scale-105 shadow-lg" : "ring-transparent hover:ring-gray-300"
              )}
              style={{
                background: `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.45), ${c.hex} 60%)`,
              }}
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Check className="h-5 w-5 text-white drop-shadow-lg" strokeWidth={3} />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 px-1 py-0.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[8px] uppercase tracking-wider font-bold text-white truncate text-center leading-tight">
                  {c.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-400 text-center">
        {ALL_NAMED_COLORS.length} curated shades · {COLOR_FAMILIES.length} families
      </p>

      {/* Hue wheel — free pick */}
      {showHueWheel && (
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">
            Or pick any color
          </p>
          <div className="flex items-center gap-3">
            <label
              htmlFor="hue-input"
              className="relative w-14 h-14 rounded-full flex-shrink-0 cursor-pointer ring-2 ring-white shadow-md hover:scale-110 transition-transform"
              style={{
                background:
                  "conic-gradient(from 0deg, #FF0000, #FF8800, #FFFF00, #88FF00, #00FF00, #00FF88, #00FFFF, #0088FF, #0000FF, #8800FF, #FF00FF, #FF0088, #FF0000)",
              }}
              title="Open color wheel"
            >
              <input
                id="hue-input"
                type="color"
                value={selectedHex}
                onChange={(e) => {
                  const hex = e.target.value;
                  setCustomHex(hex);
                  onChange({ name: nameForHex(hex) ?? "Custom", hex });
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="absolute inset-1.5 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-[18px]">
                🎨
              </span>
            </label>
            <input
              type="text"
              value={selectedHex.toUpperCase()}
              onChange={(e) => {
                const v = e.target.value.trim();
                if (/^#[0-9a-f]{6}$/i.test(v)) {
                  setCustomHex(v);
                  onChange({ name: nameForHex(v) ?? "Custom", hex: v });
                } else {
                  setCustomHex(v);
                }
              }}
              className="flex-1 font-mono text-sm uppercase tracking-wider px-3 py-2 rounded-lg border border-gray-200 focus:border-[#9B5DE5] focus:outline-none"
              placeholder="#FF6B9D"
            />
          </div>
        </div>
      )}
    </div>
  );
}
