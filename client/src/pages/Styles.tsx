import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Wand2, Download, Heart, Loader2, ChevronDown, ChevronUp, X, ShoppingBag, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { BrandSpinner } from "@/components/BrandSpinner";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getRandomMessage } from "@/lib/microcopy";
import { downloadWithWatermark } from "@/lib/watermark";
import { UpgradeModal } from "@/components/UpgradeModal";
import { KawaiiPolish } from "@/components/Kawaii";
import type { NamedColor } from "@/lib/colorPalette";
import type { Texture } from "@/lib/colorFromProduct";

// ============================================
// NEW PINTEREST COLOR PALETTE
// ============================================
const PINK = "#FF6B9D";
const PURPLE = "#9B5DE5";
const CYAN = "#00D9FF";
const CORAL = "#FF8A5B";
const GOLD = "#D4AF37";
const GOLD_DARK = "#B08D57";

const GOLD_TEXT = "text-[#B08D57]";
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";
const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";
const CYAN_GRADIENT = "bg-gradient-to-r from-[#00D9FF] to-[#9B5DE5]";

// ============================================
// NAIL STYLES WITH REAL IMAGES AND DESCRIPTIONS
// ============================================
const STYLE_CATEGORIES = {
  shape: {
    label: "The Silhouette Guide",
    color: "from-[#FF6B9D] to-[#FF8A5B]",
    options: [
      { id: "square", label: "Square", image: "http://nail-check.com/wp-content/uploads/2026/02/Nail-Shape-Square.png", description: "Classic and timeless. Clean, straight edges with a flat tip for a polished, professional look." },
      { id: "coffin", label: "Coffin", image: "http://nail-check.com/wp-content/uploads/2026/02/Nail-Shape-Coffin.png", description: "Tapered sides with a flat tip. Bold, edgy, and perfect for longer lengths and statement designs." },
      { id: "almond", label: "Almond", image: "http://nail-check.com/wp-content/uploads/2026/02/Nail-Shape-Almond.png", description: "Slim and elegant. Tapered sides that meet at a rounded peak, elongating the fingers beautifully." },
      { id: "stiletto", label: "Stiletto", image: "http://nail-check.com/wp-content/uploads/2026/02/Nail-Shape-Stiletto.png", description: "Fierce and dramatic. A sharp, pointed tip that demands attention and showcases artistry." },
      { id: "longsquarestiletto", label: "Long Square Stiletto", image: "http://nail-check.com/wp-content/uploads/2026/02/Nail-Shape-Duck-Flare.png", description: "Extended length with squared edges tapering to sharp points. Maximum drama with structural integrity." },
      { id: "duck", label: "Duck / Flare", image: "http://nail-check.com/wp-content/uploads/2026/03/duck.jpeg", description: "Wide, flared tip resembling a duck's foot. Unique, bold, and perfect for creative nail art." },
      { id: "catclaw", label: "Cat Claw", image: "http://nail-check.com/wp-content/uploads/2026/02/Nail-Shape-Cat-Claw.png", description: "Curved and dramatic with an extreme arch. Edgy, fierce, and structurally impressive." },
    ]
  },
  product: {
    label: "The Build Specs",
    color: "from-[#9B5DE5] to-[#FF6B9D]",
    options: [
      { id: "acrylic", label: "Acrylic", image: "http://nail-check.com/wp-content/uploads/2026/02/Acrylic.png", description: "Liquid and powder polymer. The industry standard for extreme durability and crisp, structural precision." },
      { id: "hardgel", label: "Hard Gel", image: "http://nail-check.com/wp-content/uploads/2026/02/Hard-Gel.png", description: "Non-porous, high-shine builder. Hypoallergenic and lightweight with a crystal-clear, permanent finish." },
      { id: "polygel", label: "Poly Gel", image: "http://nail-check.com/wp-content/uploads/2026/02/PolyGel.png", description: "A hybrid of acrylic and hard gel. Odorless, flexible, and allows for infinite sculpting time before curing." },
      { id: "gelx", label: "Gel-X / Tips", image: "http://nail-check.com/wp-content/uploads/2026/02/Gel-X.png", description: "Pre-shaped soft gel extensions. Quick application, natural flexibility, and salon-quality results at home." },
      { id: "builder", label: "Builder / BIAB", image: "http://nail-check.com/wp-content/uploads/2026/02/Builder-in-Bottle.png", description: "Builder in a Bottle. Self-leveling gel for strength and structure without the bulk. Perfect for overlays." },
    ]
  },
  structure: {
    label: "The Anatomy",
    color: "from-[#00D9FF] to-[#9B5DE5]",
    options: [
      { id: "apex", label: "Apex Present", image: "http://nail-check.com/wp-content/uploads/2026/02/Apex-Present.png", description: "The highest point of the nail for structural integrity. Provides strength and a natural-looking arch." },
      { id: "noapex", label: "No Apex", image: "http://nail-check.com/wp-content/uploads/2026/02/No-Apex.png", description: "Flat, even surface without a raised center. Sleek, modern look ideal for minimalist designs." },
      { id: "ccurve", label: "C-Curve", image: "http://nail-check.com/wp-content/uploads/2026/02/C-Curve-1-scaled.png", description: "The curve from sidewall to sidewall. A proper C-curve adds strength and an elegant finish." },
      { id: "deepc", label: "Deep C-Curve", image: "http://nail-check.com/wp-content/uploads/2026/02/Deep-C-Curve.png", description: "An exaggerated curve for competition-level nails. Creates dramatic shadows and structural perfection." },
      { id: "sculpted", label: "Sculpted", image: "http://nail-check.com/wp-content/uploads/2026/02/Sculpted.png", description: "Built from scratch using forms. Complete control over shape, length, and structure." },
      { id: "tips", label: "Tips Used", image: "http://nail-check.com/wp-content/uploads/2026/02/Tips-Used.png", description: "Pre-made nail tips as a foundation. Quick, consistent base for extensions and overlays." },
      { id: "nailform", label: "Nail Form", image: "http://nail-check.com/wp-content/uploads/2026/03/nail-form-1.png", description: "Disposable template placed beneath the free edge. The foundation for building custom sculpted extensions without tips." },
    ]
  },
  designStyle: {
    label: "Visual Genre",
    color: "from-[#FF8A5B] to-[#FFC857]",
    options: [
      { id: "classy", label: "Classy / Minimal", image: "http://nail-check.com/wp-content/uploads/2026/02/Classy.png", description: "Understated elegance. Clean lines, neutral tones, and subtle accents for timeless sophistication." },
      { id: "junk", label: "Junk Nails", image: "http://nail-check.com/wp-content/uploads/2026/02/Junk.png", description: "Maximalist chaos. Loaded with charms, rhinestones, and 3D elements. More is more!" },
      { id: "3d", label: "3D / Character", image: "http://nail-check.com/wp-content/uploads/2026/02/3D-Character.png", description: "Sculptural nail art featuring raised designs, characters, or intricate 3D elements." },
      { id: "editorial", label: "Editorial", image: "http://nail-check.com/wp-content/uploads/2026/02/Editorial.png", description: "Avant-garde and artistic. Designed for photoshoots, runway, and making bold statements." },
    ]
  },
  effects: {
    label: "The Finish",
    color: "from-[#B08D57] to-[#D4AF37]",
    options: [
      { id: "chrome", label: "Chrome", image: "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png", description: "Mirror-like metallic finish. Reflective, futuristic, and endlessly versatile in any color." },
      { id: "cateye", label: "Cat Eye / Velvet", image: "http://nail-check.com/wp-content/uploads/2026/02/Cat-eye.png", description: "Magnetic gel that creates a mesmerizing light stripe. Deep, dimensional, and luxurious." },
      { id: "glass", label: "Glass Nails", image: "http://nail-check.com/wp-content/uploads/2026/02/Glass-Nails.png", description: "Translucent, glossy finish like shattered glass. Ethereal, delicate, and absolutely stunning." },
      { id: "matte", label: "Matte & Sugar", image: "http://nail-check.com/wp-content/uploads/2026/02/Matte-Sugar.png", description: "Non-shiny finish with a velvety or textured surface. Modern, sophisticated, and unique." },
    ]
  },
  theme: {
    label: "The Occasion",
    color: "from-[#FF6B9D] to-[#9B5DE5]",
    options: [
      { id: "bridal", label: "Bridal Nails", image: "http://nail-check.com/wp-content/uploads/2026/02/Bridal-1.png", description: "Elegant designs for the big day. Soft tones, delicate details, and photo-perfect finishes." },
      { id: "birthday", label: "Birthday Sets", image: "http://nail-check.com/wp-content/uploads/2026/02/Birthday.png", description: "Celebratory and fun! Glitter, charms, and personalized designs to mark your special day." },
      { id: "vacation", label: "Vacation Nails", image: "http://nail-check.com/wp-content/uploads/2026/02/Vacation.jpg", description: "Tropical vibes and travel-ready designs. Bright colors, beach themes, and carefree energy." },
      { id: "matching", label: "Matching Sets", image: "http://nail-check.com/wp-content/uploads/2026/02/Matching-Set.png", description: "Coordinated designs for couples, friends, or mommy-and-me. Twinning is winning!" },
    ]
  },
  skill: {
    label: "The Progression",
    color: "from-[#10B981] to-[#00D9FF]",
    options: [
      { id: "beginner", label: "Beginner Friendly", image: "http://nail-check.com/wp-content/uploads/2026/02/Beginner-Skill.png", description: "Simple techniques perfect for learning. Build your foundation with forgiving designs." },
      { id: "intermediate", label: "Intermediate", image: "http://nail-check.com/wp-content/uploads/2026/02/Intermediate-Skill.png", description: "Level up your skills. Requires steady hands and understanding of basic nail architecture." },
      { id: "advanced", label: "Advanced", image: "http://nail-check.com/wp-content/uploads/2026/02/Advanced-Skill.png", description: "Complex techniques for experienced techs. Precision, patience, and practice required." },
      { id: "competition", label: "Competition Level", image: "http://nail-check.com/wp-content/uploads/2026/02/Competition.png", description: "The highest level of nail artistry. Flawless execution judged by industry standards." },
    ]
  },
};

