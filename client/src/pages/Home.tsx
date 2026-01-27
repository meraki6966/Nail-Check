import { useState } from "react";
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
import { Search, Loader2, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAIL_ART_DATA = [
  { id: "1", title: "Staten Island Main", category: "signature", url: "https://images.unsplash.com/photo-1604654894610-df490982570d?w=800", description: "Clean, classic NYC lines." },
  { id: "2", title: "Brooklyn Series", category: "masterpiece", url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800", description: "3D sculpted urban textures." },
  { id: "3", title: "Modern Trends", category: "masterpiece", url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800", description: "High-concept 3D art." },
  { id: "4", title: "Hillside 3D Sculpt", category: "masterpiece", url: "https://images.unsplash.com/photo-1599940828174-817392259c4b?w=800", description: "Intricate 3D floral layers." },
  { id: "5", title: "League City", category: "masterpiece", url: "https://images.unsplash.com/photo-1600057033583-93348123282f?w=800", description: "Texas-sized luxury 3D set." },
  { id: "6", title: "Manhattan Chrome", category: "signature", url: "https://images.unsplash.com/photo-1522337660859-02fbefad157a?w=800", description: "Liquid metal finish." },
  { id: "7", title: "SoHo Minimalist", category: "signature", url: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800", description: "High-end chic simplicity." },
  { id: "8", title: "Queens Quicks", category: "signature", url: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=800", description: "Fast-paced NYC style." },
  { id: "9", title: "Bronx Bold", category: "masterpiece", url: "https://images.unsplash.com/photo-1516760568612-a8da0558d955?w=800", description: "Graffiti-inspired 3D textures." },
  { id: "10", title: "Harlem Gold", category: "masterpiece", url: "https://images.unsplash.com/photo-1571290274554-e94521ce8321?w=800", description: "24k gold leaf masterpiece." },
  { id: "11", title: "Wall Street Matte", category: "signature", url: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800", description: "Powerful matte black finish." },
  { id: "12", title: "Empire State Chrome", category: "signature", url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800", description: "Liquid silver NYC finish." },
  { id: "13", title: "Brooklyn 3D Sculpt", category: "masterpiece", url: "https://images.unsplash.com/photo-1604654894610-df490982570d?w=800", description: "Architectural 3D scaling." },
  { id: "14", title: "Park Avenue Pearl", category: "signature", url: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800", description: "Timeless Upper East Side look." },
  { id: "15", title: "SoHo Structural Gold", category: "masterpiece", url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800", description: "Hand-sculpted gold filigree." },
  { id: "16", title: "Statue of Liberty Patina", category: "masterpiece", url: "https://images.unsplash.com/photo-1632345031024-8727f6897d53?w=800", description: "Oxidized copper 3D textures." },
  { id: "17", title: "Manhattan Midnight", category: "signature", url: "https://images.unsplash.com/photo-1522337660859-02fbefad157a?w=800", description: "Ultra-deep navy shimmer." },
  { id: "18", title: "Tribeca Textures", category: "masterpiece", url: "https://images.unsplash.com/photo-1599940828174-817392259c4b?w=800", description: "Multi-layered mixed media." },
  { id: "19", title: "Wall Street Luxe", category: "signature", url: "https://images.unsplash.com/photo-1600057033583-93348123282f?w=800", description: "Gold-leaf accent business chic." }
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState<typeof NAIL_ART_DATA[0] | null>(null);

  const handleGenerate = async () => {
    if (generationCount >= 1) return;

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
      <div className="space-y-8">
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
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Nail Set Designer
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
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
                disabled={isGenerating || !aiPrompt || generationCount >= 1}
                className="h-12 px-8 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Designing...
                  </>
                ) : (
                  "Generate with AI"
                )}
              </Button>
            </div>
            
            {/* Paywall Message */}
            {generationCount >= 1 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center"
              >
                <p className="text-foreground font-medium mb-4">
                  You've unlocked your first NYC design! To continue creating, join the Elite Membership for $8.99/mo.
                </p>
                <a href="https://nail-check.com/join-the-elite" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                    Upgrade to Elite Membership
                  </Button>
                </a>
              </motion.div>
            )}
            
            {/* AI Result Area */}
            {(isGenerating || generatedImage) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-3xl overflow-hidden border border-border/50 aspect-video bg-muted/30 flex items-center justify-center relative"
              >
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Designing your masterpiece...</p>
                  </div>
                ) : generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="Generated Nail Set" 
                    className="w-full h-full object-cover"
                  />
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

        {/* Content Grid - 2 Column Mobile/Tablet, 3-4 Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {tutorials.map((item) => (
            <motion.div
              key={item.id}
              layoutId={`card-${item.id}`}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border/40 shadow-sm hover:shadow-md transition-all"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img 
                  src={item.url} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1">{item.category}</p>
                  <h3 className="font-display font-bold truncate">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Item Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
              <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none">
                <div className="flex flex-col">
                  <div className="relative aspect-square md:aspect-video">
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
                  <div className="p-6 md:p-8 space-y-4">
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
                    <div className="pt-4">
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

        <footer className="mt-auto py-8 border-t border-border/40">
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
