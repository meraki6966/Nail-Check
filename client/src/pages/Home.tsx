import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Upload, Wand2, Download, Heart, Loader2, Crown, ChevronDown, ChevronUp, X, ShoppingBag, BookOpen, Play, Image, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getRandomMessage } from "@/lib/microcopy";
import { downloadWithWatermark } from "@/lib/watermark";

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
      { id: "duck", label: "Duck / Flare", image: "http://nail-check.com/wp-content/uploads/2026/02/Nail-Shape-Duck-Flare.png", description: "Wide, flared tip resembling a duck's foot. Unique, bold, and perfect for creative nail art." },
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

// Gallery data
const GALLERY_ITEMS = [
  { id: 1, image: "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png", title: "Chrome Dreams", tags: ["Chrome", "Coffin"] },
  { id: 2, image: "http://nail-check.com/wp-content/uploads/2026/02/3D-Character.png", title: "3D Fantasy", tags: ["3D", "Character"] },
  { id: 3, image: "http://nail-check.com/wp-content/uploads/2026/02/Glass-Nails.png", title: "Glass Effect", tags: ["Glass", "Almond"] },
  { id: 4, image: "http://nail-check.com/wp-content/uploads/2026/02/Bridal-1.png", title: "Bridal Elegance", tags: ["Bridal", "Classy"] },
  { id: 5, image: "http://nail-check.com/wp-content/uploads/2026/02/Junk.png", title: "Junk Maximalist", tags: ["Junk", "Coffin"] },
  { id: 6, image: "http://nail-check.com/wp-content/uploads/2026/02/Cat-eye.png", title: "Cat Eye Magic", tags: ["Cat Eye", "Stiletto"] },
];

// Tutorial data
const TUTORIALS = [
  { id: 1, title: "Perfect Apex Placement", duration: "12 min", level: "Beginner", image: "http://nail-check.com/wp-content/uploads/2026/02/Apex-Present.png" },
  { id: 2, title: "Chrome Application Secrets", duration: "18 min", level: "Intermediate", image: "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png" },
  { id: 3, title: "3D Flower Sculpting", duration: "25 min", level: "Advanced", image: "http://nail-check.com/wp-content/uploads/2026/02/3D-Character.png" },
  { id: 4, title: "Competition-Ready C-Curve", duration: "20 min", level: "Competition", image: "http://nail-check.com/wp-content/uploads/2026/02/Deep-C-Curve.png" },
];

