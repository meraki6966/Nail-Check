import { useState, useEffect } from "react";
import { useTutorials } from "@/hooks/use-tutorials";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { TutorialCard } from "@/components/TutorialCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  { id: "1", title: "French Chrome Minimalist", category: "signature", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-french-chrome-minimalist.jpg", description: "Clean, classic NYC elegance." },
  { id: "2", title: "Manhattan Gold", category: "signature", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-manhattan-gold-minimalist.jpg", description: "Minimalist luxury gold detailing." },
  { id: "3", title: "Staten Island 3D", category: "masterpiece", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-staten-island-3d-sculpt.jpg", description: "Intricate architectural 3D sculpting." },
  { id: "4", title: "Bronx Chrome", category: "signature", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-bronx-chrome-minimalist.jpg", description: "High-shine urban chrome finish." },
  { id: "5", title: "Brooklyn Dimension", category: "masterpiece", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-brooklyn-textured-dimension.jpg", description: "Textured layers with NYC depth." },
  { id: "6", title: "Manhattan Chrome", category: "signature", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-manhattan-chrome-minimalist.jpg", description: "Liquid silver Manhattan style." },
  { id: "7", title: "Queens 3D Sculpt", category: "masterpiece", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-queens-ny-3d-sculpt.jpg", description: "Bold, 3D structural art." },
  { id: "8", title: "NYC Signature Gloss", category: "signature", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nyc-signature-gloss.jpg", description: "The essential high-gloss finish." },
  { id: "9", title: "Staten Island Signature", category: "signature", url: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-andrea-staten-island.jpg", description: "Andrea's classic Staten Island look." },
  { id: "10", title: "App Store Spotlight", category: "signature", url: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-andrea-staten-island-appstore.jpeg", description: "Featured App Store design." },
  { id: "11", title: "Amazon Collection", category: "signature", url: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-andrea-staten-island-amazon.jpeg", description: "Featured Amazon Kindle collection art." },
  { id: "12", title: "Brooklyn Heritage", category: "signature", url: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-andrea-brooklyn.jpg", description: "Traditional Brooklyn luxury." },
  { id: "13", title: "Elite Tutorial", category: "masterpiece", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial.jpg", description: "Advanced technique showcase." },
  { id: "14", title: "Tri-State Flow", category: "signature", url: "http://nail-check.com/wp-content/uploads/2026/01/naii-check-andrea-staten-island-manhattan.jpg", description: "Connecting NYC styles." },
  { id: "15", title: "Andrea's Masterpiece", category: "masterpiece", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-andrea-rodriguez.jpg", description: "Signature 3D art by Andrea." },
  { id: "16", title: "Tri-State Texture", category: "masterpiece", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-tri-state.jpg", description: "Complex regional 3D textures." },
  { id: "17", title: "Personal Signature", category: "signature", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-my-style.jpg", description: "Personal style minimalist set." },
  { id: "18", title: "League City Texas", category: "masterpiece", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-texas-league-city.jpg", description: "Texas-inspired 3D masterpiece." },
  { id: "19", title: "Modern Master Trends", category: "masterpiece", url: "http://nail-check.com/wp-content/uploads/2026/01/nailcheck-nail-tutorial-trends.jpg", description: "The future of 3D nail art." }
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(() => {
    const saved = localStorage.getItem("generationCount");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [selectedItem, setSelectedItem] = useState<typeof NAIL_ART_DATA[0] | null>(null);

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

  const handleGenerate = async () => {
    if (generationCount >= 3) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `${aiPrompt}. Professional NYC luxury nail photography, 8k resolution, macro 3D detail.` 
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

  const handleSave = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `nail-design-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tutorials = NAIL_ART_DATA.filter(t => {
    const matchesSearch = !search || 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const styleOptions = [
    { value: "signature", label: "Signature" },
    { value: "masterpiece", label: "Masterpiece" }
  ];

  return (
    <Layout>
      <div className="space-y-8 flex flex-col">
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
            Discover Your Next Look
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated collection of luxury nail art and find the perfect style for your next NYC masterpiece.
          </p>
        </div>

        {/* AI Generator Section */}
        <div className="max-w-4xl mx-auto w-full mb-12">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Nail Set Designer
            </h2>
            <div className="flex flex-col gap-4">
              <div className="relative flex-grow">
                <Input
                  placeholder="Describe your dream NYC nail set..."
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
            
            {/* Limit Reached Message */}
            {generationCount >= 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center"
              >
                <p className="text-foreground font-medium mb-4">
                  Free Limit Reached. Join the Inner Circle for Unlimited Generations.
                </p>
                <a href="https://nail-check.com/membership" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                    Join the Inner Circle
                  </Button>
                </a>
              </motion.div>
            )}
            
            {/* AI Result Area */}
            {(isGenerating || generatedImage) && (
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
                ) : generatedImage ? (
                  <>
                    <img 
                      src={generatedImage} 
                      alt="Generated Nail Set" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button 
                        onClick={handleSave}
                        variant="ghost"
                        className="rounded-full bg-background/80 backdrop-blur-md border border-border/50 hover:bg-background h-10 px-4 flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Save to Gallery
                      </Button>
                    </div>
                  </>
                ) : null}
              </motion.div>
            )}
          </div>
        </div>

        {/* Filters & Search */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur py-4 -mx-4 px-4 border-b border-border/40 md:static md:bg-transparent md:border-none md:p-0">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search styles, techniques..."
                className="pl-10 h-11 rounded-full border-border/60 focus:border-primary focus:ring-primary/20 bg-card"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger className="w-full md:w-[220px] h-11 rounded-full bg-card border-border/60 capitalize">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                {styleOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value} className="capitalize">{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Grid - 2 Column Always (Mobile First) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {tutorials.map((item) => (
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
          ))}
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
              <a href="#" className="hover:text-primary transition-colors" onClick={(e) => {
                e.preventDefault();
                alert("Forgot password flow initiated. Check your email for instructions.");
              }}>
                Forgot Password?
              </a>
            </div>
            <p className="text-xs text-muted-foreground/40">© 2026 Nail Check New York City</p>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
