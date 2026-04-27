// Curated nail polish color palette — ~110 named shades organized by family.
// Each entry is a real, evocative shade name with a hex code.

export interface NamedColor {
  name: string;
  hex: string;
}

export interface ColorFamily {
  id: string;
  label: string;
  accent: string; // header color
  colors: NamedColor[];
}

export const COLOR_FAMILIES: ColorFamily[] = [
  {
    id: "pinks",
    label: "Pinks",
    accent: "#FF6B9D",
    colors: [
      { name: "Cotton Candy", hex: "#FFC4D6" },
      { name: "Bubblegum", hex: "#FF9EBC" },
      { name: "Sunset Pink", hex: "#FF6B9D" },
      { name: "Hot Pink", hex: "#FF2D7A" },
      { name: "Fuchsia Flame", hex: "#E91E63" },
      { name: "Rose Petal", hex: "#F4A6B6" },
      { name: "Blush Glow", hex: "#FFC1CC" },
      { name: "Watermelon", hex: "#FF5E78" },
      { name: "Magenta Pop", hex: "#D81B60" },
      { name: "Pearl Pink", hex: "#FBE0E8" },
      { name: "Barbie Pink", hex: "#FF4F8E" },
      { name: "Dusty Rose", hex: "#C48A92" },
    ],
  },
  {
    id: "reds",
    label: "Reds",
    accent: "#DC2626",
    colors: [
      { name: "Cherry Bomb", hex: "#DC2626" },
      { name: "Crimson Kiss", hex: "#B91C1C" },
      { name: "Fire Engine", hex: "#EF4444" },
      { name: "Ruby Slipper", hex: "#9B1C2E" },
      { name: "Burgundy Wine", hex: "#7C1D2C" },
      { name: "Merlot", hex: "#5C1F2E" },
      { name: "Brick House", hex: "#A0392E" },
      { name: "Lava Flow", hex: "#FF3B30" },
      { name: "Rosewood", hex: "#65000B" },
      { name: "Strawberry Jam", hex: "#D32F4A" },
      { name: "Vampire Red", hex: "#3B0A0A" },
    ],
  },
  {
    id: "oranges",
    label: "Oranges & Corals",
    accent: "#FF8A5B",
    colors: [
      { name: "Sunset Coral", hex: "#FF7E5F" },
      { name: "Tangerine", hex: "#FB923C" },
      { name: "Apricot Glow", hex: "#FFB088" },
      { name: "Peach Fizz", hex: "#FFCBA4" },
      { name: "Mango Tango", hex: "#FFA94D" },
      { name: "Pumpkin Spice", hex: "#D97706" },
      { name: "Salmon Sunrise", hex: "#FA8072" },
      { name: "Burnt Orange", hex: "#C2410C" },
      { name: "Papaya", hex: "#FFB347" },
      { name: "Coral Crush", hex: "#FF8A5B" },
    ],
  },
  {
    id: "yellows",
    label: "Yellows & Golds",
    accent: "#D4AF37",
    colors: [
      { name: "Lemon Drop", hex: "#FBBF24" },
      { name: "Buttercup", hex: "#FDE68A" },
      { name: "Sunflower", hex: "#F59E0B" },
      { name: "Honey Dipped", hex: "#E5A53B" },
      { name: "Mustard Field", hex: "#B58105" },
      { name: "Champagne Bubbles", hex: "#F7E7CE" },
      { name: "Gold Leaf", hex: "#D4AF37" },
      { name: "Antique Gold", hex: "#B08D57" },
      { name: "Goldenrod", hex: "#DAA520" },
      { name: "Pineapple", hex: "#FFE066" },
    ],
  },
  {
    id: "greens",
    label: "Greens",
    accent: "#10B981",
    colors: [
      { name: "Mint Mojito", hex: "#6EE7B7" },
      { name: "Seafoam", hex: "#9FE7C7" },
      { name: "Emerald City", hex: "#10B981" },
      { name: "Forest Walk", hex: "#0F5132" },
      { name: "Sage Whisper", hex: "#9CAF88" },
      { name: "Olive Branch", hex: "#708238" },
      { name: "Lime Pop", hex: "#A3E635" },
      { name: "Jade Empress", hex: "#00A86B" },
      { name: "Kelly Green", hex: "#4CBB17" },
      { name: "Pistachio", hex: "#93C572" },
      { name: "Hunter Green", hex: "#355E3B" },
    ],
  },
  {
    id: "blues",
    label: "Blues",
    accent: "#3B82F6" ,
    colors: [
      { name: "Sky High", hex: "#7DD3FC" },
      { name: "Powder Blue", hex: "#B6D7E8" },
      { name: "Cornflower", hex: "#6495ED" },
      { name: "Cobalt Charge", hex: "#0047AB" },
      { name: "Royal Blue", hex: "#1E40AF" },
      { name: "Midnight Blue", hex: "#0F172A" },
      { name: "Navy Pearl", hex: "#1E3A8A" },
      { name: "Denim Day", hex: "#3B82F6" },
      { name: "Sapphire", hex: "#0F52BA" },
      { name: "Periwinkle", hex: "#9FA8DA" },
      { name: "Steel Blue", hex: "#4682B4" },
    ],
  },
  {
    id: "teals",
    label: "Teals & Cyans",
    accent: "#00D9FF",
    colors: [
      { name: "Ocean Mist", hex: "#7FDBFF" },
      { name: "Aqua Wave", hex: "#00D9FF" },
      { name: "Turquoise Tide", hex: "#40E0D0" },
      { name: "Teal Twilight", hex: "#14B8A6" },
      { name: "Lagoon", hex: "#0E7C86" },
      { name: "Ice Crystal", hex: "#A0E7E5" },
      { name: "Tropical Cyan", hex: "#00BCD4" },
      { name: "Mermaid Tail", hex: "#1E9E94" },
      { name: "Caribbean", hex: "#00CED1" },
    ],
  },
  {
    id: "purples",
    label: "Purples",
    accent: "#9B5DE5",
    colors: [
      { name: "Lilac Dream", hex: "#C4B5FD" },
      { name: "Lavender Field", hex: "#B19CD9" },
      { name: "Amethyst Glow", hex: "#9B5DE5" },
      { name: "Royal Violet", hex: "#7C3AED" },
      { name: "Deep Plum", hex: "#5B2C6F" },
      { name: "Eggplant", hex: "#3B1F44" },
      { name: "Orchid", hex: "#DA70D6" },
      { name: "Mauve Mist", hex: "#A37FA0" },
      { name: "Grape Soda", hex: "#6F2DA8" },
      { name: "Twilight Mauve", hex: "#806491" },
      { name: "Wisteria", hex: "#C9A0DC" },
    ],
  },
  {
    id: "neutrals",
    label: "Neutrals & Nudes",
    accent: "#A78B6E",
    colors: [
      { name: "Vanilla Cream", hex: "#F1E4D4" },
      { name: "Almond Milk", hex: "#E8C9A0" },
      { name: "Café Latte", hex: "#C4A484" },
      { name: "Mocha Bean", hex: "#6B4423" },
      { name: "Espresso", hex: "#3E2723" },
      { name: "Taupe Beauty", hex: "#8B7D6B" },
      { name: "Sand Dune", hex: "#D2B48C" },
      { name: "Mushroom", hex: "#A38B6E" },
      { name: "Linen", hex: "#FAF0E6" },
      { name: "Greige", hex: "#B5A89C" },
    ],
  },
  {
    id: "blackwhite",
    label: "Black, White & Grays",
    accent: "#1A1A1A",
    colors: [
      { name: "Onyx Noir", hex: "#1A1A1A" },
      { name: "Jet Black", hex: "#0A0A0A" },
      { name: "Charcoal", hex: "#36454F" },
      { name: "Slate Storm", hex: "#708090" },
      { name: "Smoke Cloud", hex: "#9CA3AF" },
      { name: "Pearl White", hex: "#F5F5F5" },
      { name: "Silver Mirror", hex: "#C0C0C0" },
      { name: "Platinum", hex: "#E5E4E2" },
      { name: "Ash Gray", hex: "#B2BEB5" },
      { name: "Gunmetal", hex: "#2A3439" },
      { name: "Crystal Clear", hex: "#E5E7EB" },
    ],
  },
];

export const ALL_NAMED_COLORS: NamedColor[] = COLOR_FAMILIES.flatMap((f) => f.colors);

export function nameForHex(hex: string): string | null {
  const target = hex.toLowerCase();
  const found = ALL_NAMED_COLORS.find((c) => c.hex.toLowerCase() === target);
  return found?.name ?? null;
}
