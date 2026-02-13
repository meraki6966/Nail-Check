import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, Upload, Wand2, Download, Heart, Loader2, Crown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const GOLD_TEXT = "text-[#B08D57]";
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState("");
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
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
    // Check credits before generation
    if (!isPaidMember && generationsUsed >= credits) {
      setShowPaywall(true);
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe your nail design",
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
          canvasImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);

      // Use a credit after successful generation
      const userId = user?.id || "guest";
      await fetch("/api/user/use-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      // Refresh credits
      await fetchCredits();

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
          tags: [],
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
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className={cn("h-10 w-10", GOLD_TEXT)} />
            <h1 className="text-6xl font-serif tracking-widest uppercase">The Design Lab</h1>
          </div>
          <p className="text-sm text-gray-500 italic">
            Upload your canvas. Describe your vision. Watch precision engineering create your perfect set.
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
              <h3 className="text-2xl font-serif mb-4">2. Describe Your Vision</h3>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Chrome french tips with gold accent, glossy finish, minimalist elegance..."
                className="min-h-[150px] resize-none"
              />
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