import { useState, useEffect } from "react";
import { useTutorials } from "@/hooks/use-tutorials";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { TutorialCard } from "@/components/TutorialCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Loader2, Sparkles, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_MESSAGES = [
  "Analyzing Silhouette...",
  "Applying 3D Textures...",
  "Curing High-Gloss Finish...",
  "Refining NYC Detail...",
  "Capturing Masterpiece..."
];

const NAIL_ART_DATA = [
  { id: "1", title: "French Chrome Minimalist", category: "Minimalist", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-french-chrome-minimalist.jpg", description: "Clean, classic technical elegance." },
  { id: "2", title: "Technical Gold", category: "Minimalist", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-manhattan-gold-minimalist.jpg", description: "Minimalist luxury gold detailing." },
  { id: "3", title: "Structural 3D", category: "Architect", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-staten-island-3d-sculpt.jpg", description: "Intricate architectural 3D sculpting." },
  { id: "4", title: "Metro Chrome", category: "Minimalist", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-bronx-chrome-minimalist.jpg", description: "High-shine urban chrome finish." },
  { id: "5", title: "Technical Dimension", category: "Architect", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-brooklyn-textured-dimension.jpg", description: "Textured layers with technical depth." },
  { id: "6", title: "Modern Chrome", category: "Minimalist", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-manhattan-chrome-minimalist.jpg", description: "Liquid silver elite style." },
  { id: "7", title: "Elite 3D Sculpt", category: "Architect", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-queens-ny-3d-sculpt.jpg", description: "Bold, 3D structural art." },
  { id: "8", title: "Elite Signature Gloss", category: "Minimalist", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nyc-signature-gloss.jpg", description: "The essential high-gloss finish." },
  { id: "9", title: "Technical Signature", category: "Minimalist", url: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-staten-island.jpg", description: "Classic technical signature look." },
  { id: "10", title: "App Store Spotlight", category: "Minimalist", url: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-staten-island-appstore.jpeg", description: "Featured App Store design." },
  { id: "11", title: "Elite Collection", category: "Minimalist", url: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-staten-island-amazon.jpeg", description: "Featured technical collection art." },
  { id: "12", title: "Technical Heritage", category: "Minimalist", url: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-brooklyn.jpg", description: "Traditional elite luxury." },
  { id: "13", title: "Elite Tutorial", category: "Architect", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial.jpg", description: "Advanced technique showcase." },
  { id: "14", title: "Technical Flow", category: "Minimalist", url: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-staten-island-manhattan.jpg", description: "Connecting technical styles." },
  { id: "15", title: "Masterpiece Sculpt", category: "Architect", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-technical-sculpt.jpg", description: "Signature 3D art masterpiece." },
  { id: "16", title: "Advanced Texture", category: "Architect", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-tri-state.jpg", description: "Complex technical 3D textures." },
  { id: "17", title: "Personal Style", category: "Minimalist", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-my-style.jpg", description: "Personal style technical set." },
  { id: "18", title: "Architectural TX", category: "Architect", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-texas-league-city.jpg", description: "Structural 3D masterpiece." },
  { id: "19", title: "Modern Master Trends", category: "Glass", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-trends.jpg", description: "The future of elite nail art." }
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showGallery, setShowGallery] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(() => {
    const saved = localStorage.getItem("generationCount");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [selectedItem, setSelectedItem] = useState<typeof NAIL_ART_DATA[0] | null>(null);
  const [vault, setVault] = useState<{url: string, id: string}[]>(() => {
    const saved = localStorage.getItem("nailCheckGallery");
    return saved ? JSON.parse(saved) : [];
  });

  // Spotlight state
  const [spotlight, setSpotlight] = useState(() => {
    const saved = localStorage.getItem("nailCheckSpotlight");
    return saved ? JSON.parse(saved) : {
      url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-trends.jpg",
      caption: "February Pick: The Glass Architect"
    };
  });

  useEffect(() => {
    localStorage.setItem("nailCheckSpotlight", JSON.stringify(spotlight));
  }, [spotlight]);

  const handleSpotlightUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSpotlight((prev: any) => ({ ...prev, url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    localStorage.setItem("generationCount", generationCount.toString());
  }, [generationCount]);

  useEffect(() => {
    localStorage.setItem("nailCheckGallery", JSON.stringify(vault));
  }, [vault]);

  const enhancePrompt = (prompt: string) => {
    return `${prompt}, high-end editorial nail photography, macro lens, 8k resolution, luxury lighting, flawless execution, professional hand model`;
  };

  const handleStylePreset = (preset: string) => {
    let additive = "";
    if (preset === "Minimalist") additive = "minimalist, neutral tones, sheer nude finish, short square";
    if (preset === "Architect") additive = "3D textures, structural elements, matte";
    if (preset === "Glass") additive = "high-gloss jelly finish, translucent";
    setAiPrompt(prev => prev ? `${prev}, ${additive}` : additive);
    
    // Auto scroll to gallery
    const gallery = document.getElementById("member-gallery");
    if (gallery) {
      setShowGallery(true);
      setTimeout(() => {
        gallery.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handleGenerate = async () => {
    if (generationCount >= 3) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: enhancePrompt(aiPrompt)
        }),
      });
      
      if (!response.ok) throw new Error("Failed to generate");
      
      const data = await response.json();
      setGeneratedImage(`data:${data.mimeType};base64,${data.b64_json}`);
      setGenerationCount(prev => prev + 1);
    } catch (error) {
      console.error("AI Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToVault = () => {
    if (!generatedImage) return;
    const newEntry = { url: generatedImage, id: Date.now().toString() };
    setVault(prev => [newEntry, ...prev]);
  };

  const handleSave = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `nail-design-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (val.length > 0) setShowGallery(true);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setShowGallery(true);
    setTimeout(() => {
      const gallery = document.getElementById("member-gallery");
      if (gallery) gallery.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const tutorials = NAIL_ART_DATA.filter(t => {
    const matchesSearch = !search || 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-8 flex flex-col overflow-x-hidden">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4"
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">
            Nail Check
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The Nationwide Technical Hub for Nail Professionals.
          </p>
        </div>

        {/* AI Generator Section */}
        <div className="max-w-4xl mx-auto w-full mb-12 px-4">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Nail Set Designer
            </h2>
            
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {["Minimalist", "Architect", "Glass"].map(style => (
                <button
                  key={style}
                  onClick={() => handleStylePreset(style)}
                  className="bg-foreground text-background text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-none hover:opacity-80 transition-opacity whitespace-nowrap"
                >
                  {style}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative flex-grow">
                <Input
                  placeholder="Describe your dream technical nail set..."
                  className="h-12 rounded-2xl border-border/60 focus:border-primary focus:ring-primary/20 bg-background"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !aiPrompt || generationCount >= 3}
                className="h-14 w-full md:w-auto md:fixed md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:z-50 rounded-full bg-foreground text-background font-display tracking-[0.2em] text-xs uppercase shadow-2xl hover:scale-105 transition-transform"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {LOADING_MESSAGES[loadingMsgIdx]}
                  </>
                ) : (
                  "Generate Design"
                )}
              </Button>
            </div>
            
            {/* AI Result Area with Paywall Overlay */}
            {(isGenerating || generatedImage || generationCount >= 3) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-3xl overflow-hidden border border-border/50 aspect-video bg-muted/30 flex flex-col items-center justify-center relative"
              >
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-muted-foreground animate-pulse">{LOADING_MESSAGES[loadingMsgIdx]}</p>
                  </div>
                ) : (
                  <>
                    {generatedImage && (
                      <img 
                        src={generatedImage} 
                        alt="Generated Nail Set" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {generationCount >= 3 && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-background/40 backdrop-blur-xl" />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative z-20 bg-background border border-border p-6 md:p-10 rounded-3xl shadow-2xl max-w-sm text-center space-y-6"
                        >
                          <h3 className="text-xl font-display font-bold text-foreground">
                            Unlock the Full Silhouette
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Join the Inner Circle for unlimited AI generation, elite supply lists, and the Collab Hub.
                          </p>
                          <a 
                            href="https://nail-check.com/membership/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Button className="w-full h-12 rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold tracking-widest uppercase text-[10px]">
                              UPGRADE ACCESS
                            </Button>
                          </a>
                        </motion.div>
                      </div>
                    )}

                    {generatedImage && generationCount < 3 && (
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                        <Button 
                          onClick={handleSaveToVault}
                          variant="ghost"
                          className="flex-1 rounded-none bg-foreground text-background text-[10px] uppercase tracking-[0.2em] h-10 border-none hover:bg-foreground/80"
                        >
                          Save to Vault
                        </Button>
                        <Button 
                          onClick={handleSave}
                          variant="ghost"
                          className="rounded-full bg-background/80 backdrop-blur-md border border-border/50 hover:bg-background h-10 w-10 p-0 flex items-center justify-center"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Flavor of the Month Section */}
        <div className="max-w-4xl mx-auto w-full mb-12 px-4 relative">
          <h2 className="text-xl font-display font-bold mb-6 tracking-[0.3em] uppercase text-center italic">Flavor of the Month</h2>
          
          {/* Admin Control */}
          <div className="absolute top-0 right-4 z-20">
            <label className="cursor-pointer bg-foreground text-background px-3 py-1 text-[8px] uppercase tracking-widest rounded-full opacity-50 hover:opacity-100 transition-opacity">
              Admin: Replace Spotlight
              <input type="file" className="hidden" accept="image/*" onChange={handleSpotlightUpdate} />
            </label>
          </div>

          <div className="relative group overflow-hidden rounded-3xl border border-border shadow-lg aspect-video md:aspect-[21/9]">
            <img 
              src={spotlight.url} 
              alt="Flavor of the Month" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 flex items-end p-8">
              <div className="text-white space-y-2">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">February Highlight</span>
                <div className="flex items-center gap-2">
                  <Input 
                    value={spotlight.caption}
                    onChange={(e) => setSpotlight((prev: any) => ({ ...prev, caption: e.target.value }))}
                    className="bg-transparent border-none text-2xl font-display font-bold tracking-tight text-white p-0 h-auto focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Local Gallery View */}
        {vault.length > 0 && (
          <div id="gallery-view" className="max-w-4xl mx-auto w-full mb-12 p-6 rounded-3xl bg-background/40 backdrop-blur-xl border border-border/50 shadow-xl px-4 mx-4">
            <h2 className="text-xl font-display font-bold mb-6 tracking-[0.3em] uppercase text-center">The Vault</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vault.map((item) => (
                <div key={item.id} className="aspect-square rounded-none overflow-hidden border border-border/20 group relative">
                  <img src={item.url} alt="Vaulted Design" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-white hover:text-primary"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = item.url;
                        link.download = `vault-design-${item.id}.png`;
                        link.click();
                      }}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur py-4 -mx-4 px-4 border-b border-border/40 md:static md:bg-transparent md:border-none md:p-0">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-grow">
              {["all", "Architect", "Glass", "Minimalist"].map((cat) => (
                <Button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  variant={activeCategory === cat ? "default" : "outline"}
                  className="rounded-full h-10 px-6 capitalize whitespace-nowrap"
                >
                  {cat === "all" ? "All" : cat}
                </Button>
              ))}
            </div>
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search styles..."
                className="pl-10 h-10 rounded-full border-border/60 focus:border-primary focus:ring-primary/20 bg-card"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Member Gallery Toggle */}
        <div className="flex justify-center my-8">
          <Button 
            onClick={() => setShowGallery(!showGallery)}
            variant="outline"
            className="rounded-full px-8 h-12 font-display font-bold tracking-widest uppercase text-xs"
          >
            {showGallery ? "Hide Member Gallery" : "Open Member Gallery"}
          </Button>
        </div>

        {/* Content Grid - Togglable Member Gallery */}
        <div 
          id="member-gallery" 
          className={cn(
            "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 transition-all duration-500 px-4",
            showGallery ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0 overflow-hidden"
          )}
        >
          {tutorials.length > 0 ? (
            tutorials.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`card-${item.id}`}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer rounded-xl overflow-hidden bg-card border border-border/40 shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5">{item.category}</p>
                    <h3 className="font-display font-bold truncate text-sm">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-muted-foreground font-display tracking-widest uppercase text-sm">More designs coming soon to this section!</p>
            </div>
          )}
        </div>

        {/* Item Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
              <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none h-screen md:h-auto md:max-h-[90vh]">
                <div className="flex flex-col h-full">
                  <div className="relative aspect-square md:aspect-video shrink-0">
                    <img 
                      src={selectedItem.url} 
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedItem(null)}
                      className="absolute top-4 right-4 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="p-6 md:p-8 space-y-4 overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                        {selectedItem.category}
                      </span>
                    </div>
                    <DialogTitle className="text-3xl font-display font-bold">
                      {selectedItem.title}
                    </DialogTitle>
                    <DialogDescription className="text-lg text-muted-foreground leading-relaxed">
                      {selectedItem.description}
                    </DialogDescription>
                    <div className="pt-4 pb-8">
                      <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                        View Tutorial Steps
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        <footer className="mt-auto py-8 border-t border-border/40 shrink-0">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-6 text-sm text-muted-foreground/60">
              <a href="https://nail-check.com/terms-of-service/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="https://nail-check.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </div>
            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mt-4">
              © 2026 Nail Check Hub. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