// Supply recommendations
const SUPPLY_RECOMMENDATIONS: Record<string, { name: string; category: string; link: string }[]> = {
  acrylic: [
    { name: "Acrylic Powder Set", category: "Powders", link: "/supplies#powders" },
    { name: "Monomer Liquid", category: "Liquids", link: "/supplies#liquids" },
    { name: "Kolinsky Brush #8", category: "Brushes", link: "/supplies#brushes" },
  ],
  hardgel: [
    { name: "Hard Gel Builder", category: "Gels", link: "/supplies#gels" },
    { name: "UV/LED Lamp 48W", category: "Equipment", link: "/supplies#equipment" },
  ],
  polygel: [
    { name: "Poly Gel Kit", category: "Gels", link: "/supplies#gels" },
    { name: "Slip Solution", category: "Liquids", link: "/supplies#liquids" },
  ],
  chrome: [
    { name: "Chrome Powder Set", category: "Powders", link: "/supplies#powders" },
    { name: "No-Wipe Top Coat", category: "Gels", link: "/supplies#gels" },
  ],
  cateye: [
    { name: "Cat Eye Gel Polish", category: "Gels", link: "/supplies#gels" },
    { name: "Cat Eye Magnet Wand", category: "Tools", link: "/supplies#tools" },
  ],
  "3d": [
    { name: "3D Acrylic Powder", category: "Powders", link: "/supplies#powders" },
    { name: "Detail Brush Set", category: "Brushes", link: "/supplies#brushes" },
  ],
  junk: [
    { name: "Rhinestone Assortment", category: "Decorations", link: "/supplies#decorations" },
    { name: "Nail Charms Mixed", category: "Decorations", link: "/supplies#decorations" },
  ],
  gelx: [
    { name: "Gel-X Tips Coffin", category: "Tips", link: "/supplies#tips" },
    { name: "Extend Gel", category: "Gels", link: "/supplies#gels" },
  ],
};

