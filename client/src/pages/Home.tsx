import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Upload, Wand2, Download, Heart, Loader2, Crown, ChevronDown, ChevronUp, X, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const GOLD_TEXT = "text-[#B08D57]";
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";

// ============================================
// NAIL STYLES CATEGORY DATA
// ============================================
const STYLE_CATEGORIES = {
  shape: {
    label: "Nail Shape",
    color: "from-pink-400 to-rose-500",
    options: [
      { id: "square", label: "Square", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "coffin", label: "Coffin", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
      { id: "almond", label: "Almond", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "stiletto", label: "Stiletto", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop" },
      { id: "duck", label: "Duck", image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=200&h=200&fit=crop" },
      { id: "catclaw", label: "Cat Claw", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "curved", label: "Curved Tip", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
    ]
  },
  product: {
    label: "Enhancement Type",
    color: "from-violet-400 to-purple-500",
    options: [
      { id: "acrylic", label: "Acrylic", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "hardgel", label: "Hard Gel", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
      { id: "softgel", label: "Soft Gel", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop" },
      { id: "polygel", label: "Poly Gel", image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=200&h=200&fit=crop" },
      { id: "builder", label: "Builder Gel", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "gelx", label: "Gel-X / Tips", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
      { id: "natural", label: "Natural Nails", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop" },
    ]
  },
  structure: {
    label: "Structure",
    color: "from-amber-400 to-orange-500",
    options: [
      { id: "apex", label: "Apex Present", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "noapex", label: "No Apex", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
      { id: "ccurve", label: "C-Curve", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop" },
      { id: "deepc", label: "Deep C-Curve", image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=200&h=200&fit=crop" },
      { id: "sculpted", label: "Sculpted", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "tips", label: "Tips Used", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
    ]
  },
  designStyle: {
    label: "Design Style",
    color: "from-teal-400 to-emerald-500",
    options: [
      { id: "classy", label: "Classy / Minimal", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "junk", label: "Junk Nails", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
      { id: "3d", label: "3D Nails", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop" },
      { id: "character", label: "Character Nails", image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=200&h=200&fit=crop" },
      { id: "luxury", label: "Luxury Nails", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "editorial", label: "Editorial Nails", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
    ]
  },
  effects: {
    label: "Effects & Finishes",
    color: "from-cyan-400 to-blue-500",
    options: [
      { id: "chrome", label: "Chrome", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "glass", label: "Glass Nails", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
      { id: "cateye", label: "Cat Eye", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop" },
      { id: "glittercateye", label: "Glitter Cat Eye", image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=200&h=200&fit=crop" },
      { id: "ombre", label: "Ombre", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "matte", label: "Matte", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
      { id: "sugar", label: "Sugar / Crystal", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop" },
    ]
  },
  theme: {
    label: "Theme / Set Type",
    color: "from-fuchsia-400 to-pink-500",
    options: [
      { id: "matching", label: "Matching Sets", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "birthday", label: "Birthday Sets", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
      { id: "bridal", label: "Bridal Nails", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop" },
      { id: "vacation", label: "Vacation Nails", image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=200&h=200&fit=crop" },
      { id: "everyday", label: "Everyday Sets", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
    ]
  },
  skill: {
    label: "Skill Level",
    color: "from-slate-400 to-gray-600",
    options: [
      { id: "beginner", label: "Beginner Friendly", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { id: "intermediate", label: "Intermediate", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=200&h=200&fit=crop" },
      { id: "advanced", label: "Advanced", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop" },
      { id: "competition", label: "Competition Level", image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=200&h=200&fit=crop" },
    ]
  },
};

// Supply recommendations based on selections
const SUPPLY_RECOMMENDATIONS: Record<string, { name: string; category: string; link: string }[]> = {
  acrylic: [
    { name: "Acrylic Powder Set", category: "Powders", link: "/supplies#powders" },
    { name: "Monomer Liquid", category: "Liquids", link: "/supplies#liquids" },
    { name: "Kolinsky Brush #8", category: "Brushes", link: "/supplies#brushes" },
  ],
  hardgel: [
    { name: "Hard Gel Builder", category: "Gels", link: "/supplies#gels" },
    { name: "UV/LED Lamp 48W", category: "Equipment", link: "/supplies#equipment" },
    { name: "Gel Brush Flat", category: "Brushes", link: "/supplies#brushes" },
  ],
  softgel: [
    { name: "Soft Gel Polish Set", category: "Gels", link: "/supplies#gels" },
    { name: "Base & Top Coat", category: "Gels", link: "/supplies#gels" },
  ],
  polygel: [
    { name: "Poly Gel Kit", category: "Gels", link: "/supplies#gels" },
    { name: "Slip Solution", category: "Liquids", link: "/supplies#liquids" },
    { name: "Dual Forms", category: "Tips", link: "/supplies#tips" },
  ],
  chrome: [
    { name: "Chrome Powder Set", category: "Powders", link: "/supplies#powders" },
    { name: "No-Wipe Top Coat", category: "Gels", link: "/supplies#gels" },
    { name: "Silicone Applicator", category: "Tools", link: "/supplies#tools" },
  ],
  cateye: [
    { name: "Cat Eye Gel Polish", category: "Gels", link: "/supplies#gels" },
    { name: "Cat Eye Magnet Wand", category: "Tools", link: "/supplies#tools" },
  ],
  ombre: [
    { name: "Ombre Brush Set", category: "Brushes", link: "/supplies#brushes" },
    { name: "Color Mixing Palette", category: "Tools", link: "/supplies#tools" },
  ],
  "3d": [
    { name: "3D Acrylic Powder", category: "Powders", link: "/supplies#powders" },
    { name: "Detail Brush Set", category: "Brushes", link: "/supplies#brushes" },
    { name: "Nail Art Charms", category: "Decorations", link: "/supplies#decorations" },
  ],
  junk: [
    { name: "Rhinestone Assortment", category: "Decorations", link: "/supplies#decorations" },
    { name: "Nail Charms Mixed", category: "Decorations", link: "/supplies#decorations" },
    { name: "Nail Glue Extra Strong", category: "Adhesives", link: "/supplies#adhesives" },
  ],
  gelx: [
    { name: "Gel-X Tips Coffin", category: "Tips", link: "/supplies#tips" },
    { name: "Extend Gel", category: "Gels", link: "/supplies#gels" },
  ],
};

type CategoryKey = keyof typeof STYLE_CATEGORIES;

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState("");
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Style selections
  const [selectedStyles, setSelectedStyles] = useState<Record<string, string[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["shape", "designStyle", "effects"]));
  const [showStylesMenu, setShowStylesMenu] = useState(true);
  
  // Supply recommendations
  const [supplyRecommendations, setSupplyRecommendations] = useState<{ name: string; category: string; link: string }[]>([]);
  
  // Credit system
  const [credits, setCredits] = useState(1);
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [isPaidMember, setIsPaidMember] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Flavor of the Month from WordPress
  const [flavorOfMonth, setFlavorOfMonth] = useState({
    title: "Ruby Architecture",
    description: "February focus: High-gloss chrome over structural red sculpting.",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=1000"
  });

  // Fetch user credits on mount
  useEffect(() => {
    fetchCredits();
  }, [user]);

  // Fetch Flavor of the Month from WordPress
  useEffect(() => {
    fetch("https://nail-check.com/wp-json/nail-check/v1/flavor-of-month")
      .then(res => res.json())
      .then(data => setFlavorOfMonth(data))
      .catch(err => console.error("Failed to fetch flavor of month:", err));
  }, []);

  // Auto-generate prompt from selections
  useEffect(() => {
    const parts: string[] = [];
    
    Object.entries(selectedStyles).forEach(([categoryKey, selections]) => {
      if (selections.length > 0) {
        const category = STYLE_CATEGORIES[categoryKey as CategoryKey];
        const labels = selections.map(id => 
          category.options.find(opt => opt.id === id)?.label
        ).filter(Boolean);
        
        if (labels.length > 0) {
          parts.push(labels.join(" + "));
        }
      }
    });
    
    if (parts.length > 0) {
      setPrompt(`Create a nail design featuring: ${parts.join(", ")}. Professional studio lighting, photorealistic quality.`);
    }
    
    // Update supply recommendations
    updateSupplyRecommendations();
  }, [selectedStyles]);

  const updateSupplyRecommendations = () => {
    const recommendations: { name: string; category: string; link: string }[] = [];
    const seen = new Set<string>();
    
    Object.values(selectedStyles).flat().forEach(styleId => {
      const supplies = SUPPLY_RECOMMENDATIONS[styleId] || [];
      supplies.forEach(supply => {
        if (!seen.has(supply.name)) {
          seen.add(supply.name);
          recommendations.push(supply);
        }
      });
    });
    
    setSupplyRecommendations(recommendations.slice(0, 6)); // Max 6 recommendations
  };

  const fetchCredits = async () => {
    try {
      const userId = user?.id || "guest";
      const response = await fetch(`/api/user/credits?userId=${userId}`);
      const data = await response.json();
      
      setCredits(data.credits);
      setGenerationsUsed(data.generationsUsed);
      setIsPaidMember(data.isPaidMember);
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    }
  };

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  };

  const toggleStyleSelection = (categoryKey: string, optionId: string) => {
    setSelectedStyles(prev => {
      const current = prev[categoryKey] || [];
      const isSelected = current.includes(optionId);
      
      return {
        ...prev,
        [categoryKey]: isSelected
          ? current.filter(id => id !== optionId)
          : [...current, optionId]
      };
    });
  };

  const clearAllSelections = () => {
    setSelectedStyles({});
    setPrompt("");
  };

  const getSelectedCount = () => {
    return Object.values(selectedStyles).flat().length;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCanvasImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!isPaidMember && generationsUsed >= credits) {
      setShowPaywall(true);
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe your nail design or select styles above",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          prompt,
          image: canvasImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      const imageUrl = `data:${data.mimeType};base64,${data.b64_json}`;
      setGeneratedImage(imageUrl);

      setGenerationsUsed(prev => prev + 1);

      const userId = user?.id || "guest";
      await fetch("/api/user/use-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      toast({
        title: "Design Generated! ✨",
        description: "Your nail design is ready",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
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
        body: JSON.stringify({
          userId: user?.id || "guest",
          imageUrl: generatedImage,
          prompt: prompt,
          canvasImageUrl: canvasImage,
          tags: Object.values(selectedStyles).flat(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Saved to Fire Vault! 🔥",
          description: "View it in your saved designs",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "nail-design.png";
    link.click();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* ============================================ */}
        {/* STYLES MENU - Pinterest-Style Visual Grid */}
        {/* ============================================ */}
        <section className="relative">
          <div 
            className="flex items-center justify-between cursor-pointer py-4 border-b-2 border-[#B08D57]"
            onClick={() => setShowStylesMenu(!showStylesMenu)}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-serif tracking-wider uppercase">Style Builder</h2>
              {getSelectedCount() > 0 && (
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium text-white",
                  GOLD_GRADIENT
                )}>
                  {getSelectedCount()} selected
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {getSelectedCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllSelections();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
              {showStylesMenu ? (
                <ChevronUp className="h-6 w-6 text-[#B08D57]" />
              ) : (
                <ChevronDown className="h-6 w-6 text-[#B08D57]" />
              )}
            </div>
          </div>

          {showStylesMenu && (
            <div className="mt-6 space-y-4">
              {(Object.entries(STYLE_CATEGORIES) as [CategoryKey, typeof STYLE_CATEGORIES[CategoryKey]][]).map(([key, category]) => (
                <div key={key} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                  {/* Category Header */}
                  <div
                    className={cn(
                      "flex items-center justify-between px-5 py-4 cursor-pointer transition-all",
                      expandedCategories.has(key) 
                        ? `bg-gradient-to-r ${category.color} text-white` 
                        : "bg-gray-50 hover:bg-gray-100"
                    )}
                    onClick={() => toggleCategory(key)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-medium">{category.label}</span>
                      {(selectedStyles[key]?.length || 0) > 0 && (
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-bold",
                          expandedCategories.has(key) ? "bg-white/30" : "bg-[#B08D57] text-white"
                        )}>
                          {selectedStyles[key].length}
                        </span>
                      )}
                    </div>
                    {expandedCategories.has(key) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>

                  {/* Options Grid - Pinterest Style */}
                  {expandedCategories.has(key) && (
                    <div className="p-4">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                        {category.options.map((option) => {
                          const isSelected = selectedStyles[key]?.includes(option.id);
                          return (
                            <div
                              key={option.id}
                              onClick={() => toggleStyleSelection(key, option.id)}
                              className={cn(
                                "relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 group",
                                isSelected 
                                  ? "ring-3 ring-[#D4AF37] scale-[1.02] shadow-lg" 
                                  : "hover:scale-[1.02] hover:shadow-md"
                              )}
                            >
                              {/* Thumbnail */}
                              <div className="aspect-square relative">
                                <img
                                  src={option.image}
                                  alt={option.label}
                                  className="w-full h-full object-cover"
                                />
                                {/* Overlay on hover/select */}
                                <div className={cn(
                                  "absolute inset-0 transition-all duration-200",
                                  isSelected 
                                    ? `bg-gradient-to-t ${category.color} opacity-60` 
                                    : "bg-black/0 group-hover:bg-black/20"
                                )} />
                                {/* Checkmark */}
                                {isSelected && (
                                  <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-[#D4AF37] text-sm">✓</span>
                                  </div>
                                )}
                              </div>
                              {/* Label */}
                              <div className={cn(
                                "px-2 py-2 text-center transition-all",
                                isSelected ? `bg-gradient-to-r ${category.color} text-white` : "bg-gray-50"
                              )}>
                                <span className="text-xs font-medium truncate block">{option.label}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className={cn("h-10 w-10", GOLD_TEXT)} />
            <h1 className="text-5xl font-serif tracking-widest uppercase">The Design Lab</h1>
          </div>
          <p className="text-sm text-gray-500 italic">
            Select styles above or describe your vision. Watch precision engineering create your perfect set.
          </p>
        </header>

        {/* Credit Display */}
        <div className="flex justify-center">
          <div className="bg-gray-50 px-6 py-3 rounded-full border border-gray-200">
            {isPaidMember ? (
              <span className={cn("text-sm uppercase tracking-widest", GOLD_TEXT)}>
                ♾️ Unlimited Generations
              </span>
            ) : (
              <span className="text-sm text-gray-600">
                Free Generations: <span className="font-bold">{generationsUsed}</span> / {credits}
              </span>
            )}
          </div>
        </div>

        {/* AI Generator */}
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Left: Input */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-serif mb-4">1. Upload Canvas</h3>
              <div className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                canvasImage ? "border-[#B08D57]" : "border-gray-300 hover:border-[#B08D57]"
              )}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="canvas-upload"
                />
                <label htmlFor="canvas-upload" className="cursor-pointer">
                  {canvasImage ? (
                    <img src={canvasImage} alt="Canvas" className="max-h-64 mx-auto rounded" />
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">Click to upload hand, prop, or nail stand</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-serif mb-4">2. Your Vision</h3>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Select styles above or type your vision here..."
                className="min-h-[150px] resize-none"
              />
              {getSelectedCount() > 0 && (
                <p className="text-xs text-gray-400 mt-2 italic">
                  ✨ Prompt auto-generated from your style selections
                </p>
              )}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className={cn("w-full h-14 text-sm uppercase tracking-widest", GOLD_GRADIENT, "text-white")}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Design
                </>
              )}
            </Button>
          </div>

          {/* Right: Output */}
          <div>
            <h3 className="text-2xl font-serif mb-4">3. Your Design</h3>
            <div className="bg-gray-50 rounded-lg min-h-[500px] flex items-center justify-center p-8">
              {generatedImage ? (
                <div className="space-y-4 w-full">
                  <img
                    src={generatedImage}
                    alt="Generated design"
                    className="w-full rounded-lg shadow-xl"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveToVault}
                      disabled={isSaving}
                      variant="outline"
                      className="flex-1"
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="mr-2 h-4 w-4" />
                      )}
                      Save to Vault
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>

                  {/* ============================================ */}
                  {/* SUPPLY RECOMMENDATIONS - Inline after generation */}
                  {/* ============================================ */}
                  {supplyRecommendations.length > 0 && (
                    <div className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag className="h-5 w-5 text-[#B08D57]" />
                        <h4 className="font-serif text-lg">Recommended Supplies</h4>
                      </div>
                      <p className="text-xs text-gray-500 mb-4 italic">
                        Based on your design, you may need these products:
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {supplyRecommendations.map((supply, idx) => (
                          <a
                            key={idx}
                            href={supply.link}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-[#B08D57] to-[#D4AF37] rounded-lg flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate group-hover:text-[#B08D57] transition-colors">
                                {supply.name}
                              </p>
                              <p className="text-xs text-gray-400">{supply.category}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                      <a 
                        href="/supplies" 
                        className={cn(
                          "block mt-4 text-center py-2 rounded-lg text-sm font-medium transition-all",
                          "bg-[#B08D57] text-white hover:bg-[#9a7a4a]"
                        )}
                      >
                        View Full Supply Suite →
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Sparkles className="h-16 w-16 mx-auto mb-4" />
                  <p>Your generated design will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flavor of the Month */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-serif uppercase tracking-wider">Flavor of the Month</h2>
              <p className="text-sm text-gray-500 italic mt-2">Current focus from the Technical Hub</p>
            </div>
          </div>

          <div className="relative h-[500px] overflow-hidden group rounded-lg">
            <img
              src={flavorOfMonth.image}
              alt={flavorOfMonth.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
              <div className="p-8 text-white">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2">
                  Flavor of the Month
                </span>
                <h3 className="text-3xl font-serif mb-2">{flavorOfMonth.title}</h3>
                <p className="text-sm text-gray-300 italic max-w-md">
                  {flavorOfMonth.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="grid md:grid-cols-3 gap-6">
          <a href="/saved" className="group">
            <div className="border border-gray-200 p-6 hover:border-[#B08D57] transition-all">
              <Heart className={cn("h-8 w-8 mb-4 group-hover:text-[#B08D57]")} />
              <h3 className="text-xl font-serif mb-2">Fire Vault</h3>
              <p className="text-sm text-gray-600">Your saved AI designs</p>
            </div>
          </a>

          <a href="/seasonal" className="group">
            <div className="border border-gray-200 p-6 hover:border-[#B08D57] transition-all">
              <Sparkles className={cn("h-8 w-8 mb-4 group-hover:text-[#B08D57]")} />
              <h3 className="text-xl font-serif mb-2">Seasonal Vault</h3>
              <p className="text-sm text-gray-600">Curated collections</p>
            </div>
          </a>

          <a href="/supplies" className="group">
            <div className="border border-gray-200 p-6 hover:border-[#B08D57] transition-all">
              <Crown className={cn("h-8 w-8 mb-4 group-hover:text-[#B08D57]")} />
              <h3 className="text-xl font-serif mb-2">Supply Suite</h3>
              <p className="text-sm text-gray-600">Professional products</p>
            </div>
          </a>
        </section>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-8 text-center">
            <img 
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=200" 
              alt="The Founder" 
              className="w-24 h-24 mx-auto mb-6 rounded-full object-cover"
            />
            <h2 className="text-3xl font-serif mb-4">The Founder</h2>
            <p className="text-gray-600 mb-6">
              You've used your complimentary generation. Unlock unlimited AI designs, Fire Vault, and exclusive features.
            </p>
            <div className="space-y-3">
              <a href="https://nail-check.com/membership/" target="_blank" rel="noopener noreferrer">
                <Button className={cn("w-full h-12", GOLD_GRADIENT, "text-white")}>
                  Become a Member - $8.99/mo
                </Button>
              </a>
              <Button
                onClick={() => setShowPaywall(false)}
                variant="ghost"
                className="w-full"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}