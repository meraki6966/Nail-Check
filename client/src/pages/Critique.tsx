import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Sparkles, Upload, Loader2, Crown, X, ShoppingBag, BookOpen, Play, Heart, Camera, Link, Star, CheckCircle, AlertCircle, TrendingUp, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ============================================
// COLOR PALETTE
// ============================================
const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";
const CYAN_GRADIENT = "bg-gradient-to-r from-[#00D9FF] to-[#9B5DE5]";

// ============================================
// CRITIQUE RESULT INTERFACE
// ============================================
interface CritiqueResult {
  overallScore: number;
  styleDetected: string;
  shapeDetected: string;
  whatWorks: string[];
  areasToImprove: string[];
  technicalNotes: string;
  suggestedStyles: string[];
  suggestedProducts: string[];
  skillLevel: string;
}

interface CritiqueResponse {
  critique: CritiqueResult;
  recommendations: {
    tutorials: any[];
    supplies: any[];
  };
}

export default function Critique() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // ============================================
  // STATE
  // ============================================
  const [critiqueImage, setCritiqueImage] = useState<string | null>(null);
  const [critiqueImageUrl, setCritiqueImageUrl] = useState("");
  const [isCritiquing, setIsCritiquing] = useState(false);
  const [critiqueResult, setCritiqueResult] = useState<CritiqueResponse | null>(null);
  const [critiqueInputMode, setCritiqueInputMode] = useState<"upload" | "url" | "vault">("upload");
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  const [credits, setCredits] = useState(1);
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [isPaidMember, setIsPaidMember] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    fetchCredits();
  }, [user]);

  useEffect(() => {
    if (critiqueInputMode === "vault") {
      fetchSavedDesigns();
    }
  }, [critiqueInputMode]);

  // ============================================
  // FETCH FUNCTIONS
  // ============================================
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

  const fetchSavedDesigns = async () => {
    try {
      const userId = user?.id || "guest";
      const response = await fetch(`/api/designs?userId=${userId}`);
      const designs = await response.json();
      setSavedDesigns(designs);
    } catch (error) {
      console.error("Failed to fetch saved designs:", error);
    }
  };

  // ============================================
  // IMAGE HANDLERS
  // ============================================
  const handleCritiqueImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCritiqueImage(event.target?.result as string);
        setCritiqueResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCritiqueFromUrl = () => {
    if (critiqueImageUrl.trim()) {
      setCritiqueImage(critiqueImageUrl);
      setCritiqueResult(null);
    }
  };

  const handleCritiqueFromVault = (design: any) => {
    setCritiqueImage(design.imageUrl);
    setCritiqueResult(null);
  };

  const clearCritiqueImage = () => {
    setCritiqueImage(null);
    setCritiqueImageUrl("");
    setCritiqueResult(null);
  };

  // ============================================
  // AI CRITIQUE HANDLER
  // ============================================
  const handleCritique = async () => {
    if (!isPaidMember && generationsUsed >= credits) {
      setShowPaywall(true);
      return;
    }

    if (!critiqueImage) {
      toast({
        title: "No image selected",
        description: "Please upload or select an image to critique",
        variant: "destructive"
      });
      return;
    }

    setIsCritiquing(true);
    setCritiqueResult(null);

    try {
      // Determine if we're sending base64 or URL
      const isBase64 = critiqueImage.startsWith("data:");

      const response = await fetch("/api/ai/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(isBase64 ? { image: critiqueImage } : { imageUrl: critiqueImage }),
      });

      if (!response.ok) throw new Error("Failed to analyze image");

      const data: CritiqueResponse = await response.json();
      setCritiqueResult(data);

      // Use credit
      const userId = user?.id || "guest";
      await fetch("/api/ai/critique/use-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      setGenerationsUsed(prev => prev + 1);

      toast({
        title: "Analysis Complete! 💅",
        description: `Score: ${data.critique.overallScore}/10 - ${data.critique.styleDetected}`
      });

    } catch (error) {
      console.error("Critique error:", error);
      toast({
        title: "Analysis failed",
        description: "Please try again with a different image",
        variant: "destructive"
      });
    } finally {
      setIsCritiquing(false);
    }
  };

  // ============================================
  // HELPERS
  // ============================================
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    if (score >= 4) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return "from-green-400 to-emerald-500";
    if (score >= 6) return "from-yellow-400 to-amber-500";
    if (score >= 4) return "from-orange-400 to-orange-500";
    return "from-red-400 to-red-500";
  };

  const getSkillBadgeColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner": return "bg-gradient-to-r from-[#10B981] to-[#34D399]";
      case "intermediate": return "bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]";
      case "advanced": return "bg-gradient-to-r from-[#EF4444] to-[#F87171]";
      case "competition": return "bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]";
      default: return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* HEADER */}
        <header className="text-center space-y-4">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#9B5DE5] transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Design Lab
          </a>
          <div className="flex items-center justify-center gap-3">
            <Star className="h-10 w-10 text-[#9B5DE5]" />
            <h1 className="text-5xl font-serif tracking-widest uppercase bg-gradient-to-r from-[#9B5DE5] via-[#00D9FF] to-[#FF6B9D] bg-clip-text text-transparent">
              AI Nail Critique
            </h1>
          </div>
          <p className="text-sm text-gray-500 italic max-w-2xl mx-auto">
            Upload your nail work and get instant feedback from our AI nail tech expert.
            Receive a score, detailed critique, and personalized recommendations for tutorials and supplies.
          </p>
        </header>

        {/* Credits */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-[#F8F0FF] to-[#F0FFFF] px-6 py-3 rounded-full border border-[#9B5DE5]/30">
            {isPaidMember ? (
              <span className="text-sm uppercase tracking-widest bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent font-semibold">
                ♾️ Unlimited Critiques
              </span>
            ) : (
              <span className="text-sm text-gray-600">
                Free Uses: <span className="font-bold text-[#9B5DE5]">{generationsUsed}</span> / {credits}
              </span>
            )}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* Left: Upload/Select Image */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
              1. Select Your Nail Image
            </h3>

            {/* Input Mode Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setCritiqueInputMode("upload")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                  critiqueInputMode === "upload"
                    ? "bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Upload className="h-4 w-4" /> Upload
              </button>
              <button
                onClick={() => setCritiqueInputMode("url")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                  critiqueInputMode === "url"
                    ? "bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Link className="h-4 w-4" /> URL
              </button>
              <button
                onClick={() => setCritiqueInputMode("vault")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                  critiqueInputMode === "vault"
                    ? "bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Heart className="h-4 w-4" /> Fire Vault
              </button>
            </div>

            {/* Upload Mode */}
            {critiqueInputMode === "upload" && (
              <div
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                  critiqueImage ? "border-[#9B5DE5] bg-[#F8F0FF]" : "border-gray-300 hover:border-[#9B5DE5] hover:bg-[#F8F0FF]"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCritiqueImageUpload}
                  className="hidden"
                />
                {critiqueImage && critiqueInputMode === "upload" ? (
                  <div className="relative">
                    <img src={critiqueImage} alt="Critique" className="max-h-64 mx-auto rounded-xl" />
                    <button
                      onClick={(e) => { e.stopPropagation(); clearCritiqueImage(); }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Camera className="h-12 w-12 mx-auto mb-4 text-[#9B5DE5]" />
                    <p className="text-gray-600 font-medium">Click to upload or take a photo</p>
                    <p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, WEBP</p>
                  </>
                )}
              </div>
            )}

            {/* URL Mode */}
            {critiqueInputMode === "url" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={critiqueImageUrl}
                    onChange={(e) => setCritiqueImageUrl(e.target.value)}
                    placeholder="Paste image URL here..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9B5DE5] focus:outline-none focus:ring-2 focus:ring-[#9B5DE5]/20"
                  />
                  <Button
                    onClick={handleCritiqueFromUrl}
                    disabled={!critiqueImageUrl.trim()}
                    className="bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] text-white rounded-xl px-6"
                  >
                    Load
                  </Button>
                </div>
                {critiqueImage && critiqueInputMode === "url" && (
                  <div className="relative">
                    <img src={critiqueImage} alt="Critique" className="max-h-64 mx-auto rounded-xl" />
                    <button
                      onClick={clearCritiqueImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Fire Vault Mode */}
            {critiqueInputMode === "vault" && (
              <div className="space-y-4">
                {savedDesigns.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-2">
                    {savedDesigns.map((design) => (
                      <div
                        key={design.id}
                        onClick={() => handleCritiqueFromVault(design)}
                        className={cn(
                          "aspect-square rounded-xl overflow-hidden cursor-pointer transition-all",
                          critiqueImage === design.imageUrl
                            ? "ring-4 ring-[#9B5DE5] scale-[1.02]"
                            : "hover:scale-[1.02] hover:shadow-lg"
                        )}
                      >
                        <img src={design.imageUrl} alt={design.prompt} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">No saved designs yet</p>
                    <p className="text-sm mt-1">Generate some designs first!</p>
                    <a href="/" className="inline-block mt-4 text-[#9B5DE5] hover:underline text-sm">
                      Go to Design Lab →
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Critique Button */}
            <Button
              onClick={handleCritique}
              disabled={isCritiquing || !critiqueImage}
              className={cn(
                "w-full h-14 text-sm uppercase tracking-widest rounded-full transition-all",
                "bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] text-white hover:shadow-lg hover:shadow-[#9B5DE5]/30",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isCritiquing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Your Nails...</>
              ) : (
                <><Star className="mr-2 h-5 w-5" /> Get AI Critique</>
              )}
            </Button>

            {/* Tips */}
            <div className="bg-gradient-to-r from-[#F8F0FF] to-[#F0FFFF] rounded-2xl p-5 border border-[#9B5DE5]/10">
              <h4 className="font-semibold text-[#9B5DE5] mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Tips for Best Results
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#9B5DE5]">•</span>
                  Use good lighting - natural light works best
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9B5DE5]">•</span>
                  Hold your hand steady against a plain background
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9B5DE5]">•</span>
                  Show all 5 nails clearly in frame
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9B5DE5]">•</span>
                  Avoid blurry or dark images
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Critique Results */}
          <div>
            <h3 className="text-2xl font-serif mb-4 bg-gradient-to-r from-[#00D9FF] to-[#9B5DE5] bg-clip-text text-transparent">
              2. Your Critique
            </h3>

            <div className="bg-gradient-to-br from-[#F8F0FF] to-[#F0FFFF] rounded-2xl min-h-[600px] p-6">
              {critiqueResult ? (
                <div className="space-y-6">
                  {/* Score Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Overall Score</p>
                        <p className={cn("text-5xl font-bold", getScoreColor(critiqueResult.critique.overallScore))}>
                          {critiqueResult.critique.overallScore}/10
                        </p>
                      </div>
                      <div className={cn("w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center", getScoreGradient(critiqueResult.critique.overallScore))}>
                        <Star className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-gray-500 text-xs uppercase">Style Detected</p>
                        <p className="font-semibold text-[#9B5DE5]">{critiqueResult.critique.styleDetected}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-gray-500 text-xs uppercase">Shape</p>
                        <p className="font-semibold text-[#FF6B9D]">{critiqueResult.critique.shapeDetected}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                        <p className="text-gray-500 text-xs uppercase mb-1">Skill Level</p>
                        <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-bold text-white", getSkillBadgeColor(critiqueResult.critique.skillLevel))}>
                          {critiqueResult.critique.skillLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* What Works */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <h4 className="font-semibold text-green-700">What's Working</h4>
                    </div>
                    <ul className="space-y-2">
                      {critiqueResult.critique.whatWorks.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas to Improve */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-amber-500" />
                      <h4 className="font-semibold text-amber-700">Areas to Improve</h4>
                    </div>
                    <ul className="space-y-2">
                      {critiqueResult.critique.areasToImprove.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-amber-500 mt-0.5">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Notes */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-[#9B5DE5]" />
                      <h4 className="font-semibold text-[#9B5DE5]">Technical Notes</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{critiqueResult.critique.technicalNotes}</p>
                  </div>

                  {/* Recommended Tutorials */}
                  {critiqueResult.recommendations.tutorials.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="h-5 w-5 text-[#FF6B9D]" />
                        <h4 className="font-semibold">Recommended Tutorials</h4>
                      </div>
                      <div className="space-y-3">
                        {critiqueResult.recommendations.tutorials.map((tutorial: any) => (
                          <a
                            key={tutorial.id}
                            href={`/the-learning-lab`}
                            className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] rounded-xl hover:shadow-md transition-all group"
                          >
                            {tutorial.imageSource && (
                              <img src={tutorial.imageSource} alt={tutorial.title} className="w-16 h-16 rounded-lg object-cover" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium group-hover:text-[#FF6B9D] transition-colors">{tutorial.title}</p>
                              <p className="text-xs text-gray-500">{tutorial.difficultyLevel} • {tutorial.styleCategory}</p>
                            </div>
                            <Play className="h-5 w-5 text-[#FF6B9D] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Supplies */}
                  {critiqueResult.recommendations.supplies.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
                        <h4 className="font-semibold">Recommended Supplies</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {critiqueResult.recommendations.supplies.map((supply: any) => (
                          <a
                            key={supply.id}
                            href={`/supplies`}
                            className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#FFFBF0] to-[#FFF5F8] rounded-xl hover:shadow-md transition-all group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B08D57] rounded-xl flex items-center justify-center flex-shrink-0">
                              <ShoppingBag className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate group-hover:text-[#D4AF37] transition-colors">{supply.name}</p>
                              <p className="text-xs text-gray-400">{supply.category}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Try Again Button */}
                  <Button
                    onClick={clearCritiqueImage}
                    variant="outline"
                    className="w-full rounded-full border-[#9B5DE5] text-[#9B5DE5] hover:bg-[#9B5DE5] hover:text-white"
                  >
                    Critique Another Image
                  </Button>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-gray-400 min-h-[400px]">
                  <div>
                    <Star className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">Upload an image and click "Get AI Critique"</p>
                    <p className="text-sm mt-2">to receive your personalized analysis</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-8 text-center rounded-3xl">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] flex items-center justify-center">
              <Crown className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-serif mb-4 bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
              Unlock Unlimited
            </h2>
            <p className="text-gray-600 mb-6">
              You've used your complimentary critique. Unlock unlimited AI critiques, Fire Vault, and exclusive features.
            </p>
            <div className="space-y-3">
              <a href="/subscribe">
                <Button className={cn("w-full h-12 rounded-full", PURPLE_GRADIENT, "text-white")}>
                  Subscribe — From $8.99/mo
                </Button>
              </a>
              <Button onClick={() => setShowPaywall(false)} variant="ghost" className="w-full text-gray-500 hover:text-[#9B5DE5]">
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}