type CategoryKey = keyof typeof STYLE_CATEGORIES;

export default function Styles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [prompt, setPrompt] = useState("");
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<Record<string, string[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["shape", "designStyle", "effects"]));
  const [showStylesMenu, setShowStylesMenu] = useState(true);
  const [supplyRecommendations, setSupplyRecommendations] = useState<{ name: string; category: string; link: string }[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [hoveredStyle, setHoveredStyle] = useState<{ categoryKey: string; optionId: string } | null>(null);

  // ── Color & finish picker state ──────────────────────────────────────────
  const [selectedColor, setSelectedColor] = useState<NamedColor | null>(null);
  const [selectedTexture, setSelectedTexture] = useState<Texture>("glossy");

  // ── AI Critique tab state ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"design" | "critique">("design");
  const [critiqueImage, setCritiqueImage] = useState<string | null>(null);
  const [critique, setCritique] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ── Subscription status ──────────────────────────────────────────────────
  const { data: subStatus } = useQuery<{
    tier: "free" | "base" | "premium";
    status: string;
    aiGenerationsUsedThisMonth: number;
    aiGenerationsRemaining: number | "unlimited";
    resetDate: string | null;
  }>({
    queryKey: ["/api/subscriptions/status", user?.id],
    queryFn: async () => {
      if (!user?.id) return { tier: "free", status: "none", aiGenerationsUsedThisMonth: 0, aiGenerationsRemaining: 0, resetDate: null };
      const res = await fetch(`/api/subscriptions/status/${user.id}`, { credentials: "include" });
      if (!res.ok) return { tier: "free", status: "none", aiGenerationsUsedThisMonth: 0, aiGenerationsRemaining: 0, resetDate: null };
      return res.json();
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  });

  const subTier = subStatus?.tier ?? "free";
  const aiUsed = subStatus?.aiGenerationsUsedThisMonth ?? 0;
  const aiRemaining = subStatus?.aiGenerationsRemaining ?? 0;
  const isPremium = subTier === "premium";

  // ============================================
  // MICROCOPY STATE - Andrea's UX phrases
  // ============================================
  const [generatingText, setGeneratingText] = useState(getRandomMessage("AI_PROCESSING"));

  useEffect(() => {
    const parts: string[] = [];
    Object.entries(selectedStyles).forEach(([categoryKey, selections]) => {
      if (selections.length > 0) {
        const category = STYLE_CATEGORIES[categoryKey as CategoryKey];
        const labels = selections.map(id => category.options.find(opt => opt.id === id)?.label).filter(Boolean);
        if (labels.length > 0) parts.push(labels.join(" + "));
      }
    });
    if (selectedColor) {
      parts.push(`color: ${selectedColor.name} (${selectedColor.hex})`);
    }
    if (selectedTexture && selectedColor) {
      parts.push(`${selectedTexture} finish`);
    }
    if (parts.length > 0) setPrompt(`Create a nail design featuring: ${parts.join(", ")}. Professional studio lighting, photorealistic quality.`);
    updateSupplyRecommendations();
  }, [selectedStyles, selectedColor, selectedTexture]);

  const updateSupplyRecommendations = () => {
    const recommendations: { name: string; category: string; link: string }[] = [];
    const seen = new Set<string>();
    Object.values(selectedStyles).flat().forEach(styleId => {
      const supplies = SUPPLY_RECOMMENDATIONS[styleId] || [];
      supplies.forEach(supply => {
        if (!seen.has(supply.name)) { seen.add(supply.name); recommendations.push(supply); }
      });
    });
    setSupplyRecommendations(recommendations.slice(0, 6));
  };

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryKey)) next.delete(categoryKey);
      else next.add(categoryKey);
      return next;
    });
  };

  const toggleStyleSelection = (categoryKey: string, optionId: string) => {
    setSelectedStyles(prev => {
      const current = prev[categoryKey] || [];
      const isSelected = current.includes(optionId);
      return { ...prev, [categoryKey]: isSelected ? current.filter(id => id !== optionId) : [...current, optionId] };
    });
  };

  const clearAllSelections = () => { setSelectedStyles({}); setPrompt(""); };
  const getSelectedCount = () => Object.values(selectedStyles).flat().length;

  // Get description for hovered or selected style
  const getStyleDescription = (categoryKey: string, optionId: string) => {
    const category = STYLE_CATEGORIES[categoryKey as CategoryKey];
    const option = category?.options.find(opt => opt.id === optionId);
    return option?.description || "";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCanvasImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: getRandomMessage("AI_NO_RESULT"),
        description: "Please describe your nail design or select styles above",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setGeneratingText(getRandomMessage("AI_PROCESSING"));

    const messageInterval = setInterval(() => {
      setGeneratingText(getRandomMessage("AI_GENERATING"));
    }, 2000);

    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt, image: canvasImage }),
      });

      // Limit reached → show upgrade modal instead of generic error
      if (response.status === 403) {
        const errData = await response.json();
        if (errData.error === "limit_reached") {
          setShowUpgradeModal(true);
          return;
        }
      }

      if (!response.ok) throw new Error("Failed to generate image");

      const data = await response.json();
      const imageUrl = `data:${data.mimeType};base64,${data.b64_json}`;
      setGeneratedImage(imageUrl);

      // Refresh subscription status so the usage counter updates
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/status", user?.id] });

      toast({ title: getRandomMessage("AI_SUCCESS"), description: "Your nail design is ready" });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: getRandomMessage("GENERIC_ERROR"),
        description: getRandomMessage("RETRY_ACTION"),
        variant: "destructive",
      });
    } finally {
      clearInterval(messageInterval);
      setIsGenerating(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!generatedImage) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user?.id || "guest", imageUrl: generatedImage, prompt, canvasImageUrl: canvasImage, tags: Object.values(selectedStyles).flat() }),
      });
      if (response.ok) {
        // ✨ Andrea's save success message
        toast({
          title: getRandomMessage("SAVE_SUCCESS"),
          description: "View it in your saved designs"
        });
      } else throw new Error("Failed to save");
    } catch (error) {
      // ✨ Andrea's save error message
      toast({
        title: getRandomMessage("SAVE_ERROR"),
        variant: "destructive"
      });
    }
    finally { setIsSaving(false); }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      await downloadWithWatermark(generatedImage, 'nail-check-design.png');
      toast({
        title: "Download complete",
        description: "Your design has been saved with the Nail Check watermark"
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Scroll to generator section
  const scrollToGenerator = () => {
    const generatorSection = document.getElementById("ai-generator");
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ── AI Critique handlers ──────────────────────────────────────────────────
  const handleCritiqueUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCritiqueImage(event.target?.result as string);
        setCritique(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!critiqueImage) return;
    setIsAnalyzing(true);
    setCritique(null);
    try {
      const response = await fetch("/api/image/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ image: critiqueImage }),
      });
      if (response.status === 403) {
        const errData = await response.json();
        if (errData.error === "limit_reached") { setShowUpgradeModal(true); return; }
      }
      if (!response.ok) throw new Error("Failed to analyze");
      const data = await response.json();
      setCritique(data.critique);
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/status", user?.id] });
      toast({ title: "Analysis complete!", description: "Your professional nail critique is ready" });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({ title: "Analysis failed", description: "Please try again", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">

        {/* HEADER */}
        <header className="text-center space-y-4 animate-fade-up">
          <h1 className="text-5xl font-serif tracking-widest uppercase text-brand-gradient-animated">
            The Design Lab
          </h1>
          <p className="text-sm text-gray-500 italic">Select styles below or describe your vision. Watch precision engineering create your perfect set.</p>
        </header>

        {/* Tab Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-full p-1 gap-1">
            <button
              onClick={() => setActiveTab("design")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                activeTab === "design"
                  ? "bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Wand2 className="inline h-4 w-4 mr-1.5 -mt-0.5" />
              Design Lab
            </button>
            <button
              onClick={() => setActiveTab("critique")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                activeTab === "critique"
                  ? "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              AI Critique
            </button>
          </div>
        </div>

        {activeTab === "critique" ? (
          /* ── AI CRITIQUE PANEL ─────────────────────────────────────────── */
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: Upload */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl mb-4 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                  Upload Your Nails
                </h3>
                <div className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                  critiqueImage ? "border-[#9B5DE5] bg-[#F8F0FF]" : "border-gray-300 hover:border-[#9B5DE5] hover:bg-[#F8F0FF]"
                )}>
                  <input type="file" accept="image/*" onChange={handleCritiqueUpload} className="hidden" id="critique-upload" />
                  <label htmlFor="critique-upload" className="cursor-pointer">
                    {critiqueImage ? (
                      <img src={critiqueImage} alt="Uploaded nails" className="max-h-64 mx-auto rounded-xl" />
                    ) : (
                      <>
                        <Upload className="h-12 w-12 mx-auto mb-4 text-[#9B5DE5]" />
                        <p className="text-gray-600">Click to upload a photo of your nails</p>
                        <p className="text-sm text-gray-400 mt-2">Best results with clear, well-lit photos</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !critiqueImage}
                className={cn("w-full h-14 text-sm uppercase tracking-widest rounded-full", PURPLE_GRADIENT, "text-white hover:shadow-lg transition-all")}
              >
                {isAnalyzing ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Your Nails...</>
                ) : (
                  <>Get AI Critique</>
                )}
              </Button>
            </div>

            {/* Right: Results */}
            <div>
              <h3 className="text-2xl mb-4 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                Professional Analysis
              </h3>
              <div className="bg-gradient-to-br from-[#FFF5F8] to-[#F8F0FF] rounded-2xl min-h-[500px] flex items-center justify-center p-8">
                {isAnalyzing ? (
                  <BrandSpinner size="xl" label="Analyzing your nails…" />
                ) : critique ? (
                  <div className="space-y-6 w-full">
                    <div className="bg-white rounded-xl p-6 text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] bg-clip-text text-transparent mb-2">
                        {critique.overallScore}/10
                      </div>
                      <p className="text-sm text-gray-500">Overall Quality</p>
                    </div>
                    <div className="space-y-4">
                      {critique.sections?.map((section: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-xl p-5">
                          <div className="flex items-start gap-3 mb-3">
                            {section.score >= 8 ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{section.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{section.feedback}</p>
                              {section.suggestions && (
                                <p className="text-sm text-[#9B5DE5] mt-2">💡 {section.suggestions}</p>
                              )}
                            </div>
                            <span className="text-sm font-bold text-[#9B5DE5]">{section.score}/10</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {critique.recommendations && (
                      <div className="bg-white rounded-xl p-5">
                        <h4 className="font-semibold text-gray-800 mb-3">Recommended Products</h4>
                        <ul className="space-y-2">
                          {critique.recommendations.map((rec: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-[#FF6B9D]">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <p>Upload a photo to get your professional nail critique</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
        <>
        {/* AI generation usage counter */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] px-6 py-3 rounded-full border border-[#FF6B9D]/30 flex items-center gap-3">
            {isPremium ? (
              <span className="text-sm uppercase tracking-widest bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent font-semibold">♾️ Unlimited AI Designs</span>
            ) : subTier === "base" ? (
              <>
                <span className="text-sm text-gray-600">
                  AI Designs: <span className="font-bold text-[#9B5DE5]">{aiUsed}</span> / 20 this month
                </span>
                {typeof aiRemaining === "number" && aiRemaining <= 3 && aiRemaining > 0 && (
                  <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    {aiRemaining} left
                  </span>
                )}
                {typeof aiRemaining === "number" && aiRemaining === 0 && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="text-[10px] bg-[#9B5DE5] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide hover:opacity-90"
                  >
                    Upgrade
                  </button>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-500">
                <a href="/subscribe" className="text-[#9B5DE5] font-semibold hover:underline">Subscribe</a> to unlock AI designs
              </span>
            )}
          </div>
        </div>

        {/* STYLE BUILDER */}
        <section className="relative">
          <div className="flex items-center justify-between cursor-pointer py-4 border-b-2 border-[#FF6B9D]" onClick={() => setShowStylesMenu(!showStylesMenu)}>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl tracking-wider uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">Style Builder</h2>
              {getSelectedCount() > 0 && <span className={cn("px-3 py-1 rounded-full text-sm font-medium text-white", PINK_GRADIENT)}>{getSelectedCount()} selected</span>}
            </div>
            <div className="flex items-center gap-3">
              {getSelectedCount() > 0 && <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); clearAllSelections(); }} className="text-gray-500 hover:text-[#FF6B9D]"><X className="h-4 w-4 mr-1" /> Clear All</Button>}
              {showStylesMenu ? <ChevronUp className="h-6 w-6 text-[#FF6B9D]" /> : <ChevronDown className="h-6 w-6 text-[#FF6B9D]" />}
            </div>
          </div>

          {showStylesMenu && (
            <div className="mt-6 space-y-4">
              {(Object.entries(STYLE_CATEGORIES) as [CategoryKey, typeof STYLE_CATEGORIES[CategoryKey]][]).map(([key, category]) => (
                <div key={key} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className={cn("flex items-center justify-between px-5 py-4 cursor-pointer transition-all", expandedCategories.has(key) ? `bg-gradient-to-r ${category.color} text-white` : "bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF]")} onClick={() => toggleCategory(key)}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-medium">{category.label}</span>
                      {(selectedStyles[key]?.length || 0) > 0 && <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold", expandedCategories.has(key) ? "bg-white/30" : "bg-[#FF6B9D] text-white")}>{selectedStyles[key].length}</span>}
                    </div>
                    {expandedCategories.has(key) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5 text-[#9B5DE5]" />}
                  </div>

                  {expandedCategories.has(key) && (
                    <div className="p-4 bg-gradient-to-b from-white to-[#FFFBFC]">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {category.options.map((option) => {
                          const isSelected = selectedStyles[key]?.includes(option.id);
                          const isHovered = hoveredStyle?.categoryKey === key && hoveredStyle?.optionId === option.id;
                          return (
                            <div
                              key={option.id}
                              onClick={() => toggleStyleSelection(key, option.id)}
                              onMouseEnter={() => setHoveredStyle({ categoryKey: key, optionId: option.id })}
                              onMouseLeave={() => setHoveredStyle(null)}
                              className={cn(
                                "relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 group",
                                isSelected ? "ring-4 ring-[#FF6B9D] scale-[1.02] shadow-lg shadow-[#FF6B9D]/20" : "hover:scale-[1.03] hover:shadow-lg"
                              )}
                            >
                              <div className="aspect-square relative">
                                <img
                                  src={option.image}
                                  alt={option.label}
                                  onError={(e) => {
                                    const t = e.currentTarget;
                                    if (t.dataset.fallback) return;
                                    t.dataset.fallback = "1";
                                    const label = option.label.replace(/[<>&]/g, "");
                                    t.src = "data:image/svg+xml;utf8," + encodeURIComponent(
                                      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#FF6B9D'/><stop offset='1' stop-color='#9B5DE5'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/><text x='200' y='210' text-anchor='middle' font-family='serif' font-size='24' fill='white' opacity='0.9'>${label}</text></svg>`
                                    );
                                  }}
                                  className="w-full h-full object-cover"
                                />
                                <div className={cn("absolute inset-0 transition-all duration-300", isSelected ? `bg-gradient-to-t ${category.color} opacity-40` : "bg-black/0 group-hover:bg-black/20")} />
                                {isSelected && <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg"><span className="text-[#FF6B9D] text-lg font-bold">✓</span></div>}
                              </div>
                              <div className={cn("px-3 py-3 text-center transition-all", isSelected ? `bg-gradient-to-r ${category.color} text-white` : "bg-white")}>
                                <span className="text-sm font-semibold block uppercase tracking-wide">{option.label}</span>
                                {/* Description - shows on hover or when selected */}
                                <p className={cn(
                                  "text-xs mt-2 leading-relaxed transition-all duration-300",
                                  isSelected ? "text-white/90" : "text-gray-500",
                                  (isHovered || isSelected) ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"
                                )}>
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Generate CTA after Style Builder */}
              {getSelectedCount() > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-[#FFF5F8] via-[#F8F0FF] to-[#F0FFFF] rounded-2xl border-2 border-dashed border-[#FF6B9D]/30">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                        Ready to Generate?
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        You've selected {getSelectedCount()} style{getSelectedCount() > 1 ? 's' : ''}. Scroll down to generate your custom nail design!
                      </p>
                    </div>
                    <Button
                      onClick={scrollToGenerator}
                      className={cn("px-8 h-12 rounded-full text-sm uppercase tracking-wider", PINK_GRADIENT, "text-white hover:shadow-lg hover:shadow-[#FF6B9D]/30")}
                    >
                      <Wand2 className="mr-2 h-5 w-5" /> Generate My Design
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* AI Generator */}
        <div id="ai-generator" className="grid md:grid-cols-2 gap-12 scroll-mt-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl mb-4 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">1. Upload Canvas</h3>
              <div className={cn("border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all", canvasImage ? "border-[#FF6B9D] bg-[#FFF5F8]" : "border-gray-300 hover:border-[#9B5DE5] hover:bg-[#F8F0FF]")}>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="canvas-upload" />
                <label htmlFor="canvas-upload" className="cursor-pointer">
                  {canvasImage ? <img src={canvasImage} alt="Canvas" className="max-h-64 mx-auto rounded-xl" /> : <><Upload className="h-12 w-12 mx-auto mb-4 text-[#9B5DE5]" /><p className="text-gray-600">Click to upload hand, prop, or nail stand</p></>}
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-2xl mb-4 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">2. Your Vision</h3>
              {/* ✨ Andrea's AI_IDLE placeholder */}
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={getRandomMessage("AI_IDLE")}
                className="min-h-[150px] resize-none rounded-xl border-gray-200 focus:border-[#9B5DE5]"
              />
              {getSelectedCount() > 0 && <p className="text-xs text-[#9B5DE5] mt-2 italic">✨ Prompt auto-generated from your style selections</p>}
            </div>

            <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className={cn("w-full h-14 text-sm uppercase tracking-widest rounded-full", PINK_GRADIENT, "text-white hover:shadow-lg hover:shadow-[#FF6B9D]/30 transition-all")}>
              {/* ✨ Andrea's generating messages */}
              {isGenerating ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {generatingText}</> : <><Wand2 className="mr-2 h-5 w-5" /> Generate Design</>}
            </Button>
          </div>

          <div>
            <h3 className="text-2xl mb-4 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">3. Your Design</h3>
            <div className="bg-gradient-to-br from-[#FFF5F8] to-[#F8F0FF] rounded-2xl min-h-[500px] flex items-center justify-center p-8">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center w-full py-12 gap-4">
                  <KawaiiPolish pose="polish" color={selectedColor?.hex || "#9B5DE5"} size={120} className="animate-bounce-soft" />
                  <BrandSpinner size="xl" label={generatingText} />
                  <p className="text-xs uppercase tracking-widest text-[#9B5DE5] font-bold">Polly is painting...</p>
                </div>
              ) : generatedImage ? (
                <div className="space-y-4 w-full animate-fade-up">
                  <div className="relative">
                    <img src={generatedImage} alt="Generated design" className="w-full rounded-2xl shadow-xl animate-pop-in" />
                    <KawaiiPolish
                      pose="celebrate"
                      color={selectedColor?.hex || "#FF6B9D"}
                      size={90}
                      className="absolute -top-4 -right-4 anime-image-pop"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSaveToVault} disabled={isSaving} variant="outline" className="flex-1 rounded-full border-[#FF6B9D] text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white">
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Heart className="mr-2 h-4 w-4" />} Save to Vault
                    </Button>
                    <Button onClick={handleDownload} variant="outline" className="flex-1 rounded-full border-[#9B5DE5] text-[#9B5DE5] hover:bg-[#9B5DE5] hover:text-white">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                  {/* Find a Tech CTA */}
                  <a href="/find-tech" className="block mt-4">
                    <div className="p-4 bg-gradient-to-r from-[#FF6B9D]/10 to-[#9B5DE5]/10 rounded-2xl border border-[#FF6B9D]/20 hover:shadow-lg hover:shadow-[#FF6B9D]/10 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 group-hover:text-[#FF6B9D] transition-colors">Love this design?</p>
                          <p className="text-sm text-gray-500">Find a nail tech near you who can create it! →</p>
                        </div>
                      </div>
                    </div>
                  </a>
                  {supplyRecommendations.length > 0 && (
                    <div className="mt-6 p-5 bg-white rounded-2xl border border-[#FF6B9D]/20 shadow-sm">
                      <div className="flex items-center gap-2 mb-4"><ShoppingBag className="h-5 w-5 text-[#FF6B9D]" /><h4 className="font-serif text-lg">Recommended Supplies</h4></div>
                      <div className="grid grid-cols-2 gap-3">
                        {supplyRecommendations.map((supply, idx) => (
                          <a key={idx} href={supply.link} className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] rounded-xl hover:shadow-md transition-all group">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5] rounded-xl flex items-center justify-center"><ShoppingBag className="h-5 w-5 text-white" /></div>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate group-hover:text-[#FF6B9D] transition-colors">{supply.name}</p><p className="text-xs text-gray-400">{supply.category}</p></div>
                          </a>
                        ))}
                      </div>
                      <a href="/supplies" className={cn("block mt-4 text-center py-3 rounded-full text-sm font-medium transition-all", PURPLE_GRADIENT, "text-white hover:shadow-lg")}>View Full Supply Suite →</a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400"><p>Your generated design will appear here</p></div>
              )}
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => { setShowUpgradeModal(false); window.location.href = "/subscribe"; }}
        generationsRemaining={typeof aiRemaining === "number" ? aiRemaining : undefined}
      />
    </>
  );
}