type CategoryKey = keyof typeof STYLE_CATEGORIES;

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState("");
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<Record<string, string[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["shape", "designStyle", "effects"]));
  const [showStylesMenu, setShowStylesMenu] = useState(true);
  const [supplyRecommendations, setSupplyRecommendations] = useState<{ name: string; category: string; link: string }[]>([]);
  const [credits, setCredits] = useState(1);
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [isPaidMember, setIsPaidMember] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hoveredStyle, setHoveredStyle] = useState<{ categoryKey: string; optionId: string } | null>(null);
  
  // ============================================
  // MICROCOPY STATE - Andrea's UX phrases
  // ============================================
  const [generatingText, setGeneratingText] = useState(getRandomMessage("AI_PROCESSING"));

  const [flavorOfMonth, setFlavorOfMonth] = useState({
    title: "Ruby Architecture",
    description: "February focus: High-gloss chrome over structural red sculpting.",
    image: "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png"
  });

  useEffect(() => { fetchCredits(); }, [user]);

  useEffect(() => {
    fetch("https://nail-check.com/wp-json/nail-check/v1/flavor-of-month")
      .then(res => res.json())
      .then(data => setFlavorOfMonth(data))
      .catch(err => console.error("Failed to fetch flavor of month:", err));
  }, []);

  useEffect(() => {
    const parts: string[] = [];
    Object.entries(selectedStyles).forEach(([categoryKey, selections]) => {
      if (selections.length > 0) {
        const category = STYLE_CATEGORIES[categoryKey as CategoryKey];
        const labels = selections.map(id => category.options.find(opt => opt.id === id)?.label).filter(Boolean);
        if (labels.length > 0) parts.push(labels.join(" + "));
      }
    });
    if (parts.length > 0) setPrompt(`Create a nail design featuring: ${parts.join(", ")}. Professional studio lighting, photorealistic quality.`);
    updateSupplyRecommendations();
  }, [selectedStyles]);

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

  const fetchCredits = async () => {
    try {
      const userId = user?.id || "guest";
      const response = await fetch(`/api/user/credits?userId=${userId}`);
      const data = await response.json();
      setCredits(data.credits);
      setGenerationsUsed(data.generationsUsed);
      setIsPaidMember(data.isPaidMember);
    } catch (error) { console.error("Failed to fetch credits:", error); }
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
    if (!isPaidMember && generationsUsed >= credits) { setShowPaywall(true); return; }
    if (!prompt.trim()) { 
      toast({ 
        title: getRandomMessage("AI_NO_RESULT"), 
        description: "Please describe your nail design or select styles above", 
        variant: "destructive" 
      }); 
      return; 
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    
    // Rotate through generating messages for variety
    setGeneratingText(getRandomMessage("AI_PROCESSING"));
    
    // Change message midway through for premium feel
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

      if (!response.ok) throw new Error("Failed to generate image");

      const data = await response.json();
      const imageUrl = `data:${data.mimeType};base64,${data.b64_json}`;
      setGeneratedImage(imageUrl);
      setGenerationsUsed(prev => prev + 1);

      const userId = user?.id || "guest";
      await fetch("/api/user/use-credit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });

      // ✨ Andrea's success message
      toast({ 
        title: getRandomMessage("AI_SUCCESS"), 
        description: "Your nail design is ready" 
      });
    } catch (error) {
      console.error("Generation error:", error);
      // ✨ Andrea's error message
      toast({ 
        title: getRandomMessage("GENERIC_ERROR"), 
        description: getRandomMessage("RETRY_ACTION"), 
        variant: "destructive" 
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
        
        {/* HEADER */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-[#FF6B9D]" />
            <h1 className="text-5xl font-serif tracking-widest uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
              The Design Lab
            </h1>
          </div>
          <p className="text-sm text-gray-500 italic">Select styles below or describe your vision. Watch precision engineering create your perfect set.</p>
        </header>

        {/* Credits */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] px-6 py-3 rounded-full border border-[#FF6B9D]/30">
            {isPaidMember ? (
              <span className="text-sm uppercase tracking-widest bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent font-semibold">♾️ Unlimited Designs</span>
            ) : (
              <span className="text-sm text-gray-600">Free Designs: <span className="font-bold text-[#9B5DE5]">{generationsUsed}</span> / {credits}</span>
            )}
          </div>
        </div>

        {/* STYLE BUILDER */}
        <section className="relative">
          <div className="flex items-center justify-between cursor-pointer py-4 border-b-2 border-[#FF6B9D]" onClick={() => setShowStylesMenu(!showStylesMenu)}>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-serif tracking-wider uppercase bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">Style Builder</h2>
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
                                <img src={option.image} alt={option.label} className="w-full h-full object-cover" />
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
                      <h3 className="text-xl font-serif bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
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
              <h3 className="text-2xl font-serif mb-4 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">1. Upload Canvas</h3>
              <div className={cn("border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all", canvasImage ? "border-[#FF6B9D] bg-[#FFF5F8]" : "border-gray-300 hover:border-[#9B5DE5] hover:bg-[#F8F0FF]")}>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="canvas-upload" />
                <label htmlFor="canvas-upload" className="cursor-pointer">
                  {canvasImage ? <img src={canvasImage} alt="Canvas" className="max-h-64 mx-auto rounded-xl" /> : <><Upload className="h-12 w-12 mx-auto mb-4 text-[#9B5DE5]" /><p className="text-gray-600">Click to upload hand, prop, or nail stand</p></>}
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-serif mb-4 bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">2. Your Vision</h3>
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
            <h3 className="text-2xl font-serif mb-4 bg-gradient-to-r from-[#00D9FF] to-[#9B5DE5] bg-clip-text text-transparent">3. Your Design</h3>
            <div className="bg-gradient-to-br from-[#FFF5F8] to-[#F8F0FF] rounded-2xl min-h-[500px] flex items-center justify-center p-8">
              {generatedImage ? (
                <div className="space-y-4 w-full">
                  <img src={generatedImage} alt="Generated design" className="w-full rounded-2xl shadow-xl" />
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
                <div className="text-center text-gray-400"><Sparkles className="h-16 w-16 mx-auto mb-4 text-[#9B5DE5]/30" /><p>Your generated design will appear here</p></div>
              )}
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3"><Image className="h-8 w-8 text-[#FF6B9D]" /><h2 className="text-4xl font-serif uppercase tracking-wider bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">Gallery</h2></div>
            <a href="/gallery" className="text-sm text-[#9B5DE5] hover:text-[#FF6B9D] transition-colors font-medium">View All →</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {GALLERY_ITEMS.map((item) => (
              <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-[#FF6B9D]/20 transition-all duration-300">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div><p className="text-white font-medium text-sm">{item.title}</p><div className="flex gap-1 mt-1">{item.tags.map((tag, idx) => <span key={idx} className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">{tag}</span>)}</div></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TUTORIALS */}
        <section className="bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3"><BookOpen className="h-8 w-8 text-[#9B5DE5]" /><h2 className="text-4xl font-serif uppercase tracking-wider bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">The Learning Lab</h2></div>
            <a href="/the-learning-lab" className="text-sm text-[#9B5DE5] hover:text-[#FF6B9D] transition-colors font-medium">All Tutorials →</a>
          </div>
          <p className="text-gray-500 mb-8 max-w-2xl">Level up your skills with step-by-step video tutorials from beginner basics to competition-level techniques.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TUTORIALS.map((tutorial) => (
              <div key={tutorial.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#9B5DE5]/10 transition-all duration-300 group cursor-pointer">
                <div className="relative aspect-video">
                  <img src={tutorial.image} alt={tutorial.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg"><Play className="h-6 w-6 text-[#FF6B9D] ml-1" /></div></div>
                  <span className={cn("absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white", tutorial.level === "Beginner" && "bg-gradient-to-r from-[#10B981] to-[#34D399]", tutorial.level === "Intermediate" && "bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]", tutorial.level === "Advanced" && "bg-gradient-to-r from-[#EF4444] to-[#F87171]", tutorial.level === "Competition" && "bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]")}>{tutorial.level}</span>
                </div>
                <div className="p-4"><h3 className="font-medium text-gray-800 group-hover:text-[#9B5DE5] transition-colors">{tutorial.title}</h3><p className="text-sm text-gray-400 mt-1">{tutorial.duration}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* Flavor of the Month */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div><h2 className="text-4xl font-serif uppercase tracking-wider bg-gradient-to-r from-[#B08D57] to-[#D4AF37] bg-clip-text text-transparent">Flavor of the Month</h2><p className="text-sm text-gray-500 italic mt-2">Current focus from the Technical Hub</p></div>
          </div>
          <div className="relative h-[500px] overflow-hidden group rounded-3xl">
            <img src={flavorOfMonth.image} alt={flavorOfMonth.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
              <div className="p-8 text-white"><span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2">Flavor of the Month</span><h3 className="text-3xl font-serif mb-2">{flavorOfMonth.title}</h3><p className="text-sm text-gray-300 italic max-w-md">{flavorOfMonth.description}</p></div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="grid md:grid-cols-4 gap-6">
          <a href="/find-tech" className="group"><div className="border border-[#FF6B9D]/20 p-6 rounded-2xl bg-gradient-to-br from-white to-[#FFF5F8] hover:shadow-lg hover:shadow-[#FF6B9D]/10 transition-all"><MapPin className="h-8 w-8 mb-4 text-[#FF6B9D]" /><h3 className="text-xl font-serif mb-2 group-hover:text-[#FF6B9D] transition-colors">Find a Tech</h3><p className="text-sm text-gray-600">Nail techs near you</p></div></a>
          <a href="/saved" className="group"><div className="border border-[#9B5DE5]/20 p-6 rounded-2xl bg-gradient-to-br from-white to-[#F8F0FF] hover:shadow-lg hover:shadow-[#9B5DE5]/10 transition-all"><Heart className="h-8 w-8 mb-4 text-[#9B5DE5]" /><h3 className="text-xl font-serif mb-2 group-hover:text-[#9B5DE5] transition-colors">Fire Vault</h3><p className="text-sm text-gray-600">Your saved AI designs</p></div></a>
          <a href="/seasonal" className="group"><div className="border border-[#00D9FF]/20 p-6 rounded-2xl bg-gradient-to-br from-white to-[#F0FFFF] hover:shadow-lg hover:shadow-[#00D9FF]/10 transition-all"><Sparkles className="h-8 w-8 mb-4 text-[#00D9FF]" /><h3 className="text-xl font-serif mb-2 group-hover:text-[#00D9FF] transition-colors">Seasonal Vault</h3><p className="text-sm text-gray-600">Curated collections</p></div></a>
          <a href="/supplies" className="group"><div className="border border-[#D4AF37]/20 p-6 rounded-2xl bg-gradient-to-br from-white to-[#FFFBF0] hover:shadow-lg hover:shadow-[#D4AF37]/10 transition-all"><Crown className="h-8 w-8 mb-4 text-[#D4AF37]" /><h3 className="text-xl font-serif mb-2 group-hover:text-[#D4AF37] transition-colors">Supply Suite</h3><p className="text-sm text-gray-600">Professional products</p></div></a>
        </section>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-8 text-center rounded-3xl">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] flex items-center justify-center"><Crown className="h-12 w-12 text-white" /></div>
            <h2 className="text-3xl font-serif mb-4 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">Unlock Unlimited</h2>
            <p className="text-gray-600 mb-6">You've used your complimentary generation. Unlock unlimited AI designs, Fire Vault, and exclusive features.</p>
            <div className="space-y-3">
              <a href="https://nail-check.com/membership/" target="_blank" rel="noopener noreferrer"><Button className={cn("w-full h-12 rounded-full", PINK_GRADIENT, "text-white")}>Become a Member - $8.99/mo</Button></a>
              <Button onClick={() => setShowPaywall(false)} variant="ghost" className="w-full text-gray-500 hover:text-[#9B5DE5]">Maybe Later</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  
  );
}