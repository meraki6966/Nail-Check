// Derives a hex color, finish texture, and display label from a supply product's
// name / description / tags. Used by the Supply Suite to render real color
// swatches for the "Color" category instead of stock photos.

export type Texture = "glossy" | "matte" | "shimmer" | "chrome";

interface ColorMatch {
  match: RegExp;
  hex: string;
}

// Ordered most-specific → least-specific so "rose gold" wins over "rose".
const COLOR_TABLE: ColorMatch[] = [
  { match: /\brose ?gold\b/i, hex: "#E0BFB8" },
  { match: /\bhot pink|fuchsia|magenta\b/i, hex: "#E91E63" },
  { match: /\bbaby pink|pastel pink|soft pink|blush\b/i, hex: "#FFC1CC" },
  { match: /\bcoral|salmon|peach\b/i, hex: "#FF8A5B" },
  { match: /\bsunset\b/i, hex: "#FF7E5F" },
  { match: /\bpink\b/i, hex: "#FF6B9D" },
  { match: /\bred|crimson|cherry|ruby\b/i, hex: "#DC2626" },
  { match: /\bburgundy|wine|merlot\b/i, hex: "#7C1D2C" },
  { match: /\borange|tangerine|apricot\b/i, hex: "#FB923C" },
  { match: /\byellow|lemon|gold(?!en)\b/i, hex: "#FBBF24" },
  { match: /\bgolden\b/i, hex: "#D4AF37" },
  { match: /\blime|chartreuse\b/i, hex: "#A3E635" },
  { match: /\bmint|seafoam\b/i, hex: "#6EE7B7" },
  { match: /\bgreen|emerald|jade\b/i, hex: "#10B981" },
  { match: /\bteal\b/i, hex: "#14B8A6" },
  { match: /\bocean|aqua|turquoise|cyan\b/i, hex: "#00D9FF" },
  { match: /\bsky|baby blue|powder blue\b/i, hex: "#7DD3FC" },
  { match: /\bnavy|midnight\b/i, hex: "#1E3A8A" },
  { match: /\bblue|sapphire|cobalt\b/i, hex: "#3B82F6" },
  { match: /\bperiwinkle\b/i, hex: "#9FA8DA" },
  { match: /\blavender|lilac\b/i, hex: "#C4B5FD" },
  { match: /\bviolet|purple|amethyst|plum\b/i, hex: "#9B5DE5" },
  { match: /\beggplant|aubergine\b/i, hex: "#5B2C6F" },
  { match: /\bmocha|espresso|coffee\b/i, hex: "#6B4423" },
  { match: /\bchocolate|cocoa|brown\b/i, hex: "#7B3F00" },
  { match: /\btaupe|mushroom\b/i, hex: "#8B7D6B" },
  { match: /\bnude|beige|sand|cream\b/i, hex: "#E8C9A0" },
  { match: /\bivory|champagne|pearl\b/i, hex: "#F1E4D4" },
  { match: /\bsilver|platinum\b/i, hex: "#C0C0C0" },
  { match: /\bgrey|gray|charcoal|smoke\b/i, hex: "#6B7280" },
  { match: /\bblack|onyx|jet|noir\b/i, hex: "#1A1A1A" },
  { match: /\bwhite|snow|ivory\b/i, hex: "#F5F5F5" },
  { match: /\bclear|crystal|transparent\b/i, hex: "#E5E7EB" },
];

// Fallback palette for products whose name doesn't match any color word.
const FALLBACK_PALETTE = [
  "#FF6B9D", "#9B5DE5", "#00D9FF", "#FF8A5B", "#10B981",
  "#FBBF24", "#E91E63", "#3B82F6", "#D4AF37", "#7C3AED",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function colorFromText(text: string): string {
  for (const { match, hex } of COLOR_TABLE) {
    if (match.test(text)) return hex;
  }
  return FALLBACK_PALETTE[hashString(text) % FALLBACK_PALETTE.length];
}

export function textureFromText(text: string): Texture {
  if (/\bchrome|mirror|metallic|holographic|holo\b/i.test(text)) return "chrome";
  if (/\bshimmer|glitter|sparkle|sugar|stardust\b/i.test(text)) return "shimmer";
  if (/\bmatte|velvet|sueded?\b/i.test(text)) return "matte";
  return "glossy";
}

export interface SwatchInfo {
  hex: string;
  texture: Texture;
  label: string;
}

export function swatchFromProduct(p: { name: string; description?: string | null; tags?: string[] | null }): SwatchInfo {
  const corpus = [p.name, p.description ?? "", ...(p.tags ?? [])].join(" ");
  return {
    hex: colorFromText(corpus),
    texture: textureFromText(corpus),
    label: p.name,
  };
}

function hexToHsl(hex: string): [number, number, number] {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return [0, 0, 50];
  const [r, g, b] = m.map((x) => parseInt(x, 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return [h, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return Math.round(c * 255).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function tonalShades(hex: string, count = 5): string[] {
  const [h, s, baseL] = hexToHsl(hex);
  const min = Math.max(20, baseL - 25);
  const max = Math.min(85, baseL + 25);
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => hslToHex(h, s, max - i * step));
}
